import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminBackup: React.FC = () => {
  const { exportBackupJSON, importBackupJSON, seedInitialData, showToast } = useStore();
  const [jsonInput, setJsonInput] = useState('');
  const [loadingImport, setLoadingImport] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);

  const handleDownload = () => {
    const jsonString = exportBackupJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `store_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Store backup JSON downloaded successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!jsonInput.trim()) {
      showToast('Please provide or upload a valid JSON backup content.', 'warning');
      return;
    }
    setLoadingImport(true);
    try {
      const result = await importBackupJSON(jsonInput);
      if (!result.success) {
        showToast(`Restore error: ${result.message}`, 'error');
      } else {
        setJsonInput('');
      }
    } catch (err: any) {
      showToast(err.message || 'Import failed', 'error');
    } finally {
      setLoadingImport(false);
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm(
        'This will populate your Firestore database with reference sample files and categories. Continue?'
      )
    ) {
      return;
    }
    setLoadingSeed(true);
    try {
      await seedInitialData();
    } catch (e: any) {
      showToast(e.message || 'Seed failed', 'error');
    } finally {
      setLoadingSeed(false);
    }
  };

  return (
    <div id="admin-backup-section" className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-database text-amber-400"></i>
          <span>Backup, Restore & Seeding</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Export your entire store data as a JSON file, or restore existing files and categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl mb-4">
              <i className="fa-solid fa-file-export"></i>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Export Store Data (JSON)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Download an encrypted snapshot containing all website settings, file records, categories, and social media configurations.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-download"></i>
            <span>Download Backup File</span>
          </button>
        </div>

        {/* Quick Seed Demo Card */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xl mb-4">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Seed Sample Store Data
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Instantly populate your Firebase Firestore with clean, production-ready sample files, categories, and social links to preview the full layout.
            </p>
          </div>

          <button
            onClick={handleSeed}
            disabled={loadingSeed}
            className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/50 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-seedling text-amber-400"></i>
            <span>{loadingSeed ? 'Seeding Firestore...' : 'Populate Firestore Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Restore Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-file-import text-amber-400"></i>
          <span>Restore Store from Backup</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-xs font-semibold text-neutral-300 flex items-center gap-2 cursor-pointer transition-colors shrink-0">
            <i className="fa-solid fa-folder-open text-amber-400"></i>
            <span>Choose JSON File</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <span className="text-xs text-neutral-500 self-center">
            Or paste JSON content into the editor below:
          </span>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={6}
          placeholder='{"version": "1.0", "settings": {...}, "files": [...]}'
          className="w-full p-4 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs font-mono text-neutral-300 outline-none resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleRestore}
            disabled={loadingImport || !jsonInput.trim()}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>{loadingImport ? 'Restoring...' : 'Restore Data to Store'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
