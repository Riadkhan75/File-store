import React, { useEffect, useRef } from 'react';

interface AdBannerSlotProps {
  id?: string;
  slotType: 'header' | 'infeed' | 'footer';
  enabled?: boolean;
  code?: string;
  className?: string;
  fallbackText?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  id,
  slotType,
  enabled,
  code,
  className = '',
  fallbackText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const trimmedCode = (code || '').trim();
    if (!trimmedCode) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create a temporary container to parse HTML and scripts
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = trimmedCode;

    // Collect all elements and scripts
    const scripts: HTMLScriptElement[] = [];
    Array.from(tempDiv.querySelectorAll('script')).forEach((s) => {
      scripts.push(s);
      s.parentNode?.removeChild(s);
    });

    // Append non-script HTML elements first
    while (tempDiv.firstChild) {
      container.appendChild(tempDiv.firstChild);
    }

    // Now dynamically re-create and execute scripts so ad networks work in React
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      container.appendChild(newScript);
    });
  }, [enabled, code]);

  if (!enabled) return null;

  const hasCode = !!(code && code.trim().length > 0);

  // Slot-specific layout styling
  const slotStyles = {
    header: 'my-3 w-full max-w-xl mx-auto min-h-[50px]',
    infeed: 'w-[95%] sm:w-[96%] mx-auto my-3 min-h-[60px]',
    footer: 'my-4 w-full max-w-xl mx-auto min-h-[50px]',
  }[slotType];

  return (
    <div
      id={id || `ad-slot-${slotType}`}
      className={`relative overflow-hidden rounded-xl text-center transition-all ${slotStyles} ${className}`}
    >
      {hasCode ? (
        <div ref={containerRef} className="w-full flex items-center justify-center min-h-[45px]" />
      ) : (
        /* Default Visual Monetization Placeholder when code is not yet pasted */
        <div className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-400/30 text-center flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest">
            <i className="fa-solid fa-rectangle-ad text-xs"></i>
            <span>{slotType.toUpperCase()} ADVERTISEMENT SPACE</span>
          </div>
          <p className="text-xs text-neutral-300 font-medium">
            {fallbackText || 'Monetization Active • Place your AdSense or Sponsor Banner here'}
          </p>
          <span className="text-[10px] text-neutral-500">
            Configure code in Admin Panel ➔ Monetization & Ads
          </span>
        </div>
      )}
    </div>
  );
};
