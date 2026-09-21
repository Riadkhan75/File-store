import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { SocialLinkItem } from '../../types';

export const AdminSocialLinks: React.FC = () => {
  const { socialLinks, saveAllSocialLinks, updateSocialLink, addAdminLog, showToast } = useStore();
  const [links, setLinks] = useState<SocialLinkItem[]>(socialLinks);
  const [saving, setSaving] = useState(false);

  // Keep state in sync with real-time Firestore socialLinks
  useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      setLinks(socialLinks);
    }
  }, [socialLinks]);

  const handleUrlChange = (id: string, newUrl: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, url: newUrl } : l))
    );
  };

  // Instant on/off toggle with database save and toast feedback
  const handleToggleEnable = async (id: string) => {
    const target = links.find((l) => l.id === id);
    if (!target) return;
    const nextVal = !target.enabled;
    const updated = { ...target, enabled: nextVal };
    
    // Instant optimistic update
    setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    
    try {
      await updateSocialLink(updated);
      await addAdminLog({
        action: `${nextVal ? 'Enabled' : 'Disabled'} ${target.platform} Social Link`,
        category: 'settings',
      });
      showToast(`${target.platform} channel is now ${nextVal ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}`, 'info');
    } catch (e) {
      console.error(e);
      setLinks((prev) => prev.map((l) => (l.id === id ? target : l)));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveAllSocialLinks(links);
      await addAdminLog({
        action: 'Saved all social channel URLs',
        category: 'settings',
      });
      showToast('All social channel links saved successfully!', 'info');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="admin-social-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-share-nodes text-amber-400"></i>
            <span>Social Links</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Configure community channels. Toggling switches will immediately show or hide links on the storefront.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? 'Saving...' : 'Save All URLs'}
        </button>
      </div>

      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 divide-y divide-neutral-800/80">
        {links.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Platform info */}
            <div className="flex items-center gap-3.5 w-48 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                <i className={item.icon}></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{item.platform}</h4>
                <span className="text-[10px] text-neutral-500 font-mono">{item.id}</span>
              </div>
            </div>

            {/* URL input */}
            <div className="flex-1">
              <input
                type="url"
                value={item.url}
                onChange={(e) => handleUrlChange(item.id, e.target.value)}
                placeholder={`https://${item.id}.com/yourprofile`}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs font-mono text-white placeholder-neutral-600 outline-none"
              />
            </div>

            {/* Toggle switch with visible badge */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggleEnable(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  item.enabled
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.enabled ? 'bg-emerald-400' : 'bg-neutral-500'
                  }`}
                ></span>
                <span>{item.enabled ? 'Visible (ON)' : 'Hidden (OFF)'}</span>
              </button>

              {/* Direct slider switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggleEnable(item.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
