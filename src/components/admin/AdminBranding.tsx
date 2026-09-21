import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { compressImageFile, compressBase64Image } from '../../utils/imageCompressor';

const PRESET_LOGOS = [
  {
    name: 'Cyber Gold Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Golden Hexagon Core',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dark Cyber Matrix',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Liquid Amber Glass',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&auto=format&fit=crop&q=80',
  },
];

export const AdminBranding: React.FC = () => {
  const { settings, updateSettings, showToast, addAdminLog } = useStore();
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [optimizedInfo, setOptimizedInfo] = useState<string | null>(null);

  // Sync state with settings
  useEffect(() => {
    if (settings && settings.logoUrl !== undefined) {
      setLogoUrl(settings.logoUrl || '');
    }
  }, [settings.logoUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'warning');
      return;
    }

    setCompressing(true);
    try {
      // Automatically compress and resize to max 320x320
      // This drops size from 2MB down to ~20KB-40KB, keeping Firestore document lightweight!
      const compressed = await compressImageFile(file, {
        maxWidth: 320,
        maxHeight: 320,
        quality: 0.82,
        mimeType: 'image/jpeg',
      });

      const kbSize = Math.round(compressed.length / 1024);
      setLogoUrl(compressed);
      setOptimizedInfo(`Optimized to ~${kbSize} KB (High-resolution, cloud-safe)`);
      showToast(`Image optimized (${kbSize} KB) and ready to save!`, 'info');
    } catch (err) {
      console.error('Image compression error:', err);
      showToast('Failed to optimize image. Try a smaller file or direct URL.', 'error');
    } finally {
      setCompressing(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      let finalLogo = logoUrl;

      // Double-check if existing logo is oversized uncompressed base64
      if (finalLogo.startsWith('data:image/') && finalLogo.length > 100000) {
        showToast('Compressing image for cloud database...', 'info');
        finalLogo = await compressBase64Image(finalLogo, {
          maxWidth: 320,
          maxHeight: 320,
          quality: 0.8,
          mimeType: 'image/jpeg',
        });
        setLogoUrl(finalLogo);
      }

      await updateSettings({ logoUrl: finalLogo });
      await addAdminLog({
        action: 'Updated Store Logo',
        category: 'settings',
        details: finalLogo ? 'Applied customized logo image' : 'Removed logo image',
      });
      showToast('Store logo saved successfully!', 'info');
    } catch (err: any) {
      console.error('Logo save error:', err);
      showToast(err.message || 'Failed to save logo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    setLogoUrl('');
    setOptimizedInfo(null);
    await updateSettings({ logoUrl: '' });
    showToast('Logo removed. Default cloud emblem restored.', 'info');
  };

  return (
    <div id="admin-branding-section" className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-image text-amber-400"></i>
          <span>Logo & Branding</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Upload or configure the primary visual emblem displayed on the public store homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Live Logo Preview Card */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
            Live Logo Preview
          </h3>

          <div className="w-28 h-28 rounded-2xl p-1 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-xl shadow-amber-500/25 mb-4">
            <div className="w-full h-full rounded-[14px] bg-neutral-950 overflow-hidden flex items-center justify-center border border-amber-400/30">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <i className="fa-solid fa-cloud-arrow-down text-3xl text-amber-400"></i>
              )}
            </div>
          </div>

          <p className="text-sm font-bold text-white mb-1">
            {settings.storeName || 'Store Logo'}
          </p>
          <p className="text-[11px] text-neutral-500 mb-4">
            Displayed prominently at top of homepage
          </p>

          {logoUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
              <span>Remove Logo</span>
            </button>
          )}
        </div>

        {/* Right Column: Upload & URL Configuration */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6">
          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Upload New Logo (Image File)
            </label>
            <div className="relative border-2 border-dashed border-neutral-800 hover:border-amber-400/50 rounded-2xl p-6 text-center transition-colors bg-neutral-950/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl mb-2">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  Click to choose file or drag and drop
                </p>
                <p className="text-[11px] text-neutral-500">
                  PNG, JPG, WEBP (Auto-optimized for cloud database)
                </p>
                {compressing && (
                  <p className="text-xs text-amber-400 font-bold mt-2 flex items-center gap-1.5 animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Optimizing image for database...</span>
                  </p>
                )}
                {optimizedInfo && (
                  <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{optimizedInfo}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Direct URL Input */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Or Use Logo Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setOptimizedInfo(null);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs font-mono text-white placeholder-neutral-600 outline-none"
                />
                <button
                  type="submit"
                  disabled={saving || compressing}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {saving ? 'Saving...' : 'Apply & Save Logo'}
                </button>
              </div>
            </div>
          </form>

          {/* Preset Logo Gallery */}
          <div className="pt-4 border-t border-neutral-800">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              One-Click Preset Themes & Icons
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_LOGOS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setLogoUrl(preset.url)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-2 transition-all ${
                    logoUrl === preset.url
                      ? 'bg-amber-400/10 border-amber-400'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] text-neutral-300 font-semibold text-center truncate w-full">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
