import React from 'react';
import {
  Film,
  Scissors,
  Network,
  Palette,
  Sliders,
  Rocket,
  Sparkles
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { StudioPage } from '../types/editor';

interface PageItem {
  id: StudioPage;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  activeColor: string;
  badge?: string;
}

const PAGES: PageItem[] = [
  {
    id: 'media',
    label: 'Media',
    sublabel: 'Ingest & Pool',
    icon: Film,
    activeColor: 'text-blue-400 border-blue-500 bg-blue-500/10'
  },
  {
    id: 'edit',
    label: 'Edit',
    sublabel: 'Timeline & Cut',
    icon: Scissors,
    activeColor: 'text-amber-400 border-amber-500 bg-amber-500/10'
  },
  {
    id: 'fusion',
    label: 'Fusion',
    sublabel: 'Node VFX & Titles',
    icon: Network,
    activeColor: 'text-purple-400 border-purple-500 bg-purple-500/10'
  },
  {
    id: 'colour',
    label: 'Colour',
    sublabel: 'Wheels & 3D LUTs',
    icon: Palette,
    activeColor: 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
  },
  {
    id: 'fairlight',
    label: 'Fairlight',
    sublabel: 'Audio Console & EQ',
    icon: Sliders,
    activeColor: 'text-cyan-400 border-cyan-500 bg-cyan-500/10'
  },
  {
    id: 'delivery',
    label: 'Delivery',
    sublabel: 'Render 4K & Queue',
    icon: Rocket,
    activeColor: 'text-rose-400 border-rose-500 bg-rose-500/10'
  },
  {
    id: 'ai',
    label: 'AI & Science Lab',
    sublabel: 'Veo 3, H3 & AlphaFold',
    icon: Sparkles,
    activeColor: 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-500/15',
    badge: 'Veo 3 • Science'
  }
];

export const BottomPageSwitcher: React.FC = () => {
  const { activePage, setActivePage, returnToProjectManager, setIsProjectSettingsOpen } = useEditor();

  return (
    <nav className="h-14 bg-[#0d0e11] border-t border-[#22252c] flex items-center justify-between px-3 select-none z-30 shadow-2xl">
      {/* Left empty spacer to balance center */}
      <div className="w-24 hidden md:block" />

      {/* Center 7 Studio Pages */}
      <div className="flex items-center gap-1 sm:gap-2 justify-center flex-1 max-w-4xl mx-auto">
        {PAGES.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;

          return (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`relative group flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-md transition-all duration-150 border ${
                isActive
                  ? `${page.activeColor} shadow-inner`
                  : 'text-gray-400 hover:text-gray-200 border-transparent hover:bg-[#181a20]'
              }`}
            >
              {page.badge && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-extrabold text-[9px] rounded-full shadow-sm tracking-tight scale-90">
                  {page.badge}
                </span>
              )}

              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-semibold tracking-wide">{page.label}</span>
              </div>
              <span className="hidden md:block text-[9px] text-gray-500 font-mono tracking-tighter">
                {page.sublabel}
              </span>

              {/* Active underline indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-current rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Studio Project Manager & Settings Icons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Project Manager House Icon */}
        <button
          onClick={returnToProjectManager}
          title="Project Manager (Shift+1)"
          className="p-2 rounded hover:bg-[#1f222b] text-gray-400 hover:text-indigo-400 border border-transparent hover:border-[#2e3342] transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>

        {/* Project Settings Gear Icon */}
        <button
          onClick={() => setIsProjectSettingsOpen(true)}
          title="Project Settings (Shift+9)"
          className="p-2 rounded hover:bg-[#1f222b] text-gray-400 hover:text-gray-200 border border-transparent hover:border-[#2e3342] transition-colors"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
