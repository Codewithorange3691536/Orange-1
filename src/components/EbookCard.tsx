import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  BookOpen, 
  ShoppingBag, 
  Check, 
  Tablet, 
  Smartphone,
  Eye,
  GraduationCap,
  Briefcase,
  Volume2,
  VolumeX,
  Sparkles,
  Gift,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { Ebook } from '../types';
import { useStore } from '../context/StoreContext';

interface Props {
  ebook: Ebook;
}

export const EbookCard: React.FC<Props> = ({ ebook }) => {
  const {
    addToCart,
    cart,
    toggleFavorite,
    isFavorite,
    libraryEbookIds,
    openPreview,
    openReader,
    showToast,
  } = useStore();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTakeawaysExpanded, setIsTakeawaysExpanded] = useState(false);

  const isInCart = cart.some((item) => item.ebook.id === ebook.id);
  const isOwned = libraryEbookIds.includes(ebook.id);
  const isSaved = isFavorite(ebook.id);

  const discountPercent = Math.round(
    ((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100
  );
  const savedDollars = (ebook.originalPrice - ebook.price).toFixed(2);

  // Audio teaser player using SpeechSynthesis
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('Audio teaser narration not supported in your current browser.', 'info');
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = `Audio preview for ${ebook.title}. ${ebook.subtitle}. Authored by ${ebook.author.name}. Here is what you will master: ${ebook.keyTakeaways[0] || ebook.shortDescription}. Click Look Inside to read free sample chapters right now on MNSID Digital Solutions.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    showToast(`Playing audio intro for "${ebook.title}"`, 'info');
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative transform hover:-translate-y-1">
      {/* 3D Book Spine Aesthetic Ridge Accent on Left Edge */}
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-900 z-20 group-hover:w-2 transition-all opacity-80" />

      {/* Top Cover Visual Section */}
      <div 
        className="relative aspect-[16/10] sm:aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
        onClick={() => openPreview(ebook)}
      >
        <img
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-95 group-hover:brightness-100"
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-4 flex flex-wrap gap-1.5 z-10">
          {ebook.badge && (
            <span className="bg-slate-950/90 text-amber-300 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1 border border-amber-400/40">
              <Sparkles className="w-3 h-3 text-amber-400" /> {ebook.badge}
            </span>
          )}
          <span className="bg-emerald-600/95 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
            Flat Rate $24.99
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(ebook.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all z-10 cursor-pointer shadow-md ${
            isSaved
              ? 'bg-rose-50 text-rose-600 shadow-rose-500/20 scale-110'
              : 'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-500 backdrop-blur-md'
          }`}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick Audio Narration Teaser Button */}
        <button
          onClick={handleToggleAudio}
          className={`absolute bottom-11 right-3 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all z-10 flex items-center gap-1.5 shadow-md cursor-pointer backdrop-blur-md ${
            isPlayingAudio
              ? 'bg-indigo-600 text-white animate-pulse'
              : 'bg-slate-900/80 hover:bg-slate-900 text-indigo-300 border border-indigo-400/30'
          }`}
          title="Listen to 30s audio narration teaser"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-300" />
              <span>Stop Audio</span>
              <span className="flex gap-0.5 ml-1">
                <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audio Teaser</span>
            </>
          )}
        </button>

        {/* Quick Bottom Specs Strip on Cover */}
        <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between text-[11px] text-white/95 z-10">
          <div className="flex items-center gap-2 font-medium bg-black/60 px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              {ebook.readingTime || `${ebook.pages} pages`}
            </span>
            <span>•</span>
            <span className="text-slate-300 font-mono text-[10px]">{ebook.fileSize}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10" title="PDF, EPUB & Kindle MOBI included">
            <Tablet className="w-3 h-3 text-sky-300" />
            <Smartphone className="w-3 h-3 text-emerald-300" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">PDF • EPUB</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between pl-6">
        <div>
          {/* Category & Audience Tag */}
          <div className="flex items-center justify-between gap-2 mb-2.5 text-xs">
            <span className="font-extrabold text-indigo-700 uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-0.5 rounded-md">
              {ebook.category}
            </span>

            <span
              className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-md ${
                ebook.audience === 'students'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              {ebook.audience === 'students' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5" /> Students (16–24)
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5" /> Founders (25–40)
                </>
              )}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3 
            onClick={() => openPreview(ebook)}
            className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer"
          >
            {ebook.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {ebook.subtitle}
          </p>

          {/* Author Badge & Verified Experience */}
          <div className="mt-3.5 flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <img
              src={ebook.author.avatar}
              alt={ebook.author.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-800 font-bold truncate">
                {ebook.author.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {ebook.author.role}
              </p>
            </div>
          </div>

          {/* Rating, Social Proof & Level */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1 text-amber-500 font-extrabold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ebook.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({ebook.reviewsCount})</span>
            </div>

            {ebook.level && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {ebook.level}
              </span>
            )}
          </div>

          {/* Bonus Items highlight if available */}
          {ebook.bonusItems && ebook.bonusItems.length > 0 && (
            <div className="mt-3 p-2 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold truncate">
                Bonus: {ebook.bonusItems[0]}
              </span>
            </div>
          )}

          {/* Expandable "Peek Inside Key Takeaways" toggle */}
          <div className="mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsTakeawaysExpanded(!isTakeawaysExpanded)}
              className="w-full text-left text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-between py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                {isTakeawaysExpanded ? 'Hide Key Takeaways' : 'Peek 3 Key Takeaways'}
              </span>
              {isTakeawaysExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isTakeawaysExpanded && (
              <div className="mt-2 space-y-1.5 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 animate-in fade-in duration-200">
                {ebook.keyTakeaways.slice(0, 3).map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span className="leading-tight">{takeaway}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing & High-Converting Actions Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  $24.99
                </span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-sans">
                  Digital Edition
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5" title="Digital products are non-refundable once downloaded. Free sample chapters available via Look Inside.">
                <ShieldCheck className="w-3 h-3 text-indigo-600" /> Instant download • Digital sales final
              </p>
            </div>

            {/* Quick Preview Button ("Look Inside") */}
            <button
              onClick={() => openReader(ebook, 0)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs hover:scale-102"
              title="Read free sample excerpt in reader"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Look Inside</span>
            </button>
          </div>

          {/* Primary Action Button Grid */}
          {isOwned ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openReader(ebook, 0)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" /> Read Online
              </button>
              <button
                onClick={() => openPreview(ebook)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Downloads
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openPreview(ebook)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Details & TOC
              </button>
              <button
                onClick={() => addToCart(ebook)}
                className={`w-full font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                  isInCart
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
