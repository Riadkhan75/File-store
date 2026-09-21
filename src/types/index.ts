export interface MirrorLink {
  label: string;
  url: string;
}

export interface WebsiteSettings {
  storeName: string;
  logoUrl: string;
  description: string;
  username: string;
  socialLink: string;
  telegramLink: string;
  footerText: string;
  browserTitle: string;
  faviconUrl?: string;
  // Appearance
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  buttonRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  glowIntensity: 'none' | 'subtle' | 'normal' | 'intense';
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'Inter' | 'JetBrains Mono';
  cardStyle: 'bordered' | 'filled' | 'minimal' | 'glass';
  websiteStatus: 'live' | 'maintenance';
  maintenanceMessage?: string;
  // Homepage Banner
  bannerEnabled?: boolean;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerImageUrl?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
  // Announcement ticker
  announcementEnabled?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementType?: 'info' | 'warning' | 'alert' | 'success';
  // Monetization & Ads
  monetizationEnabled?: boolean;
  vipGatingEnabled?: boolean;
  adHeaderEnabled?: boolean;
  adHeaderCode?: string;
  adInfeedEnabled?: boolean;
  adInfeedCode?: string;
  adFooterEnabled?: boolean;
  adFooterCode?: string;
  vipInstructions?: string;
  updatedAt?: string;
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  icon: string;
  status: 'active' | 'disabled';
  displayOrder: number;
  clicks: number;
  views?: number;
  isFeatured?: boolean;
  isPremium?: boolean;
  fileSize?: string;
  version?: string;
  mirrors?: MirrorLink[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  displayOrder: number;
  createdAt?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
  displayOrder: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: 'user' | 'vip' | 'admin';
  status: 'active' | 'blocked';
  blockedReason?: string;
  bookmarks?: string[]; // array of file IDs
  downloadCount: number;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  category: 'file' | 'user' | 'settings' | 'category' | 'security' | 'ad';
  details?: string;
  timestamp: string;
}

export interface BrokenLinkReport {
  id: string;
  fileId: string;
  fileName: string;
  userEmail?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface DownloadHistoryRecord {
  fileId: string;
  fileName: string;
  downloadedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAdmin: boolean;
  isVip?: boolean;
  status?: 'active' | 'blocked';
}

export type AdminTab =
  | 'overview'
  | 'settings'
  | 'banner'
  | 'branding'
  | 'files'
  | 'categories'
  | 'users'
  | 'reports'
  | 'logs'
  | 'social'
  | 'monetization'
  | 'appearance'
  | 'stats'
  | 'backup'
  | 'account';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

