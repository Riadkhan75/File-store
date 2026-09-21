import React, { useState } from 'react';
import { FileItem, WebsiteSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DICTIONARY, Language } from '../../services/i18n';

interface FileDetailsModalProps {
  file: FileItem | null;
  settings: WebsiteSettings;
  language: Language;
  onClose: () => void;
  onDownloadClick: (file: FileItem, targetUrl?: string) => void;
  onOpenReportModal: (file: FileItem) => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  file,
  settings,
  language,
  onClose,
  onDownloadClick,
  onOpenReportModal,
}) => {
  const t = DICTIONARY[language];
  const { bookmarks, toggleBookmark, isVip } = useAuth();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!file) return null;

  const isBookmarked = bookmarks.includes(file.id);
  const isPremiumLocked = file.isPremium && !isVip;

  const handleDownload = (urlToUse?: string) => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
    onDownloadClick(file, urlToUse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-amber-400/40 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 text-white my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top background subtle glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-400/15 blur-3xl pointer-events-none rounded-full" />

        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl shrink-0 shadow-inner">
              <i className={file.icon || 'fa-solid fa-download'}></i>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  {file.categoryName || 'File'}
                </span>
                {file.isFeatured && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <i className="fa-solid fa-star text-[10px] mr-1"></i>
                    {t.featured}
                  </span>
                )}
                {file.isPremium && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-black shadow-sm">
                    <i className="fa-solid fa-crown text-[10px] mr-1"></i>
                    {t.premiumVip}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-snug break-words">
                {file.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0"
            title="Close"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Description */}
        {file.description && (
          <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 mb-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {file.description}
          </div>
        )}

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 block mb-0.5">
              {t.fileSize}
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-200">
              {file.fileSize || 'Direct'}
            </span>
          </div>
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 block mb-0.5">
              {t.version}
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-400">
              {file.version || 'Latest'}
            </span>
          </div>
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 block mb-0.5">
              {t.downloads}
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-200">
              {file.clicks?.toLocaleString()}
            </span>
          </div>
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 block mb-0.5">
              {t.views}
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-200">
              {(file.views || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Verification Guarantee Banner */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs mb-5">
          <i className="fa-solid fa-shield-check text-sm"></i>
          <span>{t.verifiedSafe}</span>
        </div>

        {/* VIP Lock Notice if Premium File */}
        {isPremiumLocked ? (
          <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-200 mb-5">
            <div className="flex items-center gap-2 mb-1.5 font-bold text-amber-300 text-sm">
              <i className="fa-solid fa-crown text-amber-400"></i>
              <span>{t.vipUnlockTitle}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              {settings.vipInstructions || t.vipUnlockDesc}
            </p>
            {settings.telegramLink && (
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-extrabold shadow hover:from-amber-300 hover:to-amber-400 transition"
              >
                <i className="fa-brands fa-telegram text-sm"></i>
                <span>{t.contactTelegramVip}</span>
              </a>
            )}
          </div>
        ) : (
          /* Download Options & Mirrors */
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-semibold">
              <span>Available Download Links</span>
              <span className="text-amber-400">Direct High-Speed</span>
            </div>

            {/* Primary Download Button */}
            <button
              onClick={() => handleDownload(file.url)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold shadow-lg shadow-amber-400/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-cloud-arrow-down text-base"></i>
                <span className="text-sm font-black">{t.primaryServer}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/15 px-2.5 py-1 rounded-lg">
                {downloadSuccess ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Opening...</span>
                  </>
                ) : (
                  <>
                    <span>{t.downloadNow}</span>
                    <i className="fa-solid fa-arrow-right text-[11px]"></i>
                  </>
                )}
              </div>
            </button>

            {/* Mirrors if configured */}
            {file.mirrors && file.mirrors.length > 0 && (
              <div className="space-y-2 pt-1">
                {file.mirrors.map((mirror, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(mirror.url)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/50 text-neutral-200 text-xs font-semibold hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-server text-amber-400"></i>
                      <span>{mirror.label || `Mirror Server ${idx + 1}`}</span>
                    </div>
                    <span className="text-amber-400 flex items-center gap-1">
                      <span>Download</span>
                      <i className="fa-solid fa-up-right-from-square text-[10px]"></i>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions: Bookmark toggle & Broken link report */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
          <button
            onClick={() => toggleBookmark(file.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
              isBookmarked
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-white'
            }`}
          >
            <i className={`${isBookmarked ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart`}></i>
            <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark'}</span>
          </button>

          <button
            onClick={() => onOpenReportModal(file)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-neutral-700 transition"
          >
            <i className="fa-solid fa-triangle-exclamation text-[11px] text-amber-400/80"></i>
            <span>{t.reportBrokenLink}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
