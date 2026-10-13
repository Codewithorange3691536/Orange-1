import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck,
  X,
  ChevronDown,
  Layers,
  Menu,
  Percent,
  Check,
  Tag,
  Palette,
  Code2,
  TrendingUp,
  BriefcaseBusiness,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST, AVAILABLE_COUPONS } from '../data/ebooks';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartTotal,
    favorites,
    libraryEbookIds,
    selectedAudience,
    setSelectedAudience,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openCart,
    openDashboard,
    openSupport,
    applyCoupon,
    appliedCouponCode
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isOffersMenuOpen, setIsOffersMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const offersMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (offersMenuRef.current && !offersMenuRef.current.contains(event.target as Node)) {
        setIsOffersMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top Value Announcement Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wide">
              <Sparkles className="w-3 h-3" /> 20% DISCOUNT
            </span>
            <span>
              Students (16–24) use{' '}
              <button 
                onClick={() => applyCoupon('STUDENT20')} 
                className="underline decoration-amber-400 font-mono font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                title="Apply STUDENT20 (20% Off)"
              >
                STUDENT20
              </button>{' '}
              • Founders &amp; Pros (25–40) use{' '}
              <button 
                onClick={() => applyCoupon('GROWTH20')} 
                className="underline decoration-emerald-400 font-mono font-bold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
                title="Apply GROWTH20 (20% Off)"
              >
                GROWTH20
              </button>{' '}
              for <strong>20% OFF</strong> all $24.99 editions
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant PDF, EPUB &amp; MOBI
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium" title="Digital products are non-refundable once delivered. Free preview available.">
              All Sales Final • Look-Inside Preview
            </span>
            <span>•</span>
            <button 
              onClick={() => openDashboard('orders')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Order Lookup
            </button>
            <span>•</span>
            <button 
              onClick={openSupport}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Help &amp; Support
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    MNSID
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded-md">
                    Publishing
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 tracking-tight hidden sm:block font-medium">
                  Professional Digital Editions
                </p>
              </div>
            </a>
          </div>

          {/* Professional Navigation Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
            {/* All Books */}
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setSelectedAudience('all');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                selectedCategory === 'All Categories' && selectedAudience === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All Books</span>
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => {
                  setIsCategoryMenuOpen(!isCategoryMenuOpen);
                  setIsOffersMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                  selectedCategory !== 'All Categories'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{selectedCategory !== 'All Categories' ? selectedCategory : 'Categories'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Clean Professional Categories Dropdown */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Browse by Category
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      $24.99 Flat Rate
                    </span>
                  </div>
                  <div className="py-1">
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleSelectCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {cat === 'UI/UX Design' && <Palette className="w-4 h-4 text-purple-500" />}
                          {cat === 'Web Dev & AI' && <Code2 className="w-4 h-4 text-blue-500" />}
                          {cat === 'Business & Startups' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                          {cat === 'Marketing & Sales' && <BriefcaseBusiness className="w-4 h-4 text-rose-500" />}
                          {cat}
                        </span>
                        {selectedCategory === cat ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : cat === 'UI/UX Design' ? (
                          <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 rounded-full">
                            Popular
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Special Offers (20% Deals Popover) */}
            <div className="relative" ref={offersMenuRef}>
              <button
                onClick={() => {
                  setIsOffersMenuOpen(!isOffersMenuOpen);
                  setIsCategoryMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                  appliedCouponCode
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Percent className="w-4 h-4 text-amber-600" />
                <span>Special Offers</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  20% OFF
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOffersMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Offers Popover */}
              {isOffersMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-amber-600" /> Active 20% Promotions
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full">
                      $19.99 with code
                    </span>
                  </div>

                  <div className="space-y-2">
                    {AVAILABLE_COUPONS.map((cp) => (
                      <div 
                        key={cp.code} 
                        className={`p-2.5 rounded-xl border transition-all ${
                          appliedCouponCode === cp.code
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-indigo-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            {cp.code}
                          </span>
                          <span className="text-xs font-black text-emerald-600">
                            {cp.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-2 leading-tight">
                          {cp.description}
                        </p>
                        <button
                          onClick={() => {
                            applyCoupon(cp.code);
                            setIsOffersMenuOpen(false);
                          }}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            appliedCouponCode === cp.code
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-slate-900 hover:bg-indigo-600 text-white'
                          }`}
                        >
                          {appliedCouponCode === cp.code ? '✓ Applied in Cart' : `Apply Code ${cp.code}`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support Link */}
            <button
              onClick={openSupport}
              className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Support</span>
            </button>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs xl:max-w-sm hidden md:block">
            <div className={`relative transition-all ${isSearchFocused ? 'ring-2 ring-indigo-500/30' : ''} rounded-xl`}>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search publications, topics..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/90 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons (Wishlist, Library, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => openDashboard('favorites')}
              className="p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-all relative flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="Saved Ebooks"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden xl:inline">Saved</span>
              {favorites.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User Dashboard / Library */}
            <button
              onClick={() => openDashboard('library')}
              className="p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all relative flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="My Digital Library"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span className="hidden xl:inline">My Library</span>
              {libraryEbookIds.length > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full hidden sm:inline">
                  {libraryEbookIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:shadow-indigo-600/30 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="text-indigo-100 text-xs font-mono border-l border-indigo-400/50 pl-2">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-4 animate-in slide-in-from-top-3 duration-200">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search publications, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Primary Mobile Navigation Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Explore
              </p>

              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSelectedAudience('all');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-slate-600" />
                  All Books ($24.99)
                </span>
                {selectedCategory === 'All Categories' && selectedAudience === 'all' && (
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                )}
              </button>

              {/* 20% Discount Quick Apply on Mobile */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-2">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-amber-700" /> Quick Apply 20% Discount
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      applyCoupon('STUDENT20');
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-900 hover:bg-amber-100 text-center"
                  >
                    STUDENT20 (20%)
                  </button>
                  <button
                    onClick={() => {
                      applyCoupon('GROWTH20');
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-900 hover:bg-amber-100 text-center"
                  >
                    GROWTH20 (20%)
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Categories Grid */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold truncate transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button 
                onClick={() => {
                  openSupport();
                  setIsMobileMenuOpen(false);
                }}
                className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Support &amp; FAQ
              </button>
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Instant Delivery
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
