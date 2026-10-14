import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

const SHORTCUT_GROUPS = [
  {
    category: 'Playback & Transport',
    shortcuts: [
      { key: 'Space', desc: 'Play / Stop playback' },
      { key: 'J / K / L', desc: 'Fast Reverse, Pause, Fast Forward (Shuttle)' },
      { key: 'Left / Right Arrow', desc: 'Step 1 frame backward / forward' },
      { key: 'Shift + Left / Right', desc: 'Step 1 second backward / forward' },
      { key: 'Home / End', desc: 'Go to Start / End of Timeline' },
      { key: 'I / O', desc: 'Mark In / Mark Out points' }
    ]
  },
  {
    category: 'Timeline Editing Tools',
    shortcuts: [
      { key: 'A', desc: 'Selection Arrow mode' },
      { key: 'B', desc: 'Razor Blade Cut tool' },
      { key: 'Cmd/Ctrl + B', desc: 'Split clip at Playhead' },
      { key: 'Backspace / Delete', desc: 'Ripple Delete selected clip' },
      { key: 'N', desc: 'Toggle Snapping Magnet' },
      { key: 'M', desc: 'Mute track / Add Marker' }
    ]
  },
  {
    category: 'Studio Workflow Page Switcher',
    shortcuts: [
      { key: 'Shift + 1', desc: 'Project Library / Project Manager' },
      { key: 'Shift + 2', desc: 'Media Pool & Ingest Page' },
      { key: 'Shift + 4', desc: 'Edit & Timeline Page' },
      { key: 'Shift + 5', desc: 'Fusion Node VFX Page' },
      { key: 'Shift + 6', desc: 'Colour Wheels & 3D LUT Page' },
      { key: 'Shift + 7', desc: 'Fairlight Audio Mixing Page' },
      { key: 'Shift + 8', desc: 'Delivery & Render Queue Page' },
      { key: 'Shift + 9', desc: 'AI Studio Lab (MiniMax H3)' }
    ]
  }
];

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useEditor();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#15171e] border border-[#2d3240] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden text-gray-200 select-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#252834] flex items-center justify-between bg-[#191b24]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Studio Keyboard Shortcuts</h3>
              <p className="text-[11px] text-gray-400">High-speed studio editing hotkeys</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 rounded-lg hover:bg-[#252834] text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                {group.category}
              </span>
              <div className="bg-[#111216] rounded-lg border border-[#232630] divide-y divide-[#20232c] overflow-hidden">
                {group.shortcuts.map((sc) => (
                  <div key={sc.key} className="px-3 py-2 flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-[#1f222d] border border-[#313645] text-amber-300 font-mono text-[11px] font-bold shadow-xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#252834] bg-[#191b24] flex items-center justify-end">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
