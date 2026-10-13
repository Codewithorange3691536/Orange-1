import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sun, 
  Moon, 
  Coffee, 
  Type, 
  List, 
  Download, 
  ShoppingBag, 
  ShieldCheck,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BookReaderModal: React.FC = () => {
  const {
    readingEbook,
    readingChapterIndex,
    setReadingChapterIndex,
    closeReader,
    libraryEbookIds,
    addToCart,
    cart,
    downloadEbookFile,
  } = useStore();

  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  if (!readingEbook) return null;

  const isOwned = libraryEbookIds.includes(readingEbook.id);
  const isInCart = cart.some((item) => item.ebook.id === readingEbook.id);
  const currentChapter = readingEbook.chapters[readingChapterIndex] || readingEbook.chapters[0];

  const totalChapters = readingEbook.chapters.length;
  const progressPercent = Math.round(((readingChapterIndex + 1) / totalChapters) * 100);

  // Theme styling classes
  const themeClasses = {
    light: 'bg-white text-slate-800',
    sepia: 'bg-[#FAF6EE] text-[#3c332a]',
    dark: 'bg-[#18181B] text-[#E4E4E7]',
  }[theme];

  const themeNavClasses = {
    light: 'bg-slate-50 border-slate-200 text-slate-700',
    sepia: 'bg-[#F2ECE1] border-[#E5DAC8] text-[#554637]',
    dark: 'bg-[#27272A] border-[#3F3F46] text-[#D4D4D8]',
  }[theme];

  const fontClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Top Reading Toolbar */}
      <div className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${themeNavClasses}`}>
        {/* Left: Book & Chapter info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Toggle Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Chapters</span>
          </button>

          <div className="border-l border-current/20 pl-3">
            <h2 className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md">
              {readingEbook.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] opacity-75">
              <span>{currentChapter.title}</span>
              {!isOwned && (
                <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded text-[10px]">
                  Sample Preview
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Controls & Theme switch */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme toggles */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-current/10">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Light Paper Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                theme === 'sepia' ? 'bg-[#F2ECE1] shadow-xs text-amber-900 font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Sepia Warm Theme (Recommended)"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-[#3F3F46] shadow-xs text-white font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Dark OLED Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Size controls */}
          <div className="hidden md:flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-current/10">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-60'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                fontSize === 'large' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-60'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-60'
              }`}
            >
              A++
            </button>
          </div>

          {/* Dyslexia friendly toggle */}
          <button
            onClick={() => setIsDyslexicFont(!isDyslexicFont)}
            className={`hidden lg:flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-current/10 cursor-pointer ${
              isDyslexicFont ? 'bg-indigo-600 text-white font-bold border-indigo-600' : 'opacity-70 hover:opacity-100'
            }`}
            title="Toggle high-readability spacing font"
          >
            <Type className="w-3 h-3" /> Accessible Font
          </button>

          {/* Download button if owned */}
          {isOwned ? (
            <button
              onClick={() => downloadEbookFile(readingEbook, 'PDF')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Copy</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(readingEbook)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isInCart ? 'In Cart' : `Buy Full Book $${readingEbook.price.toFixed(2)}`}</span>
            </button>
          )}

          {/* Close Reader */}
          <button
            onClick={closeReader}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer ml-1"
            title="Close In-Browser Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/10 dark:bg-white/10 h-1">
        <div 
          className="bg-indigo-600 h-1 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Reader Body: Main Container with optional TOC sidebar */}
      <div className={`flex-1 flex overflow-hidden ${themeClasses}`}>
        {/* Table of Contents Drawer */}
        {isTocOpen && (
          <div className={`w-72 sm:w-80 border-r overflow-y-auto p-4 shrink-0 transition-colors ${themeNavClasses}`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
              <h3 className="font-bold text-sm">Table of Contents</h3>
              <button
                onClick={() => setIsTocOpen(false)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-1.5">
              {readingEbook.chapters.map((ch, idx) => {
                const isCurrent = idx === readingChapterIndex;
                const canAccess = isOwned || ch.isPreviewAvailable;
                return (
                  <button
                    key={ch.id}
                    disabled={!canAccess}
                    onClick={() => {
                      setReadingChapterIndex(idx);
                      setIsTocOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-bold'
                        : canAccess
                        ? 'hover:bg-black/5 dark:hover:bg-white/5 opacity-90'
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <p className="font-medium line-clamp-1">{ch.title}</p>
                      <p className={`text-[10px] mt-0.5 ${isCurrent ? 'text-indigo-100' : 'opacity-70'}`}>
                        Starting on Page {ch.pageStart}
                      </p>
                    </div>
                    {!canAccess && (
                      <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 shrink-0">
                        Locked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!isOwned && (
              <div className="mt-6 p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Unlock All Chapters
                </p>
                <p className="text-[11px] mt-1 opacity-80">
                  Instant unrestricted access + multi-format downloads (PDF, EPUB, MOBI).
                </p>
                <button
                  onClick={() => addToCart(readingEbook)}
                  className="mt-2 w-full py-1.5 bg-indigo-600 text-white rounded-lg font-semibold text-center block hover:bg-indigo-700 transition-colors"
                >
                  Get for ${readingEbook.price.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chapter Content Reader View */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 py-8 max-w-4xl mx-auto">
          <div className={`${isDyslexicFont ? 'font-mono tracking-wide' : 'font-serif'} ${fontClasses}`}>
            {/* Chapter Header */}
            <div className="mb-8 pb-6 border-b border-current/15">
              <span className="text-xs uppercase tracking-widest font-sans font-bold opacity-60">
                Chapter {readingChapterIndex + 1} of {totalChapters}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {currentChapter.title}
              </h1>
              <p className="text-sm font-sans italic opacity-75 mt-2">
                {currentChapter.snippet}
              </p>
            </div>

            {/* Content paragraphs */}
            {currentChapter.content && currentChapter.content.length > 0 ? (
              <div className="space-y-6">
                {currentChapter.content.map((para, i) => (
                  <p key={i} className="text-justify leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-black/5 dark:bg-white/5 rounded-2xl border border-current/10">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <h3 className="font-bold text-base">Preview Limit Reached for this Chapter</h3>
                <p className="text-xs opacity-75 max-w-md mx-auto mt-2">
                  To read the full unabridged chapters of <em>{readingEbook.title}</em>, complete your order with instant access and download all offline editions.
                </p>
                {!isOwned && (
                  <button
                    onClick={() => addToCart(readingEbook)}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" /> Unlock Book for ${readingEbook.price.toFixed(2)}
                  </button>
                )}
              </div>
            )}

            {/* Sample Excerpt Box if in preview */}
            {!isOwned && readingEbook.sampleExcerpt && (
              <div className="mt-12 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/15">
                <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  {readingEbook.sampleExcerpt.title}
                </h4>
                <div className="space-y-3 text-sm opacity-90 italic">
                  {readingEbook.sampleExcerpt.content.map((snippet, idx) => (
                    <p key={idx}>{snippet}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Chapter Navigation Bar */}
            <div className="mt-12 pt-8 border-t border-current/15 flex items-center justify-between text-xs font-sans">
              <button
                disabled={readingChapterIndex <= 0}
                onClick={() => setReadingChapterIndex(readingChapterIndex - 1)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-current/20 cursor-pointer ${
                  readingChapterIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <span className="opacity-60 text-[11px]">
                Page {currentChapter.pageStart} / {readingEbook.pages}
              </span>

              <button
                disabled={
                  readingChapterIndex >= totalChapters - 1 ||
                  (!isOwned && !readingEbook.chapters[readingChapterIndex + 1]?.isPreviewAvailable)
                }
                onClick={() => setReadingChapterIndex(readingChapterIndex + 1)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-current/20 cursor-pointer ${
                  readingChapterIndex >= totalChapters - 1 ||
                  (!isOwned && !readingEbook.chapters[readingChapterIndex + 1]?.isPreviewAvailable)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
