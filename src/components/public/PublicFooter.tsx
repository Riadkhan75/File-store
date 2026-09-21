import React from 'react';
import { WebsiteSettings, SocialLinkItem } from '../../types';

interface PublicFooterProps {
  settings: WebsiteSettings;
  socialLinks: SocialLinkItem[];
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ settings, socialLinks }) => {
  const activeSocials = socialLinks.filter((s) => s.enabled && s.url && s.url.trim() !== '');

  return (
    <footer id="public-footer" className="mt-16 pb-12 pt-8 border-t border-neutral-900 text-center px-4 max-w-xl mx-auto">
      {/* Social Media Icons List */}
      {activeSocials.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          {activeSocials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.platform}
              className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 hover:bg-neutral-800 transition-all duration-200 text-base shadow-sm hover:scale-110 active:scale-95"
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      )}

      {/* Footer Text */}
      <p className="text-neutral-500 text-xs sm:text-sm font-normal leading-relaxed max-w-md mx-auto">
        {settings.footerText || `© ${new Date().getFullYear()} ${settings.storeName}. All rights reserved.`}
      </p>

      {/* Security & Fast direct badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-600">
        <i className="fa-solid fa-lock text-[10px] text-amber-400/60"></i>
        <span>Encrypted Direct Delivery • Official Releases</span>
      </div>
    </footer>
  );
};
