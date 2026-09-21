import React, { useState } from 'react';
import { WebsiteSettings } from '../../types';

interface AnnouncementTickerProps {
  settings: WebsiteSettings;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({ settings }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementEnabled || !settings.announcementText || dismissed) {
    return null;
  }

  const type = settings.announcementType || 'info';
  const colorMap = {
    info: 'bg-amber-400/10 border-amber-400/40 text-amber-300',
    warning: 'bg-orange-500/10 border-orange-500/40 text-orange-300',
    alert: 'bg-rose-500/10 border-rose-500/40 text-rose-300',
    success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
  };

  const iconMap = {
    info: 'fa-solid fa-bullhorn text-amber-400',
    warning: 'fa-solid fa-triangle-exclamation text-orange-400',
    alert: 'fa-solid fa-bell text-rose-400',
    success: 'fa-solid fa-circle-check text-emerald-400',
  };

  return (
    <div
      className={`relative w-full px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs mb-4 shadow-sm ${
        colorMap[type] || colorMap.info
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <i className={`${iconMap[type] || iconMap.info} text-xs shrink-0`}></i>
        {settings.announcementLink ? (
          <a
            href={settings.announcementLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate font-medium flex items-center gap-1.5"
          >
            <span>{settings.announcementText}</span>
            <i className="fa-solid fa-arrow-right text-[10px] shrink-0 opacity-80"></i>
          </a>
        ) : (
          <span className="truncate font-medium">{settings.announcementText}</span>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="opacity-70 hover:opacity-100 transition p-1 shrink-0"
        title="Dismiss"
      >
        <i className="fa-solid fa-xmark text-xs"></i>
      </button>
    </div>
  );
};
