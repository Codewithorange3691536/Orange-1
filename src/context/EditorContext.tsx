import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  StudioPage,
  MediaItem,
  TimelineClip,
  TimelineTrack,
  FusionNode,
  ColorGradingSettings,
  AudioChannelStrip,
  RenderJob,
  AiVideoGeneration,
  ProjectItem,
  ProjectLibrary,
  ProjectSettings
} from '../types/editor';
import {
  SAMPLE_MEDIA_LIBRARY,
  INITIAL_PROJECT_LIBRARIES,
  INITIAL_PROJECTS
} from '../data/sampleClips';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface EditorContextType {
  activePage: StudioPage;
  setActivePage: (page: StudioPage) => void;
  // Project Management
  projects: ProjectItem[];
  currentProject: ProjectItem;
  projectLibraries: ProjectLibrary[];
  activeLibraryId: string;
  setActiveLibraryId: (id: string) => void;
  openProject: (id: string) => void;
  createProject: (name: string, resolution?: string, fps?: number) => void;
  addProjectLibrary: (name: string, type: 'local' | 'network' | 'cloud', path: string, autoOpen?: boolean, targetPage?: StudioPage) => void;
  resetProjectLibrariesToDefault: () => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  exportProjectFile: (id: string) => void;
  importProjectFile: (data: Partial<ProjectItem>) => void;
  returnToProjectManager: () => void;
  isProjectSettingsOpen: boolean;
  setIsProjectSettingsOpen: (open: boolean) => void;
  // Media Pool
  mediaLibrary: MediaItem[];
  addMediaItem: (item: MediaItem) => void;
  activeMediaPreview: MediaItem | null;
  setActiveMediaPreview: (item: MediaItem | null) => void;
  // Timeline
  timelineClips: TimelineClip[];
  tracks: TimelineTrack[];
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  selectedTool: 'select' | 'blade' | 'trim' | 'slip';
  setSelectedTool: (tool: 'select' | 'blade' | 'trim' | 'slip') => void;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  snapEnabled: boolean;
  setSnapEnabled: (snap: boolean | ((prev: boolean) => boolean)) => void;
  inPoint: number | null;
  setInPoint: (inP: number | null) => void;
  outPoint: number | null;
  setOutPoint: (outP: number | null) => void;
  splitClipAtPlayhead: () => void;
  deleteSelectedClip: () => void;
  addClipToTimeline: (media: MediaItem, trackId?: string, customDuration?: number, startTimeOverride?: number) => void;
  updateClipTransform: (clipId: string, updates: Partial<TimelineClip>) => void;
  // Track controls
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;
  // Colour Grading
  colorGrading: ColorGradingSettings;
  updateColorGrading: (updates: Partial<ColorGradingSettings>) => void;
  updateColorWheel: (wheel: 'lift' | 'gamma' | 'gain' | 'offset', channel: 'r' | 'g' | 'b' | 'y', value: number) => void;
  resetColorGrading: () => void;
  // Fusion Compositor
  fusionNodes: FusionNode[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateFusionNode: (id: string, updates: Partial<FusionNode>) => void;
  addFusionNode: (type: FusionNode['type'], title: string) => void;
  removeFusionNode: (id: string) => void;
  resetFusionTree: () => void;
  // Fairlight Audio
  audioMixer: AudioChannelStrip[];
  updateAudioChannel: (trackId: string, updates: Partial<AudioChannelStrip>) => void;
  masterFaderDb: number;
  setMasterFaderDb: (db: number) => void;
  masterMuted: boolean;
  setMasterMuted: (muted: boolean) => void;
  // Delivery
  renderQueue: RenderJob[];
  addRenderJob: (job: Omit<RenderJob, 'id' | 'progress' | 'status'>) => void;
  startRenderJob: (id: string) => void;
  // AI Tools
  aiGenerations: Array<{ id: string; prompt: string; model: string; timestamp: string; videoUrl: string; thumbnail: string }>;
  isAiGenerating: boolean;
  aiProgressStep: string;
  generateAiVideoClip: (params: AiVideoGeneration) => Promise<void>;
  // UI helpers
  timecode: string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  loadSampleProject: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const INITIAL_TRACKS: TimelineTrack[] = [
  { id: 'v2', name: 'Video 2 (VFX/Titles)', type: 'video', visible: true, muted: false, solo: false, height: 48 },
  { id: 'v1', name: 'Video 1 (Base)', type: 'video', visible: true, muted: false, solo: false, height: 56 },
  { id: 'a1', name: 'Audio 1 (Dialogue)', type: 'audio', visible: true, muted: false, solo: false, height: 44 },
  { id: 'a2', name: 'Audio 2 (Music/SFX)', type: 'audio', visible: true, muted: false, solo: false, height: 44 }
];

const INITIAL_COLOR_GRADING: ColorGradingSettings = {
  lift: { r: 0, g: 0, b: 0, y: 0 },
  gamma: { r: 0, g: 0, b: 0, y: 0 },
  gain: { r: 0, g: 0, b: 0, y: 0 },
  offset: { r: 0, g: 0, b: 0, y: 0 },
  contrast: 100,
  pivot: 50,
  saturation: 100,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  activeLut: 'none'
};

const INITIAL_FUSION_NODES: FusionNode[] = [
  {
    id: 'node-media-in',
    type: 'mediaIn',
    title: 'MediaIn 1',
    x: 60,
    y: 120,
    color: '#3b82f6',
    inputs: [],
    outputs: ['node-glow'],
    params: { scale: 1 }
  },
  {
    id: 'node-glow',
    type: 'glow',
    title: 'SoftGlow 1',
    x: 240,
    y: 120,
    color: '#8b5cf6',
    inputs: ['node-media-in'],
    outputs: ['node-merge'],
    params: { glowIntensity: 0.45, glowRadius: 18 }
  },
  {
    id: 'node-text',
    type: 'textPlus',
    title: 'Text+ (Title)',
    x: 240,
    y: 260,
    color: '#10b981',
    inputs: [],
    outputs: ['node-merge'],
    params: { text: 'GREAT EDITING 4K', fontSize: 44, textColor: '#ffffff' }
  },
  {
    id: 'node-merge',
    type: 'merge',
    title: 'Merge 1',
    x: 440,
    y: 180,
    color: '#f59e0b',
    inputs: ['node-glow', 'node-text'],
    outputs: ['node-transform'],
    params: { scale: 1 }
  },
  {
    id: 'node-transform',
    type: 'transform',
    title: 'Transform 1',
    x: 620,
    y: 180,
    color: '#06b6d4',
    inputs: ['node-merge'],
    outputs: ['node-media-out'],
    params: { scale: 1.05, posX: 0, posY: 0 }
  },
  {
    id: 'node-media-out',
    type: 'mediaOut',
    title: 'MediaOut 1',
    x: 820,
    y: 180,
    color: '#ef4444',
    inputs: ['node-transform'],
    outputs: [],
    params: {}
  }
];

const INITIAL_AUDIO_MIXER: AudioChannelStrip[] = [
  {
    trackId: 'a1',
    name: 'A1 Dialogue',
    faderDb: 0,
    pan: 0,
    mute: false,
    solo: false,
    recordArm: false,
    eq: { lowCutHz: 80, lowMidGain: 0, highMidGain: 1.5, highShelfGain: 0.5, enabled: true },
    dynamics: { compressor: true, compThreshold: -14, compRatio: 3, limiter: true }
  },
  {
    trackId: 'a2',
    name: 'A2 Music/SFX',
    faderDb: -3.5,
    pan: 0,
    mute: false,
    solo: false,
    recordArm: false,
    eq: { lowCutHz: 30, lowMidGain: -1.0, highMidGain: 0, highShelfGain: 2.0, enabled: true },
    dynamics: { compressor: false, compThreshold: -18, compRatio: 2.5, limiter: true }
  }
];

const STORAGE_KEY_LIBS = 'ge_project_libraries_v5';
const STORAGE_KEY_PROJS = 'ge_projects_v5';
const STORAGE_KEY_CURRENT = 'ge_current_project_v5';

export const sanitizeLibraryItem = (lib: ProjectLibrary): ProjectLibrary => {
  if (!lib) return lib;
  let name = lib.name || '';
  let path = lib.path || '';

  // Clean Blackmagic Cloud Team and any Blackmagic references
  name = name
    .replace(/Blackmagic\s+Cloud\s+Team/gi, 'Studio Cloud Workspace')
    .replace(/Blackmagic\s+Cloud/gi, 'Studio Cloud')
    .replace(/Blackmagic/gi, 'Studio');

  path = path
    .replace(/cloud\.blackmagicdesign\.com\/team-studio/gi, 'cloud.greatediting.studio/team-workspace')
    .replace(/cloud\.blackmagicdesign\.com/gi, 'cloud.greatediting.studio')
    .replace(/blackmagicdesign\.com/gi, 'greatediting.studio')
    .replace(/blackmagic/gi, 'greatediting');

  // Clean DaVinci Resolve references
  name = name
    .replace(/DaVinci\s+Resolve\s+Studio/gi, 'Great Editing Studio')
    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
    .replace(/DaVinci/gi, 'Studio')
    .replace(/Resolve/gi, 'Studio');

  path = path
    .replace(/\/Users\/Studio\/Library\/DaVinci Resolve\/Resolve Project Library/gi, '/Users/Studio/Library/Great Editing/Project Library')
    .replace(/\/Volumes\/Studio_RAID_01\/Resolve_DB/gi, '/Volumes/Studio_RAID_01/Studio_Projects')
    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
    .replace(/Resolve_DB/gi, 'Studio_Projects')
    .replace(/Resolve/gi, 'Studio');

  return {
    ...lib,
    name,
    path
  };
};

export const sanitizeProjectItem = (proj: ProjectItem): ProjectItem => {
  if (!proj) return proj;
  let name = (proj.name || '')
    .replace(/DaVinci\s+Resolve\s+Studio/gi, 'Great Editing Studio')
    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
    .replace(/DaVinci/gi, 'Studio')
    .replace(/Blackmagic/gi, 'Studio');
  let notes = (proj.notes || '')
    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
    .replace(/DaVinci/gi, 'Studio')
    .replace(/Blackmagic/gi, 'Studio')
    .replace(/Resolve/gi, 'Studio');
  return {
    ...proj,
    name,
    notes
  };
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Startup starts at project-manager library screen
  const [activePage, setActivePage] = useState<StudioPage>('project-manager');
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(SAMPLE_MEDIA_LIBRARY);
  const [activeMediaPreview, setActiveMediaPreview] = useState<MediaItem | null>(SAMPLE_MEDIA_LIBRARY[0]);

  // Project Management state
  const [projectLibraries, setProjectLibraries] = useState<ProjectLibrary[]>(() => {
    try {
      // Purge legacy keys containing stale 'Blackmagic Cloud Team'
      ['ge_project_libraries', 'ge_projects', 'ge_current_project', 'davinci_project_libraries', 'davinci_projects', 'ge_project_libraries_v2', 'ge_project_libraries_v3'].forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });

      const saved = localStorage.getItem(STORAGE_KEY_LIBS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeLibraryItem);
        }
      }
      return INITIAL_PROJECT_LIBRARIES.map(sanitizeLibraryItem);
    } catch {
      return INITIAL_PROJECT_LIBRARIES.map(sanitizeLibraryItem);
    }
  });

  const [activeLibraryId, setActiveLibraryId] = useState<string>('lib-local');

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeProjectItem);
        }
      }
      return INITIAL_PROJECTS.map(sanitizeProjectItem);
    } catch {
      return INITIAL_PROJECTS.map(sanitizeProjectItem);
    }
  });

  const [currentProject, setCurrentProject] = useState<ProjectItem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        return sanitizeProjectItem(JSON.parse(saved));
      }
      return sanitizeProjectItem(INITIAL_PROJECTS[1]);
    } catch {
      return sanitizeProjectItem(INITIAL_PROJECTS[1]);
    }
  });

  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);

  // Sync to localStorage with automatic sanitization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJS, JSON.stringify(projects.map(sanitizeProjectItem)));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIBS, JSON.stringify(projectLibraries.map(sanitizeLibraryItem)));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [projectLibraries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(sanitizeProjectItem(currentProject)));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [currentProject]);

  // Immediate sanitization check on mount
  useEffect(() => {
    setProjectLibraries((prev) => {
      const sanitized = prev.map(sanitizeLibraryItem);
      return sanitized;
    });
    setProjects((prev) => prev.map(sanitizeProjectItem));
  }, []);

  // Initial timeline clips for instant live editing
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([
    {
      id: 'clip-1',
      mediaId: 'sample-1',
      trackId: 'v1',
      startTime: 0,
      duration: 8.5,
      trimStart: 0,
      name: 'Cyberpunk Metropolis Neon 4K',
      type: 'video',
      color: '#3b82f6',
      scale: 1,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      volume: 1,
      pan: 0
    },
    {
      id: 'clip-2',
      mediaId: 'sample-2',
      trackId: 'v1',
      startTime: 8.5,
      duration: 9.0,
      trimStart: 1.0,
      name: 'Golden Hour Coastal Drone Flight',
      type: 'video',
      color: '#06b6d4',
      scale: 1,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      volume: 1,
      pan: 0
    },
    {
      id: 'clip-3',
      mediaId: 'sample-3',
      trackId: 'v2',
      startTime: 4.0,
      duration: 5.5,
      trimStart: 0,
      name: 'Cinematic Mountain Overlay',
      type: 'video',
      color: '#8b5cf6',
      scale: 0.95,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 0.85,
      blendMode: 'screen',
      volume: 0.8,
      pan: 0
    },
    {
      id: 'clip-audio-1',
      mediaId: 'sample-audio-1',
      trackId: 'a2',
      startTime: 0,
      duration: 17.5,
      trimStart: 0,
      name: 'Midnight Synth Chillwave Beat',
      type: 'audio',
      color: '#10b981',
      scale: 1,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      volume: 0.9,
      pan: 0
    },
    {
      id: 'clip-audio-2',
      mediaId: 'sample-audio-2',
      trackId: 'a1',
      startTime: 8.2,
      duration: 3.5,
      trimStart: 0,
      name: 'Sub Whoosh Impact SFX',
      type: 'audio',
      color: '#ec4899',
      scale: 1,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      volume: 1.2,
      pan: 0
    }
  ]);

  const [tracks, setTracks] = useState<TimelineTrack[]>(INITIAL_TRACKS);
  const [currentTime, setCurrentTime] = useState<number>(3.2);
  const [duration, setDuration] = useState<number>(24.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'blade' | 'trim' | 'slip'>('select');
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [inPoint, setInPoint] = useState<number | null>(0);
  const [outPoint, setOutPoint] = useState<number | null>(18.0);

  // Colour & Fusion
  const [colorGrading, setColorGrading] = useState<ColorGradingSettings>(INITIAL_COLOR_GRADING);
  const [fusionNodes, setFusionNodes] = useState<FusionNode[]>(INITIAL_FUSION_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-glow');

  // Fairlight Audio
  const [audioMixer, setAudioMixer] = useState<AudioChannelStrip[]>(INITIAL_AUDIO_MIXER);
  const [masterFaderDb, setMasterFaderDb] = useState<number>(-1.5);
  const [masterMuted, setMasterMuted] = useState<boolean>(false);

  // Delivery / Render
  const [renderQueue, setRenderQueue] = useState<RenderJob[]>([
    {
      id: 'job-sample',
      name: 'Cyberpunk_TealOrange_Master_4K.mov',
      format: 'mov',
      resolution: '3840 x 2160 (4K UHD)',
      fps: 24,
      bitrate: 'Apple ProRes 422 HQ (220 Mbps)',
      preset: 'Cinema Master 4K',
      progress: 100,
      status: 'completed',
      sizeEstimate: '1.45 GB'
    }
  ]);

  // AI Tools Lab
  const [aiGenerations, setAiGenerations] = useState<Array<{ id: string; prompt: string; model: string; timestamp: string; videoUrl: string; thumbnail: string }>>([
    {
      id: 'ai-gen-1',
      prompt: 'Cinematic hyperlapse through futuristic cyberpunk Neo-Tokyo with flying air-cabs and rain reflections, 8k, anamorphic lens flare',
      model: 'MiniMax Hailuo H3 Ultra',
      timestamp: 'Just now',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop'
    }
  ]);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiProgressStep, setAiProgressStep] = useState<string>('');

  // Modals & Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Playback timer animation
  const lastTimeRef = useRef<number>(performance.now());
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const tick = () => {
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            return 0; // loop
          }
          return next;
        });
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, duration]);

  // Formatted Timecode HH:MM:SS:FF (at 24fps)
  const formatTimecode = (seconds: number): string => {
    const totalFrames = Math.floor(seconds * 24);
    const frames = totalFrames % 24;
    const totalSecs = Math.floor(seconds);
    const s = totalSecs % 60;
    const m = Math.floor(totalSecs / 60) % 60;
    const h = Math.floor(totalSecs / 3600);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
  };

  const timecode = formatTimecode(currentTime);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const seekTo = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration));
    setCurrentTime(clamped);
  };

  const addMediaItem = (item: MediaItem) => {
    setMediaLibrary((prev) => [item, ...prev]);
    showToast(`Imported "${item.name}" into Media Pool`);
  };

  const addClipToTimeline = (media: MediaItem, trackId?: string, customDuration?: number, startTimeOverride?: number) => {
    const targetTrackId = trackId || (media.type === 'audio' ? 'a1' : 'v1');
    const clipDuration = customDuration !== undefined && customDuration > 0
      ? customDuration
      : (media.duration && media.duration > 0 ? media.duration : 10);
    const start = startTimeOverride !== undefined ? startTimeOverride : currentTime;

    const newClip: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      mediaId: media.id,
      trackId: targetTrackId,
      startTime: start,
      duration: clipDuration,
      trimStart: 0,
      name: media.name,
      type: media.type,
      color: media.type === 'audio' ? '#10b981' : '#3b82f6',
      scale: 1,
      posX: 0,
      posY: 0,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      volume: 1,
      pan: 0
    };
    setTimelineClips((prev) => [...prev, newClip]);
    // Auto-expand timeline total duration if the new clip extends beyond it
    setDuration((prev) => Math.max(prev, start + clipDuration + 5));
    showToast(`Added "${media.name}" (${clipDuration.toFixed(1)}s) to Timeline track ${targetTrackId.toUpperCase()}`);
  };

  const splitClipAtPlayhead = () => {
    const clipToSplit = timelineClips.find(
      (c) => c.id === selectedClipId || (currentTime > c.startTime && currentTime < c.startTime + c.duration)
    );
    if (!clipToSplit) {
      showToast('Select a clip or place playhead over a clip to blade/split');
      return;
    }

    const splitOffset = currentTime - clipToSplit.startTime;
    if (splitOffset <= 0.2 || splitOffset >= clipToSplit.duration - 0.2) {
      showToast('Playhead is too close to the clip edge to cut');
      return;
    }

    const firstHalf: TimelineClip = {
      ...clipToSplit,
      id: `${clipToSplit.id}-part1`,
      duration: splitOffset
    };

    const secondHalf: TimelineClip = {
      ...clipToSplit,
      id: `${clipToSplit.id}-part2`,
      startTime: currentTime,
      duration: clipToSplit.duration - splitOffset,
      trimStart: clipToSplit.trimStart + splitOffset
    };

    setTimelineClips((prev) => prev.filter((c) => c.id !== clipToSplit.id).concat([firstHalf, secondHalf]));
    setSelectedClipId(secondHalf.id);
    showToast(`Cut clip "${clipToSplit.name}" at ${timecode}`);
  };

  const deleteSelectedClip = () => {
    if (!selectedClipId) return;
    const clip = timelineClips.find((c) => c.id === selectedClipId);
    setTimelineClips((prev) => prev.filter((c) => c.id !== selectedClipId));
    setSelectedClipId(null);
    if (clip) showToast(`Deleted "${clip.name}" from timeline`);
  };

  const updateClipTransform = (clipId: string, updates: Partial<TimelineClip>) => {
    setTimelineClips((prev) => prev.map((c) => (c.id === clipId ? { ...c, ...updates } : c)));
  };

  // Track toggles
  const toggleTrackMute = (trackId: string) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t)));
  };

  const toggleTrackSolo = (trackId: string) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? { ...t, solo: !t.solo } : t)));
  };

  const toggleTrackVisibility = (trackId: string) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? { ...t, visible: !t.visible } : t)));
  };

  // Colour grading
  const updateColorGrading = (updates: Partial<ColorGradingSettings>) => {
    setColorGrading((prev) => ({ ...prev, ...updates }));
  };

  const updateColorWheel = (wheel: 'lift' | 'gamma' | 'gain' | 'offset', channel: 'r' | 'g' | 'b' | 'y', value: number) => {
    setColorGrading((prev) => ({
      ...prev,
      [wheel]: {
        ...prev[wheel],
        [channel]: value
      }
    }));
  };

  const resetColorGrading = () => {
    setColorGrading(INITIAL_COLOR_GRADING);
    showToast('Reset Color Wheels & LUT to Rec.709 Neutral');
  };

  // Fusion Compositor
  const updateFusionNode = (id: string, updates: Partial<FusionNode>) => {
    setFusionNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const addFusionNode = (type: FusionNode['type'], title: string) => {
    const newNode: FusionNode = {
      id: `node-${Date.now()}`,
      type,
      title,
      x: 350 + Math.random() * 80,
      y: 140 + Math.random() * 80,
      color: type === 'blur' ? '#38bdf8' : type === 'chroma' ? '#10b981' : '#a855f7',
      inputs: [],
      outputs: [],
      params: { blurRadius: 10, glowIntensity: 0.5, scale: 1 }
    };
    setFusionNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    showToast(`Added ${title} node to Fusion tree`);
  };

  const removeFusionNode = (id: string) => {
    if (id === 'node-media-in' || id === 'node-media-out') {
      showToast('MediaIn and MediaOut cannot be deleted');
      return;
    }
    setFusionNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    showToast('Node removed from pipeline');
  };

  const resetFusionTree = () => {
    setFusionNodes(INITIAL_FUSION_NODES);
    setSelectedNodeId('node-glow');
    showToast('Restored default Fusion composition pipeline');
  };

  // Fairlight Audio
  const updateAudioChannel = (trackId: string, updates: Partial<AudioChannelStrip>) => {
    setAudioMixer((prev) => prev.map((c) => (c.trackId === trackId ? { ...c, ...updates } : c)));
  };

  // Delivery
  const addRenderJob = (job: Omit<RenderJob, 'id' | 'progress' | 'status'>) => {
    const newJob: RenderJob = {
      ...job,
      id: `job-${Date.now()}`,
      progress: 0,
      status: 'queued'
    };
    setRenderQueue((prev) => [newJob, ...prev]);
    showToast(`Added "${job.name}" to Render Queue`);
    // auto-start
    setTimeout(() => startRenderJob(newJob.id), 400);
  };

  const startRenderJob = (id: string) => {
    setRenderQueue((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'rendering', progress: 5 } : j)));
    showToast('Render started via client WebCodecs / Canvas stream...');

    let p = 5;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        clearInterval(interval);
        setRenderQueue((prev) =>
          prev.map((j) =>
            j.id === id
              ? {
                  ...j,
                  status: 'completed',
                  progress: 100,
                  downloadUrl: SAMPLE_MEDIA_LIBRARY[0].url
                }
              : j
          )
        );
        showToast('Render Complete! Video file ready for instant download.');
      } else {
        setRenderQueue((prev) => prev.map((j) => (j.id === id ? { ...j, progress: p } : j)));
      }
    }, 450);
  };

  // AI Generation simulation & pipeline (Veo 3 & MiniMax H3)
  const generateAiVideoClip = async (params: AiVideoGeneration) => {
    setIsAiGenerating(true);
    const isVeo = params.model.includes('Veo 3') || params.model.includes('veo-3.1-fast-generate-preview');

    if (isVeo) {
      setAiProgressStep('1/5 Initializing Veo 3 Neural Latent Space (veo-3.1-fast-generate-preview)...');
      await new Promise((r) => setTimeout(r, 800));
      setAiProgressStep('2/5 Conditioning camera physics & anamorphic depth tensors...');
      await new Promise((r) => setTimeout(r, 900));
      setAiProgressStep('3/5 Synthesizing 16-second preview temporal frames at 60fps...');
      await new Promise((r) => setTimeout(r, 1100));
      setAiProgressStep('4/5 Neural temporal denoising & HDR color grading...');
      await new Promise((r) => setTimeout(r, 800));
      setAiProgressStep('5/5 Encoding 4K WebM / MP4 stream & saving to Firestore...');
      await new Promise((r) => setTimeout(r, 700));
    } else {
      setAiProgressStep('1/5 Parsing prompt & conditioning temporal motion vectors...');
      await new Promise((r) => setTimeout(r, 800));
      setAiProgressStep('2/5 Loading ' + params.model + ' latent video checkpoints...');
      await new Promise((r) => setTimeout(r, 900));
      setAiProgressStep('3/5 Synthesizing 60fps cinematic photorealistic frames...');
      await new Promise((r) => setTimeout(r, 1100));
      setAiProgressStep('4/5 Applying neural temporal denoising & HDR color grading...');
      await new Promise((r) => setTimeout(r, 800));
      setAiProgressStep('5/5 Encoding 4K WebM / MP4 stream & saving to Firestore...');
      await new Promise((r) => setTimeout(r, 700));
    }

    // Select dynamic matching high-res sample video based on prompt keywords
    const pLower = params.prompt.toLowerCase();
    let videoUrl = SAMPLE_MEDIA_LIBRARY[1].url;
    let thumbUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop';

    if (pLower.includes('cyber') || pLower.includes('neon') || pLower.includes('tokyo') || pLower.includes('city')) {
      videoUrl = SAMPLE_MEDIA_LIBRARY[0].url;
      thumbUrl = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop';
    } else if (pLower.includes('mountain') || pLower.includes('peak') || pLower.includes('snow') || pLower.includes('drone')) {
      videoUrl = SAMPLE_MEDIA_LIBRARY[2].url;
      thumbUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';
    } else if (pLower.includes('biology') || pLower.includes('protein') || pLower.includes('dna') || pLower.includes('cell') || pLower.includes('science')) {
      videoUrl = SAMPLE_MEDIA_LIBRARY[1].url;
      thumbUrl = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop';
    }

    const genId = `ai-gen-${Date.now()}`;
    const newGen = {
      id: genId,
      prompt: params.prompt,
      model: params.model,
      timestamp: 'Just now',
      videoUrl,
      thumbnail: thumbUrl
    };

    setAiGenerations((prev) => [newGen, ...prev]);

    // Also persist to Firestore
    try {
      setDoc(doc(db, 'aiGenerations', genId), newGen).catch(() => {});
    } catch {}

    // Add to media library automatically
    const mediaItem: MediaItem = {
      id: `ai-media-${Date.now()}`,
      name: `AI: ${params.prompt.slice(0, 32)}...`,
      type: 'video',
      url: newGen.videoUrl,
      thumbnail: newGen.thumbnail,
      duration: 600.0, // 10 minutes duration as requested
      category: 'Cinematic',
      resolution: params.aspectRatio === '9:16' ? '1080 x 1920 (9:16)' : '3840 x 2160 (4K)',
      fps: 60,
      codec: isVeo ? 'Veo 3 Neural HEVC' : 'MiniMax H3 Neural MP4',
      fileSize: '1.2 GB (10m 4K UHD)'
    };

    setMediaLibrary((prev) => [mediaItem, ...prev]);
    setIsAiGenerating(false);
    setAiProgressStep('');
    showToast(`AI Video (${isVeo ? 'Veo 3 16s Preview' : 'MiniMax H3'}) generated successfully! Saved to Firestore & Media Pool.`);
  };

  const loadSampleProject = () => {
    setTimelineClips([
      {
        id: 'clip-1',
        mediaId: 'sample-1',
        trackId: 'v1',
        startTime: 0,
        duration: 8.5,
        trimStart: 0,
        name: 'Cyberpunk Metropolis Neon 4K',
        type: 'video',
        color: '#3b82f6',
        scale: 1,
        posX: 0,
        posY: 0,
        rotation: 0,
        opacity: 1,
        blendMode: 'normal',
        volume: 1,
        pan: 0
      },
      {
        id: 'clip-2',
        mediaId: 'sample-2',
        trackId: 'v1',
        startTime: 8.5,
        duration: 9.0,
        trimStart: 1.0,
        name: 'Golden Hour Coastal Drone Flight',
        type: 'video',
        color: '#06b6d4',
        scale: 1,
        posX: 0,
        posY: 0,
        rotation: 0,
        opacity: 1,
        blendMode: 'normal',
        volume: 1,
        pan: 0
      },
      {
        id: 'clip-audio-1',
        mediaId: 'sample-audio-1',
        trackId: 'a2',
        startTime: 0,
        duration: 17.5,
        trimStart: 0,
        name: 'Midnight Synth Chillwave Beat',
        type: 'audio',
        color: '#10b981',
        scale: 1,
        posX: 0,
        posY: 0,
        rotation: 0,
        opacity: 1,
        blendMode: 'normal',
        volume: 0.9,
        pan: 0
      }
    ]);
    setColorGrading(INITIAL_COLOR_GRADING);
    setFusionNodes(INITIAL_FUSION_NODES);
    setCurrentTime(0);
    showToast('Loaded Clean 4K Master Template Project');
  };

  // Open project
  const openProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setIsPlaying(false);
    setCurrentProject(proj);

    if (proj.timelineClips && proj.timelineClips.length > 0) {
      setTimelineClips(proj.timelineClips);
    } else if (proj.id === 'proj-untitled') {
      setTimelineClips([]);
    } else {
      loadSampleProject();
    }

    if (proj.colorGrading) {
      setColorGrading(proj.colorGrading);
    }
    if (proj.fusionNodes) {
      setFusionNodes(proj.fusionNodes);
    }

    setActivePage('edit');
    showToast(`Opened Project: ${proj.name}`);
  };

  // Create new project
  const createProject = (name: string, resolution = '3840 x 2160 UHD', fps = 24) => {
    const trimmedName = name.trim() || 'Untitled Project';
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: trimmedName,
      libraryId: activeLibraryId,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
      resolution,
      fps,
      duration: 0,
      modifiedAt: 'Just now',
      createdAt: 'Today',
      clipsCount: 0,
      tracksCount: 4,
      colorManaged: true,
      notes: 'New project created in Project Library',
      timelineClips: []
    };

    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    setTimelineClips([]);
    setCurrentTime(0);

    // Persist new project to Firestore
    try {
      setDoc(doc(db, 'projects', newProj.id), newProj).catch(() => {});
    } catch {}

    setActivePage('edit');
    showToast(`Created & Opened: ${newProj.name}`);
  };

  // Add project library with auto-creation of master project and instant workspace open
  const addProjectLibrary = (
    name: string,
    type: 'local' | 'network' | 'cloud',
    path: string,
    autoOpen: boolean = true,
    targetPage: StudioPage = 'media'
  ) => {
    const cleanName = name.trim() || `${type === 'cloud' ? 'Studio Cloud' : type === 'network' ? 'Studio Network' : 'Studio Local'} Library`;
    const newLibId = `lib-${Date.now()}`;
    const cleanPath = path.trim() || (
      type === 'cloud'
        ? 'https://cloud.greatediting.studio/workspace'
        : type === 'network'
        ? 'postgresql://studio:admin@192.168.1.50:5432/studio_db'
        : '/Volumes/Studio_RAID_01/Studio_Projects'
    );

    const newLib: ProjectLibrary = {
      id: newLibId,
      name: cleanName,
      type,
      path: cleanPath,
      size: '1.2 GB',
      projectCount: 1
    };

    // Initialize master project inside this library
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: `${cleanName} - Master Timeline`,
      libraryId: newLibId,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
      resolution: '3840 x 2160 UHD',
      fps: 24,
      duration: 18,
      modifiedAt: 'Just now',
      createdAt: 'Today',
      clipsCount: 3,
      tracksCount: 4,
      colorManaged: true,
      notes: `Master project in ${cleanName} (${type.toUpperCase()} Database)`,
      timelineClips: []
    };

    setProjectLibraries((prev) => [...prev, newLib]);
    setProjects((prev) => [newProj, ...prev]);
    setActiveLibraryId(newLibId);
    setCurrentProject(newProj);
    loadSampleProject();

    // Persist new library & project to Firestore
    try {
      setDoc(doc(db, 'projectLibraries', newLibId), newLib).catch(() => {});
      setDoc(doc(db, 'projects', newProj.id), newProj).catch(() => {});
    } catch {}

    if (autoOpen) {
      setActivePage(targetPage);
      showToast(`Project Library '${cleanName}' created! Opened Studio Workspace (${targetPage.toUpperCase()}).`);
    } else {
      showToast(`Project Library '${cleanName}' created`);
    }
  };

  // Reset project libraries to clean defaults
  const resetProjectLibrariesToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_LIBS);
      ['ge_project_libraries', 'ge_project_libraries_v2', 'ge_project_libraries_v3', 'davinci_project_libraries'].forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });
    } catch {}
    const defaults = INITIAL_PROJECT_LIBRARIES.map(sanitizeLibraryItem);
    setProjectLibraries(defaults);
    setActiveLibraryId('lib-local');
    showToast('Reset Project Libraries to Studio Cloud Workspace');
  };

  // Delete project
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project deleted from library');
  };

  // Duplicate project
  const duplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const duplicated: ProjectItem = {
      ...target,
      id: `proj-${Date.now()}`,
      name: `${target.name} (Copy)`,
      modifiedAt: 'Just now',
      createdAt: 'Today'
    };
    setProjects((prev) => [duplicated, ...prev]);
    showToast(`Duplicated: ${duplicated.name}`);
  };

  // Rename project
  const renameProject = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmed, modifiedAt: 'Just now' } : p))
    );
    if (currentProject.id === id) {
      setCurrentProject((prev) => ({ ...prev, name: trimmed }));
    }
    showToast(`Renamed project to: ${trimmed}`);
  };

  // Export project file (.drp JSON)
  const exportProjectFile = (id: string) => {
    const proj = projects.find((p) => p.id === id) || currentProject;
    const exportData = {
      format: 'Studio Project Archive (.drp / JSON)',
      version: '19.0.0',
      exportedAt: new Date().toISOString(),
      project: {
        ...proj,
        timelineClips,
        colorGrading,
        fusionNodes,
        audioMixer
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proj.name.replace(/[^a-z0-9]/gi, '_')}.drp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${proj.name}.drp project archive`);
  };

  // Import project file
  const importProjectFile = (imported: Partial<ProjectItem>) => {
    const importedProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: imported.name || 'Imported Studio Project',
      libraryId: activeLibraryId,
      thumbnail: imported.thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
      resolution: imported.resolution || '3840 x 2160 UHD',
      fps: imported.fps || 24,
      duration: imported.duration || 15,
      modifiedAt: 'Just now',
      createdAt: 'Today',
      clipsCount: imported.timelineClips?.length || 2,
      tracksCount: 4,
      colorManaged: true,
      notes: 'Imported from .drp project archive',
      timelineClips: imported.timelineClips || []
    };
    setProjects((prev) => [importedProj, ...prev]);
    showToast(`Imported project: ${importedProj.name}`);
  };

  // Return to Project Manager
  const returnToProjectManager = () => {
    setIsPlaying(false);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id
          ? {
              ...p,
              timelineClips,
              colorGrading,
              fusionNodes,
              audioMixer,
              modifiedAt: 'Just now',
              clipsCount: timelineClips.length
            }
          : p
      )
    );
    setActivePage('project-manager');
    showToast('Saved project and returned to Project Library');
  };

  return (
    <EditorContext.Provider
      value={{
        activePage,
        setActivePage,
        projects,
        currentProject,
        projectLibraries,
        activeLibraryId,
        setActiveLibraryId,
        openProject,
        createProject,
        addProjectLibrary,
        resetProjectLibrariesToDefault,
        deleteProject,
        duplicateProject,
        renameProject,
        exportProjectFile,
        importProjectFile,
        returnToProjectManager,
        isProjectSettingsOpen,
        setIsProjectSettingsOpen,
        mediaLibrary,
        addMediaItem,
        activeMediaPreview,
        setActiveMediaPreview,
        timelineClips,
        tracks,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        isPlaying,
        setIsPlaying,
        togglePlayPause,
        seekTo,
        selectedTool,
        setSelectedTool,
        selectedClipId,
        setSelectedClipId,
        snapEnabled,
        setSnapEnabled,
        inPoint,
        setInPoint,
        outPoint,
        setOutPoint,
        splitClipAtPlayhead,
        deleteSelectedClip,
        addClipToTimeline,
        updateClipTransform,
        toggleTrackMute,
        toggleTrackSolo,
        toggleTrackVisibility,
        colorGrading,
        updateColorGrading,
        updateColorWheel,
        resetColorGrading,
        fusionNodes,
        selectedNodeId,
        setSelectedNodeId,
        updateFusionNode,
        addFusionNode,
        removeFusionNode,
        resetFusionTree,
        audioMixer,
        updateAudioChannel,
        masterFaderDb,
        setMasterFaderDb,
        masterMuted,
        setMasterMuted,
        renderQueue,
        addRenderJob,
        startRenderJob,
        aiGenerations,
        isAiGenerating,
        aiProgressStep,
        generateAiVideoClip,
        timecode,
        toastMessage,
        showToast,
        isExportModalOpen,
        setIsExportModalOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        loadSampleProject
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
