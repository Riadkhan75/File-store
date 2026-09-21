import React from 'react';
import { CategoryItem } from '../../types';
import { DICTIONARY, Language } from '../../services/i18n';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export type FilterSpecial = 'all' | 'popular' | 'newest' | 'featured' | 'vip' | 'bookmarks';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  specialFilter: FilterSpecial;
  onSelectSpecialFilter: (filter: FilterSpecial) => void;
  filteredCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  specialFilter,
  onSelectSpecialFilter,
  filteredCount,
  language,
  onLanguageChange,
  onOpenProfile,
}) => {
  const t = DICTIONARY[language];
  const { currentUser, bookmarks } = useAuth();

  return (
    <div id="search-filter-section" className="w-full mb-5 space-y-3">
      {/* Top Utilities bar: Language switch, PWA install, and User Profile */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="inline-flex rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg transition ${
                language === 'en'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2.5 py-1 rounded-lg transition ${
                language === 'bn'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton language={language} />
        </div>

        {/* User Account / Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/40 text-xs font-semibold text-neutral-200 hover:text-white transition active:scale-95"
        >
          {currentUser ? (
            <>
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-[10px]">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="max-w-[90px] truncate text-[11px]">{currentUser.displayName || 'Profile'}</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-user text-amber-400 text-xs"></i>
              <span className="text-[11px]">{t.userProfile}</span>
            </>
          )}

          {bookmarks.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {bookmarks.length}
            </span>
          )}
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <i className="fa-solid fa-magnifying-glass text-xs text-amber-400/80"></i>
        </div>
        <input
          id="search-files-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-9 pr-9 py-2.5 bg-neutral-900/90 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-neutral-500 rounded-xl text-xs sm:text-sm transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
            aria-label="Clear search"
          >
            <i className="fa-solid fa-circle-xmark text-xs"></i>
          </button>
        )}
      </div>

      {/* Special Category Filters (Popular, Newest, Featured, VIP, Bookmarks) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            onSelectSpecialFilter('all');
            onSelectCategory('all');
          }}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition ${
            specialFilter === 'all' && selectedCategory === 'all'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          {t.allCategories}
        </button>
        <button
          onClick={() => onSelectSpecialFilter('popular')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition ${
            specialFilter === 'popular'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
          }`}
        >
          {t.popular}
        </button>
        <button
          onClick={() => onSelectSpecialFilter('newest')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition ${
            specialFilter === 'newest'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
          }`}
        >
          {t.newest}
        </button>
        <button
          onClick={() => onSelectSpecialFilter('featured')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition ${
            specialFilter === 'featured'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
          }`}
        >
          {t.featured}
        </button>
        <button
          onClick={() => onSelectSpecialFilter('vip')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition ${
            specialFilter === 'vip'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-amber-300 hover:text-white border border-amber-400/30'
          }`}
        >
          {t.premiumVip}
        </button>
        <button
          onClick={() => onSelectSpecialFilter('bookmarks')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
            specialFilter === 'bookmarks'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-neutral-900 text-rose-300 hover:text-white border border-neutral-800'
          }`}
        >
          <i className="fa-solid fa-heart text-[10px]"></i>
          <span>{t.bookmarks}</span>
          {bookmarks.length > 0 && (
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
              {bookmarks.length}
            </span>
          )}
        </button>
      </div>

      {/* Category Chips Bar */}
      {categories.length > 0 && specialFilter === 'all' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-${cat.id}-btn`}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium text-[11px] transition ${
                  isSelected
                    ? 'bg-amber-400/20 border border-amber-400 text-amber-300 font-bold'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
