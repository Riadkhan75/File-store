import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SocialLinkItem } from '../../types';

export const AdminSocialLinks: React.FC = () => {
  const { socialLinks, saveAllSocialLinks } = useStore();
  const [links, setLinks] = useState<SocialLinkItem[]>(socialLinks);
  const [saving, setSaving] = useState(false);

  const handleUrlChange = (id: string, newUrl: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, url: newUrl } : l))
    );
  };

  const handleToggleEnable = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveAllSocialLinks(links);
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
            Configure community channels. Only enabled channels with a valid link appear on the public homepage.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? 'Saving...' : 'Save All Links'}
        </button>
      </div>

      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 divide-y divide-neutral-800/80">
        {links.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Platform info */}
            <div className="flex items-center gap-3.5 w-44 shrink-0">
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

            {/* Toggle switch */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggleEnable(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
                <span>{item.enabled ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
