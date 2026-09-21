import React from 'react';
import { WebsiteSettings } from '../../types';

interface HomepageBannerProps {
  settings: WebsiteSettings;
}

export const HomepageBanner: React.FC<HomepageBannerProps> = ({ settings }) => {
  if (!settings.bannerEnabled) {
    return null;
  }

  const title = settings.bannerTitle || 'Welcome to our Official File Store';
  const subtitle = settings.bannerSubtitle || 'Direct high-speed downloads & premium modding resources.';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-neutral-900 to-amber-500/10 p-5 sm:p-6 mb-5 shadow-xl shadow-amber-500/5 group">
      {/* Background image if provided */}
      {settings.bannerImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url(${settings.bannerImageUrl})` }}
        />
      )}

      {/* Decorative ambient badge */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            Featured Spotlight
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-wide leading-snug drop-shadow-sm">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {settings.bannerButtonText && settings.bannerButtonLink && (
          <a
            href={settings.bannerButtonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-400/25 active:scale-95 transition"
          >
            <span>{settings.bannerButtonText}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
          </a>
        )}
      </div>
    </div>
  );
};
