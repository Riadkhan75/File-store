import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminBanner: React.FC = () => {
  const { settings, updateSettings, addAdminLog } = useStore();

  const [bannerEnabled, setBannerEnabled] = useState(settings.bannerEnabled ?? false);
  const [bannerTitle, setBannerTitle] = useState(settings.bannerTitle || '');
  const [bannerSubtitle, setBannerSubtitle] = useState(settings.bannerSubtitle || '');
  const [bannerImageUrl, setBannerImageUrl] = useState(settings.bannerImageUrl || '');
  const [bannerButtonText, setBannerButtonText] = useState(settings.bannerButtonText || 'Explore Now');
  const [bannerButtonLink, setBannerButtonLink] = useState(settings.bannerButtonLink || '');

  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementEnabled ?? false);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [announcementLink, setAnnouncementLink] = useState(settings.announcementLink || '');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'alert' | 'success'>(
    settings.announcementType || 'info'
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        bannerEnabled,
        bannerTitle,
        bannerSubtitle,
        bannerImageUrl,
        bannerButtonText,
        bannerButtonLink,
        announcementEnabled,
        announcementText,
        announcementLink,
        announcementType,
      });

      await addAdminLog({
        action: 'Updated Homepage Banner & Announcement Settings',
        category: 'settings',
        details: `Banner: ${bannerEnabled ? 'Enabled' : 'Disabled'}, Announcement: ${
          announcementEnabled ? 'Enabled' : 'Disabled'
        }`,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
          Banner & Live Announcements
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Highlight promotions, telegram channel alerts, or new software releases on the homepage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Live Announcement / Broadcast Bar */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <i className="fa-solid fa-bullhorn text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live Broadcast Ticker</h3>
                <p className="text-xs text-neutral-400">Top notification bar visible across the storefront</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {announcementEnabled && (
            <div className="space-y-3 pt-2 border-t border-neutral-850">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Announcement Style
                  </label>
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value="info">Info / News (Gold Accent)</option>
                    <option value="warning">Important Alert (Orange Accent)</option>
                    <option value="alert">Critical Notice (Red Accent)</option>
                    <option value="success">Success / New Release (Emerald Accent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Optional Action Link
                  </label>
                  <input
                    type="url"
                    value={announcementLink}
                    onChange={(e) => setAnnouncementLink(e.target.value)}
                    placeholder="https://t.me/yourchannel or file link"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Ticker Message Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Join our official Telegram channel for VIP updates & requests!"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Homepage Spotlight Hero Banner */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <i className="fa-solid fa-rectangle-ad text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Homepage Spotlight Banner</h3>
                <p className="text-xs text-neutral-400">Large card featured directly beneath the store header</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {bannerEnabled && (
            <div className="space-y-3 pt-2 border-t border-neutral-850">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. 🔥 New Ultra Mod Pack 2026 Released"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Background Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. Direct cloud high-speed mirror with zero waiting time."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                    placeholder="e.g. Download Now"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    CTA Button Destination URL
                  </label>
                  <input
                    type="url"
                    value={bannerButtonLink}
                    onChange={(e) => setBannerButtonLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in">
              <i className="fa-solid fa-circle-check"></i>
              <span>Saved Successfully!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-400/20 active:scale-95 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Banner Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
