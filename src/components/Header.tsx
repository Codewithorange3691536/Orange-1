import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Magnet,
  Scissors,
  Share2,
  HelpCircle,
  FolderOpen,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export const Header: React.FC = () => {
  const {
    timecode,
    isPlaying,
    togglePlayPause,
    seekTo,
    currentTime,
    snapEnabled,
    setSnapEnabled,
    splitClipAtPlayhead,
    setIsExportModalOpen,
    setIsShortcutsModalOpen,
    loadSampleProject,
    activePage,
    setActivePage,
    currentProject,
    returnToProjectManager
  } = useEditor();

  const handleStepBack = () => {
    seekTo(Math.max(0, currentTime - 1 / 24));
  };

  const handleStepForward = () => {
    seekTo(currentTime + 1 / 24);
  };

  return (
    <header className="h-13 bg-[#111215] border-b border-[#23262d] flex items-center justify-between px-3 text-xs select-none z-30">
      {/* Left: Branding & Project Status */}
      <div className="flex items-center gap-2.5">
        {/* Project Manager Button */}
        <button
          onClick={returnToProjectManager}
          title="Open Project Library / Project Manager (Shift+1)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1b1e26] hover:bg-[#252a36] text-gray-200 border border-[#2e3444] rounded font-medium shadow-xs transition-colors group"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-xs text-white">Project Library</span>
        </button>

        <div className="h-5 w-px bg-[#262933]" />

        {/* Branding & Project Title */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-xs">
            <span className="font-black text-white text-[10px] tracking-tighter">GE</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-100 tracking-wide text-xs">GREAT EDITING</span>
              <span className="bg-[#242730] text-[#a0a5b5] text-[9px] px-1.5 py-0.2 rounded font-mono border border-[#333842]">
                Studio Edition
              </span>
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Free • No Login
              </span>
              <span>•</span>
              <span className="text-gray-200 font-semibold truncate max-w-[160px]" title={currentProject?.name}>
                {currentProject?.name || 'Untitled Project'}
              </span>
            </div>
          </div>
        </div>

        {/* Studio Badge */}
        <div className="hidden lg:flex items-center gap-1 bg-[#1a1c22] px-2 py-1 rounded text-[11px] text-gray-300 border border-[#2b2f3a]">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Client WebGPU & Canvas Engine</span>
        </div>
      </div>

      {/* Center: Timecode HUD & Playback Transport */}
      <div className="flex items-center gap-3">
        {/* Step back */}
        <button
          onClick={handleStepBack}
          title="Step 1 Frame Back (Left Arrow)"
          className="p-1.5 rounded hover:bg-[#252830] text-gray-400 hover:text-gray-100 transition-colors"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={togglePlayPause}
          title="Play / Stop (Space)"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold'
              : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Step forward */}
        <button
          onClick={handleStepForward}
          title="Step 1 Frame Forward (Right Arrow)"
          className="p-1.5 rounded hover:bg-[#252830] text-gray-400 hover:text-gray-100 transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Timecode Digital HUD */}
        <div className="bg-[#0b0c0e] border border-[#2a2d36] rounded px-3 py-1 flex items-center gap-2 font-mono shadow-inner">
          <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">TC</span>
          <span className="text-sm font-bold tracking-widest text-emerald-400 font-mono select-all">
            {timecode}
          </span>
          <span className="text-[10px] text-gray-400 px-1 bg-[#1c1f26] rounded">24.00 fps</span>
        </div>
      </div>

      {/* Right: Quick Tools, Shortcuts & Export */}
      <div className="flex items-center gap-2">
        {/* Blade Quick Cut */}
        <button
          onClick={splitClipAtPlayhead}
          title="Blade / Cut Clip at Playhead (B)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1e2129] hover:bg-[#282c37] text-gray-300 border border-[#2f3442] transition-colors"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Blade (B)</span>
        </button>

        {/* Snapping Toggle */}
        <button
          onClick={() => setSnapEnabled((prev) => !prev)}
          title="Toggle Snapping Magnet (N)"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded border transition-colors ${
            snapEnabled
              ? 'bg-blue-950/60 border-blue-600/80 text-blue-300'
              : 'bg-[#1a1c22] border-[#2c303c] text-gray-400 hover:text-gray-200'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Snap</span>
        </button>

        {/* Shortcuts Reference */}
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          title="Keyboard Shortcuts Cheat Sheet (?)"
          className="p-1.5 rounded bg-[#1e2129] hover:bg-[#282c37] text-gray-400 hover:text-gray-200 border border-[#2f3442] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Sample Projects */}
        <button
          onClick={loadSampleProject}
          title="Reset to 4K Master Template"
          className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded bg-[#1e2129] hover:bg-[#282c37] text-gray-300 border border-[#2f3442] transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Demo Cut</span>
        </button>

        {/* AI Tools Quick Access */}
        <button
          onClick={() => setActivePage('ai')}
          title="Open AI & Science Lab (Text-to-Video, MiniMax H3, Veo 3, AlphaFold)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-md transition-all active:scale-95 border ${
            activePage === 'ai'
              ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-200 shadow-fuchsia-900/40'
              : 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 border-fuchsia-400/40 text-white shadow-indigo-950/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-200" />
          <span>AI Tools</span>
          <span className="hidden lg:inline text-[9px] bg-black/35 text-fuchsia-100 px-1 py-0.2 rounded font-mono">Veo 3 • H3</span>
        </button>

        {/* Quick Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold shadow-md transition-all active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Fast Export</span>
        </button>
      </div>
    </header>
  );
};
