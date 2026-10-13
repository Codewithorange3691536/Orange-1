import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AudienceFilterBar } from './components/AudienceFilterBar';
import { EbookCard } from './components/EbookCard';
import { BookReaderModal } from './components/BookReaderModal';
import { EbookDetailModal } from './components/EbookDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { EmailDeliveryModal } from './components/EmailDeliveryModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { SupportModal } from './components/SupportModal';
import { TrustGuaranteeSection } from './components/TrustGuaranteeSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { 
  Sparkles, 
  HelpCircle, 
  Search, 
  GraduationCap, 
  Briefcase, 
  BookOpen,
  ArrowUp
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    filteredEbooks,
    selectedAudience,
    setSelectedAudience,
    selectedCategory,
    openSupport,
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  // Sorted ebooks
  const sortedEbooks = useMemo(() => {
    const list = [...filteredEbooks];
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    // Default 'popular'
    return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }, [filteredEbooks, sortBy]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Filter and Sort Toolbar */}
      <AudienceFilterBar sortBy={sortBy} setSortBy={setSortBy} />

      {/* Main E-Book Catalog */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Active Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory === 'UI/UX Design'
                  ? '🎨 Best-Selling UI/UX Design & Design System E-Books'
                  : selectedAudience === 'students'
                  ? 'E-Books for Students & Beginners (16–24)'
                  : selectedAudience === 'professionals'
                  ? 'Playbooks for Professionals & Founders (25–40)'
                  : 'Curated Digital Publications'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {selectedCategory === 'UI/UX Design'
                ? 'Master Figma 5.0, multi-tier design tokens, micro-interactions, psychology, and design-to-code workflows with included Figma templates.'
                : selectedAudience === 'students'
                ? 'High-impact coding, UI/UX design, AI prompting, freelancing, and study tactics with 20% student discounts (STUDENT20).'
                : selectedAudience === 'professionals'
                ? 'Enterprise design systems, conversion optimization, SaaS finance, and executive productivity.'
                : 'All titles are verified 2026 editions, DRM-free with instant PDF, EPUB, and MOBI format delivery.'}
            </p>
          </div>

          {/* Quick Segment Switcher Pill */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedAudience('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedAudience === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedAudience('students')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedAudience === 'students'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Students
            </button>
            <button
              onClick={() => setSelectedAudience('professionals')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedAudience === 'professionals'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Founders
            </button>
          </div>
        </div>

        {/* E-Books Grid */}
        {sortedEbooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No matching ebooks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any books matching your current search or category filter. Try resetting your filters to explore our full library.
            </p>
            <button
              onClick={() => setSelectedAudience('all')}
              className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              Show All Ebooks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        )}
      </main>

      {/* Trust & Guarantee Section */}
      <TrustGuaranteeSection />

      {/* Footer */}
      <Footer />

      {/* Floating Quick Support Button */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={openSupport}
          className="bg-slate-900 hover:bg-slate-800 text-white p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 border border-slate-700"
          title="Need Help or FAQs?"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">24/7 Reader Support &amp; FAQs</span>
        </button>
      </div>

      {/* Modals & Overlays */}
      <BookReaderModal />
      <EbookDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <EmailDeliveryModal />
      <UserDashboardModal />
      <SupportModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
