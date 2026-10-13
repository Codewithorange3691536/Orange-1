import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  BookOpen, 
  Sparkles,
  MailCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top trust pill */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>MNSID Digital Solutions • Verified 2026 Editions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            High-Impact Digital E-Books for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Ambitious Learners & Scaled Founders
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Inspect content with interactive <strong className="text-white">free sample previews</strong> before buying. 
            Instant multi-format downloads (PDF, EPUB, MOBI for Kindle) with automated receipt delivery. <em>(Digital goods notice: Strict No-Refund Policy once delivered)</em>.
          </p>

          {/* Featured UI/UX Design Collection Spotlight */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('UI/UX Design')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-400/40 text-purple-200 text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore New Collection: <strong>UI/UX Design &amp; Figma Systems (4 New Best-Sellers)</strong></span>
              <span className="text-purple-300 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          {/* Quick Problem-Solver Badges Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center justify-center gap-2 bg-slate-900/40 py-2 px-3 rounded-xl border border-slate-800">
              <Download className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Instant Offline Downloads</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/40 py-2 px-3 rounded-xl border border-slate-800">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Interactive Sample Previews</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/40 py-2 px-3 rounded-xl border border-slate-800" title="Digital downloads are final once delivered. Read free samples before purchase.">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Strict No-Refund Policy</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900/40 py-2 px-3 rounded-xl border border-slate-800">
              <MailCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated Email Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
