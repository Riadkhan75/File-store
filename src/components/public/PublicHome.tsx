import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { PublicHeader } from './PublicHeader';
import { SearchAndFilter, FilterSpecial } from './SearchAndFilter';
import { FileCard } from './FileCard';
import { PublicFooter } from './PublicFooter';
import { EmptyState } from './EmptyState';
import { AnnouncementTicker } from './AnnouncementTicker';
import { HomepageBanner } from './HomepageBanner';
import { FileDetailsModal } from './FileDetailsModal';
import { ReportBrokenLinkModal } from './ReportBrokenLinkModal';
import { UserProfileModal } from './UserProfileModal';
import { AdBannerSlot } from './AdBannerSlot';
import { FileItem } from '../../types';
import { DICTIONARY, Language } from '../../services/i18n';

export const PublicHome: React.FC = () => {
  const {
    settings,
    files,
    categories,
    socialLinks,
    loading,
    trackFileClick,
    trackFileView,
    recordBatchViews,
    showToast,
  } = useStore();
  const { bookmarks, isAdmin, isVip } = useAuth();

  const [language, setLanguage] = useState<Language>('en');
  const t = DICTIONARY[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [specialFilter, setSpecialFilter] = useState<FilterSpecial>('all');

  // Modals state
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<FileItem | null>(null);
  const [selectedFileForReport, setSelectedFileForReport] = useState<FileItem | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [maintenanceBypass, setMaintenanceBypass] = useState(false);

  // Filter active files and search query & special tabs
  const filteredFiles = useMemo(() => {
    let result = files.filter((file) => file.status === 'active');

    // Special category / filter logic
    if (specialFilter === 'popular') {
      result = [...result].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    } else if (specialFilter === 'newest') {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    } else if (specialFilter === 'featured') {
      result = result.filter((f) => f.isFeatured);
    } else if (specialFilter === 'vip') {
      result = result.filter((f) => f.isPremium);
    } else if (specialFilter === 'bookmarks') {
      result = result.filter((f) => bookmarks.includes(f.id));
    } else {
      result = [...result].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((file) => {
        const matchName = file.name.toLowerCase().includes(query);
        const matchDesc = (file.description || '').toLowerCase().includes(query);
        const matchCat = (file.categoryName || '').toLowerCase().includes(query);
        return matchName || matchDesc || matchCat;
      });
    }

    return result;
  }, [files, selectedCategory, specialFilter, searchQuery, bookmarks]);

  // Realtime view counter tracking on visit
  useEffect(() => {
    if (files.length > 0) {
      try {
        const sessionKey = 'novastore_viewed_' + new Date().toDateString();
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          const activeIds = files.filter((f) => f.status === 'active').map((f) => f.id);
          if (activeIds.length > 0) {
            recordBatchViews(activeIds);
          }
        }
      } catch {}
    }
  }, [files.length, recordBatchViews]);

  const totalViews = useMemo(() => files.reduce((acc, f) => acc + (f.views || 0), 0), [files]);
  const totalClicks = useMemo(() => files.reduce((acc, f) => acc + (f.clicks || 0), 0), [files]);

  const handleOpenFileDetails = (file: FileItem) => {
    trackFileView(file.id);
    setSelectedFileForDetails(file);
  };

  const handleDownload = (file: FileItem) => {
    // If file is VIP-locked and VIP gating is active, enforce VIP membership
    const isVipGated = (settings.vipGatingEnabled !== false) && file.isPremium && !isVip && !isAdmin;
    if (isVipGated) {
      trackFileView(file.id);
      setSelectedFileForDetails(file);
      showToast('This file requires VIP membership. Please view unlock instructions.', 'info');
      return;
    }
    trackFileClick(file);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl animate-pulse shadow-lg shadow-amber-400/20 mb-4">
          <i className="fa-solid fa-cloud-arrow-down"></i>
        </div>
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase animate-pulse">
          {t.loadingStore}
        </p>
      </div>
    );
  }

  // Maintenance mode screen
  const isMaintenanceActive = settings.websiteStatus === 'maintenance' && !isAdmin && !maintenanceBypass;
  if (isMaintenanceActive) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900/90 border border-amber-400/30 shadow-2xl relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 text-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <i className="fa-solid fa-screwdriver-wrench animate-bounce"></i>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{t.maintenanceTitle}</h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            {settings.maintenanceMessage || t.maintenanceNotice}
          </p>

          {settings.telegramLink && (
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs mb-4 shadow hover:brightness-105 transition"
            >
              <i className="fa-brands fa-telegram text-sm"></i>
              <span>{t.contactTelegramVip}</span>
            </a>
          )}

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-center">
            <button
              onClick={() => setMaintenanceBypass(true)}
              className="text-xs text-neutral-500 hover:text-amber-400 transition"
            >
              Staff Bypass / Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-xl mx-auto px-4 pb-12">
        {/* Header Ad Placement */}
        {settings.monetizationEnabled !== false && settings.adHeaderEnabled && (
          <AdBannerSlot
            slotType="header"
            enabled={true}
            code={settings.adHeaderCode}
          />
        )}

        {/* Announcement Ticker */}
        <AnnouncementTicker settings={settings} />

        {/* 1. Header: Logo, Name, Username, Description */}
        <PublicHeader
          settings={settings}
          totalFiles={files.filter((f) => f.status === 'active').length}
        />

        {/* Homepage Spotlight Banner */}
        <HomepageBanner settings={settings} />

        {/* 2. Search & Category Filter Section */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setSpecialFilter('all');
          }}
          specialFilter={specialFilter}
          onSelectSpecialFilter={(filter) => {
            setSpecialFilter(filter);
            setSelectedCategory('all');
          }}
          filteredCount={filteredFiles.length}
          language={language}
          onLanguageChange={setLanguage}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        {/* 3. Section Title Bar */}
        <div className="w-[95%] sm:w-[96%] mx-auto flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
            <h2 className="text-xs sm:text-sm uppercase tracking-wider font-black text-white">
              {specialFilter === 'popular'
                ? t.popular
                : specialFilter === 'newest'
                ? t.newest
                : specialFilter === 'featured'
                ? t.featured
                : specialFilter === 'vip'
                ? t.premiumVip
                : specialFilter === 'bookmarks'
                ? t.myBookmarks
                : selectedCategory === 'all'
                ? 'DOWNLOAD FILES'
                : categories.find((c) => c.id === selectedCategory)?.name || t.files}
            </h2>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        {/* Live Realtime Database Status Bar */}
        <div className="w-[95%] sm:w-[96%] mx-auto mb-3.5 px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-md flex items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-300 font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
              Live Realtime Database
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-neutral-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-eye text-amber-400 text-[11px]"></i>
              <strong className="text-white font-bold">{totalViews.toLocaleString()}</strong> views
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-cloud-arrow-down text-amber-400 text-[11px]"></i>
              <strong className="text-white font-bold">{totalClicks.toLocaleString()}</strong> downloads
            </span>
          </div>
        </div>

        {/* 4. Files List */}
        {filteredFiles.length > 0 ? (
          <div id="files-list" className="w-full flex flex-col items-center gap-2.5 sm:gap-3">
            {filteredFiles.map((file, index) => (
              <React.Fragment key={file.id}>
                <FileCard
                  file={file}
                  settings={settings}
                  language={language}
                  onDownloadClick={handleDownload}
                  onOpenDetails={handleOpenFileDetails}
                />
                {/* In-feed Ad Banner after every 4 items if enabled */}
                {settings.monetizationEnabled !== false && settings.adInfeedEnabled && (index + 1) % 4 === 0 && (
                  <AdBannerSlot
                    slotType="infeed"
                    enabled={true}
                    code={settings.adInfeedCode}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <EmptyState
            isSearching={!!searchQuery || selectedCategory !== 'all' || specialFilter !== 'all'}
            onResetSearch={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSpecialFilter('all');
            }}
          />
        )}

        {/* Footer Ad Placement */}
        {settings.monetizationEnabled !== false && settings.adFooterEnabled && (
          <AdBannerSlot
            slotType="footer"
            enabled={true}
            code={settings.adFooterCode}
          />
        )}

        {/* 5. Footer with Social Media & Copyright */}
        <PublicFooter settings={settings} socialLinks={socialLinks} />
      </main>

      {/* File Details Modal */}
      {selectedFileForDetails && (
        <FileDetailsModal
          file={selectedFileForDetails}
          settings={settings}
          language={language}
          onClose={() => setSelectedFileForDetails(null)}
          onDownloadClick={handleDownload}
          onOpenReportModal={(file) => {
            setSelectedFileForDetails(null);
            setSelectedFileForReport(file);
          }}
        />
      )}

      {/* Report Broken Link Modal */}
      {selectedFileForReport && (
        <ReportBrokenLinkModal
          file={selectedFileForReport}
          language={language}
          onClose={() => setSelectedFileForReport(null)}
        />
      )}

      {/* User Profile Modal */}
      {profileModalOpen && (
        <UserProfileModal
          language={language}
          onClose={() => setProfileModalOpen(false)}
          onOpenFileDetails={handleOpenFileDetails}
        />
      )}
    </div>
  );
};
