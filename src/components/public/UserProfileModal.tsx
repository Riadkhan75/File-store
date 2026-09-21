import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { DICTIONARY, Language } from '../../services/i18n';
import { FileItem } from '../../types';

interface UserProfileModalProps {
  language: Language;
  onClose: () => void;
  onOpenFileDetails: (file: FileItem) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  language,
  onClose,
  onOpenFileDetails,
}) => {
  const t = DICTIONARY[language];
  const {
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
    bookmarks,
    downloadHistory,
    isBlocked,
    blockedReason,
    isAdmin,
    isVip,
  } = useAuth();
  const { files } = useStore();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [loggingIn, setLoggingIn] = useState(false);

  const bookmarkedFiles = files.filter((f) => bookmarks.includes(f.id));

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-white relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.userProfile}</h3>
              <p className="text-xs text-neutral-400">Personal Dashboard & History</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* User Card or Login Prompt */}
        <div className="py-4">
          {currentUser ? (
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-11 h-11 rounded-full object-cover border border-amber-400/40"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold flex items-center justify-center text-base">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-white truncate">
                      {currentUser.displayName}
                    </h4>
                    {isAdmin && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                        Admin
                      </span>
                    )}
                    {!isAdmin && isVip && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                        VIP
                      </span>
                    )}
                    {!isAdmin && !isVip && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 text-xs font-semibold transition shrink-0"
                title={t.signOut}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
              <p className="text-xs text-neutral-300">
                Sign in with Google to sync your saved bookmarks across all your devices and access VIP downloads.
              </p>
              <button
                onClick={handleGoogleLogin}
                disabled={loggingIn}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-bold transition shadow"
              >
                <i className="fa-brands fa-google text-amber-400 text-sm"></i>
                <span>{loggingIn ? 'Connecting...' : t.signInGoogle}</span>
              </button>
            </div>
          )}

          {/* Account restriction banner if blocked */}
          {isBlocked && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <i className="fa-solid fa-ban text-sm shrink-0"></i>
              <span>{blockedReason || t.accountBlockedNotice}</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 mb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'bookmarks'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <i className="fa-solid fa-heart text-[11px]"></i>
            <span>
              {t.myBookmarks} ({bookmarks.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'history'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <i className="fa-solid fa-clock-rotate-left text-[11px]"></i>
            <span>
              {t.myDownloads} ({downloadHistory.length})
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
          {activeTab === 'bookmarks' ? (
            bookmarkedFiles.length > 0 ? (
              bookmarkedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    onClose();
                    onOpenFileDetails(file);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/40 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-sm shrink-0">
                      <i className={file.icon || 'fa-solid fa-download'}></i>
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                        {file.name}
                      </h5>
                      <span className="text-[10px] text-neutral-500">
                        {file.categoryName || 'File'} • {file.fileSize || 'Direct'}
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-xs text-neutral-500 group-hover:text-amber-400 transition shrink-0"></i>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-neutral-500 text-xs">
                <i className="fa-regular fa-heart text-2xl mb-2 text-neutral-600 block"></i>
                No saved files yet. Tap the heart icon on any file to bookmark it!
              </div>
            )
          ) : downloadHistory.length > 0 ? (
            downloadHistory.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <i className="fa-solid fa-arrow-down text-emerald-400 text-xs shrink-0"></i>
                  <span className="text-neutral-200 font-semibold truncate">{rec.fileName}</span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0">
                  {new Date(rec.downloadedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-neutral-500 text-xs">
              <i className="fa-solid fa-clock-rotate-left text-2xl mb-2 text-neutral-600 block"></i>
              No download history recorded on this device yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
