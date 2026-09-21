import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { WebsiteSettings } from '../../types';

export const AdminAppearance: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#facc15');
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor || '#09090b');
  const [borderColor, setBorderColor] = useState(settings.borderColor || '#eab308');
  const [buttonRadius, setButtonRadius] = useState<WebsiteSettings['buttonRadius']>(
    settings.buttonRadius || 'rounded-xl'
  );
  const [glowIntensity, setGlowIntensity] = useState<WebsiteSettings['glowIntensity']>(
    settings.glowIntensity || 'normal'
  );
  const [fontFamily, setFontFamily] = useState<WebsiteSettings['fontFamily']>(
    settings.fontFamily || 'Outfit'
  );
  const [cardStyle, setCardStyle] = useState<WebsiteSettings['cardStyle']>(
    settings.cardStyle || 'bordered'
  );
  const [saving, setSaving] = useState(false);

  // Sync with Firestore settings
  useEffect(() => {
    if (settings) {
      if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
      if (settings.backgroundColor) setBackgroundColor(settings.backgroundColor);
      if (settings.borderColor) setBorderColor(settings.borderColor);
      if (settings.buttonRadius) setButtonRadius(settings.buttonRadius);
      if (settings.glowIntensity) setGlowIntensity(settings.glowIntensity);
      if (settings.fontFamily) setFontFamily(settings.fontFamily);
      if (settings.cardStyle) setCardStyle(settings.cardStyle);
    }
  }, [
    settings.primaryColor,
    settings.backgroundColor,
    settings.borderColor,
    settings.buttonRadius,
    settings.glowIntensity,
    settings.fontFamily,
    settings.cardStyle,
  ]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        primaryColor,
        backgroundColor,
        borderColor,
        buttonRadius,
        glowIntensity,
        fontFamily,
        cardStyle,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setPrimaryColor('#facc15');
    setBackgroundColor('#09090b');
    setBorderColor('#eab308');
    setButtonRadius('rounded-xl');
    setGlowIntensity('normal');
    setFontFamily('Outfit');
    setCardStyle('bordered');
    showToast('Appearance restored to default Cyber Gold & Black theme', 'info');
  };

  return (
    <div id="admin-appearance-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-palette text-amber-400"></i>
            <span>Appearance & Theme</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Customize typography, glow intensity, colors, and button rounded corners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all"
          >
            Reset to Reference Default
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form controls */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Colors Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Theme Palette
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Primary / Button Color</label>
                <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Border Glow Accent</label>
                <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Dark Canvas Background</label>
                <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Radius & Glow Intensity */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Geometry & Glow Effects
            </h3>

            {/* Button Radius */}
            <div>
              <label className="block text-xs text-neutral-400 mb-2">Button Corner Radius</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rounded-lg', label: 'Rounded LG' },
                  { id: 'rounded-xl', label: 'Rounded XL (Default)' },
                  { id: 'rounded-2xl', label: 'Rounded 2XL' },
                  { id: 'rounded-full', label: 'Capsule Pill' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setButtonRadius(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      buttonRadius === item.id
                        ? 'bg-amber-400 text-black border-amber-400 font-extrabold'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow Intensity */}
            <div>
              <label className="block text-xs text-neutral-400 mb-2">Glow Light Intensity</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None (Subdued)' },
                  { id: 'subtle', label: 'Subtle Accent' },
                  { id: 'normal', label: 'Balanced (Default)' },
                  { id: 'intense', label: 'Intense Cyber Neon' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setGlowIntensity(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      glowIntensity === item.id
                        ? 'bg-amber-400 text-black border-amber-400 font-extrabold'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography & Card Style */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Typography & Card Treatment
            </h3>

            {/* Typography */}
            <div>
              <label className="block text-xs text-neutral-400 mb-2">Font Family</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Outfit', 'Plus Jakarta Sans', 'Inter', 'JetBrains Mono'].map((font) => (
                  <button
                    type="button"
                    key={font}
                    onClick={() => setFontFamily(font as any)}
                    style={{ fontFamily: font }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      fontFamily === font
                        ? 'bg-amber-400 text-black border-amber-400 font-extrabold'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div>
              <label className="block text-xs text-neutral-400 mb-2">Card Style Layout</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bordered', label: 'Golden Border' },
                  { id: 'filled', label: 'Solid Charcoal' },
                  { id: 'glass', label: 'Glassmorphism' },
                  { id: 'minimal', label: 'Ultra Minimal' },
                ].map((style) => (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setCardStyle(style.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      cardStyle === style.id
                        ? 'bg-amber-400 text-black border-amber-400 font-extrabold'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Applying Theme...' : 'Apply Appearance to Public Store'}
          </button>
        </form>

        {/* Live Card Preview Box */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
              Real-Time Button Preview
            </h3>

            <div
              className={`p-4 border transition-all duration-300 ${
                glowIntensity === 'intense'
                  ? 'shadow-[0_0_30px_rgba(250,204,21,0.5)] border-amber-400'
                  : glowIntensity === 'none'
                  ? 'border-neutral-800'
                  : 'shadow-[0_0_20px_rgba(250,204,21,0.3)] border-amber-400/50'
              } ${
                cardStyle === 'filled'
                  ? 'bg-neutral-900'
                  : cardStyle === 'glass'
                  ? 'bg-neutral-900/50 backdrop-blur-md'
                  : 'bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950'
              } ${buttonRadius}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center text-xl">
                    <i className="fa-brands fa-android"></i>
                  </div>
                  <div>
                    <h4
                      className="text-sm font-bold text-white tracking-wide"
                      style={{ fontFamily }}
                    >
                      Android Tools Pro
                    </h4>
                    <span className="text-[10px] text-neutral-400">Direct Download • 2.8k DLs</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/30">
                  <i className="fa-solid fa-arrow-down"></i>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Font:</span>
                <span className="text-white font-mono">{fontFamily}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Radius:</span>
                <span className="text-white font-mono">{buttonRadius}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Glow Level:</span>
                <span className="text-white font-mono">{glowIntensity}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Card Style:</span>
                <span className="text-white font-mono">{cardStyle}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 mt-6 text-center">
            Changes propagate live to all visitors without code recompilation.
          </p>
        </div>
      </div>
    </div>
  );
};
