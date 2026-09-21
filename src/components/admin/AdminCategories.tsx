import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, files, addCategory, updateCategory, deleteCategory } = useStore();

  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState<number>(1);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setLoading(true);
    try {
      await addCategory(newCatName.trim());
      setNewCatName('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: CategoryItem) => {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditOrder(cat.displayOrder);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editName.trim()) return;
    setLoading(true);
    try {
      await updateCategory(editingCat.id, editName.trim(), Number(editOrder));
      setEditingCat(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="admin-categories-section" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-tags text-amber-400"></i>
          <span>Category Management</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Organize files into filterable groups on your public store.
        </p>
      </div>

      {/* Add Category Card */}
      <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
          Create New Category
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Android Tools, Mods, Windows Software..."
            className="flex-1 px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-neutral-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !newCatName.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold tracking-wide shadow-md shadow-amber-400/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <span>Configured Categories ({categories.length})</span>
          <span>Linked Files</span>
        </div>

        {categories.length > 0 ? (
          <div className="divide-y divide-neutral-800/80">
            {categories.map((cat) => {
              const fileCount = files.filter((f) => f.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-850/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-neutral-950 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {cat.displayOrder}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono">ID: {cat.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                      {fileCount} {fileCount === 1 ? 'file' : 'files'}
                    </span>

                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-amber-400 transition-colors text-xs"
                      title="Edit Category"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 transition-colors text-xs"
                      title="Delete Category"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-neutral-500">
            No categories defined yet. Create one above to organize files.
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-750 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Edit Category
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={editOrder}
                  onChange={(e) => setEditOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-extrabold shadow-md shadow-amber-400/20"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-sm font-bold text-white mb-2">Delete Category</h3>
            <p className="text-xs text-neutral-400 mb-5">
              Are you sure you want to delete "<span className="text-white font-bold">{deleteTarget.name}</span>"? Files in this category will remain available under All Files.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
