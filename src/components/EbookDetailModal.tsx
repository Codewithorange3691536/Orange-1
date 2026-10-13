import React from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Download, 
  ShoppingBag, 
  ShieldCheck, 
  Tablet, 
  FileCheck, 
  Award, 
  Clock, 
  Globe2, 
  Layers, 
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const EbookDetailModal: React.FC = () => {
  const {
    previewingEbook,
    closePreview,
    addToCart,
    cart,
    libraryEbookIds,
    openReader,
    toggleFavorite,
    isFavorite,
    downloadEbookFile,
    showToast,
  } = useStore();

  if (!previewingEbook) return null;

  const isOwned = libraryEbookIds.includes(previewingEbook.id);
  const isInCart = cart.some((item) => item.ebook.id === previewingEbook.id);
  const isSaved = isFavorite(previewingEbook.id);

  const discountPercent = Math.round(
    ((previewingEbook.originalPrice - previewingEbook.price) / previewingEbook.originalPrice) * 100
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Ebook link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          onClick={closePreview}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition-all cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 bg-slate-50/50">
          {/* Left Column: Book Cover & Quick Meta */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src={previewingEbook.coverImage}
                alt={previewingEbook.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                {previewingEbook.category}
              </div>
            </div>

            {/* Quick Actions under cover */}
            <div className="mt-4 flex items-center gap-2 w-full justify-center">
              <button
                onClick={() => openReader(previewingEbook, 0)}
                className="flex-1 max-w-[140px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Look Inside
              </button>

              <button
                onClick={() => toggleFavorite(previewingEbook.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Key Specifications Pill List */}
            <div className="mt-6 w-full space-y-2 text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Pages:
                </span>
                <span className="font-semibold text-slate-800">{previewingEbook.pages} pages</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> File Size:
                </span>
                <span className="font-semibold text-slate-800">{previewingEbook.fileSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5" /> Language:
                </span>
                <span className="font-semibold text-slate-800">{previewingEbook.language}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> Digital ISBN:
                </span>
                <span className="font-mono text-slate-800">{previewingEbook.isbn}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Author, Pricing & Core Value */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Audience badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {previewingEbook.audience === 'students' ? 'Students & Beginners (16–24)' : 'Professionals & Founders (25–40)'}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Flat Rate $24.99
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {previewingEbook.title}
              </h1>

              <p className="text-sm text-slate-600 mt-2 font-medium">
                {previewingEbook.subtitle}
              </p>

              {/* Author Card */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                <img
                  src={previewingEbook.author.avatar}
                  alt={previewingEbook.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{previewingEbook.author.name}</h4>
                  <p className="text-[11px] text-slate-500">{previewingEbook.author.role}</p>
                  <p className="text-[10px] text-indigo-600 font-medium">{previewingEbook.author.credentials}</p>
                </div>
              </div>

              {/* Rating & Social Proof */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center text-amber-500 font-bold text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 text-slate-900">{previewingEbook.rating.toFixed(2)}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {previewingEbook.reviewsCount} Verified Customer Ratings
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {previewingEbook.fullDescription}
              </p>
            </div>

            {/* Price Box & Primary Action */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      $24.99
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-sans">
                      Flat Digital Rate
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    ✓ Lifetime Personal License Included
                  </span>
                </div>

                {isOwned ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openReader(previewingEbook, 0)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" /> Read Online
                    </button>
                    <button
                      onClick={() => downloadEbookFile(previewingEbook, 'PDF')}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(previewingEbook);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                      isInCart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isInCart ? 'View In Cart' : 'Add to Cart'}</span>
                  </button>
                )}
              </div>

              {/* Guarantees checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-slate-700 font-semibold" title="Strict No-Refund Policy on digital files once delivered.">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Sales Final (Digital)
                </span>
                <span className="flex items-center gap-1 text-sky-700">
                  <Tablet className="w-3.5 h-3.5 text-sky-600 shrink-0" /> Kindle / iPad Ready
                </span>
                <span className="flex items-center gap-1 text-indigo-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Instant Email Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Lower Body: Takeaways, Table of Contents, Reviews */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key Takeaways */}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-indigo-600" /> What You Will Master
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {previewingEbook.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>

            {/* Included Bonus Materials */}
            {previewingEbook.bonusItems && previewingEbook.bonusItems.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  🎁 Included Bonus Materials (Instant Download with Purchase)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {previewingEbook.bonusItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-amber-950 font-semibold flex items-center gap-2 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Table of Contents with Preview link */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Complete Table of Contents
              </h3>
              <button
                onClick={() => openReader(previewingEbook, 0)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
              >
                Read Sample Chapters <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {previewingEbook.chapters.map((ch, idx) => (
                <div key={ch.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">{ch.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ch.snippet}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      Page {ch.pageStart}
                    </span>
                    {ch.isPreviewAvailable ? (
                      <button
                        onClick={() => openReader(previewingEbook, idx)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg cursor-pointer"
                      >
                        Read Free
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded">
                        Full Edition
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Compatibility Guide */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-sky-600" /> Device Compatibility Guarantee
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Every purchase includes multi-format files optimized for all modern screens:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {previewingEbook.deviceCompatibility.map((device, i) => (
                <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center font-medium text-slate-800">
                  {device}
                </div>
              ))}
            </div>
          </div>

          {/* Verified Reader Reviews */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Verified Reader Reviews ({previewingEbook.reviews.length})
            </h3>
            <div className="space-y-3">
              {previewingEbook.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                      <span className="text-[11px] text-slate-500">• {rev.userRole}</span>
                      {rev.verifiedPurchase && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400 mb-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
