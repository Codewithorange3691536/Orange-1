import React, { useState, useRef } from 'react';
import {
  Folder,
  Film,
  Music,
  Plus,
  Play,
  Pause,
  UploadCloud,
  Search,
  SlidersHorizontal,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { MediaItem } from '../../types/editor';
import { createMediaItemFromFile } from '../../utils/mediaUtils';

export const MediaPage: React.FC = () => {
  const {
    mediaLibrary,
    addMediaItem,
    activeMediaPreview,
    setActiveMediaPreview,
    addClipToTimeline,
    setActivePage,
    showToast
  } = useEditor();

  const [activeBin, setActiveBin] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewTime, setPreviewTime] = useState<number>(0);
  const [previewMuted, setPreviewMuted] = useState<boolean>(false);
  const [previewVolume, setPreviewVolume] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeBin === 'all') return matchesSearch;
    if (activeBin === 'video') return matchesSearch && item.type === 'video';
    if (activeBin === 'audio') return matchesSearch && item.type === 'audio';
    if (activeBin === 'cinematic') return matchesSearch && item.category === 'Cinematic';
    if (activeBin === 'cyberpunk') return matchesSearch && item.category === 'Cyberpunk';
    return matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast(`Processing ${files.length} uploaded file(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const newItem = await createMediaItemFromFile(file);
        addMediaItem(newItem);
        if (i === 0) {
          setActiveMediaPreview(newItem);
          setPreviewTime(0);
        }
      } catch (err) {
        console.error('File ingest error:', err);
      }
    }
    e.target.value = '';
  };

  const handleTogglePreviewPlay = () => {
    if (activeMediaPreview?.type === 'video' && previewVideoRef.current) {
      if (isPlayingPreview) {
        previewVideoRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        previewVideoRef.current.muted = previewMuted;
        previewVideoRef.current.volume = previewVolume;
        previewVideoRef.current.play().then(() => {
          setIsPlayingPreview(true);
        }).catch((err) => {
          console.warn('Video play prevented:', err);
          // Retry muted if browser policy blocked audio autoplay
          if (previewVideoRef.current) {
            previewVideoRef.current.muted = true;
            setPreviewMuted(true);
            previewVideoRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => {});
          }
        });
      }
    } else if (activeMediaPreview?.type === 'audio' && previewAudioRef.current) {
      if (isPlayingPreview) {
        previewAudioRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        previewAudioRef.current.muted = previewMuted;
        previewAudioRef.current.volume = previewVolume;
        previewAudioRef.current.play().then(() => {
          setIsPlayingPreview(true);
        }).catch((err) => {
          console.warn('Audio play prevented:', err);
        });
      }
    } else {
      setIsPlayingPreview(!isPlayingPreview);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#131418] text-gray-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="video/*,audio/*,image/*"
        className="hidden"
      />

      {/* Left Sidebar: Smart Bins & Folders */}
      <div className="w-56 bg-[#16181f] border-r border-[#242730] flex flex-col">
        <div className="p-3 border-b border-[#242730] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            Media Storage
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-[#282c38] rounded text-gray-400 hover:text-white"
            title="Import Media Files"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 p-2 space-y-1 overflow-y-auto text-xs">
          <div className="px-2 py-1 text-[10px] text-gray-500 uppercase font-semibold">Master Bins</div>
          <button
            onClick={() => setActiveBin('all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
              activeBin === 'all' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-[#1f222b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> All Media
            </span>
            <span className="text-[10px] bg-[#22252f] px-1.5 py-0.5 rounded text-gray-400 font-mono">
              {mediaLibrary.length}
            </span>
          </button>

          <button
            onClick={() => setActiveBin('video')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
              activeBin === 'video' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-[#1f222b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-indigo-400" /> Video Clips
            </span>
            <span className="text-[10px] bg-[#22252f] px-1.5 py-0.5 rounded text-gray-400 font-mono">
              {mediaLibrary.filter((m) => m.type === 'video').length}
            </span>
          </button>

          <button
            onClick={() => setActiveBin('audio')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
              activeBin === 'audio' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-[#1f222b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-emerald-400" /> Audio & SFX
            </span>
            <span className="text-[10px] bg-[#22252f] px-1.5 py-0.5 rounded text-gray-400 font-mono">
              {mediaLibrary.filter((m) => m.type === 'audio').length}
            </span>
          </button>

          <div className="pt-3 px-2 py-1 text-[10px] text-gray-500 uppercase font-semibold">Smart Collections</div>
          <button
            onClick={() => setActiveBin('cyberpunk')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
              activeBin === 'cyberpunk' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-300 hover:bg-[#1f222b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> Cyberpunk 4K
            </span>
          </button>

          <button
            onClick={() => setActiveBin('cinematic')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
              activeBin === 'cinematic' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-[#1f222b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-amber-400" /> Cinematic DCI
            </span>
          </button>
        </div>

        {/* Quick Ingest Buttons */}
        <div className="p-3 border-t border-[#242730] space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded bg-[#20232d] hover:bg-[#2b303d] text-gray-200 border border-[#333846] flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Import Media</span>
          </button>
          <button
            onClick={() => setActivePage('ai')}
            className="w-full py-2 px-3 rounded bg-gradient-to-r from-fuchsia-600/25 via-purple-600/25 to-indigo-600/25 hover:from-fuchsia-600/40 hover:to-indigo-600/40 text-fuchsia-200 border border-fuchsia-500/40 flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Generate AI Video (Veo 3)</span>
          </button>
        </div>
      </div>

      {/* Center: Media Pool Gallery */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#101115]">
        {/* Pool Filter Bar */}
        <div className="h-11 border-b border-[#242730] px-4 flex items-center justify-between bg-[#15171d]">
          <div className="flex items-center gap-2 w-64">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media pool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-gray-200 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{filteredMedia.length} clips found</span>
            <SlidersHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-gray-200" />
          </div>
        </div>

        {/* Media Grid Cards */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredMedia.map((media) => {
            const isSelected = activeMediaPreview?.id === media.id;
            return (
              <div
                key={media.id}
                onClick={() => setActiveMediaPreview(media)}
                className={`group relative rounded-md overflow-hidden bg-[#191b22] border transition-all cursor-pointer flex flex-col ${
                  isSelected
                    ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500'
                    : 'border-[#262932] hover:border-gray-600'
                }`}
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video bg-[#0b0c0e] overflow-hidden">
                  <img
                    src={media.thumbnail}
                    alt={media.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaPreview(media);
                        handleTogglePreviewPlay();
                      }}
                      className="p-2 rounded-full bg-blue-600 text-white shadow hover:scale-110 transition-transform"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono text-gray-300 flex items-center gap-1">
                    {media.type === 'video' ? <Film className="w-2.5 h-2.5 text-blue-400" /> : <Volume2 className="w-2.5 h-2.5 text-emerald-400" />}
                    <span>{media.duration}s</span>
                  </div>

                  {media.fps && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-gray-400">
                      {media.fps} fps
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                      {media.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                      {media.resolution || media.codec}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-2.5 pt-2 border-t border-[#262a34] flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">{media.fileSize || 'Sample'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addClipToTimeline(media);
                      }}
                      className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                    >
                      <span>Insert Cut</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar: Source Preview Monitor & Metadata Inspector */}
      <div className="w-80 bg-[#16181f] border-l border-[#242730] flex flex-col">
        <div className="p-3 border-b border-[#242730] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            Source Viewer & Inspector
          </span>
        </div>

        {/* Preview Screen */}
        <div className="p-3 bg-[#0d0e11] border-b border-[#242730] flex flex-col items-center">
          <div className="w-full aspect-video bg-black rounded border border-[#2a2d36] overflow-hidden relative flex items-center justify-center">
            {activeMediaPreview ? (
              activeMediaPreview.type === 'video' ? (
                <>
                  <video
                    ref={previewVideoRef}
                    src={activeMediaPreview.url}
                    className="w-full h-full object-contain"
                    loop
                    controls={false}
                    poster={activeMediaPreview.thumbnail}
                    onTimeUpdate={(e) => setPreviewTime((e.target as HTMLVideoElement).currentTime)}
                    onEnded={() => setIsPlayingPreview(false)}
                  />
                  {/* Sound indicator badge */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-gray-300 flex items-center gap-1 border border-white/10">
                    <button
                      onClick={() => {
                        const newMute = !previewMuted;
                        setPreviewMuted(newMute);
                        if (previewVideoRef.current) previewVideoRef.current.muted = newMute;
                      }}
                      className="hover:text-emerald-400"
                    >
                      {previewMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                    </button>
                    <span>{previewMuted ? 'Muted' : 'Sound On'}</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <audio
                    ref={previewAudioRef}
                    src={activeMediaPreview.url}
                    onTimeUpdate={(e) => setPreviewTime((e.target as HTMLAudioElement).currentTime)}
                    onEnded={() => setIsPlayingPreview(false)}
                  />
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 animate-pulse">
                    <Music className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-300">{activeMediaPreview.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1">Live Audio Waveform</span>
                </div>
              )
            ) : (
              <span className="text-xs text-gray-600">No media selected</span>
            )}
          </div>

          {/* Viewer Transport */}
          {activeMediaPreview && (
            <div className="w-full mt-2.5 space-y-1.5">
              {/* Scrub Slider */}
              <input
                type="range"
                min="0"
                max={activeMediaPreview.duration || 10}
                step="0.05"
                value={previewTime}
                onChange={(e) => {
                  const t = parseFloat(e.target.value);
                  setPreviewTime(t);
                  if (previewVideoRef.current) previewVideoRef.current.currentTime = t;
                  if (previewAudioRef.current) previewAudioRef.current.currentTime = t;
                }}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="w-full flex items-center justify-between text-xs pt-0.5">
                <span className="font-mono text-gray-400 text-[11px]">{previewTime.toFixed(1)}s</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewTime(0);
                      if (previewVideoRef.current) previewVideoRef.current.currentTime = 0;
                      if (previewAudioRef.current) previewAudioRef.current.currentTime = 0;
                    }}
                    className="p-1 text-gray-400 hover:text-white text-[10px]"
                    title="Rewind to Start"
                  >
                    Start
                  </button>
                  <button
                    onClick={handleTogglePreviewPlay}
                    className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow"
                  >
                    {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => {
                      const newMute = !previewMuted;
                      setPreviewMuted(newMute);
                      if (previewVideoRef.current) previewVideoRef.current.muted = newMute;
                      if (previewAudioRef.current) previewAudioRef.current.muted = newMute;
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                    title={previewMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {previewMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
                <span className="font-mono text-emerald-400 text-[11px] font-semibold">{activeMediaPreview.duration}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        {activeMediaPreview ? (
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Clip Name</span>
              <p className="font-semibold text-gray-200 mt-0.5">{activeMediaPreview.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#121317] p-2 rounded border border-[#232630]">
                <span className="text-[10px] text-gray-400">Resolution</span>
                <p className="font-mono text-gray-200 font-semibold">{activeMediaPreview.resolution || 'N/A'}</p>
              </div>
              <div className="bg-[#121317] p-2 rounded border border-[#232630]">
                <span className="text-[10px] text-gray-400">Framerate</span>
                <p className="font-mono text-gray-200 font-semibold">{activeMediaPreview.fps ? `${activeMediaPreview.fps} fps` : '48kHz'}</p>
              </div>
              <div className="bg-[#121317] p-2 rounded border border-[#232630]">
                <span className="text-[10px] text-gray-400">Duration</span>
                <p className="font-mono text-gray-200 font-semibold">{activeMediaPreview.duration} sec</p>
              </div>
              <div className="bg-[#121317] p-2 rounded border border-[#232630]">
                <span className="text-[10px] text-gray-400">File Size</span>
                <p className="font-mono text-gray-200 font-semibold">{activeMediaPreview.fileSize || 'Standard'}</p>
              </div>
            </div>

            <div className="bg-[#121317] p-2 rounded border border-[#232630] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 text-[11px]">Video Codec:</span>
                <span className="font-mono text-gray-300 text-[11px]">{activeMediaPreview.codec || 'H.265/HEVC'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-[11px]">Audio Channels:</span>
                <span className="font-mono text-gray-300 text-[11px]">{activeMediaPreview.channels || 'Stereo 48kHz'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-[11px]">Color Primaries:</span>
                <span className="font-mono text-emerald-400 text-[11px]">Rec.709 / Studio YRGB</span>
              </div>
            </div>

            {/* Ingest Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  addClipToTimeline(activeMediaPreview);
                  setActivePage('edit');
                }}
                className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <span>Append to Edit Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActivePage('colour');
                    showToast(`Loaded ${activeMediaPreview.name} into Colour Grading`);
                  }}
                  className="py-1.5 px-2 rounded bg-[#20232c] hover:bg-[#2c303d] text-gray-300 text-[11px] border border-[#303442]"
                >
                  Grade in Colour
                </button>
                <button
                  onClick={() => {
                    setActivePage('fusion');
                    showToast(`Created VFX composite node for ${activeMediaPreview.name}`);
                  }}
                  className="py-1.5 px-2 rounded bg-[#20232c] hover:bg-[#2c303d] text-gray-300 text-[11px] border border-[#303442]"
                >
                  Send to Fusion VFX
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 text-xs">
            Select a clip from the media pool to inspect details.
          </div>
        )}
      </div>
    </div>
  );
};
