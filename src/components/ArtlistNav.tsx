import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Sparkles, Image as ImageIcon, Video, Mic, Music, Box, Layers, Workflow, Cpu, FolderKanban, BookOpen, ArrowRight } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export const ArtlistNav: React.FC = () => {
  const { setActivePage, showToast } = useEditor();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleToolSelect = (toolName: string, modelName?: string) => {
    setActiveDropdown(null);
    setActivePage('ai');
    showToast(`Activated ${toolName}${modelName ? ` with ${modelName}` : ''}`);
  };

  return (
    <nav ref={navRef} className="bg-[#141519] border-b border-[#23262d] px-3 py-1.5 flex items-center justify-between text-xs text-gray-300 relative z-50 select-none">
      <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
        {/* Brand Link */}
        <div 
          onClick={() => { setActivePage('edit'); setActiveDropdown(null); }} 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#1f222b] cursor-pointer text-white font-bold shrink-0"
        >
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[10px] text-white font-black shadow-xs">GE</div>
          <span className="tracking-wide">Greate Editing</span>
        </div>

        <div className="h-4 w-px bg-[#2a2d38] shrink-0" />

        {/* Image Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => toggleDropdown('image')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeDropdown === 'image' ? 'bg-[#222530] text-white font-semibold' : 'hover:bg-[#1f222b] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Image</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'image' ? 'rotate-180' : ''}`} />
          </button>
          {activeDropdown === 'image' && (
            <div className="absolute top-full left-0 w-[520px] bg-[#141519]/95 backdrop-blur-2xl border border-[#2b2f3d] rounded-2xl shadow-2xl p-6 mt-2 grid grid-cols-2 gap-8 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">TOOLS</div>
                <div className="space-y-2.5">
                  <div onClick={() => handleToolSelect('Image Generator')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Image Generator</div>
                  <div onClick={() => handleToolSelect('Text to Image')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Text to Image</div>
                  <div onClick={() => handleToolSelect('Image to Image')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Image to Image</div>
                  <div onClick={() => { setActivePage('edit'); setActiveDropdown(null); showToast('Opened Image Editor'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Image Editor</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">MODELS</div>
                <div className="space-y-2.5 text-gray-400 font-medium">
                  <div onClick={() => handleToolSelect('Image Generator', 'Nano Banana 2')} className="hover:text-white text-sm cursor-pointer transition-colors">Nano Banana 2</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'Nano Banana Pro')} className="hover:text-white text-sm cursor-pointer transition-colors">Nano Banana Pro</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'Nano Banana')} className="hover:text-white text-sm cursor-pointer transition-colors">Nano Banana</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'Kling 3.0')} className="hover:text-white text-sm cursor-pointer transition-colors">Kling 3.0</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'GPT Image 2')} className="hover:text-white text-sm cursor-pointer transition-colors">GPT Image 2</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'Seedream 5.0')} className="hover:text-white text-sm cursor-pointer transition-colors">Seedream 5.0</div>
                  <div onClick={() => handleToolSelect('Image Generator', 'Artlist Original 1.0')} className="hover:text-white text-sm cursor-pointer transition-colors">Artlist Original 1.0</div>
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-[#232733] flex items-center justify-between">
                <span className="font-bold text-white text-sm tracking-wide">Generate Image</span>
                <button 
                  onClick={() => handleToolSelect('Image Generator')} 
                  className="w-9 h-9 rounded-full bg-[#d0d6e0] hover:bg-white text-gray-950 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => toggleDropdown('video')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeDropdown === 'video' ? 'bg-[#222530] text-white font-semibold' : 'hover:bg-[#1f222b] hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Video</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'video' ? 'rotate-180' : ''}`} />
          </button>
          {activeDropdown === 'video' && (
            <div className="absolute top-full left-0 w-[520px] bg-[#141519]/95 backdrop-blur-2xl border border-[#2b2f3d] rounded-2xl shadow-2xl p-6 mt-2 grid grid-cols-2 gap-8 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">TOOLS</div>
                <div className="space-y-2.5">
                  <div onClick={() => handleToolSelect('Video Generator')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Video Generator</div>
                  <div onClick={() => handleToolSelect('Image to Video')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Image to Video</div>
                  <div onClick={() => handleToolSelect('Text to Video')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Text to Video</div>
                  <div onClick={() => handleToolSelect('Video to Video')} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Video to Video</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">MODELS</div>
                <div className="space-y-2.5 text-gray-400 font-medium">
                  <div onClick={() => handleToolSelect('Video Generator', 'Gemini Omni Flash')} className="hover:text-white text-sm cursor-pointer transition-colors">Gemini Omni Flash</div>
                  <div onClick={() => handleToolSelect('Video Generator', 'Seedance 2.0')} className="hover:text-white text-sm cursor-pointer transition-colors">Seedance 2.0</div>
                  <div onClick={() => handleToolSelect('Video Generator', 'Happy Horse 1.1')} className="hover:text-white text-sm cursor-pointer transition-colors">Happy Horse 1.1</div>
                  <div onClick={() => handleToolSelect('Video Generator', 'Veo 3.1')} className="hover:text-white text-sm cursor-pointer transition-colors">Veo 3.1</div>
                  <div onClick={() => handleToolSelect('Video Generator', 'Kling 3.0')} className="hover:text-white text-sm cursor-pointer transition-colors">Kling 3.0</div>
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-[#232733] flex items-center justify-between">
                <span className="font-bold text-white text-sm tracking-wide">Generate Video</span>
                <button 
                  onClick={() => handleToolSelect('Video Generator')} 
                  className="w-9 h-9 rounded-full bg-[#d0d6e0] hover:bg-white text-gray-950 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Voiceover Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => toggleDropdown('voiceover')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeDropdown === 'voiceover' ? 'bg-[#222530] text-white font-semibold' : 'hover:bg-[#1f222b] hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voiceover</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'voiceover' ? 'rotate-180' : ''}`} />
          </button>
          {activeDropdown === 'voiceover' && (
            <div className="absolute top-full left-0 w-[520px] bg-[#141519]/95 backdrop-blur-2xl border border-[#2b2f3d] rounded-2xl shadow-2xl p-6 mt-2 grid grid-cols-2 gap-8 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">TOOLS</div>
                <div className="space-y-2.5">
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Voice Generator'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Voice Generator</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Text to Speech'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Text to Speech</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Speech to Speech'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Speech to Speech</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Voice Cloning'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Voice Cloning</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Voice Effects'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Voice Effects</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">MODELS</div>
                <div className="space-y-2.5 text-gray-400 font-medium">
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Selected ElevenLabs'); }} className="hover:text-white text-sm cursor-pointer transition-colors">ElevenLabs</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Selected Cartesia'); }} className="hover:text-white text-sm cursor-pointer transition-colors">Cartesia</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Selected MiniMax'); }} className="hover:text-white text-sm cursor-pointer transition-colors">MiniMax</div>
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-[#232733] flex items-center justify-between">
                <span className="font-bold text-white text-sm tracking-wide">Generate Voiceover</span>
                <button 
                  onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); }} 
                  className="w-9 h-9 rounded-full bg-[#d0d6e0] hover:bg-white text-gray-950 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Music Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => toggleDropdown('music')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeDropdown === 'music' ? 'bg-[#222530] text-white font-semibold' : 'hover:bg-[#1f222b] hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>Music</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'music' ? 'rotate-180' : ''}`} />
          </button>
          {activeDropdown === 'music' && (
            <div className="absolute top-full left-0 w-[540px] bg-[#141519]/95 backdrop-blur-2xl border border-[#2b2f3d] rounded-2xl shadow-2xl p-6 mt-2 grid grid-cols-2 gap-8 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">TOOLS</div>
                <div className="space-y-2.5">
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Music Generator'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Music Generator</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Text to Music'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Text to Music</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Opened Image to Music'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer transition-colors">Image to Music</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">MODELS</div>
                <div className="space-y-2.5 text-gray-400 font-medium">
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Selected Lyria 3 Pro'); }} className="hover:text-white text-sm cursor-pointer transition-colors">Lyria 3 Pro</div>
                  <div onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); showToast('Selected Lyria 3'); }} className="hover:text-white text-sm cursor-pointer transition-colors">Lyria 3</div>
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-[#232733] flex items-center justify-between">
                <span className="font-bold text-white text-sm tracking-wide">Generate Music</span>
                <button 
                  onClick={() => { setActivePage('fairlight'); setActiveDropdown(null); }} 
                  className="w-9 h-9 rounded-full bg-[#d0d6e0] hover:bg-white text-gray-950 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3D */}
        <button onClick={() => { setActivePage('fusion'); showToast('Opened 3D Fusion Workspace'); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors shrink-0">
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D</span>
        </button>

        {/* Presets */}
        <button onClick={() => { setActivePage('colour'); showToast('Opened Presets & Color Grading'); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors shrink-0">
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>Presets</span>
        </button>

        {/* Flows */}
        <button onClick={() => { setActivePage('fusion'); showToast('Opened Fusion Flows'); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors shrink-0">
          <Workflow className="w-3.5 h-3.5 text-purple-400" />
          <span>Flows</span>
        </button>

        {/* MCP */}
        <button onClick={() => { setActivePage('ai'); showToast('Opened Model Control Protocol (MCP)'); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors shrink-0">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>MCP</span>
        </button>

        {/* Studio Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => toggleDropdown('studio')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeDropdown === 'studio' ? 'bg-[#222530] text-white font-semibold' : 'hover:bg-[#1f222b] hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
            <span>Studio</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'studio' ? 'rotate-180' : ''}`} />
          </button>
          {activeDropdown === 'studio' && (
            <div className="absolute top-full left-0 w-[260px] bg-[#141519]/95 backdrop-blur-2xl border border-[#2b2f3d] rounded-2xl shadow-2xl p-4 mt-2 space-y-2 text-xs z-50">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">STUDIO ASSETS</div>
              <div onClick={() => { setActivePage('project-manager'); setActiveDropdown(null); showToast('Opened Character Creator'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer p-1 rounded hover:bg-[#222530]">Create Character</div>
              <div onClick={() => { setActivePage('project-manager'); setActiveDropdown(null); showToast('Opened Location Creator'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer p-1 rounded hover:bg-[#222530]">Create Location</div>
              <div onClick={() => { setActivePage('project-manager'); setActiveDropdown(null); showToast('Opened Prop Creator'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer p-1 rounded hover:bg-[#222530]">Create Props</div>
              <div onClick={() => { setActivePage('project-manager'); setActiveDropdown(null); showToast('Opened Studio Explorer'); }} className="text-gray-200 hover:text-white font-medium text-sm cursor-pointer p-1 rounded hover:bg-[#222530]">Explore Studio</div>
            </div>
          )}
        </div>

        {/* Stock Catalog & Resources */}
        <button onClick={() => { setActivePage('media'); showToast('Opened Stock Catalog'); }} className="px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors shrink-0">
          Stock Catalog
        </button>
        <button onClick={() => { setActivePage('ai'); showToast('Opened Resources'); }} className="px-3 py-1 rounded-lg hover:bg-[#1f222b] hover:text-white transition-colors flex items-center gap-1.5 shrink-0">
          <BookOpen className="w-3 h-3" /> Resources
        </button>
      </div>

      <div className="hidden xl:flex items-center gap-2 shrink-0">
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> 1B Token Quota Active
        </span>
      </div>
    </nav>
  );
};
