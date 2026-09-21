import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminMonetization: React.FC = () => {
  const { settings, updateSettings, files, users, addAdminLog } = useStore();

  const [vipInstructions, setVipInstructions] = useState(
    settings.vipInstructions ||
      'To access VIP exclusive files, send a message to our Telegram admin. We support bKash, Nagad, USDT, and Credit Card.'
  );

  const [adHeaderEnabled, setAdHeaderEnabled] = useState(settings.adHeaderEnabled ?? false);
  const [adHeaderCode, setAdHeaderCode] = useState(settings.adHeaderCode || '');

  const [adInfeedEnabled, setAdInfeedEnabled] = useState(settings.adInfeedEnabled ?? false);
  const [adInfeedCode, setAdInfeedCode] = useState(settings.adInfeedCode || '');

  const [adFooterEnabled, setAdFooterEnabled] = useState(settings.adFooterEnabled ?? false);
  const [adFooterCode, setAdFooterCode] = useState(settings.adFooterCode || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const vipFilesCount = files.filter((f) => f.isPremium).length;
  const vipUsersCount = users.filter((u) => u.role === 'vip').length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        vipInstructions,
        adHeaderEnabled,
        adHeaderCode,
        adInfeedEnabled,
        adInfeedCode,
        adFooterEnabled,
        adFooterCode,
      });

      await addAdminLog({
        action: 'Updated Monetization & Ad Placements',
        category: 'ad',
        details: `Header Ad: ${adHeaderEnabled ? 'ON' : 'OFF'}, Infeed Ad: ${
          adInfeedEnabled ? 'ON' : 'OFF'
        }, Footer Ad: ${adFooterEnabled ? 'ON' : 'OFF'}`,
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
          Monetization & Ad Networks
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Configure VIP subscription instructions, gate premium downloads, and embed ad networks.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            VIP Files Gated
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400">{vipFilesCount}</span>
            <span className="text-xs text-neutral-400">files</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            VIP Members Active
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400">{vipUsersCount}</span>
            <span className="text-xs text-neutral-400">subscribers</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Active Ad Slots
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-400">
              {[adHeaderEnabled, adInfeedEnabled, adFooterEnabled].filter(Boolean).length}
            </span>
            <span className="text-xs text-neutral-400">of 3 slots enabled</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: VIP Access Instructions */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-crown"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">VIP Membership Unlock Instructions</h3>
              <p className="text-xs text-neutral-400">
                Shown to non-VIP users whenever they try to download a gated/premium file
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            value={vipInstructions}
            onChange={(e) => setVipInstructions(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-400 outline-none leading-relaxed font-mono"
            placeholder="Provide payment instructions (bKash/Nagad/USDT) and direct Telegram contact..."
          />
        </div>

        {/* Section 2: Ad Placements */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-rectangle-ad"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ad Networks & Banner HTML Slots</h3>
              <p className="text-xs text-neutral-400">
                Paste raw HTML / JavaScript ad snippets (Google AdSense, PropellerAds, PopCash, custom image banners)
              </p>
            </div>
          </div>

          {/* Slot 1: Header Ad */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">1. Top Header Ad Banner</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adHeaderEnabled}
                  onChange={(e) => setAdHeaderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
            {adHeaderEnabled && (
              <textarea
                rows={2}
                value={adHeaderCode}
                onChange={(e) => setAdHeaderCode(e.target.value)}
                placeholder="<a href='...'><img src='...' /></a> or <script>...</script>"
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
              />
            )}
          </div>

          {/* Slot 2: In-feed Ad */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">2. In-feed Card Ad (Between Files)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adInfeedEnabled}
                  onChange={(e) => setAdInfeedEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
            {adInfeedEnabled && (
              <textarea
                rows={2}
                value={adInfeedCode}
                onChange={(e) => setAdInfeedCode(e.target.value)}
                placeholder="Responsive native ad snippet or banner code..."
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
              />
            )}
          </div>

          {/* Slot 3: Footer Ad */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">3. Footer Ad Banner</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adFooterEnabled}
                  onChange={(e) => setAdFooterEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
            {adFooterEnabled && (
              <textarea
                rows={2}
                value={adFooterCode}
                onChange={(e) => setAdFooterCode(e.target.value)}
                placeholder="Footer banner snippet..."
                className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
              />
            )}
          </div>
        </div>

        {/* Submit */}
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
            {saving ? 'Saving...' : 'Save Monetization Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
