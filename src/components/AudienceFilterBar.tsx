import React from 'react';
import { CATEGORIES_LIST } from '../data/ebooks';
import { useStore } from '../context/StoreContext';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface Props {
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
  setSortBy: (sort: 'popular' | 'price-low' | 'price-high' | 'rating') => void;
}

export const AudienceFilterBar: React.FC<Props> = ({ sortBy, setSortBy }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedAudience,
    setSelectedAudience,
    filteredEbooks,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const hasActiveFilters =
    selectedCategory !== 'All Categories' ||
    selectedAudience !== 'all' ||
    Boolean(searchQuery.trim());

  const resetAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedAudience('all');
    setSearchQuery('');
  };

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category horizontal scrolling list */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES_LIST.map((category) => {
            const isSelected = selectedCategory === category;
            const isDesign = category === 'UI/UX Design';
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? isDesign
                      ? 'bg-purple-700 text-white font-bold shadow-sm'
                      : 'bg-slate-900 text-white font-semibold shadow-xs'
                    : isDesign
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold border border-purple-200/80'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {isDesign && <span className="text-[10px]">✨</span>}
                {category}
                {isDesign && (
                  <span className="text-[9px] bg-purple-200/80 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results Counter, Reset & Sort */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>
              Showing <strong className="text-slate-900">{filteredEbooks.length}</strong> ebooks
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline decoration-dotted"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated (4.9+ ★)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
