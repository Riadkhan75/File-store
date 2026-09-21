import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FileItem, MirrorLink } from '../../types';

const POPULAR_ICONS = [
  { class: 'fa-solid fa-download', label: 'Download' },
  { class: 'fa-brands fa-android', label: 'Android' },
  { class: 'fa-brands fa-apple', label: 'iOS / Apple' },
  { class: 'fa-brands fa-windows', label: 'Windows PC' },
  { class: 'fa-solid fa-gamepad', label: 'Gaming' },
  { class: 'fa-solid fa-file-zipper', label: 'Zip / Archive' },
  { class: 'fa-solid fa-microchip', label: 'Chip / Firmware' },
  { class: 'fa-solid fa-wrench', label: 'Tools / Utility' },
  { class: 'fa-solid fa-shield-halved', label: 'Security' },
  { class: 'fa-solid fa-palette', label: 'Theme / Mod' },
  { class: 'fa-solid fa-wifi', label: 'Network' },
  { class: 'fa-solid fa-file-pdf', label: 'PDF Document' },
  { class: 'fa-solid fa-cloud-arrow-down', label: 'Cloud' },
  { class: 'fa-solid fa-code', label: 'Source Code' },
];

export const AdminFiles: React.FC = () => {
  const { files, categories, addFile, updateFile, deleteFile, addAdminLog } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formIcon, setFormIcon] = useState('fa-solid fa-download');
  const [formStatus, setFormStatus] = useState<'active' | 'disabled'>('active');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  const [formIsPremium, setFormIsPremium] = useState<boolean>(false);
  const [formFileSize, setFormFileSize] = useState<string>('');
  const [formVersion, setFormVersion] = useState<string>('');
  const [formMirrors, setFormMirrors] = useState<MirrorLink[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Filter in admin table
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const openAddModal = () => {
    setEditingFile(null);
    setFormName('');
    setFormUrl('');
    setFormDescription('');
    setFormCategoryId(categories[0]?.id || '');
    setFormIcon('fa-solid fa-download');
    setFormStatus('active');
    setFormDisplayOrder(files.length + 1);
    setFormIsFeatured(false);
    setFormIsPremium(false);
    setFormFileSize('');
    setFormVersion('');
    setFormMirrors([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (file: FileItem) => {
    setEditingFile(file);
    setFormName(file.name);
    setFormUrl(file.url);
    setFormDescription(file.description || '');
    setFormCategoryId(file.categoryId || '');
    setFormIcon(file.icon || 'fa-solid fa-download');
    setFormStatus(file.status);
    setFormDisplayOrder(file.displayOrder);
    setFormIsFeatured(file.isFeatured || false);
    setFormIsPremium(file.isPremium || false);
    setFormFileSize(file.fileSize || '');
    setFormVersion(file.version || '');
    setFormMirrors(file.mirrors ? [...file.mirrors] : []);
    setFormError(null);
    setIsModalOpen(true);
  };

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddMirror = () => {
    setFormMirrors([...formMirrors, { label: '', url: '' }]);
  };

  const handleRemoveMirror = (index: number) => {
    setFormMirrors(formMirrors.filter((_, idx) => idx !== index));
  };

  const handleMirrorChange = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...formMirrors];
    updated[index] = { ...updated[index], [field]: value };
    setFormMirrors(updated);
  };

  const handleSaveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('File Name is required.');
      return;
    }

    if (!formUrl.trim()) {
      setFormError('File URL is required.');
      return;
    }

    if (!validateUrl(formUrl.trim())) {
      setFormError('Invalid URL. Must begin with http:// or https://');
      return;
    }

    // Filter valid mirrors
    const cleanMirrors = formMirrors
      .filter((m) => m.url && m.url.trim().length > 0)
      .map((m) => ({
        label: m.label.trim() || 'Mirror Download',
        url: m.url.trim(),
      }));

    setSaving(true);
    const selectedCat = categories.find((c) => c.id === formCategoryId);
    const categoryName = selectedCat ? selectedCat.name : '';

    const payload = {
      name: formName.trim(),
      url: formUrl.trim(),
      description: formDescription.trim(),
      categoryId: formCategoryId,
      categoryName,
      icon: formIcon,
      status: formStatus,
      displayOrder: Number(formDisplayOrder) || 1,
      isFeatured: formIsFeatured,
      isPremium: formIsPremium,
      fileSize: formFileSize.trim(),
      version: formVersion.trim(),
      mirrors: cleanMirrors,
    };

    try {
      if (editingFile) {
        await updateFile(editingFile.id, payload);
        await addAdminLog({
          action: `Updated File: ${formName.trim()}`,
          category: 'file',
          details: `ID: ${editingFile.id}, Featured: ${formIsFeatured}, VIP: ${formIsPremium}`,
        });
      } else {
        await addFile(payload);
        await addAdminLog({
          action: `Created File: ${formName.trim()}`,
          category: 'file',
          details: `Category: ${categoryName}, Featured: ${formIsFeatured}, VIP: ${formIsPremium}`,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save file. Please verify database rules.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.id);
      await addAdminLog({
        action: `Deleted File: ${deleteTarget.name}`,
        category: 'file',
        details: `Deleted file ID: ${deleteTarget.id}`,
      });
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleToggleStatus = async (file: FileItem) => {
    const nextStatus = file.status === 'active' ? 'disabled' : 'active';
    await updateFile(file.id, { status: nextStatus });
    await addAdminLog({
      action: `Toggled File Status: ${file.name} to ${nextStatus}`,
      category: 'file',
    });
  };

  const handleQuickToggleFeatured = async (file: FileItem) => {
    await updateFile(file.id, { isFeatured: !file.isFeatured });
    await addAdminLog({
      action: `Toggled Featured on: ${file.name}`,
      category: 'file',
    });
  };

  const handleQuickTogglePremium = async (file: FileItem) => {
    await updateFile(file.id, { isPremium: !file.isPremium });
    await addAdminLog({
      action: `Toggled VIP Status on: ${file.name}`,
      category: 'file',
    });
  };

  const filteredFiles = files.filter((f) => {
    if (categoryFilter !== 'all' && f.categoryId !== categoryFilter) return false;
    const q = filterQuery.toLowerCase().trim();
    if (q) {
      return (
        f.name.toLowerCase().includes(q) ||
        (f.categoryName || '').toLowerCase().includes(q) ||
        (f.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="admin-files-section" className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-folder-tree text-amber-400"></i>
            <span>File Management</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Create, edit, reorder, feature, and configure downloadable files and mirror links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="add-file-btn"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs tracking-wide shadow-md shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            <span>+ Add New File</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <i className="fa-solid fa-magnifying-glass text-xs text-amber-400"></i>
          </div>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter files by name, category or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:border-amber-400 outline-none font-semibold"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="text-xs text-neutral-400 font-semibold whitespace-nowrap">
          {filteredFiles.length} of {files.length} files
        </span>
      </div>

      {/* Files List Table */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">File Name & Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Stats</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-neutral-900/40 transition">
                    {/* File Icon & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center text-sm shrink-0">
                          <i className={file.icon || 'fa-solid fa-download'}></i>
                        </div>
                        <div className="min-w-0 max-w-[220px] sm:max-w-xs">
                          <div className="font-bold text-white truncate flex items-center gap-1.5">
                            <span>{file.name}</span>
                            {file.version && (
                              <span className="text-[10px] text-amber-400 font-mono">
                                ({file.version})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate font-mono">
                            {file.url}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-bold">
                        {file.categoryName || 'General'}
                      </span>
                    </td>

                    {/* Badges: Featured & VIP */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleQuickToggleFeatured(file)}
                          title="Click to toggle Featured status"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                            file.isFeatured
                              ? 'bg-amber-400/20 border border-amber-400 text-amber-300'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <i className="fa-solid fa-star text-[9px]"></i>
                          <span>Star</span>
                        </button>
                        <button
                          onClick={() => handleQuickTogglePremium(file)}
                          title="Click to toggle VIP status"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                            file.isPremium
                              ? 'bg-amber-400 text-black shadow-sm font-black'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <i className="fa-solid fa-crown text-[9px]"></i>
                          <span>VIP</span>
                        </button>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-neutral-200 font-semibold flex items-center gap-1">
                        <i className="fa-regular fa-circle-down text-amber-400 text-[10px]"></i>
                        <span>{(file.clicks || 0).toLocaleString()} dl</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {(file.views || 0).toLocaleString()} views
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(file)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                          file.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            file.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                          }`}
                        />
                        <span className="capitalize">{file.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open link in new tab"
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </a>
                        <button
                          onClick={() => openEditModal(file)}
                          title="Edit File"
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(file)}
                          title="Delete File"
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 transition"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <i className="fa-solid fa-folder-open text-3xl mb-2 block text-neutral-600"></i>
                    No files found. Tap "+ Add New File" to create your first item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit File Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-xl rounded-2xl bg-neutral-900 border border-amber-400/40 p-6 shadow-2xl text-white my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-folder-plus text-amber-400"></i>
                <span>{editingFile ? 'Edit File Details' : 'Add New File'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveFile} className="space-y-4 pt-4">
              {/* File Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    File Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Photoshop 2026 Portable"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-amber-400 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Download URL */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Primary Download URL *
                </label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or direct link"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Description / Features (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief changelog, installation instructions, or file details..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>

              {/* File Size & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    File Size (e.g. 45 MB, 1.2 GB)
                  </label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="e.g. 18.5 MB"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Version (e.g. v2.4.1)
                  </label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="e.g. v3.1.0"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Select Icon
                </label>
                <div className="grid grid-cols-7 sm:grid-cols-7 gap-2">
                  {POPULAR_ICONS.map((ico) => (
                    <button
                      type="button"
                      key={ico.class}
                      onClick={() => setFormIcon(ico.class)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition ${
                        formIcon === ico.class
                          ? 'bg-amber-400 text-black border-amber-400 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={ico.label}
                    >
                      <i className={`${ico.class} text-sm`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: Featured & VIP / Premium */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                    <span className="text-xs font-bold text-white">Feature on Home</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-amber-400 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-crown text-amber-400 text-xs"></i>
                    <span className="text-xs font-bold text-white">VIP Member Only</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsPremium}
                    onChange={(e) => setFormIsPremium(e.target.checked)}
                    className="accent-amber-400 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Multiple Mirror Links Section */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-server text-amber-400 text-[11px]"></i>
                    <span>Mirror Download Links (Optional)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMirror}
                    className="text-[11px] text-amber-400 hover:underline font-bold"
                  >
                    + Add Mirror
                  </button>
                </div>

                {formMirrors.map((mirror, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Mirror Label (e.g. MediaFire)"
                      value={mirror.label}
                      onChange={(e) => handleMirrorChange(idx, 'label', e.target.value)}
                      className="w-1/3 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={mirror.url}
                      onChange={(e) => handleMirrorChange(idx, 'url', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMirror(idx)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Status & Display Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-amber-400 outline-none font-semibold"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="disabled">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs shadow-md shadow-amber-400/25 active:scale-95 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingFile ? 'Update File' : 'Save File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-base">
                <i className="fa-solid fa-trash"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Delete File?</h4>
                <p className="text-xs text-neutral-400 truncate max-w-[200px]">{deleteTarget.name}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-300">
              Are you sure you want to delete this file link? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow transition"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
