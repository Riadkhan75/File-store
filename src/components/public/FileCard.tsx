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

  // Dynamic typography sizing based on length so full title is always 100% visible
  const titleLength = displayText.length;
  const textSizeClass =
    titleLength > 50
      ? 'text-[13px] sm:text-[14px] md:text-[15px] leading-snug'
      : titleLength > 30
      ? 'text-[14.5px] sm:text-[16px] md:text-[17px] leading-snug'
      : 'text-[17px] sm:text-[19px] md:text-[21px] leading-snug';

  return (
    <button
      type="button"
      id={`download-btn-${file.id}`}
      onClick={handleDownload}
      title={displayText}
      aria-label={displayText}
      style={{
        fontFamily: settings?.fontFamily ? `'${settings.fontFamily}', 'Oswald', sans-serif` : "'Oswald', 'Outfit', sans-serif",
      }}
      className={`group relative w-[95%] sm:w-[96%] min-h-[58px] sm:min-h-[64px] h-auto py-3 sm:py-3.5 mx-auto bg-[#FFD000] hover:bg-[#FFE033] active:bg-[#FFC400] text-black font-extrabold uppercase ${radiusClass} border border-black/90 ${glowClass} hover:scale-[1.012] active:scale-[0.98] transition-all duration-200 ease-out flex items-center justify-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-6 select-none cursor-pointer outline-none shrink-0`}
    >
      {/* Clean Font Awesome Download Icon on the LEFT */}
      <i className="fa-solid fa-download text-[18px] sm:text-[20px] md:text-[22px] text-black shrink-0 self-center transition-transform duration-200 group-hover:translate-y-0.5"></i>

      {/* Perfectly Centered Bold Uppercase Full File Name (No Truncation) */}
      <span className={`text-black font-bold tracking-wider ${textSizeClass} break-words whitespace-normal text-center drop-shadow-[0_1px_0_rgba(255,255,255,0.25)] flex-1 min-w-0 max-w-full`}>
        {displayText}
      </span>
    </button>
  );
};
