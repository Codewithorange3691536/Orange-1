import React, { useState } from 'react';
import {
  Rocket,
  Play,
  CheckCircle2,
  Download,
  Trash2,
  Youtube,
  Smartphone,
  Film,
  HardDrive,
  Settings,
  Sparkles,
  Clock,
  FileVideo
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { RenderJob } from '../../types/editor';

const EXPORT_PRESETS = [
  {
    id: 'youtube_4k',
    name: 'YouTube 4K Ultra HD',
    icon: Youtube,
    resolution: '3840 x 2160 (4K)',
    format: 'mp4' as const,
    fps: 60,
    bitrate: 'High (45 Mbps)',
    description: 'Optimized for high-bitrate YouTube & Vimeo 4K streaming'
  },
  {
    id: 'youtube_1080p',
    name: 'YouTube / Web 1080p',
    icon: Youtube,
    resolution: '1920 x 1080 (FHD)',
    format: 'mp4' as const,
    fps: 30,
    bitrate: 'Standard (16 Mbps)',
    description: 'Fast encoding, universally compatible standard HD'
  },
  {
    id: 'tiktok_vertical',
    name: 'TikTok / Shorts / Reels 9:16',
    icon: Smartphone,
    resolution: '1080 x 1920 (Vertical)',
    format: 'mp4' as const,
    fps: 60,
    bitrate: 'High (24 Mbps)',
    description: 'Portrait 9:16 aspect ratio for mobile short-form video'
  },
  {
    id: 'cinema_4k',
    name: 'Cinema Master DCI 4K ProRes',
    icon: Film,
    resolution: '4096 x 2160 (DCI 4K)',
    format: 'mov' as const,
    fps: 24,
    bitrate: 'Apple ProRes 422 HQ (220 Mbps)',
    description: 'Master archive quality for theatrical release & festivals'
  }
];

export const DeliveryPage: React.FC = () => {
  const {
    renderQueue,
    addRenderJob,
    startRenderJob,
    timecode,
    activeMediaPreview,
    showToast
  } = useEditor();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('youtube_4k');
  const [customFilename, setCustomFilename] = useState<string>('Cyberpunk_Master_Cut_4K');
  const [format, setFormat] = useState<'mp4' | 'webm' | 'mov'>('mp4');
  const [resolution, setResolution] = useState<string>('3840 x 2160 (4K)');
  const [fps, setFps] = useState<number>(24);
  const [qualityBitrate, setQualityBitrate] = useState<string>('High (45 Mbps)');

  const selectedPreset = EXPORT_PRESETS.find((p) => p.id === selectedPresetId) || EXPORT_PRESETS[0];

  const handleSelectPreset = (preset: typeof EXPORT_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setFormat(preset.format);
    setResolution(preset.resolution);
    setFps(preset.fps);
    setQualityBitrate(preset.bitrate);
    showToast(`Loaded ${preset.name} render profile`);
  };

  const handleAddToRenderQueue = () => {
    const job: Omit<RenderJob, 'id' | 'progress' | 'status'> = {
      name: `${customFilename}.${format}`,
      format,
      resolution,
      fps,
      bitrate: qualityBitrate,
      preset: selectedPreset.name,
      sizeEstimate: format === 'mov' ? '1.8 GB' : '420 MB'
    };
    addRenderJob(job);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#101115] text-gray-200 select-none">
      {/* Left Column: Render Settings & Presets */}
      <div className="w-[420px] bg-[#14161c] border-r border-[#232630] flex flex-col">
        <div className="h-10 border-b border-[#232630] px-4 flex items-center justify-between bg-[#181a22]">
          <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Rocket className="w-4 h-4 text-rose-500" />
            Render Settings
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Hardware GPU Accelerated</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {/* Preset Buttons */}
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-2">Delivery Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {EXPORT_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                        : 'bg-[#1b1e26] border-[#292d3a] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-bold text-[11px] truncate">{preset.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{preset.resolution}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filename & Destination */}
          <div className="p-3 bg-[#181a22] rounded-lg border border-[#272b38] space-y-2">
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Filename</label>
              <div className="flex">
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  className="flex-1 bg-[#121317] border border-[#2e3342] rounded-l px-2.5 py-1.5 text-gray-200 font-mono text-xs focus:outline-none"
                />
                <span className="bg-[#242834] px-2.5 py-1.5 border border-l-0 border-[#2e3342] rounded-r text-gray-400 font-mono text-xs">
                  .{format}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Export Location</label>
              <div className="p-2 bg-[#121317] border border-[#2e3342] rounded text-[11px] font-mono text-gray-400 flex items-center justify-between">
                <span>/Browser Downloads (Instant)</span>
                <span className="text-emerald-400 font-sans text-[10px]">No Server Upload</span>
              </div>
            </div>
          </div>

          {/* Video Parameters */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Video Stream Specs</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Container Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-[#1c1f28] border border-[#2e3342] rounded px-2.5 py-1.5 text-gray-200 text-xs"
                >
                  <option value="mp4">MP4 (MPEG-4 Part 14)</option>
                  <option value="mov">QuickTime MOV (ProRes)</option>
                  <option value="webm">WebM (VP9 / AV1)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-[#1c1f28] border border-[#2e3342] rounded px-2.5 py-1.5 text-gray-200 text-xs font-mono"
                >
                  <option value="3840 x 2160 (4K)">3840 x 2160 (4K UHD)</option>
                  <option value="4096 x 2160 (DCI 4K)">4096 x 2160 (DCI 4K)</option>
                  <option value="1920 x 1080 (FHD)">1920 x 1080 (FHD)</option>
                  <option value="1080 x 1920 (Vertical)">1080 x 1920 (9:16)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Framerate</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full bg-[#1c1f28] border border-[#2e3342] rounded px-2.5 py-1.5 text-gray-200 text-xs font-mono"
                >
                  <option value={24}>24.000 fps (Cinema)</option>
                  <option value={30}>30.000 fps (Standard)</option>
                  <option value={60}>60.000 fps (Smooth)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Quality Bitrate</label>
                <select
                  value={qualityBitrate}
                  onChange={(e) => setQualityBitrate(e.target.value)}
                  className="w-full bg-[#1c1f28] border border-[#2e3342] rounded px-2.5 py-1.5 text-gray-200 text-xs"
                >
                  <option value="High (45 Mbps)">Ultra High (45 Mbps)</option>
                  <option value="Standard (16 Mbps)">Standard (16 Mbps)</option>
                  <option value="Apple ProRes 422 HQ (220 Mbps)">ProRes HQ (220 Mbps)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add to Render Queue Button */}
          <div className="pt-2">
            <button
              onClick={handleAddToRenderQueue}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>Add to Render Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Render Queue Manager */}
      <div className="flex-1 flex flex-col bg-[#0f1014] overflow-hidden">
        <div className="h-10 border-b border-[#232630] px-4 flex items-center justify-between bg-[#15171d]">
          <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Clock className="w-4 h-4 text-emerald-400" />
            Render Queue ({renderQueue.length} Jobs)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const queued = renderQueue.find((j) => j.status === 'queued');
                if (queued) startRenderJob(queued.id);
                else showToast('All jobs in queue are already completed');
              }}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Render All</span>
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {renderQueue.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
              <Rocket className="w-10 h-10 text-gray-600 mb-2" />
              <p className="font-semibold text-gray-400">Render Queue is Empty</p>
              <p className="text-[11px] text-gray-500 mt-1">Configure export settings on the left and click "Add to Render Queue".</p>
            </div>
          ) : (
            renderQueue.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-[#161820] rounded-lg border border-[#272b38] flex flex-col justify-between space-y-3 shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#222530] text-rose-400 border border-[#2d3140]">
                      <FileVideo className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-200">{job.name}</h4>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {job.preset} • {job.resolution} • {job.fps} fps • {job.bitrate}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {job.status === 'completed' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                    {job.status === 'rendering' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 text-xs font-semibold border border-amber-800/40 animate-pulse">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Rendering {job.progress}%
                      </span>
                    )}
                    {job.status === 'queued' && (
                      <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-semibold">
                        Queued
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0d0e12] h-2 rounded-full overflow-hidden border border-[#222530]">
                  <div
                    style={{ width: `${job.progress}%` }}
                    className={`h-full transition-all duration-300 ${
                      job.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500'
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#20232c]">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Estimated Size: {job.sizeEstimate || '412 MB'}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.status === 'completed' && (
                      <a
                        href={job.downloadUrl || '#'}
                        download={job.name}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 4K Video</span>
                      </a>
                    )}
                    {job.status === 'queued' && (
                      <button
                        onClick={() => startRenderJob(job.id)}
                        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Render</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
