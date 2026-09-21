import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  writeBatch,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import {
  WebsiteSettings,
  FileItem,
  CategoryItem,
  SocialLinkItem,
  ToastMessage,
  UserProfile,
  AdminLog,
  BrokenLinkReport,
} from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_FILES,
  DEFAULT_CATEGORIES,
  DEFAULT_SOCIALS,
} from '../services/defaultData';
import { useAuth } from './AuthContext';
import { compressBase64Image, estimateJsonByteSize } from '../utils/imageCompressor';

interface StoreContextType {
  settings: WebsiteSettings;
  files: FileItem[];
  categories: CategoryItem[];
  socialLinks: SocialLinkItem[];
  users: UserProfile[];
  adminLogs: AdminLog[];
  reports: BrokenLinkReport[];
  loading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  // Settings
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  // Files CRUD
  addFile: (file: Omit<FileItem, 'id' | 'clicks' | 'createdAt'>) => Promise<string>;
  updateFile: (id: string, file: Partial<FileItem>) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  trackFileClick: (file: FileItem) => Promise<void>;
  trackFileView: (fileId: string) => Promise<void>;
  recordBatchViews: (fileIds: string[]) => Promise<void>;
  // Categories CRUD
  addCategory: (name: string) => Promise<string>;
  updateCategory: (id: string, name: string, order?: number) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Social Links
  updateSocialLink: (link: SocialLinkItem) => Promise<void>;
  saveAllSocialLinks: (links: SocialLinkItem[]) => Promise<void>;
  // User Management
  updateUserRole: (userId: string, role: 'user' | 'vip' | 'admin') => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'blocked', reason?: string) => Promise<void>;
  toggleUserBlock: (userId: string, currentBlocked: boolean) => Promise<void>;
  // Reports
  submitBrokenLinkReport: (report: Omit<BrokenLinkReport, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReportStatus: (id: string, status: BrokenLinkReport['status']) => Promise<void>;
  // Admin Audit Log
  logs: AdminLog[];
  logAdminAction: (action: string, category: AdminLog['category'], details?: string) => Promise<void>;
  addAdminLog: (log: { action: string; category: AdminLog['category']; details?: string }) => Promise<void>;
  recordClick: (fileId: string) => Promise<void>;
  // Backup / Restore & Seed
  seedInitialData: () => Promise<void>;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonString: string) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const isAdmin = !!currentUser?.isAdmin;

  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [files, setFiles] = useState<FileItem[]>(DEFAULT_FILES);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(DEFAULT_SOCIALS);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [reports, setReports] = useState<BrokenLinkReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync title, favicon, and dynamic styling from settings
  useEffect(() => {
    if (settings.browserTitle) {
      document.title = settings.browserTitle;
    } else if (settings.storeName) {
      document.title = `${settings.storeName} - File Store`;
    }

    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }

    // Apply CSS variables dynamically if custom theme colors are configured
    const root = document.documentElement;
    if (settings.primaryColor) {
      root.style.setProperty('--primary-yellow', settings.primaryColor);
    }
    if (settings.borderColor) {
      root.style.setProperty('--border-color', settings.borderColor);
    }
    if (settings.backgroundColor) {
      root.style.setProperty('background-color', settings.backgroundColor);
    }
  }, [settings]);

  // Firestore Subscriptions
  useEffect(() => {
    let settingsLoaded = false;
    let filesLoaded = false;
    let categoriesLoaded = false;
    let socialsLoaded = false;

    const checkAllLoaded = () => {
      if (settingsLoaded && filesLoaded && categoriesLoaded && socialsLoaded) {
        setLoading(false);
      }
    };

    // 1. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'website'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snapshot.data() } as WebsiteSettings);
        } else {
          setSettings(DEFAULT_SETTINGS);
          // Persist default settings to Firestore so it exists in realtime DB
          setDoc(doc(db, 'settings', 'website'), DEFAULT_SETTINGS).catch((e) =>
            console.warn('Realtime settings seed warning:', e)
          );
        }
        settingsLoaded = true;
        checkAllLoaded();
      },
      (error) => {
        console.warn('Settings subscription fallback to default:', error.message);
        settingsLoaded = true;
        checkAllLoaded();
      }
    );

    // 2. Files listener
    const unsubFiles = onSnapshot(
      collection(db, 'files'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: FileItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || 'Untitled File',
              url: data.url || '#',
              description: data.description || '',
              categoryId: data.categoryId || '',
              categoryName: data.categoryName || '',
              icon: data.icon || 'fa-solid fa-download',
              status: data.status || 'active',
              displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
              clicks: typeof data.clicks === 'number' ? data.clicks : 0,
              views: typeof data.views === 'number' ? data.views : 0,
              isFeatured: !!data.isFeatured,
              isPremium: !!data.isPremium,
              fileSize: data.fileSize || '',
              version: data.version || '',
              mirrors: Array.isArray(data.mirrors) ? data.mirrors : [],
              tags: Array.isArray(data.tags) ? data.tags : [],
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || '',
            };
          });
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setFiles(items);
        } else {
          setFiles(DEFAULT_FILES);
          // Auto-seed files to Firestore so real-time database documents exist
          const batch = writeBatch(db);
          DEFAULT_FILES.forEach((f) => {
            batch.set(doc(db, 'files', f.id), f);
          });
          batch.commit().catch((e) => console.warn('Realtime files seed warning:', e));
        }
        filesLoaded = true;
        checkAllLoaded();
      },
      (error) => {
        console.warn('Files subscription fallback to default:', error.message);
        filesLoaded = true;
        checkAllLoaded();
      }
    );

    // 3. Categories listener
    const unsubCats = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: CategoryItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || 'Category',
              displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
              createdAt: data.createdAt || new Date().toISOString(),
            };
          });
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setCategories(items);
        } else {
          setCategories(DEFAULT_CATEGORIES);
          const batch = writeBatch(db);
          DEFAULT_CATEGORIES.forEach((c) => {
            batch.set(doc(db, 'categories', c.id), c);
          });
          batch.commit().catch((e) => console.warn('Realtime categories seed warning:', e));
        }
        categoriesLoaded = true;
        checkAllLoaded();
      },
      (error) => {
        console.warn('Categories subscription fallback to default:', error.message);
        categoriesLoaded = true;
        checkAllLoaded();
      }
    );

    // 4. Social Links listener
    const unsubSocials = onSnapshot(
      collection(db, 'socialLinks'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: SocialLinkItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              platform: data.platform || 'Link',
              url: data.url || '',
              icon: data.icon || 'fa-solid fa-link',
              enabled: data.enabled ?? true,
              displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 99,
            };
          });
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setSocialLinks(items);
        } else {
          setSocialLinks(DEFAULT_SOCIALS);
          const batch = writeBatch(db);
          DEFAULT_SOCIALS.forEach((s) => {
            batch.set(doc(db, 'socialLinks', s.id), s);
          });
          batch.commit().catch((e) => console.warn('Realtime socials seed warning:', e));
        }
        socialsLoaded = true;
        checkAllLoaded();
      },
      (error) => {
        console.warn('Socials subscription fallback to default:', error.message);
        socialsLoaded = true;
        checkAllLoaded();
      }
    );

    // Safety timeout to dismiss full-screen loading state if offline
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      unsubSettings();
      unsubFiles();
      unsubCats();
      unsubSocials();
    };
  }, []);

  // Admin Real-Time Subscriptions (Users, Activity Logs, Broken Link Reports)
  useEffect(() => {
    if (!isAdmin) {
      setUsers([]);
      setAdminLogs([]);
      setReports([]);
      return;
    }

    // 1. Real-time Users listener
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const uList: UserProfile[] = snapshot.docs.map((docSnap) => ({
          uid: docSnap.id,
          ...docSnap.data(),
        })) as UserProfile[];
        setUsers(uList);
      },
      (err) => {
        console.warn('Real-time Users listener note:', err.message);
      }
    );

    // 2. Real-time Admin Logs listener
    const logsQuery = query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'), limit(150));
    const unsubLogs = onSnapshot(
      logsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AdminLog[];
        setAdminLogs(list);
      },
      (err) => {
        console.warn('Real-time Admin logs listener note:', err.message);
      }
    );

    // 3. Real-time Broken Link Reports listener
    const unsubReports = onSnapshot(
      collection(db, 'reports'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as BrokenLinkReport[];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReports(list);
      },
      (err) => {
        console.warn('Real-time Reports listener note:', err.message);
      }
    );

    return () => {
      unsubUsers();
      unsubLogs();
      unsubReports();
    };
  }, [isAdmin]);

  // Update Settings with automatic size protection for Firestore (1MB limit)
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    let payload = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    // Auto-compress oversized base64 images if present
    if (payload.logoUrl && payload.logoUrl.startsWith('data:image/') && payload.logoUrl.length > 80000) {
      try {
        payload.logoUrl = await compressBase64Image(payload.logoUrl, {
          maxWidth: 320,
          maxHeight: 320,
          quality: 0.8,
          mimeType: 'image/jpeg',
        });
      } catch (e) {
        console.warn('Auto-compression of logoUrl failed:', e);
      }
    }

    if (payload.bannerImageUrl && payload.bannerImageUrl.startsWith('data:image/') && payload.bannerImageUrl.length > 100000) {
      try {
        payload.bannerImageUrl = await compressBase64Image(payload.bannerImageUrl, {
          maxWidth: 800,
          maxHeight: 400,
          quality: 0.8,
          mimeType: 'image/jpeg',
        });
      } catch (e) {
        console.warn('Auto-compression of bannerImageUrl failed:', e);
      }
    }

    // Safety threshold check (Firestore maximum document size is 1,048,576 bytes)
    const payloadSize = estimateJsonByteSize(payload);
    if (payloadSize > 850000) {
      console.warn(`Settings payload size (${payloadSize} bytes) exceeds safe Firestore threshold.`);
      // Strip base64 image data to protect database integrity
      if (payload.logoUrl?.startsWith('data:image/')) {
        payload.logoUrl = '';
      }
      if (payload.bannerImageUrl?.startsWith('data:image/')) {
        payload.bannerImageUrl = '';
      }
      showToast('Uploaded image was too large for cloud database. Please use a direct image URL.', 'warning');
    }

    try {
      await setDoc(doc(db, 'settings', 'website'), payload, { merge: true });
      setSettings(payload);
      showToast('Website settings saved successfully!');
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      // In case Firestore still returns size limit error, perform lightweight fallback
      if (errMsg.includes('maximum allowed size') || errMsg.includes('exceeds')) {
        console.warn('Document size limit exceeded. Retrying with sanitized settings...');
        try {
          const fallback = { ...payload, logoUrl: '', bannerImageUrl: '' };
          await setDoc(doc(db, 'settings', 'website'), fallback, { merge: true });
          setSettings(fallback);
          showToast('Settings saved with lightweight fallback (image URL recommended).', 'info');
          return;
        } catch (fallbackErr) {
          handleFirestoreError(fallbackErr, OperationType.WRITE, 'settings/website');
          return;
        }
      }
      handleFirestoreError(error, OperationType.WRITE, 'settings/website');
    }
  };

  // Add File
  const addFile = async (fileData: Omit<FileItem, 'id' | 'clicks' | 'createdAt'>): Promise<string> => {
    const newId = 'file-' + Math.random().toString(36).substring(2, 9);
    const newFile: FileItem = {
      ...fileData,
      id: newId,
      clicks: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'files', newId), newFile);
      showToast(`File "${newFile.name}" added successfully!`);
      return newId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `files/${newId}`);
    }
  };

  // Update File with instant optimistic UI update
  const updateFile = async (id: string, fileData: Partial<FileItem>) => {
    const existing = files.find((f) => f.id === id);
    const updated = {
      ...(existing || {}),
      ...fileData,
      updatedAt: new Date().toISOString(),
    };
    // Optimistically update memory state immediately
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    try {
      await setDoc(doc(db, 'files', id), updated, { merge: true });
      showToast('File updated successfully!');
    } catch (error) {
      // Revert if write failed
      if (existing) {
        setFiles((prev) => prev.map((f) => (f.id === id ? existing : f)));
      }
      handleFirestoreError(error, OperationType.UPDATE, `files/${id}`);
    }
  };

  // Delete File with instant optimistic UI update
  const deleteFile = async (id: string) => {
    const backup = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      await deleteDoc(doc(db, 'files', id));
      showToast('File removed successfully!');
    } catch (error) {
      if (backup) {
        setFiles((prev) => [...prev, backup]);
      }
      handleFirestoreError(error, OperationType.DELETE, `files/${id}`);
    }
  };

  // Track File Click
  const trackFileClick = async (file: FileItem) => {
    if (file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
    }
    try {
      await updateDoc(doc(db, 'files', file.id), {
        clicks: increment(1),
      });
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, clicks: f.clicks + 1 } : f))
      );
    } catch (err) {
      console.warn('Click counter update error:', err);
    }
  };

  // Track File View
  const trackFileView = async (fileId: string) => {
    try {
      await updateDoc(doc(db, 'files', fileId), {
        views: increment(1),
      });
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, views: (f.views || 0) + 1 } : f))
      );
    } catch (err) {
      // quiet fallback
    }
  };

  // Record batch views for files appearing in viewport
  const recordBatchViews = async (fileIds: string[]) => {
    if (!fileIds || fileIds.length === 0) return;
    try {
      const batch = writeBatch(db);
      fileIds.forEach((id) => {
        batch.update(doc(db, 'files', id), {
          views: increment(1),
        });
      });
      await batch.commit();
    } catch (err) {
      // quiet fallback
    }
  };

  // Categories CRUD
  const addCategory = async (name: string): Promise<string> => {
    const newId = 'cat-' + Math.random().toString(36).substring(2, 8);
    const newCat: CategoryItem = {
      id: newId,
      name,
      displayOrder: categories.length + 1,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'categories', newId), newCat);
      showToast(`Category "${name}" created!`);
      return newId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `categories/${newId}`);
    }
  };

  const updateCategory = async (id: string, name: string, order?: number) => {
    try {
      await updateDoc(doc(db, 'categories', id), {
        name,
        ...(typeof order === 'number' ? { displayOrder: order } : {}),
      });
      showToast('Category updated!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      showToast('Category deleted!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  // Social Links with optimistic state update
  const updateSocialLink = async (link: SocialLinkItem) => {
    setSocialLinks((prev) => prev.map((s) => (s.id === link.id ? { ...s, ...link } : s)));
    try {
      await setDoc(doc(db, 'socialLinks', link.id), link, { merge: true });
      showToast(`${link.platform} link updated!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `socialLinks/${link.id}`);
    }
  };

  const saveAllSocialLinks = async (links: SocialLinkItem[]) => {
    setSocialLinks(links);
    try {
      const batch = writeBatch(db);
      links.forEach((l) => {
        batch.set(doc(db, 'socialLinks', l.id), l, { merge: true });
      });
      await batch.commit();
      showToast('All social links saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'socialLinks');
    }
  };

  // User Management
  const updateUserRole = async (userId: string, role: 'user' | 'vip' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role });
      setUsers((prev) => prev.map((u) => (u.uid === userId ? { ...u, role } : u)));
      showToast(`User role updated to ${role.toUpperCase()}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'blocked', reason?: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status,
        ...(reason !== undefined ? { blockedReason: reason } : {}),
      });
      setUsers((prev) =>
        prev.map((u) => (u.uid === userId ? { ...u, status, blockedReason: reason } : u))
      );
      showToast(`User has been ${status === 'blocked' ? 'blocked' : 'unblocked'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  // Broken link reports
  const submitBrokenLinkReport = async (
    reportData: Omit<BrokenLinkReport, 'id' | 'createdAt' | 'status'>
  ) => {
    const reportId = 'report-' + Math.random().toString(36).substring(2, 9);
    const newReport: BrokenLinkReport = {
      ...reportData,
      id: reportId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'reports', reportId), newReport);
      showToast('Thank you! Your report has been submitted to the admin.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `reports/${reportId}`);
    }
  };

  const updateReportStatus = async (id: string, status: BrokenLinkReport['status']) => {
    try {
      await updateDoc(doc(db, 'reports', id), { status });
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      showToast(`Report marked as ${status}!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reports/${id}`);
    }
  };

  // Admin audit log
  const logAdminAction = async (action: string, category: AdminLog['category'], details?: string) => {
    const logId = 'log-' + Math.random().toString(36).substring(2, 9);
    const newLog: AdminLog = {
      id: logId,
      adminEmail: currentUser?.email || 'banglag215@gmail.com',
      action,
      category,
      details: details || '',
      timestamp: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'adminLogs', logId), newLog);
    } catch (e) {
      console.warn('Could not record admin log:', e);
    }
  };

  // Seed Initial Demo Data into Firestore
  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);

      batch.set(doc(db, 'settings', 'website'), DEFAULT_SETTINGS);

      DEFAULT_CATEGORIES.forEach((cat) => {
        batch.set(doc(db, 'categories', cat.id), cat);
      });

      DEFAULT_FILES.forEach((file) => {
        batch.set(doc(db, 'files', file.id), file);
      });

      DEFAULT_SOCIALS.forEach((social) => {
        batch.set(doc(db, 'socialLinks', social.id), social);
      });

      await batch.commit();
      showToast('Store seeded with initial high-quality content!');
      await logAdminAction('Seeded database with demo content', 'settings', 'Loaded default files and categories');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
    }
  };

  // Export Backup JSON
  const exportBackupJSON = (): string => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings,
      files,
      categories,
      socialLinks,
      users,
      reports,
      adminLogs,
    };
    return JSON.stringify(backupData, null, 2);
  };

  // Import Backup JSON
  const importBackupJSON = async (
    jsonString: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.settings && !parsed.files) {
        return { success: false, message: 'Invalid backup file format' };
      }

      const batch = writeBatch(db);

      if (parsed.settings) {
        batch.set(doc(db, 'settings', 'website'), parsed.settings, { merge: true });
      }

      if (Array.isArray(parsed.categories)) {
        parsed.categories.forEach((cat: CategoryItem) => {
          if (cat.id) {
            batch.set(doc(db, 'categories', cat.id), cat, { merge: true });
          }
        });
      }

      if (Array.isArray(parsed.files)) {
        parsed.files.forEach((file: FileItem) => {
          if (file.id) {
            batch.set(doc(db, 'files', file.id), file, { merge: true });
          }
        });
      }

      if (Array.isArray(parsed.socialLinks)) {
        parsed.socialLinks.forEach((soc: SocialLinkItem) => {
          if (soc.id) {
            batch.set(doc(db, 'socialLinks', soc.id), soc, { merge: true });
          }
        });
      }

      await batch.commit();
      showToast('Store data successfully restored from backup!');
      await logAdminAction('Restored full database backup', 'settings', 'JSON import successful');
      return { success: true, message: 'Data imported successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'JSON Parsing error';
      return { success: false, message: errorMsg };
    }
  };

  const toggleUserBlock = async (userId: string, currentBlocked: boolean) => {
    await updateUserStatus(userId, currentBlocked ? 'active' : 'blocked');
  };

  const addAdminLog = async (log: { action: string; category: AdminLog['category']; details?: string }) => {
    await logAdminAction(log.action, log.category, log.details);
  };

  const recordClick = async (fileId: string) => {
    const targetFile = files.find((f) => f.id === fileId);
    if (targetFile) {
      await trackFileClick(targetFile);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        files,
        categories,
        socialLinks,
        users,
        adminLogs,
        logs: adminLogs,
        reports,
        loading,
        toasts,
        showToast,
        removeToast,
        updateSettings,
        addFile,
        updateFile,
        deleteFile,
        trackFileClick,
        trackFileView,
        recordBatchViews,
        recordClick,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSocialLink,
        saveAllSocialLinks,
        updateUserRole,
        updateUserStatus,
        toggleUserBlock,
        submitBrokenLinkReport,
        updateReportStatus,
        logAdminAction,
        addAdminLog,
        seedInitialData,
        exportBackupJSON,
        importBackupJSON,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

