import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Activity, Volume2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface AudioWaveformAnalyzerProps {
  trackName?: string;
  duration?: number;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  height?: number;
}

export const AudioWaveformAnalyzer: React.FC<AudioWaveformAnalyzerProps> = ({
  trackName = 'Audio Master / A1 Track',
  duration = 24,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  height = 140
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic audio peak data for visual analyzer
  const numBars = 75;
  const peaks = React.useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < numBars; i++) {
      // Simulate natural speech / music waveform peaks with sine/random combo
      const val = Math.sin(i * 0.3) * 0.4 + Math.cos(i * 0.8) * 0.3 + Math.sin(i * 1.5) * 0.2 + 0.55;
      const normalized = Math.max(0.1, Math.min(1.0, Math.abs(val)));
      list.push(normalized);
    }
    return list;
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onSeek) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const playheadPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div className="bg-[#12141c] border border-[#232733] rounded-lg p-3 flex flex-col space-y-2 select-none shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#222530]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold text-gray-200 uppercase tracking-wider">Audio Waveform & Transient Analyzer</span>
          <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.2 rounded font-mono border border-emerald-800/40">
            {trackName}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-1 hover:bg-[#202330] rounded text-gray-400 hover:text-white"
              title="Zoom Out Waveform"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-xs">{zoom.toFixed(1)}x</span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-1 hover:bg-[#202330] rounded text-gray-400 hover:text-white"
              title="Zoom In Waveform (Detailed transient view)"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
          <span className="text-emerald-400 font-bold">{currentTime.toFixed(2)}s / {duration}s</span>
        </div>
      </div>

      {/* Main Waveform Display Area */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative bg-[#08090c] rounded border border-[#1e222d] overflow-hidden cursor-pointer flex items-center px-2 py-1"
        style={{ height: `${height}px` }}
      >
        {/* Center 0dB Reference Line */}
        <div className="absolute inset-x-0 top-1/2 border-t border-emerald-500/20 pointer-events-none" />

        {/* Waveform Bars Container */}
        <div className="w-full h-full flex items-center justify-between gap-0.5 relative z-10">
          {peaks.map((peak, idx) => {
            const barHeight = peak * 100 * (isPlaying ? (0.85 + Math.sin(currentTime * 10 + idx) * 0.15) : 0.9);
            const isPassed = (idx / peaks.length) * duration <= currentTime;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-center group relative"
                style={{ height: '100%' }}
              >
                {/* Top Peak Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-75 ${
                    isPassed
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-t from-gray-700 to-gray-500 hover:from-emerald-700 hover:to-emerald-400'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
                {/* Bottom Mirrored Peak Bar (Stereo Waveform view) */}
                <div
                  className={`w-full rounded-b transition-all duration-75 mt-0.5 ${
                    isPassed
                      ? 'bg-gradient-to-b from-emerald-600 to-emerald-400/80'
                      : 'bg-gradient-to-b from-gray-700 to-gray-500/70 hover:from-emerald-700 hover:to-emerald-400'
                  }`}
                  style={{ height: `${barHeight * 0.85}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Interactive Playhead Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-amber-400 z-20 pointer-events-none shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          style={{ left: `${playheadPercent}%` }}
        >
          <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-amber-400 rotate-45 rounded-xs" />
        </div>

        {/* Transient Sync Marker Grids */}
        <div className="absolute inset-0 pointer-events-none flex justify-between px-4 opacity-15">
          <div className="border-r border-white h-full" />
          <div className="border-r border-white h-full" />
          <div className="border-r border-white h-full" />
          <div className="border-r border-white h-full" />
        </div>
      </div>

      {/* Analyzer Footer Status & Sync Guide */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Synced Audio Transients</span>
          </span>
          <span className="text-gray-500">• Click anywhere on waveform to instant seek</span>
        </div>
        <span className="font-mono text-cyan-400">Sample Rate: 48.0 kHz • Bit Depth: 24-bit Float</span>
      </div>
    </div>
  );
};
