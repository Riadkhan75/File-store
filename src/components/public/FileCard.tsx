import React from 'react';
import { FileItem, WebsiteSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../services/i18n';

interface FileCardProps {
  file: FileItem;
  settings?: WebsiteSettings;
  language?: Language;
  onDownloadClick: (file: FileItem) => void;
  onOpenDetails?: (file: FileItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  settings,
  onDownloadClick,
}) => {
  const { recordDownload, isBlocked, blockedReason } = useAuth();

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isBlocked) {
      alert(blockedReason || 'Your access has been suspended.');
      return;
    }

    // Register user download count & history if logged in
    recordDownload(file.id, file.name).catch(() => {});

    // Register click count and open admin-configured URL in new browser tab
    onDownloadClick(file);
  };

  // Format file name dynamically to match reference:
  // [ fa-download ] DOWNLOAD <FILE_NAME>
  // e.g., "DOWNLOAD OB55 AIM HACK", "DOWNLOAD MACRO SPACE PANEL"
  const formatButtonText = (name: string): string => {
    if (!name) return 'DOWNLOAD FILE';
    const trimmed = name.trim();
    if (/^download\b/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
    return `DOWNLOAD ${trimmed.toUpperCase()}`;
  };

  const displayText = formatButtonText(file.name);

  const radiusClass =
    settings?.buttonRadius === 'rounded-full'
      ? 'rounded-full'
      : settings?.buttonRadius === 'rounded-2xl'
      ? 'rounded-2xl'
      : settings?.buttonRadius === 'rounded-lg'
      ? 'rounded-lg'
      : 'rounded-[14px]';

  const glowClass =
    settings?.glowIntensity === 'none'
      ? 'shadow-none hover:shadow-none'
      : settings?.glowIntensity === 'intense'
      ? 'shadow-[0_4px_24px_rgba(255,208,0,0.55)] hover:shadow-[0_8px_32px_rgba(255,208,0,0.75)]'
      : 'shadow-[0_4px_16px_rgba(255,208,0,0.35)] hover:shadow-[0_6px_24px_rgba(255,208,0,0.55)]';

  return (
    <button
      type="button"
      id={`download-btn-${file.id}`}
      onClick={handleDownload}
      aria-label={displayText}
      style={{
        fontFamily: settings?.fontFamily ? `'${settings.fontFamily}', 'Oswald', sans-serif` : "'Oswald', 'Outfit', sans-serif",
      }}
      className={`group relative w-[95%] sm:w-[96%] h-[62px] sm:h-[66px] md:h-[68px] mx-auto bg-[#FFD000] hover:bg-[#FFE033] active:bg-[#FFC400] text-black font-extrabold uppercase ${radiusClass} border border-black/90 ${glowClass} hover:scale-[1.015] active:scale-[0.98] transition-all duration-200 ease-out flex items-center justify-center gap-2.5 sm:gap-3 px-4 select-none cursor-pointer outline-none shrink-0`}
    >
      {/* Clean Font Awesome Download Icon on the LEFT */}
      <i className="fa-solid fa-download text-[18px] sm:text-[20px] md:text-[22px] text-black shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"></i>

      {/* Perfectly Centered Bold Uppercase File Name */}
      <span className="text-black font-bold tracking-wider text-[18px] sm:text-[19px] md:text-[21px] leading-none truncate max-w-[85%] text-center drop-shadow-[0_1px_0_rgba(255,255,255,0.25)]">
        {displayText}
      </span>
    </button>
  );
};
