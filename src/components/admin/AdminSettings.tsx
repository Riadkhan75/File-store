import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, addAdminLog } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName || '');
  const [description, setDescription] = useState(settings.description || '');
  const [username, setUsername] = useState(settings.username || '');
  const [telegramLink, setTelegramLink] = useState(settings.telegramLink || '');
  const [socialLink, setSocialLink] = useState(settings.socialLink || '');
  const [footerText, setFooterText] = useState(settings.footerText || '');
  const [browserTitle, setBrowserTitle] = useState(settings.browserTitle || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || '');
  const [websiteStatus, setWebsiteStatus] = useState<'live' | 'maintenance'>(
    settings.websiteStatus || 'live'
  );
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    settings.maintenanceMessage ||
      'We are upgrading our download servers for faster speeds. Check back shortly!'
  );
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        storeName: storeName.trim(),
        description: description.trim(),
        username: username.trim(),
        telegramLink: telegramLink.trim(),
        socialLink: socialLink.trim(),
        footerText: footerText.trim(),
        browserTitle: browserTitle.trim(),
        faviconUrl: faviconUrl.trim(),
        websiteStatus,
        maintenanceMessage: maintenanceMessage.trim(),
      });

      await addAdminLog({
        action: 'Updated Website Core Settings',
        category: 'settings',
        details: `Name: ${storeName}, Status: ${websiteStatus}`,
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
    <div id="admin-settings-section" className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-sliders text-amber-400"></i>
          <span>Website Settings</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Configure general store identity, metadata, maintenance mode, and telegram links.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-5"
      >
        {/* Store Name & Browser Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Store / Website Name <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. NOVA FILE STORE"
              required
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Browser Tab Title
            </label>
            <input
              type="text"
              value={browserTitle}
              onChange={(e) => setBrowserTitle(e.target.value)}
              placeholder="e.g. Nova File Store - Direct Downloads"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            Store Description / Bio
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short tagline or bio shown directly below store title..."
            className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none resize-none"
          />
        </div>

        {/* Maintenance Mode Configuration */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-screwdriver-wrench"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Store Status & Maintenance Mode
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Pause public access while updating files or hosting accounts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWebsiteStatus('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  websiteStatus === 'live'
                    ? 'bg-emerald-500 text-black shadow'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                Live Online
              </button>
              <button
                type="button"
                onClick={() => setWebsiteStatus('maintenance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  websiteStatus === 'maintenance'
                    ? 'bg-amber-400 text-black shadow'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                Maintenance
              </button>
            </div>
          </div>

          {websiteStatus === 'maintenance' && (
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">
                Custom Maintenance Notice Message
              </label>
              <input
                type="text"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Reason or estimated downtime..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>
          )}
        </div>

        {/* Username & Telegram Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Display Handle / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. @novastore_official"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Telegram Support / Channel Link
            </label>
            <input
              type="url"
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/yourchannel"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Favicon URL & General Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Website Favicon URL
            </label>
            <input
              type="url"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              placeholder="https://example.com/favicon.png"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Primary Social Link
            </label>
            <input
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="https://t.me or https://youtube.com"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Footer Text */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
            Footer Copyright / Disclaimer Text
          </label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="e.g. © 2026 Nova File Store. All rights reserved."
            className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-sm text-white outline-none"
          />
        </div>

        <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in">
              <i className="fa-solid fa-circle-check"></i>
              <span>Saved Successfully!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs tracking-wider uppercase shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
