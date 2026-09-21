import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { AdminUser, UserProfile, DownloadHistoryRecord } from '../types';

export const ADMIN_EMAILS = [
  'banglag215@gmail.com',
  'nazrulpost75@gmail.com',
];

export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some((ae) => ae.toLowerCase() === email.trim().toLowerCase());
};

interface AuthContextType {
  currentUser: AdminUser | null;
  user: AdminUser | null;
  userProfile: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isVip: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  bookmarks: string[];
  toggleBookmark: (fileId: string) => Promise<void>;
  recordDownload: (fileId: string, fileName: string) => Promise<void>;
  downloadHistory: DownloadHistoryRecord[];
  adminSessionActive: boolean;
  lockAdminSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [localBookmarks, setLocalBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guest_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('user_download_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [adminSessionActive, setAdminSessionActive] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('admin_session_active') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync bookmarks to localStorage for offline / guest access
  useEffect(() => {
    try {
      localStorage.setItem('guest_bookmarks', JSON.stringify(localBookmarks));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [localBookmarks]);

  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (user) {
        let isUserAdmin = isAuthorizedAdminEmail(user.email);

        // 1. Check admin rights
        if (!isUserAdmin) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              isUserAdmin = true;
            }
          } catch (err) {
            console.warn('Admin check error:', err);
          }
        }

        if (isUserAdmin) {
          try {
            await setDoc(
              doc(db, 'admins', user.uid),
              {
                email: user.email,
                role: 'admin',
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (err) {
            console.warn('Admin record write note:', err);
          }
        }

        // 2. Real-time User Profile sync
        const userRef = doc(db, 'users', user.uid);
        unsubUserDoc = onSnapshot(
          userRef,
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              setUserProfile(data);
              if (data.bookmarks && Array.isArray(data.bookmarks)) {
                setLocalBookmarks(data.bookmarks);
              }
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: data.displayName || user.displayName || user.email?.split('@')[0] || 'User',
                photoURL: data.photoURL || user.photoURL,
                isAdmin: isUserAdmin || data.role === 'admin',
                isVip: data.role === 'vip' || isUserAdmin,
                status: data.status,
              });
            } else {
              // Create initial user document
              const initialProfile: UserProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                photoURL: user.photoURL || '',
                role: isUserAdmin ? 'admin' : 'user',
                status: 'active',
                bookmarks: localBookmarks,
                downloadCount: 0,
                lastLoginAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              };
              try {
                await setDoc(userRef, initialProfile, { merge: true });
                setUserProfile(initialProfile);
              } catch (e) {
                console.warn('User profile creation warning:', e);
                setUserProfile(initialProfile);
              }
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: initialProfile.displayName,
                photoURL: initialProfile.photoURL,
                isAdmin: isUserAdmin,
                isVip: isUserAdmin,
                status: 'active',
              });
            }
          },
          (err) => {
            console.warn('User profile listener error:', err.message);
          }
        );
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isUserAdmin = isAuthorizedAdminEmail(user.email);
      if (isUserAdmin) {
        try {
          sessionStorage.setItem('admin_session_active', 'true');
        } catch {}
        setAdminSessionActive(true);
      }

      // Record login in user document
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || '',
            lastLoginAt: new Date().toISOString(),
            status: 'active',
            ...(isUserAdmin ? { role: 'admin' } : {}),
          },
          { merge: true }
        );
        if (isUserAdmin) {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              email: user.email,
              role: 'admin',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } catch (e) {
        console.warn('User login record error:', e);
      }
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isMasterAdmin = isAuthorizedAdminEmail(cleanEmail);
    const isMasterPasscode = pass === '205090';

    if (!isMasterAdmin) {
      throw new Error(`Access denied: "${cleanEmail}" is not in the authorized administrator list.`);
    }

    try {
      let cred: any = null;
      try {
        cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      } catch (signInErr: any) {
        // Auto-provision or handle disabled Email provider in Firebase Console
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential' ||
          signInErr.code === 'auth/invalid-login-credentials'
        ) {
          try {
            cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          } catch (createErr: any) {
            if (isMasterPasscode) {
              console.warn('Passcode valid, continuing master admin session');
            } else {
              throw new Error('Incorrect password for admin account.');
            }
          }
        } else if (
          signInErr.code === 'auth/operation-not-allowed' ||
          signInErr.code === 'auth/admin-restricted-operation' ||
          signInErr.code === 'auth/configuration-not-found'
        ) {
          // If Email/Password is not enabled in Firebase Console, verify master passcode directly
          if (!isMasterPasscode) {
            throw new Error('Incorrect admin password.');
          }
        } else {
          if (isMasterPasscode) {
            console.warn('Firebase login note, master passcode accepted:', signInErr.message);
          } else {
            throw signInErr;
          }
        }
      }

      try {
        sessionStorage.setItem('admin_session_active', 'true');
      } catch {}
      setAdminSessionActive(true);

      const activeUid =
        cred?.user?.uid ||
        auth.currentUser?.uid ||
        `admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      setCurrentUser({
        uid: activeUid,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0] || 'Administrator',
        isAdmin: true,
        isVip: true,
        status: 'active',
      });

      try {
        await setDoc(
          doc(db, 'admins', activeUid),
          {
            email: cleanEmail,
            role: 'admin',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        await setDoc(
          doc(db, 'users', activeUid),
          {
            uid: activeUid,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0] || 'Administrator',
            lastLoginAt: new Date().toISOString(),
            role: 'admin',
            status: 'active',
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Email login user sync:', e);
      }
    } catch (error) {
      console.error('Email login error', error);
      throw error;
    }
  };

  const registerAdmin = async (email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, 'admins', cred.user.uid), {
        email: cred.user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        role: 'admin',
        status: 'active',
        downloadCount: 0,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Admin registration error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('admin_session_active');
    } catch {}
    setAdminSessionActive(false);
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const lockAdminSession = () => {
    try {
      sessionStorage.removeItem('admin_session_active');
    } catch {}
    setAdminSessionActive(false);
  };

  // Toggle Bookmark
  const toggleBookmark = async (fileId: string) => {
    const isBookmarked = localBookmarks.includes(fileId);
    const updated = isBookmarked
      ? localBookmarks.filter((id) => id !== fileId)
      : [...localBookmarks, fileId];

    setLocalBookmarks(updated);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          bookmarks: isBookmarked ? arrayRemove(fileId) : arrayUnion(fileId),
        });
      } catch (e) {
        console.warn('Bookmark sync warning:', e);
      }
    }
  };

  // Record Download History
  const recordDownload = async (fileId: string, fileName: string) => {
    const newRecord: DownloadHistoryRecord = {
      fileId,
      fileName,
      downloadedAt: new Date().toISOString(),
    };
    const updatedHistory = [newRecord, ...downloadHistory.slice(0, 49)];
    setDownloadHistory(updatedHistory);
    try {
      localStorage.setItem('user_download_history', JSON.stringify(updatedHistory));
    } catch {
      // ignore
    }

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          downloadCount: increment(1),
        });
      } catch (e) {
        console.warn('Download record warning:', e);
      }
    }
  };

  const isAdmin = !!currentUser?.isAdmin;
  const isVip = !!currentUser?.isVip || isAdmin;
  const isBlocked = userProfile?.status === 'blocked';
  const blockedReason = userProfile?.blockedReason;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        userProfile,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerAdmin,
        logout,
        isAdmin,
        isVip,
        isBlocked,
        blockedReason,
        bookmarks: localBookmarks,
        toggleBookmark,
        recordDownload,
        downloadHistory,
        adminSessionActive,
        lockAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

