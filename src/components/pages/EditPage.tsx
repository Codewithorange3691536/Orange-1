import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Scissors,
  MousePointer,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Plus,
  Sliders,
  Type,
  Sparkles,
  Maximize2,
  RotateCcw,
  Zap,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Columns2,
  Monitor,
  Film,
  UploadCloud,
  SkipBack,
  SkipForward,
  Bookmark,
  ArrowDownToLine,
  Check
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { LUT_PRESETS } from '../../data/sampleClips';
import { createMediaItemFromFile } from '../../utils/mediaUtils';

export const EditPage: React.FC = () => {
  const {
    timelineClips,
    tracks,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isPlaying,
    togglePlayPause,
    selectedTool,
    setSelectedTool,
    selectedClipId,
    setSelectedClipId,
    splitClipAtPlayhead,
    deleteSelectedClip,
    updateClipTransform,
    toggleTrackMute,
    toggleTrackSolo,
    toggleTrackVisibility,
    colorGrading,
    timecode,
    addClipToTimeline,
    mediaLibrary,
    addMediaItem,
    activeMediaPreview,
    setActiveMediaPreview,
    setActivePage,
    isAiGenerating,
    generateAiVideoClip,
    masterMuted,
    setMasterMuted,
    masterFaderDb,
    showToast
  } = useEditor();

  const [activeTab, setActiveTab] = useState<'transitions' | 'titles' | 'media' | 'ai'>('transitions');
  const [quickAiPrompt, setQuickAiPrompt] = useState('Cinematic 8K drone shot sweeping over futuristic Tokyo neon skyscrapers in rain');
  const [zoomLevel, setZoomLevel] = useState<number>(35); // pixels per second
  const timelineRef = useRef<HTMLDivElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Monitor Display & Playback State (Dual Monitor View)
  const [viewerMode, setViewerMode] = useState<'dual' | 'program' | 'source'>('dual');
  const [isSourcePlaying, setIsSourcePlaying] = useState<boolean>(false);
  const [sourceTime, setSourceTime] = useState<number>(0);
  const [sourceMuted, setSourceMuted] = useState<boolean>(false);
  const [sourceVolume, setSourceVolume] = useState<number>(1);
  const [sourceIn, setSourceIn] = useState<number | null>(null);
  const [sourceOut, setSourceOut] = useState<number | null>(null);

  const [programMuted, setProgramMuted] = useState<boolean>(false);
  const [programVolume, setProgramVolume] = useState<number>(1);

  // Media Player References
  const programVideoRef = useRef<HTMLVideoElement>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const sourceAudioRef = useRef<HTMLAudioElement>(null);
  const timelineAudioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Helper timecode formatter
  const formatSecsToTimecode = (secs: number) => {
    const totalFrames = Math.floor(secs * 24);
    const frames = totalFrames % 24;
    const totalSecs = Math.floor(secs);
    const s = totalSecs % 60;
    const m = Math.floor(totalSecs / 60) % 60;
    const h = Math.floor(totalSecs / 3600);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
  };

  // Find currently active clip at playhead
  const activeTopVideoClip = timelineClips
    .filter((c) => c.type === 'video' && currentTime >= c.startTime && currentTime <= c.startTime + c.duration)
    .sort((a, b) => (a.trackId === 'v2' ? -1 : 1))[0];

  const selectedClip = timelineClips.find((c) => c.id === selectedClipId);

  // Associated media item for active clip
  const activeMedia = activeTopVideoClip
    ? (mediaLibrary.find((m) => m.id === activeTopVideoClip.mediaId) || {
        id: activeTopVideoClip.id,
        name: activeTopVideoClip.name,
        type: activeTopVideoClip.type,
        url: (activeTopVideoClip as any).url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        duration: activeTopVideoClip.duration,
        thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
        category: 'Imported' as const,
        resolution: '3840 x 2160 (4K UHD)',
        fps: 24
      })
    : null;

  // Active audio clips at current playhead
  const activeAudioClips = timelineClips.filter(
    (c) => c.type === 'audio' && currentTime >= c.startTime && currentTime <= c.startTime + c.duration && !c.muted
  );

  // Active LUT CSS filter
  const activeLutObj = LUT_PRESETS.find((l) => l.id === colorGrading.activeLut);
  const lutFilter = activeLutObj ? activeLutObj.filter : 'none';

  // Real-time synchronization of Program Video player with Timeline Clock
  useEffect(() => {
    const video = programVideoRef.current;
    if (!video) return;

    if (activeTopVideoClip && activeMedia && activeMedia.type === 'video') {
      const clipLocalTime = Math.max(0, currentTime - activeTopVideoClip.startTime + activeTopVideoClip.trimStart);

      video.muted = programMuted || masterMuted;
      video.volume = (programMuted || masterMuted) ? 0 : Math.min(1, Math.max(0, programVolume * (activeTopVideoClip.volume ?? 1)));

      if (isPlaying) {
        if (Math.abs(video.currentTime - clipLocalTime) > 0.25) {
          video.currentTime = clipLocalTime;
        }
        video.play().catch((err) => {
          console.warn('Program video autoplay prevented:', err);
          if (!video.muted) {
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      } else {
        video.pause();
        video.currentTime = clipLocalTime;
      }
    } else {
      video.pause();
    }
  }, [isPlaying, activeTopVideoClip?.id, activeMedia?.url, programMuted, masterMuted, programVolume]);

  // Frame-accurate scrub seek when user moves playhead while paused
  useEffect(() => {
    const video = programVideoRef.current;
    if (!video || isPlaying || !activeTopVideoClip || activeMedia?.type !== 'video') return;
    const clipLocalTime = Math.max(0, currentTime - activeTopVideoClip.startTime + activeTopVideoClip.trimStart);
    if (Math.abs(video.currentTime - clipLocalTime) > 0.05) {
      video.currentTime = clipLocalTime;
    }
  }, [currentTime, isPlaying, activeTopVideoClip]);

  // Sync timeline audio tracks with playback
  useEffect(() => {
    activeAudioClips.forEach((audioClip) => {
      const el = timelineAudioRefs.current[audioClip.id];
      if (!el) return;
      const localTime = Math.max(0, currentTime - audioClip.startTime + audioClip.trimStart);
      el.muted = masterMuted;
      el.volume = masterMuted ? 0 : Math.min(1, Math.max(0, (audioClip.volume ?? 1) * programVolume));

      if (isPlaying) {
        if (Math.abs(el.currentTime - localTime) > 0.25) {
          el.currentTime = localTime;
        }
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = localTime;
      }
    });
  }, [isPlaying, currentTime, masterMuted, programVolume, activeAudioClips.length]);

  const toggleSourcePlay = () => {
    if (activeMediaPreview?.type === 'video' && sourceVideoRef.current) {
      if (isSourcePlaying) {
        sourceVideoRef.current.pause();
        setIsSourcePlaying(false);
      } else {
        sourceVideoRef.current.muted = sourceMuted;
        sourceVideoRef.current.volume = sourceVolume;
        sourceVideoRef.current.play().then(() => {
          setIsSourcePlaying(true);
        }).catch((err) => {
          console.warn('Source playback restricted:', err);
          if (sourceVideoRef.current) {
            sourceVideoRef.current.muted = true;
            setSourceMuted(true);
            sourceVideoRef.current.play().then(() => setIsSourcePlaying(true)).catch(() => {});
          }
        });
      }
    } else if (activeMediaPreview?.type === 'audio' && sourceAudioRef.current) {
      if (isSourcePlaying) {
        sourceAudioRef.current.pause();
        setIsSourcePlaying(false);
      } else {
        sourceAudioRef.current.muted = sourceMuted;
        sourceAudioRef.current.volume = sourceVolume;
        sourceAudioRef.current.play().then(() => {
          setIsSourcePlaying(true);
        }).catch(() => {});
      }
    } else {
      setIsSourcePlaying(!isSourcePlaying);
    }
  };

  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    showToast(`Uploading ${files.length} video/media file(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const newItem = await createMediaItemFromFile(file);
        addMediaItem(newItem);
        if (i === 0) {
          setActiveMediaPreview(newItem);
          setSourceTime(0);
          setSourceIn(null);
          setSourceOut(null);
          showToast(`Uploaded "${file.name}" into Source Monitor ready for playback`);
        }
      } catch (err) {
        console.error('File ingest error in EditPage:', err);
      }
    }
    e.target.value = '';
  };

  const handleInsertSourceToTimeline = () => {
    if (!activeMediaPreview) {
      showToast('Select a media clip in the Media Pool or upload a video first');
      return;
    }
    const hasRange = sourceIn !== null && sourceOut !== null && sourceOut > sourceIn;
    const clipDur = hasRange ? (sourceOut - sourceIn) : (activeMediaPreview.duration || 10);
    const startOffset = hasRange ? sourceIn : 0;

    addClipToTimeline(activeMediaPreview, activeMediaPreview.type === 'audio' ? 'a1' : 'v1', clipDur, currentTime);
    showToast(`Inserted "${activeMediaPreview.name}" (${clipDur.toFixed(1)}s) to Timeline at ${timecode}`);
  };

  const handleAppendSourceToTimeline = () => {
    if (!activeMediaPreview) {
      showToast('Select a media clip in the Media Pool or upload a video first');
      return;
    }
    const hasRange = sourceIn !== null && sourceOut !== null && sourceOut > sourceIn;
    const clipDur = hasRange ? (sourceOut - sourceIn) : (activeMediaPreview.duration || 10);
    const maxEnd = timelineClips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);

    addClipToTimeline(activeMediaPreview, activeMediaPreview.type === 'audio' ? 'a1' : 'v1', clipDur, maxEnd);
    showToast(`Appended "${activeMediaPreview.name}" (${clipDur.toFixed(1)}s) to end of timeline`);
  };

  // Scrubbing on timeline ruler
  const handleTimelineRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const newTime = Math.max(0, Math.min(clickX / zoomLevel, duration));
    setCurrentTime(newTime);
  };

  const handleDragTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    handleTimelineRulerClick(e);
  };

  const handleApplyTransition = (transName: string) => {
    showToast(`Applied "${transName}" transition to selected cut`);
  };

  const handleAddTitle = (titleType: string) => {
    showToast(`Added "${titleType}" animated title to Video Track V2`);
    const titleClip = {
      id: `title-media-${Date.now()}`,
      name: `${titleType} (Title)`,
      type: 'video' as const,
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
      duration: 5.0,
      category: 'Cinematic' as const
    };
    addClipToTimeline(titleClip, 'v2');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#101115] text-gray-200">
      {/* Top Workspace: Left Library | Center Program Monitor | Right Inspector */}
      <div className="h-[52%] flex border-b border-[#22252d] overflow-hidden">
        {/* Left Library: Effects, Transitions & Titles */}
        <div className="w-72 bg-[#14161c] border-r border-[#22252d] flex flex-col">
          <div className="h-9 border-b border-[#22252d] flex items-center px-2 gap-1 bg-[#181a22]">
            <button
              onClick={() => setActiveTab('transitions')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                activeTab === 'transitions' ? 'bg-[#252834] text-amber-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Transitions
            </button>
            <button
              onClick={() => setActiveTab('titles')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                activeTab === 'titles' ? 'bg-[#252834] text-blue-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Titles & Text
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                activeTab === 'media' ? 'bg-[#252834] text-purple-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-2 py-1 text-[11px] font-semibold rounded flex items-center gap-1 ${
                activeTab === 'ai'
                  ? 'bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-700/50'
                  : 'text-gray-400 hover:text-fuchsia-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-fuchsia-400" />
              <span>AI Tools</span>
            </button>
          </div>

          <div className="flex-1 p-2.5 overflow-y-auto space-y-2 text-xs">
            {activeTab === 'transitions' && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Video Dissolves</span>
                {['Cross Dissolve (Standard)', 'Dip to Black', 'Dip to White', 'Film Glitch Flash', 'Whip Pan Motion', 'Radial Zoom Blur'].map(
                  (trans) => (
                    <div
                      key={trans}
                      onClick={() => handleApplyTransition(trans)}
                      className="p-2 bg-[#1b1e26] hover:bg-[#252935] rounded border border-[#2a2e3b] cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <span className="text-gray-300 font-medium group-hover:text-amber-400">{trans}</span>
                      <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400" />
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === 'titles' && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Studio Text+ Presets</span>
                {['Cinematic Lower Third', 'Cyberpunk Glitch Header', 'Minimalist Clean Sans', 'Social Subtitle Pill', 'Bold Hollywood Title'].map(
                  (title) => (
                    <div
                      key={title}
                      onClick={() => handleAddTitle(title)}
                      className="p-2 bg-[#1b1e26] hover:bg-[#252935] rounded border border-[#2a2e3b] cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <span className="text-gray-300 font-medium group-hover:text-blue-400">{title}</span>
                      <Type className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400" />
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-2">
                <button
                  onClick={() => editFileInputRef.current?.click()}
                  className="w-full py-1.5 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Video / Media</span>
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Media Pool ({mediaLibrary.length})</span>
                  <p className="text-[9px] text-gray-500">Click to preview in Source Monitor</p>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {mediaLibrary.map((m) => {
                    const isSelected = activeMediaPreview?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setActiveMediaPreview(m);
                          setSourceTime(0);
                          setSourceIn(null);
                          setSourceOut(null);
                          showToast(`Loaded "${m.name}" into Source Monitor`);
                        }}
                        className={`p-1.5 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                          isSelected
                            ? 'bg-blue-900/40 border-blue-500/70 text-blue-200 ring-1 ring-blue-500/40'
                            : 'bg-[#1b1e26] hover:bg-[#252935] border-[#2a2e3b]'
                        }`}
                      >
                        <img src={m.thumbnail} alt="" className="w-9 h-6 object-cover rounded bg-black shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-medium truncate ${isSelected ? 'text-blue-300 font-semibold' : 'text-gray-200'}`}>
                            {m.name}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] text-gray-400 font-mono">
                            <span>{m.duration}s</span>
                            <span className="uppercase text-[8px] px-1 bg-black/40 rounded">{m.type}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addClipToTimeline(m);
                          }}
                          className="p-1 hover:bg-[#323748] rounded text-gray-400 hover:text-white"
                          title="Add to Timeline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-2.5">
                <div className="p-2 bg-gradient-to-br from-fuchsia-950/40 via-purple-950/30 to-indigo-950/40 border border-fuchsia-800/40 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-fuchsia-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Veo 3 Quick Gen</span>
                    </span>
                    <span className="text-[9px] bg-fuchsia-900/60 text-fuchsia-200 px-1 py-0.2 rounded font-mono">
                      Fast AI
                    </span>
                  </div>
                  <textarea
                    value={quickAiPrompt}
                    onChange={(e) => setQuickAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-[#0d0e12] border border-[#2e3342] rounded p-1.5 text-[11px] text-gray-200 focus:outline-none focus:border-fuchsia-500 resize-none font-sans"
                    placeholder="Describe scene for AI video..."
                  />
                  <button
                    disabled={isAiGenerating}
                    onClick={() => {
                      generateAiVideoClip({
                        prompt: quickAiPrompt,
                        model: 'Veo 3 (veo-3.1-fast-generate-preview)',
                        cameraMotion: 'Orbit Drone',
                        aspectRatio: '16:9',
                        style: 'Cinematic 8K'
                      });
                    }}
                    className="w-full mt-1.5 py-1.5 px-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white text-[11px] font-bold rounded shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAiGenerating ? 'Generating Clip...' : 'Generate & Add to Timeline'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">AI Timeline Presets</span>
                  {[
                    { label: 'Auto Hormozi Subtitles', desc: 'Yellow bold keyword captions to V2' },
                    { label: 'Neural Magic Mask Cutout', desc: 'Foreground subject isolation' },
                    { label: 'Deep Cinema Voiceover', desc: 'Narrator audio to Track A2' }
                  ].map((preset) => (
                    <div
                      key={preset.label}
                      onClick={() => {
                        showToast(`Applied ${preset.label} to active timeline segment`);
                        const aiClip = {
                          id: `ai-track-${Date.now()}`,
                          name: `AI: ${preset.label}`,
                          type: 'video' as const,
                          url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
                          thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
                          duration: 4.5,
                          category: 'Cinematic' as const
                        };
                        addClipToTimeline(aiClip, 'v2');
                      }}
                      className="p-1.5 bg-[#1b1e26] hover:bg-[#252935] rounded border border-[#2a2e3b] cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <p className="text-[11px] font-medium text-gray-200 group-hover:text-fuchsia-300">{preset.label}</p>
                        <p className="text-[9px] text-gray-400">{preset.desc}</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-fuchsia-300 shrink-0" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActivePage('ai')}
                  className="w-full py-2 px-3 bg-[#1e212b] hover:bg-[#272b38] border border-fuchsia-700/40 text-fuchsia-300 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Open Full AI & Science Lab</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input for Direct Media Ingest */}
        <input
          type="file"
          ref={editFileInputRef}
          onChange={handleEditFileUpload}
          multiple
          accept="video/*,audio/*,image/*"
          className="hidden"
        />

        {/* Hidden Audio Elements for Timeline Audio Tracks (A1, A2) */}
        <div className="hidden">
          {timelineClips
            .filter((c) => c.type === 'audio')
            .map((audioClip) => {
              const mediaObj = mediaLibrary.find((m) => m.id === audioClip.mediaId);
              const audioSrc = mediaObj?.url || (audioClip as any).url || 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg';
              return (
                <audio
                  key={audioClip.id}
                  ref={(el) => {
                    timelineAudioRefs.current[audioClip.id] = el;
                  }}
                  src={audioSrc}
                  preload="auto"
                />
              );
            })}
        </div>

        {/* Center: Dual Video Monitors (2 Images: Source Monitor & Program Master Monitor) */}
        <div className="flex-1 bg-[#090a0d] flex flex-col min-w-0 select-none overflow-hidden">
          {/* Top Multi-Monitor Bar & View Switcher */}
          <div className="h-8 bg-[#12141a] border-b border-[#1c1f26] px-3 flex items-center justify-between text-[11px] text-gray-400">
            {/* Left: Source Clip Status */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="font-semibold text-gray-200 truncate max-w-[200px]">
                {activeMediaPreview ? `Source: ${activeMediaPreview.name}` : 'Source: No Clip Selected'}
              </span>
              {activeMediaPreview && (
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 bg-cyan-950/60 rounded border border-cyan-800/40 shrink-0">
                  {activeMediaPreview.duration}s
                </span>
              )}
            </div>

            {/* Center: 2 Images / Single Monitor Layout Toggle */}
            <div className="flex items-center bg-[#1a1d26] p-0.5 rounded border border-[#262a38]">
              <button
                onClick={() => setViewerMode('dual')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                  viewerMode === 'dual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Dual View: Source Monitor & Program Monitor side-by-side (2 Images)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>2 Monitors (Dual View)</span>
              </button>

              <button
                onClick={() => setViewerMode('program')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                  viewerMode === 'program'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Program Master Record Monitor Only"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Program Only</span>
              </button>

              <button
                onClick={() => setViewerMode('source')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                  viewerMode === 'source'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Source Clip Monitor Only"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Source Only</span>
              </button>
            </div>

            {/* Right: Master Output Status */}
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Program Master</span>
              </div>
              <span className="text-amber-400 font-semibold">
                {colorGrading.activeLut !== 'none' ? `LUT: ${activeLutObj?.name}` : 'LUT: Neutral'}
              </span>
              <span className="text-emerald-400 font-bold">{timecode}</span>
            </div>
          </div>

          {/* Monitors Canvas Area */}
          <div className={`flex-1 p-2 gap-2 min-h-0 overflow-hidden ${
            viewerMode === 'dual' ? 'grid grid-cols-2' : 'flex flex-col'
          }`}>
            {/* ================= MONITOR 1 (LEFT): SOURCE VIEWER ================= */}
            {(viewerMode === 'dual' || viewerMode === 'source') && (
              <div className="flex-1 bg-[#0b0c10] rounded-lg border border-[#1e222d] flex flex-col min-h-0 overflow-hidden shadow-lg">
                {/* Source Monitor Header */}
                <div className="h-7 px-2.5 bg-[#14161f] border-b border-[#1f2330] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      <span>SOURCE</span>
                    </span>
                    <span className="text-gray-400 truncate text-[10px]">
                      {activeMediaPreview ? activeMediaPreview.name : 'No Clip Selected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white border border-blue-500/40 text-[10px] font-medium flex items-center gap-1 transition-colors"
                      title="Upload Video / Media File"
                    >
                      <UploadCloud className="w-3 h-3" />
                      <span>Upload Video</span>
                    </button>
                    {activeMediaPreview && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        {activeMediaPreview.resolution || '1080p'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Source Screen (Real Video & Audio) */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                  {activeMediaPreview ? (
                    activeMediaPreview.type === 'video' ? (
                      <>
                        <video
                          ref={sourceVideoRef}
                          src={activeMediaPreview.url}
                          className="w-full h-full object-contain"
                          poster={activeMediaPreview.thumbnail}
                          playsInline
                          onTimeUpdate={(e) => setSourceTime((e.target as HTMLVideoElement).currentTime)}
                          onEnded={() => setIsSourcePlaying(false)}
                        />
                        {/* Live HUD Badges */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-cyan-400 border border-cyan-500/30">
                          SOURCE • {activeMediaPreview.fps || 24} FPS
                        </div>

                        {/* Audio status toggle on monitor */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono flex items-center gap-1 border border-white/10">
                          <button
                            onClick={() => {
                              const newMute = !sourceMuted;
                              setSourceMuted(newMute);
                              if (sourceVideoRef.current) sourceVideoRef.current.muted = newMute;
                            }}
                            className="hover:text-emerald-400 flex items-center gap-1 text-gray-300"
                          >
                            {sourceMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                            <span>{sourceMuted ? 'Muted' : 'Sound On'}</span>
                          </button>
                        </div>

                        {/* In/Out Marker indicator HUD */}
                        {(sourceIn !== null || sourceOut !== null) && (
                          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-amber-950/80 rounded text-[9px] font-mono text-amber-300 border border-amber-600/40">
                            IN: {sourceIn !== null ? `${sourceIn.toFixed(1)}s` : '0s'} | OUT: {sourceOut !== null ? `${sourceOut.toFixed(1)}s` : `${activeMediaPreview.duration}s`}
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-gray-300">
                          {formatSecsToTimecode(sourceTime)}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <audio
                          ref={sourceAudioRef}
                          src={activeMediaPreview.url}
                          onTimeUpdate={(e) => setSourceTime((e.target as HTMLAudioElement).currentTime)}
                          onEnded={() => setIsSourcePlaying(false)}
                        />
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 animate-pulse">
                          <Film className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-gray-200">{activeMediaPreview.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono mt-1">Full Source Clip Ready</span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                      <Film className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-xs font-semibold text-gray-400">No Clip Loaded in Source Viewer</span>
                      <p className="text-[10px] text-gray-500 mt-1 max-w-[220px]">
                        Click any clip in the Media Pool on the left, or upload a video file.
                      </p>
                      <button
                        onClick={() => editFileInputRef.current?.click()}
                        className="mt-2.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Video Now</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Source Monitor Transport Controls */}
                <div className="p-2 bg-[#12141c] border-t border-[#1f2330] space-y-1.5">
                  {/* Scrub Slider */}
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max={activeMediaPreview?.duration || 10}
                      step="0.05"
                      value={sourceTime}
                      onChange={(e) => {
                        const t = parseFloat(e.target.value);
                        setSourceTime(t);
                        if (sourceVideoRef.current) sourceVideoRef.current.currentTime = t;
                        if (sourceAudioRef.current) sourceAudioRef.current.currentTime = t;
                      }}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    {/* Visual In Point Mark */}
                    {sourceIn !== null && activeMediaPreview && (
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-amber-400 pointer-events-none rounded"
                        style={{ left: `${(sourceIn / (activeMediaPreview.duration || 10)) * 100}%` }}
                      />
                    )}
                    {/* Visual Out Point Mark */}
                    {sourceOut !== null && activeMediaPreview && (
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-amber-400 pointer-events-none rounded"
                        style={{ left: `${(sourceOut / (activeMediaPreview.duration || 10)) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Transport Buttons Row */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSourceTime(0);
                          if (sourceVideoRef.current) sourceVideoRef.current.currentTime = 0;
                          if (sourceAudioRef.current) sourceAudioRef.current.currentTime = 0;
                        }}
                        className="p-1 rounded hover:bg-[#20232d] text-gray-400 hover:text-white"
                        title="Return to Clip Start"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const t = Math.max(0, sourceTime - 1 / 24);
                          setSourceTime(t);
                          if (sourceVideoRef.current) sourceVideoRef.current.currentTime = t;
                        }}
                        className="p-1 rounded hover:bg-[#20232d] text-gray-400 hover:text-white"
                        title="Step Back 1 Frame"
                      >
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>

                      {/* Source Play/Pause Button */}
                      <button
                        onClick={toggleSourcePlay}
                        className="px-2.5 py-1 rounded bg-[#202430] hover:bg-[#2b3040] text-cyan-300 font-semibold flex items-center gap-1 border border-cyan-800/40 shadow"
                        title="Play Full Source Video with Audio"
                      >
                        {isSourcePlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
                        <span className="text-[11px]">{isSourcePlaying ? 'Pause' : 'Play Source'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const maxD = activeMediaPreview?.duration || 10;
                          const t = Math.min(maxD, sourceTime + 1 / 24);
                          setSourceTime(t);
                          if (sourceVideoRef.current) sourceVideoRef.current.currentTime = t;
                        }}
                        className="p-1 rounded hover:bg-[#20232d] text-gray-400 hover:text-white"
                        title="Step Forward 1 Frame"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>

                      {/* In/Out Marker Buttons */}
                      <button
                        onClick={() => {
                          setSourceIn(sourceTime);
                          showToast(`Set Mark IN at ${sourceTime.toFixed(2)}s`);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          sourceIn !== null ? 'bg-amber-950/60 text-amber-300 border-amber-600' : 'bg-[#1a1d26] text-gray-400 hover:text-amber-300 border-[#282d3b]'
                        }`}
                        title="Set In Point [I]"
                      >
                        [ IN
                      </button>
                      <button
                        onClick={() => {
                          setSourceOut(sourceTime);
                          showToast(`Set Mark OUT at ${sourceTime.toFixed(2)}s`);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          sourceOut !== null ? 'bg-amber-950/60 text-amber-300 border-amber-600' : 'bg-[#1a1d26] text-gray-400 hover:text-amber-300 border-[#282d3b]'
                        }`}
                        title="Set Out Point [O]"
                      >
                        OUT ]
                      </button>
                    </div>

                    {/* Timecode & Actions */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-gray-300">
                        {sourceTime.toFixed(1)}s / {activeMediaPreview?.duration || 0}s
                      </span>

                      <button
                        onClick={handleInsertSourceToTimeline}
                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow"
                        title="Insert into Timeline at Playhead (F9)"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>Insert</span>
                      </button>

                      <button
                        onClick={handleAppendSourceToTimeline}
                        className="px-2 py-1 rounded bg-[#252936] hover:bg-[#323748] text-gray-200 text-[11px] font-medium border border-[#33384a]"
                        title="Append to End of Timeline"
                      >
                        <span>Append</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= MONITOR 2 (RIGHT): PROGRAM MASTER RECORD ================= */}
            {(viewerMode === 'dual' || viewerMode === 'program') && (
              <div className="flex-1 bg-[#0b0c10] rounded-lg border border-[#1e222d] flex flex-col min-h-0 overflow-hidden shadow-lg">
                {/* Program Monitor Header */}
                <div className="h-7 px-2.5 bg-[#14161f] border-b border-[#1f2330] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>PROGRAM</span>
                    </span>
                    <span className="text-gray-300 font-mono text-[10px]">
                      {activeMedia?.resolution || '3840 x 2160 (4K UHD Master)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-amber-400 font-semibold">
                      {colorGrading.activeLut !== 'none' ? `LUT: ${activeLutObj?.name}` : 'LUT: Neutral'}
                    </span>
                    <span className="text-gray-400">Rec.709 24.000 FPS</span>
                  </div>
                </div>

                {/* Program Canvas Screen (Live Synchronized Video & Audio) */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                  {activeMedia ? (
                    <div
                      className="w-full h-full relative overflow-hidden flex items-center justify-center"
                      style={{
                        filter: `${lutFilter} contrast(${colorGrading.contrast}%) saturate(${colorGrading.saturation}%)`,
                        transform: activeTopVideoClip
                          ? `scale(${activeTopVideoClip.scale}) translate(${activeTopVideoClip.posX}px, ${activeTopVideoClip.posY}px) rotate(${activeTopVideoClip.rotation}deg)`
                          : 'none',
                        opacity: activeTopVideoClip ? activeTopVideoClip.opacity : 1
                      }}
                    >
                      {/* Real Synchronized HTML5 Video Element */}
                      <video
                        ref={programVideoRef}
                        src={activeMedia.url}
                        className="w-full h-full object-contain"
                        poster={activeMedia.thumbnail}
                        playsInline
                      />

                      {/* Live HUD Watermark Overlay */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                        LIVE MASTER • 24.000 FPS
                      </div>

                      {/* Sound badge toggle on Program Monitor */}
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono flex items-center gap-1 border border-white/10">
                        <button
                          onClick={() => {
                            const newMute = !programMuted;
                            setProgramMuted(newMute);
                            if (programVideoRef.current) programVideoRef.current.muted = newMute;
                          }}
                          className="hover:text-emerald-400 flex items-center gap-1 text-gray-300"
                        >
                          {programMuted || masterMuted ? (
                            <VolumeX className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3 h-3 text-emerald-400" />
                          )}
                          <span>{programMuted || masterMuted ? 'Muted' : 'Audio On'}</span>
                        </button>
                      </div>

                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-gray-300">
                        {timecode}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500">
                      <span className="text-sm font-semibold text-gray-400">Timeline Playhead in Blank Space</span>
                      <span className="text-xs text-gray-600 mt-1">Move playhead over clips or insert media from the Source Monitor</span>
                    </div>
                  )}
                </div>

                {/* Program Monitor Transport Controls */}
                <div className="p-2 bg-[#12141c] border-t border-[#1f2330] flex items-center justify-between text-xs">
                  {/* Transport Playback Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTime(0)}
                      className="p-1 rounded hover:bg-[#20232c] text-gray-400 hover:text-gray-100"
                      title="Return to Start (Home)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 1 / 24))}
                      className="p-1 rounded hover:bg-[#20232c] text-gray-400 hover:text-gray-100"
                      title="Step Backward 1 Frame (Left Arrow)"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Master Timeline Play / Pause Button */}
                    <button
                      onClick={togglePlayPause}
                      className="px-3.5 py-1 rounded bg-[#20242e] hover:bg-[#2c313f] text-gray-100 font-semibold flex items-center gap-1.5 border border-[#303544] shadow"
                      title="Play Full Timeline Edit (Spacebar)"
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
                    </button>

                    <button
                      onClick={() => setCurrentTime(Math.min(duration, currentTime + 1 / 24))}
                      className="p-1 rounded hover:bg-[#20232c] text-gray-400 hover:text-gray-100"
                      title="Step Forward 1 Frame (Right Arrow)"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Program Audio & Timecode */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-[#171922] px-2 py-0.5 rounded border border-[#232733]">
                      <button
                        onClick={() => {
                          const newMute = !programMuted;
                          setProgramMuted(newMute);
                          if (programVideoRef.current) programVideoRef.current.muted = newMute;
                        }}
                        className="text-gray-400 hover:text-white"
                        title={programMuted ? 'Unmute' : 'Mute'}
                      >
                        {programMuted || masterMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={programVolume}
                        onChange={(e) => setProgramVolume(parseFloat(e.target.value))}
                        className="w-16 accent-emerald-500 h-1 bg-gray-700 rounded"
                        title="Program Audio Volume"
                      />
                    </div>

                    <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 bg-[#14161b] rounded border border-[#242732]">
                      {timecode}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Clip Inspector Panel */}
        <div className="w-72 bg-[#14161c] border-l border-[#22252d] flex flex-col text-xs select-none">
          <div className="h-9 border-b border-[#22252d] flex items-center justify-between px-3 bg-[#181a22]">
            <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Inspector
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {selectedClip ? selectedClip.name.slice(0, 16) + '...' : 'No Clip'}
            </span>
          </div>

          {selectedClip ? (
            <div className="flex-1 p-3 overflow-y-auto space-y-4">
              {/* Transform Section */}
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Video Transform</span>
                <div className="mt-2 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-gray-300 text-[11px] mb-1">
                      <span>Zoom / Scale:</span>
                      <span className="font-mono text-blue-400">{selectedClip.scale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={selectedClip.scale}
                      onChange={(e) => updateClipTransform(selectedClip.id, { scale: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500 h-1 bg-[#252834] rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 text-[10px]">Pos X (px)</span>
                      <input
                        type="number"
                        value={selectedClip.posX}
                        onChange={(e) => updateClipTransform(selectedClip.id, { posX: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1c1f28] border border-[#2a2f3d] rounded px-2 py-1 text-gray-200 text-xs font-mono mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">Pos Y (px)</span>
                      <input
                        type="number"
                        value={selectedClip.posY}
                        onChange={(e) => updateClipTransform(selectedClip.id, { posY: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1c1f28] border border-[#2a2f3d] rounded px-2 py-1 text-gray-200 text-xs font-mono mt-0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-300 text-[11px] mb-1">
                      <span>Opacity:</span>
                      <span className="font-mono text-blue-400">{Math.round(selectedClip.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selectedClip.opacity}
                      onChange={(e) => updateClipTransform(selectedClip.id, { opacity: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500 h-1 bg-[#252834] rounded"
                    />
                  </div>

                  <div>
                    <span className="text-gray-400 text-[10px] block mb-1">Composite Mode</span>
                    <select
                      value={selectedClip.blendMode}
                      onChange={(e) => updateClipTransform(selectedClip.id, { blendMode: e.target.value as any })}
                      className="w-full bg-[#1c1f28] border border-[#2a2f3d] rounded px-2 py-1 text-gray-200 text-xs"
                    >
                      <option value="normal">Normal</option>
                      <option value="screen">Screen (Lighten)</option>
                      <option value="multiply">Multiply (Darken)</option>
                      <option value="overlay">Overlay (Contrast)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Audio Section */}
              <div className="pt-2 border-t border-[#22252d]">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Audio Gain & Pan</span>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-gray-300 text-[11px]">
                    <span>Clip Volume:</span>
                    <span className="font-mono text-emerald-400">{Math.round(selectedClip.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={selectedClip.volume}
                    onChange={(e) => updateClipTransform(selectedClip.id, { volume: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                  />
                </div>
              </div>

              {/* Quick Delete */}
              <button
                onClick={deleteSelectedClip}
                className="w-full py-1.5 px-2 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected Clip</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 p-6 text-center text-gray-500 flex flex-col items-center justify-center">
              <Sliders className="w-8 h-8 text-gray-600 mb-2" />
              <p className="font-semibold text-gray-400">No clip selected</p>
              <p className="text-[10px] text-gray-500 mt-1">Click any clip on the timeline to edit its scale, position, and audio.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Timeline Section */}
      <div className="flex-1 flex flex-col bg-[#121317] overflow-hidden select-none">
        {/* Timeline Action Bar */}
        <div className="h-9 bg-[#171920] border-b border-[#232630] px-3 flex items-center justify-between text-xs">
          {/* Tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedTool('select')}
              className={`p-1.5 rounded transition-colors ${
                selectedTool === 'select' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-[#252834] hover:text-gray-200'
              }`}
              title="Selection Mode (A)"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSelectedTool('blade')}
              className={`p-1.5 rounded transition-colors ${
                selectedTool === 'blade' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-[#252834] hover:text-gray-200'
              }`}
              title="Razor Blade Tool (B)"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-[1px] bg-[#2a2d38] mx-1" />

            <button
              onClick={splitClipAtPlayhead}
              className="px-2 py-1 rounded bg-[#20232c] hover:bg-[#2c303c] text-gray-300 border border-[#2f3340] flex items-center gap-1"
              title="Cut at Playhead"
            >
              <Scissors className="w-3 h-3 text-amber-400" />
              <span>Blade Cut</span>
            </button>

            <button
              onClick={deleteSelectedClip}
              disabled={!selectedClipId}
              className={`px-2 py-1 rounded border flex items-center gap-1 ${
                selectedClipId
                  ? 'bg-[#20232c] hover:bg-rose-950/40 text-rose-300 border-rose-900/40'
                  : 'opacity-40 cursor-not-allowed bg-[#181a20] text-gray-500 border-transparent'
              }`}
            >
              <Trash2 className="w-3 h-3" />
              <span>Ripple Delete</span>
            </button>
          </div>

          {/* Timeline Zoom Slider */}
          <div className="flex items-center gap-2 text-gray-400">
            <ZoomOut className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setZoomLevel((z) => Math.max(15, z - 8))} />
            <input
              type="range"
              min="15"
              max="70"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-24 accent-blue-500 h-1 bg-[#252834] rounded"
            />
            <ZoomIn className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setZoomLevel((z) => Math.min(70, z + 8))} />
          </div>
        </div>

        {/* Tracks Header & Timeline Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Track Headers (Left fixed column) */}
          <div className="w-48 bg-[#15171d] border-r border-[#232630] flex flex-col z-10 select-none shadow-md">
            {/* Header ruler spacer */}
            <div className="h-6 bg-[#181a22] border-b border-[#232630] flex items-center px-2 text-[10px] font-mono text-gray-400 font-bold uppercase">
              Tracks
            </div>

            {/* Track controls */}
            <div className="flex-1 overflow-hidden">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  style={{ height: `${track.height}px` }}
                  className="border-b border-[#232630] px-2 flex items-center justify-between bg-[#15171e] hover:bg-[#1b1d26] transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`text-[10px] font-bold font-mono px-1 rounded ${
                        track.type === 'video' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-emerald-900/50 text-emerald-300'
                      }`}
                    >
                      {track.id.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium text-gray-300 truncate">{track.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleTrackVisibility(track.id)}
                      className={`p-1 rounded ${track.visible ? 'text-gray-400 hover:text-white' : 'text-rose-400'}`}
                      title="Toggle Visibility"
                    >
                      {track.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => toggleTrackMute(track.id)}
                      className={`p-1 rounded ${track.muted ? 'text-rose-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                      title="Mute Track (M)"
                    >
                      {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => toggleTrackSolo(track.id)}
                      className={`px-1 py-0.2 rounded text-[9px] font-bold font-mono ${
                        track.solo ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-gray-300'
                      }`}
                      title="Solo Track (S)"
                    >
                      S
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Canvas & Clips Container (Scrollable) */}
          <div
            ref={timelineRef}
            onMouseDown={handleTimelineRulerClick}
            onMouseMove={handleDragTimeline}
            className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0e0f13] select-none cursor-crosshair"
          >
            <div style={{ width: `${duration * zoomLevel + 200}px` }} className="relative h-full">
              {/* Timeline Timecode Ruler */}
              <div className="h-6 bg-[#161820] border-b border-[#232630] relative sticky top-0 z-20 flex items-center">
                {Array.from({ length: Math.ceil(duration) + 1 }).map((_, sec) => (
                  <div
                    key={sec}
                    style={{ left: `${sec * zoomLevel}px` }}
                    className="absolute top-0 bottom-0 border-l border-[#2e323e] flex items-end pb-0.5 pl-1"
                  >
                    {sec % 2 === 0 && (
                      <span className="text-[9px] font-mono text-gray-500 pointer-events-none select-none">
                        00:{sec < 10 ? `0${sec}` : sec}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Tracks Background Lanes */}
              {tracks.map((track) => (
                <div
                  key={track.id}
                  style={{ height: `${track.height}px` }}
                  className="border-b border-[#1c1e26] relative"
                >
                  {/* Subtle vertical second beat lines */}
                  {Array.from({ length: Math.ceil(duration) + 1 }).map((_, sec) => (
                    <div
                      key={sec}
                      style={{ left: `${sec * zoomLevel}px` }}
                      className="absolute top-0 bottom-0 border-l border-[#191a22] pointer-events-none"
                    />
                  ))}
                </div>
              ))}

              {/* Render Clips onto their respective track lanes */}
              {timelineClips.map((clip) => {
                const trackIndex = tracks.findIndex((t) => t.id === clip.trackId);
                if (trackIndex === -1) return null;

                let topOffset = 24; // height of ruler
                for (let i = 0; i < trackIndex; i++) {
                  topOffset += tracks[i].height;
                }

                const track = tracks[trackIndex];
                const clipLeft = clip.startTime * zoomLevel;
                const clipWidth = clip.duration * zoomLevel;
                const isSelected = selectedClipId === clip.id;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedTool === 'blade') {
                        splitClipAtPlayhead();
                      } else {
                        setSelectedClipId(clip.id);
                      }
                    }}
                    style={{
                      left: `${clipLeft}px`,
                      top: `${topOffset + 2}px`,
                      width: `${clipWidth}px`,
                      height: `${track.height - 4}px`,
                      backgroundColor: clip.color
                    }}
                    className={`absolute rounded transition-shadow cursor-pointer overflow-hidden flex flex-col justify-between px-2 py-1 shadow select-none ${
                      isSelected
                        ? 'ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10 brightness-110'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Clip Title & Duration */}
                    <div className="flex items-center justify-between text-white drop-shadow-sm min-w-0">
                      <span className="text-[11px] font-bold truncate leading-tight">{clip.name}</span>
                      <span className="text-[9px] font-mono opacity-80 shrink-0">{clip.duration.toFixed(1)}s</span>
                    </div>

                    {/* Clip Footer (waveform style for audio, filmstrip styling for video) */}
                    <div className="flex items-center justify-between opacity-80">
                      {clip.type === 'audio' ? (
                        <div className="w-full flex items-center gap-0.5 h-2">
                          {Array.from({ length: 18 }).map((_, idx) => (
                            <span
                              key={idx}
                              style={{ height: `${((idx * 7 + 13) % 100) * 0.08 + 2}px` }}
                              className="w-1 bg-white/70 rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-white/90">
                          <span>{clip.scale !== 1 ? `${clip.scale}x` : '4K DCI'}</span>
                          {clip.blendMode !== 'normal' && <span className="uppercase text-[8px] px-1 bg-black/40 rounded">{clip.blendMode}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Draggable Playhead Needle */}
              <div
                style={{ left: `${currentTime * zoomLevel}px` }}
                className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              >
                {/* Playhead Head Marker */}
                <div className="w-3.5 h-3.5 -ml-[6px] bg-red-500 rotate-45 rounded-sm flex items-center justify-center shadow">
                  <div className="w-1 h-1 bg-white rounded-full -rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
