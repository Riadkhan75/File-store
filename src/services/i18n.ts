export type Language = 'en' | 'bn';

export interface Translations {
  storeSubtitle: string;
  telegramChannel: string;
  filesAvailable: string;
  loadingStore: string;
  allFiles: string;
  files: string;
  searchPlaceholder: string;
  allCategories: string;
  popular: string;
  newest: string;
  featured: string;
  premiumVip: string;
  free: string;
  bookmarks: string;
  noFilesFound: string;
  noFilesDesc: string;
  clearFilters: string;
  downloadNow: string;
  viewDetails: string;
  fileSize: string;
  version: string;
  downloads: string;
  views: string;
  verifiedSafe: string;
  vipOnly: string;
  vipUnlockTitle: string;
  vipUnlockDesc: string;
  contactTelegramVip: string;
  reportBrokenLink: string;
  reportingTitle: string;
  reportSuccess: string;
  submitReport: string;
  reasonBroken: string;
  reasonSlow: string;
  reasonExpired: string;
  reasonWrongFile: string;
  notesOptional: string;
  cancel: string;
  primaryServer: string;
  mirrorServer: string;
  telegramMirror: string;
  maintenanceTitle: string;
  maintenanceNotice: string;
  userProfile: string;
  myBookmarks: string;
  myDownloads: string;
  signInGoogle: string;
  signOut: string;
  roleUser: string;
  roleVip: string;
  roleAdmin: string;
  accountBlockedNotice: string;
  installApp: string;
  announcement: string;
  themeDark: string;
  themeLight: string;
  themeCyber: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    storeSubtitle: 'Verified Digital Downloads & Resource Hub',
    telegramChannel: 'Telegram Channel',
    filesAvailable: 'Files Available',
    loadingStore: 'Loading store files...',
    allFiles: 'All Files',
    files: 'Files',
    searchPlaceholder: 'Search files, mods, tools, APKs...',
    allCategories: 'All Categories',
    popular: '🔥 Popular',
    newest: '🆕 Newest',
    featured: '⭐ Featured',
    premiumVip: '👑 VIP / Premium',
    free: 'Free',
    bookmarks: '❤️ Saved',
    noFilesFound: 'No files match your search criteria',
    noFilesDesc: 'Try adjusting your search terms or selecting a different category filter.',
    clearFilters: 'Clear All Filters',
    downloadNow: 'Download',
    viewDetails: 'Details',
    fileSize: 'Size',
    version: 'Version',
    downloads: 'Downloads',
    views: 'Views',
    verifiedSafe: 'Verified Safe & Clean',
    vipOnly: 'VIP Access Required',
    vipUnlockTitle: '👑 VIP Member Exclusive',
    vipUnlockDesc: 'This premium file is available exclusively for verified VIP users. Upgrade your account or contact on Telegram to get immediate VIP access.',
    contactTelegramVip: 'Get VIP via Telegram',
    reportBrokenLink: 'Report Broken Link',
    reportingTitle: 'Report an issue with this file',
    reportSuccess: 'Thank you! Your report has been submitted to the admin.',
    submitReport: 'Submit Report',
    reasonBroken: 'Download link is dead / broken (404)',
    reasonSlow: 'Extremely slow download speed',
    reasonExpired: 'File removed by hosting provider',
    reasonWrongFile: 'Wrong version or incorrect file',
    notesOptional: 'Additional details (optional)...',
    cancel: 'Cancel',
    primaryServer: 'Primary Download Server',
    mirrorServer: 'Alternative Mirror 1',
    telegramMirror: 'Direct Telegram Channel Link',
    maintenanceTitle: 'Store is Currently Under Maintenance',
    maintenanceNotice: 'We are updating our download servers and will be back shortly. Thank you for your patience!',
    userProfile: 'My Profile',
    myBookmarks: 'Saved Files',
    myDownloads: 'Download History',
    signInGoogle: 'Sign In with Google',
    signOut: 'Sign Out',
    roleUser: 'Member',
    roleVip: 'VIP Member',
    roleAdmin: 'Administrator',
    accountBlockedNotice: 'Your account has been restricted by an administrator. Download links are disabled.',
    installApp: 'Install App',
    announcement: 'Notice',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    themeCyber: 'Cyber Gold',
  },
  bn: {
    storeSubtitle: 'ভেরিফায়েড ডিজিটাল ফাইল ও ডাউনলোড হাব',
    telegramChannel: 'টেলিগ্রাম চ্যানেল',
    filesAvailable: 'টি ফাইল পাওয়া যাচ্ছে',
    loadingStore: 'স্টোর ফাইল লোড হচ্ছে...',
    allFiles: 'সকল ফাইল',
    files: 'ফাইলসমূহ',
    searchPlaceholder: 'ফাইল, টুলস, অ্যাপ খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    popular: '🔥 জনপ্রিয়',
    newest: '🆕 নতুন',
    featured: '⭐ স্পেশাল',
    premiumVip: '👑 ভিআইপি / প্রিমিয়াম',
    free: 'ফ্রি',
    bookmarks: '❤️ সেভ করা',
    noFilesFound: 'কোনো ফাইল খুঁজে পাওয়া যায়নি',
    noFilesDesc: 'অনুগ্রহ করে অন্য নাম দিয়ে খুঁজুন অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।',
    clearFilters: 'সব ফিল্টার মুছুন',
    downloadNow: 'ডাউনলোড',
    viewDetails: 'বিস্তারিত',
    fileSize: 'সাইজ',
    version: 'ভার্সন',
    downloads: 'ডাউনলোড',
    views: 'ভিউ',
    verifiedSafe: '১০০% নিরাপদ ও ভেরিফায়েড',
    vipOnly: 'ভিআইপি মেম্বারশিপ প্রয়োজন',
    vipUnlockTitle: '👑 ভিআইপি মেম্বারদের জন্য বিশেষ ফাইল',
    vipUnlockDesc: 'এই প্রিমিয়াম ফাইলটি শুধুমাত্র ভিআইপি মেম্বারদের জন্য সংরক্ষিত। ভিআইপি এক্সেস পেতে সরাসরি টেলিগ্রামে যোগাযোগ করুন।',
    contactTelegramVip: 'টেলিগ্রামে ভিআইপি নিন',
    reportBrokenLink: 'লিংক কাজ করছে না? জানান',
    reportingTitle: 'এই ফাইলের সমস্যা সম্পর্কে রিপোর্ট করুন',
    reportSuccess: 'ধন্যবাদ! আপনার রিপোর্টটি অ্যাডমিনের কাছে সফলভাবে জমা হয়েছে।',
    submitReport: 'রিপোর্ট পাঠান',
    reasonBroken: 'ডাউনলোড লিংক কাজ করছে না (Broken/404)',
    reasonSlow: 'ডাউনলোড স্পিড অত্যন্ত ধীর',
    reasonExpired: 'হোস্টিং থেকে ফাইলটি মুছে ফেলা হয়েছে',
    reasonWrongFile: 'ভুল ভার্সন বা ভুল ফাইল দেওয়া হয়েছে',
    notesOptional: 'অতিরিক্ত তথ্য (ঐচ্ছিক)...',
    cancel: 'বাতিল',
    primaryServer: 'প্রধান ডাউনলোড সার্ভার',
    mirrorServer: 'বিকল্প সার্ভার ১',
    telegramMirror: 'সরাসরি টেলিগ্রাম লিংক',
    maintenanceTitle: 'সাইট বর্তমানে মেইনটেনেন্সে রয়েছে',
    maintenanceNotice: 'আমরা সার্ভার আপডেট করছি, কিছুক্ষণের মধ্যেই আবার সচল হবে। সাময়িক অসুবিধার জন্য আন্তরিকভাবে দুঃখিত!',
    userProfile: 'আমার প্রোফাইল',
    myBookmarks: 'পছন্দের ফাইলসমূহ',
    myDownloads: 'ডাউনলোড হিস্টোরি',
    signInGoogle: 'গুগল দিয়ে লগইন',
    signOut: 'লগআউট',
    roleUser: 'মেম্বার',
    roleVip: 'ভিআইপি মেম্বার',
    roleAdmin: 'অ্যাডমিন',
    accountBlockedNotice: 'আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। ডাউনলোড বন্ধ রয়েছে।',
    installApp: 'অ্যাপ নামান',
    announcement: 'ঘোষণা',
    themeDark: 'ডার্ক মোড',
    themeLight: 'লাইট মোড',
    themeCyber: 'সাইবার গোল্ড',
  },
};
