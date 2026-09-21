import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdBannerSlot } from '../public/AdBannerSlot';

export const AdminMonetization: React.FC = () => {
  const { settings, updateSettings, files, users, addAdminLog, showToast } = useStore();

  const [monetizationEnabled, setMonetizationEnabled] = useState(
    settings.monetizationEnabled ?? true
  );
  const [vipGatingEnabled, setVipGatingEnabled] = useState(
    settings.vipGatingEnabled ?? true
  );
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

  const [previewSlot, setPreviewSlot] = useState<'header' | 'infeed' | 'footer' | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever settings change or load from Firestore
  useEffect(() => {
    if (settings) {
      setMonetizationEnabled(settings.monetizationEnabled ?? true);
      setVipGatingEnabled(settings.vipGatingEnabled ?? true);
      setVipInstructions(
        settings.vipInstructions ||
          'To access VIP exclusive files, send a message to our Telegram admin. We support bKash, Nagad, USDT, and Credit Card.'
      );
      setAdHeaderEnabled(settings.adHeaderEnabled ?? false);
      setAdHeaderCode(settings.adHeaderCode || '');
      setAdInfeedEnabled(settings.adInfeedEnabled ?? false);
      setAdInfeedCode(settings.adInfeedCode || '');
      setAdFooterEnabled(settings.adFooterEnabled ?? false);
      setAdFooterCode(settings.adFooterCode || '');
    }
  }, [
    settings.monetizationEnabled,
    settings.vipGatingEnabled,
    settings.vipInstructions,
    settings.adHeaderEnabled,
    settings.adHeaderCode,
    settings.adInfeedEnabled,
    settings.adInfeedCode,
    settings.adFooterEnabled,
    settings.adFooterCode,
  ]);

  const vipFilesCount = files.filter((f) => f.isPremium).length;
  const vipUsersCount = users.filter((u) => u.role === 'vip').length;

  // Toggle Master Monetization Switch with instant database save
  const handleToggleMaster = async (nextValue: boolean) => {
    setMonetizationEnabled(nextValue);
    try {
      await updateSettings({
        monetizationEnabled: nextValue,
      });
      await addAdminLog({
        action: 'Toggled Master Monetization',
        category: 'ad',
        details: `Global Monetization: ${nextValue ? 'ON (Activated)' : 'OFF (Deactivated)'}`,
      });
      showToast(
        nextValue
          ? 'Monetization & Ad Networks turned ON!'
          : 'Monetization turned OFF.',
        nextValue ? 'info' : 'warning'
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle monetization. Please check connection.', 'error');
    }
  };

  // Toggle Individual Ad Slot with instant feedback
  const handleToggleSlot = async (
    slot: 'header' | 'infeed' | 'footer',
    enabledVal: boolean
  ) => {
    if (slot === 'header') setAdHeaderEnabled(enabledVal);
    if (slot === 'infeed') setAdInfeedEnabled(enabledVal);
    if (slot === 'footer') setAdFooterEnabled(enabledVal);

    try {
      const payload: any = {};
      if (slot === 'header') payload.adHeaderEnabled = enabledVal;
      if (slot === 'infeed') payload.adInfeedEnabled = enabledVal;
      if (slot === 'footer') payload.adFooterEnabled = enabledVal;

      await updateSettings(payload);
      showToast(`${slot.toUpperCase()} ad slot ${enabledVal ? 'enabled' : 'disabled'}.`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle VIP Gating
  const handleToggleVipGating = async (enabledVal: boolean) => {
    setVipGatingEnabled(enabledVal);
    try {
      await updateSettings({ vipGatingEnabled: enabledVal });
      showToast(`VIP Paywall requirement ${enabledVal ? 'activated' : 'deactivated'}.`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Preset code generators
  const applyPreset = (
    slot: 'header' | 'infeed' | 'footer',
    type: 'adsense' | 'image' | 'sponsor'
  ) => {
    let code = '';
    if (type === 'adsense') {
      code = `<!-- Google AdSense Unit -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
    } else if (type === 'image') {
      code = `<a href="https://t.me" target="_blank" rel="noopener noreferrer" style="display:block; text-align:center; padding:10px;">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" alt="Special Sponsor" style="max-width:100%; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.5);" />
</a>`;
    } else if (type === 'sponsor') {
      code = `<div style="padding:14px 18px; border-radius:12px; background:linear-gradient(135deg, #1c1917, #292524); border:1px solid #f59e0b; text-align:center; color:#ffffff;">
  <h4 style="margin:0 0 4px 0; color:#fbbf24; font-weight:bold; font-size:14px;">🔥 SPONSOR OFFER • 50% OFF TODAY</h4>
  <p style="margin:0 0 10px 0; font-size:12px; color:#d6d3d1;">Get fast high-speed VIP gaming scripts with zero latency.</p>
  <a href="https://t.me" target="_blank" style="display:inline-block; padding:6px 16px; background:#f59e0b; color:#000000; font-weight:bold; font-size:11px; border-radius:8px; text-decoration:none;">JOIN TELEGRAM</a>
</div>`;
    }

    if (slot === 'header') {
      setAdHeaderCode(code);
      setAdHeaderEnabled(true);
    } else if (slot === 'infeed') {
      setAdInfeedCode(code);
      setAdInfeedEnabled(true);
    } else if (slot === 'footer') {
      setAdFooterCode(code);
      setAdFooterEnabled(true);
    }

    showToast(`Applied ${type} template to ${slot} ad slot. Click Save to publish.`, 'info');
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        monetizationEnabled,
        vipGatingEnabled,
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
        details: `Global: ${monetizationEnabled ? 'ON' : 'OFF'}, Header: ${
          adHeaderEnabled ? 'ON' : 'OFF'
        }, Infeed: ${adInfeedEnabled ? 'ON' : 'OFF'}, Footer: ${
          adFooterEnabled ? 'ON' : 'OFF'
        }, VIP Gating: ${vipGatingEnabled ? 'ON' : 'OFF'}`,
      });

      setSavedSuccess(true);
      showToast('All monetization settings saved successfully!');
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save monetization settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2.5">
            <i className="fa-solid fa-sack-dollar text-amber-400"></i>
            <span>Monetization & Ad Networks (মনিটাইজেশন)</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Turn on ads, configure Google AdSense/Adsterra/image banners, and manage VIP paywall access.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              monetizationEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                monetizationEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`}
            />
            <span>{monetizationEnabled ? 'Monetization ACTIVE' : 'Monetization OFF'}</span>
          </span>
        </div>
      </div>

      {/* MASTER MONETIZATION CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-neutral-900 to-amber-500/10 border border-amber-400/40 shadow-xl shadow-amber-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-amber-400/25">
              <i className="fa-solid fa-power-off"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Global Monetization Master Switch (প্রধান সুইচ)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase tracking-wider">
                  Master
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                {monetizationEnabled
                  ? 'সব ধরণের অ্যাড ব্যানার এবং স্পনসর স্লট ওয়েবসাইটে লাইভ চালু আছে।'
                  : 'অ্যাড ব্যানার সাময়িকভাবে বন্ধ আছে। সুইচ অন করলেই সব অ্যাড চালু হবে।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-bold text-neutral-300">
              {monetizationEnabled ? 'চালু (ON)' : 'বন্ধ (OFF)'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={monetizationEnabled}
                onChange={(e) => handleToggleMaster(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            VIP Files Gated
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400">{vipFilesCount}</span>
            <span className="text-xs text-neutral-400">files premium</span>
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
              {monetizationEnabled
                ? [adHeaderEnabled, adInfeedEnabled, adFooterEnabled].filter(Boolean).length
                : 0}
            </span>
            <span className="text-xs text-neutral-400">of 3 slots live</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: VIP Access Instructions & Paywall */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-crown"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">VIP Membership Paywall (ভিআইপি গেটওয়ে)</h3>
                <p className="text-xs text-neutral-400">
                  Enforces VIP subscription check when non-VIP users click premium files
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <span className="text-xs text-neutral-400">
                {vipGatingEnabled ? 'VIP Paywall Active' : 'Paywall Disabled'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={vipGatingEnabled}
                  onChange={(e) => handleToggleVipGating(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Payment & Unlock Instructions (বিকাশ / নগদ / টেলিগ্রাম নির্দেশনা):
            </label>
            <textarea
              rows={3}
              value={vipInstructions}
              onChange={(e) => setVipInstructions(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-400 outline-none leading-relaxed font-mono"
              placeholder="Provide payment instructions (bKash/Nagad/USDT) and direct Telegram contact..."
            />
          </div>
        </div>

        {/* Section 2: Ad Placements */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-rectangle-ad"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ad Networks & Banner Placements (বিজ্ঞাপন স্লট)</h3>
              <p className="text-xs text-neutral-400">
                Paste raw HTML / JavaScript ad snippets (Google AdSense, Adsterra, PropellerAds, custom image banners)
              </p>
            </div>
          </div>

          {/* Slot 1: Header Ad */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-white">Top Header Ad Banner (উপরে হেডার বিজ্ঞাপন)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewSlot(previewSlot === 'header' ? null : 'header')}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition flex items-center gap-1"
                >
                  <i className="fa-regular fa-eye"></i>
                  <span>{previewSlot === 'header' ? 'Hide Preview' : 'Preview'}</span>
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adHeaderEnabled}
                    onChange={(e) => handleToggleSlot('header', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Quick Templates:</span>
              <button
                type="button"
                onClick={() => applyPreset('header', 'adsense')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Google AdSense
              </button>
              <button
                type="button"
                onClick={() => applyPreset('header', 'image')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Image Banner
              </button>
              <button
                type="button"
                onClick={() => applyPreset('header', 'sponsor')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Sponsor Card
              </button>
            </div>

            <textarea
              rows={3}
              value={adHeaderCode}
              onChange={(e) => setAdHeaderCode(e.target.value)}
              placeholder="Paste <script>...</script> or <a href='...'><img src='...' /></a> HTML code here..."
              className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
            />

            {previewSlot === 'header' && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-amber-400/20">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-2">Live Preview:</span>
                <AdBannerSlot slotType="header" enabled={true} code={adHeaderCode} />
              </div>
            )}
          </div>

          {/* Slot 2: In-feed Ad */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold text-white">In-feed Card Ad (ফাইল লিস্টের মাঝখানে বিজ্ঞাপন)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewSlot(previewSlot === 'infeed' ? null : 'infeed')}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition flex items-center gap-1"
                >
                  <i className="fa-regular fa-eye"></i>
                  <span>{previewSlot === 'infeed' ? 'Hide Preview' : 'Preview'}</span>
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adInfeedEnabled}
                    onChange={(e) => handleToggleSlot('infeed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Quick Templates:</span>
              <button
                type="button"
                onClick={() => applyPreset('infeed', 'sponsor')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Native Sponsor Card
              </button>
              <button
                type="button"
                onClick={() => applyPreset('infeed', 'adsense')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Google AdSense
              </button>
            </div>

            <textarea
              rows={3}
              value={adInfeedCode}
              onChange={(e) => setAdInfeedCode(e.target.value)}
              placeholder="Responsive native card or banner code..."
              className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
            />

            {previewSlot === 'infeed' && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-amber-400/20">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-2">Live Preview:</span>
                <AdBannerSlot slotType="infeed" enabled={true} code={adInfeedCode} />
              </div>
            )}
          </div>

          {/* Slot 3: Footer Ad */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-white">Footer Ad Banner (নিচের ফুটার বিজ্ঞাপন)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewSlot(previewSlot === 'footer' ? null : 'footer')}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition flex items-center gap-1"
                >
                  <i className="fa-regular fa-eye"></i>
                  <span>{previewSlot === 'footer' ? 'Hide Preview' : 'Preview'}</span>
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adFooterEnabled}
                    onChange={(e) => handleToggleSlot('footer', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Quick Templates:</span>
              <button
                type="button"
                onClick={() => applyPreset('footer', 'adsense')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Google AdSense
              </button>
              <button
                type="button"
                onClick={() => applyPreset('footer', 'sponsor')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold transition"
              >
                + Sponsor Banner
              </button>
            </div>

            <textarea
              rows={3}
              value={adFooterCode}
              onChange={(e) => setAdFooterCode(e.target.value)}
              placeholder="Footer banner snippet..."
              className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:border-amber-400 outline-none"
            />

            {previewSlot === 'footer' && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-amber-400/20">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-2">Live Preview:</span>
                <AdBannerSlot slotType="footer" enabled={true} code={adFooterCode} />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-400/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save All Monetization Settings (সেভ করুন)'}
          </button>
        </div>
      </form>
    </div>
  );
};
