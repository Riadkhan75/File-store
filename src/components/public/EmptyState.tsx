import React from 'react';

interface EmptyStateProps {
  isSearching: boolean;
  onResetSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isSearching, onResetSearch }) => {
  return (
    <div
      id="empty-files-state"
      className="w-full max-w-md mx-auto my-12 p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center animate-in fade-in"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-2xl mb-4 shadow-lg shadow-amber-400/5">
        <i className="fa-regular fa-folder-open"></i>
      </div>

      <h3 className="text-lg font-bold text-white mb-1.5">
        {isSearching ? 'No Matching Files Found' : 'No files available right now.'}
      </h3>

      <p className="text-neutral-400 text-sm max-w-xs mb-5 leading-relaxed">
        {isSearching
          ? 'Try adjusting your search terms or selecting a different category.'
          : 'Check back soon! New files and updates are uploaded regularly.'}
      </p>

      {isSearching && (
        <button
          onClick={onResetSearch}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md shadow-amber-400/20 active:scale-95"
        >
          Clear Search Filter
        </button>
      )}
    </div>
  );
};
