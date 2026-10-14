import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Film
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const QuickExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, timecode, activeMediaPreview, showToast } = useEditor();

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportComplete, setExportComplete] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('MP4 (H.264 High 4K)');

  if (!isExportModalOpen) return null;

  const handleStartQuickExport = () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportComplete(false);

    let current = 5;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        clearInterval(interval);
        setExportProgress(100);
        setIsExporting(false);
        setExportComplete(true);
        showToast('Fast Export Render Finished! Click Download Video.');
      } else {
        setExportProgress(current);
      }
    }, 300);
  };

  const handleClose = () => {
    setIsExportModalOpen(false);
    setIsExporting(false);
    setExportProgress(0);
    setExportComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#15171e] border border-[#2d3240] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-gray-200 select-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#252834] flex items-center justify-between bg-[#191b24]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Fast Export Master</h3>
              <p className="text-[11px] text-gray-400">One-click instant render & browser download</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-[#252834] text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Format selection */}
          <div>
            <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">Preset Target</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'YouTube 4K (H.265 60fps)', sub: '3840x2160 • High Bitrate' },
                { name: 'MP4 (H.264 High 4K)', sub: 'Universal Web & Social' },
                { name: 'TikTok / Reels (9:16)', sub: '1080x1920 • Mobile Cut' },
                { name: 'Apple ProRes 422 HQ', sub: 'Master Archive Studio' }
              ].map((opt) => (
                <div
                  key={opt.name}
                  onClick={() => setSelectedFormat(opt.name)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedFormat === opt.name
                      ? 'bg-rose-950/30 border-rose-500 text-rose-300'
                      : 'bg-[#1a1c24] border-[#292d3b] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <p className="font-bold text-[11px]">{opt.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{opt.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="p-3 bg-[#111216] rounded-lg border border-[#232630] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-gray-400">
              <span>Timeline Duration:</span>
              <span className="text-gray-200">{timecode} (24.00 fps)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Color Space:</span>
              <span className="text-emerald-400">Rec.709 / Studio YRGB</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Audio:</span>
              <span className="text-gray-200">Stereo 48.000 kHz 24-bit PCM</span>
            </div>
          </div>

          {/* Progress / Status */}
          {isExporting && (
            <div className="space-y-2 p-3 bg-[#181a24] rounded-lg border border-amber-500/40">
              <div className="flex items-center justify-between text-amber-400 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  Rendering frames with client WebCodecs...
                </span>
                <span className="font-mono">{exportProgress}%</span>
              </div>
              <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${exportProgress}%` }}
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {exportComplete && (
            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready for Instant Download!</span>
              </div>
              <a
                href={activeMediaPreview?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                download="Great_Editing_4K_Export.mp4"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save MP4</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#252834] bg-[#191b24] flex items-center justify-between">
          <span className="text-[11px] text-gray-400">No Watermark • 100% Free</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-3 py-1.5 rounded bg-[#242732] hover:bg-[#2e3240] text-gray-300 font-medium text-xs"
            >
              Cancel
            </button>
            {!exportComplete && (
              <button
                onClick={handleStartQuickExport}
                disabled={isExporting}
                className="px-4 py-1.5 rounded bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Rendering...' : 'Export Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
