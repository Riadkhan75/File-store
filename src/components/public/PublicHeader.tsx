import React from 'react';
import { WebsiteSettings } from '../../types';

interface PublicHeaderProps {
  settings: WebsiteSettings;
  totalFiles: number;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ settings, totalFiles }) => {
  return (
    <header id="public-header" className="pt-8 pb-6 flex flex-col items-center text-center px-4 max-w-xl mx-auto">
      {/* Logo / Profile Image */}
      <div className="relative mb-5 group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-[14px] bg-neutral-950 overflow-hidden flex items-center justify-center border border-amber-400/30">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || 'Store Logo'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon on error
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<i class="fa-solid fa-cloud-arrow-down text-3xl text-amber-400"></i>';
                  }
                }}
              />
            ) : (
              <i className="fa-solid fa-bolt-lightning text-3xl text-amber-400 glow-text-yellow"></i>
            )}
          </div>
        </div>
        {/* Verified badge */}
        <div
          title="Verified Store"
          className="absolute -bottom-1 -right-1 bg-amber-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 border-neutral-950"
        >
          <i className="fa-solid fa-check text-[11px]"></i>
        </div>
      </div>

      {/* Website / Store Name */}
      <h1
        id="store-title"
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 uppercase drop-shadow-sm"
        style={{ fontFamily: settings.fontFamily || 'Outfit' }}
      >
        {settings.storeName || 'File Store'}
      </h1>

      {/* Username / Social Handle */}
      {settings.username && (
        <div className="flex items-center gap-2 mb-3">
          {settings.telegramLink ? (
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide hover:bg-amber-400/20 hover:border-amber-400 transition-all duration-200"
            >
              <i className="fa-brands fa-telegram text-sm"></i>
              <span>{settings.username}</span>
            </a>
          ) : (
            <span className="text-amber-400/90 text-xs font-semibold tracking-wider">
              {settings.username}
            </span>
          )}
        </div>
      )}

      {/* Short Description */}
      {settings.description && (
        <p className="text-neutral-300 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-4 px-2">
          {settings.description}
        </p>
      )}

      {/* Live Status & Count Pill */}
      <div className="flex items-center gap-3 text-xs text-neutral-400">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-neutral-300 font-medium">Direct Downloads</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          <i className="fa-solid fa-file-lines text-amber-400/90 text-[11px]"></i>
          <span className="text-neutral-300 font-medium">{totalFiles} Files Available</span>
        </span>
      </div>
    </header>
  );
};
