export type StudioPage = 'project-manager' | 'media' | 'edit' | 'fusion' | 'colour' | 'fairlight' | 'delivery' | 'ai';

export interface ProjectSettings {
  timelineResolution: string; // '3840x2160' | '1920x1080' | '1080x1920' | '4096x2160'
  fps: number; // 24, 29.97, 30, 60
  colorScience: 'Studio YRGB Color Managed' | 'Studio YRGB' | 'ACEScc' | 'Rec.709 Scene';
  workingColorSpace: string;
  playbackFramerate: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  libraryId: string;
  folderId?: string;
  thumbnail: string;
  resolution: string;
  fps: number;
  duration: number; // seconds
  modifiedAt: string;
  createdAt: string;
  clipsCount: number;
  tracksCount: number;
  colorManaged?: boolean;
  notes?: string;
  // Saved project state
  timelineClips?: TimelineClip[];
  mediaLibrary?: MediaItem[];
  colorGrading?: ColorGradingSettings;
  fusionNodes?: FusionNode[];
  audioMixer?: AudioChannelStrip[];
}

export interface ProjectLibrary {
  id: string;
  name: string;
  type: 'local' | 'network' | 'cloud';
  path: string;
  size: string;
  projectCount: number;
  isDefault?: boolean;
}

export type MediaType = 'video' | 'audio' | 'image';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  duration: number; // in seconds
  thumbnail: string;
  category: 'Cinematic' | 'Cyberpunk' | 'Drone' | 'Retro' | 'Audio' | 'Sound FX' | 'Imported';
  resolution?: string;
  fps?: number;
  codec?: string;
  fileSize?: string;
  channels?: string;
}

export interface TimelineClip {
  id: string;
  mediaId: string;
  trackId: string;
  startTime: number; // in seconds on timeline
  duration: number; // duration on timeline
  trimStart: number; // offset in source
  name: string;
  type: MediaType;
  color: string;
  // Transform & composite settings
  scale: number;
  posX: number;
  posY: number;
  rotation: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'lighten';
  // Audio settings
  volume: number; // 0 - 2
  pan: number; // -1 to 1
  muted?: boolean;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio';
  visible: boolean;
  muted: boolean;
  solo: boolean;
  height: number;
}

export interface FusionNode {
  id: string;
  type: 'mediaIn' | 'textPlus' | 'blur' | 'glow' | 'chroma' | 'colorGrade' | 'transform' | 'merge' | 'mediaOut';
  title: string;
  x: number;
  y: number;
  color: string;
  inputs: string[];
  outputs: string[];
  params: {
    text?: string;
    fontSize?: number;
    textColor?: string;
    blurRadius?: number;
    glowIntensity?: number;
    glowRadius?: number;
    chromaColor?: string;
    tolerance?: number;
    scale?: number;
    posX?: number;
    posY?: number;
    contrast?: number;
  };
}

export interface ColorGradingSettings {
  lift: { r: number; g: number; b: number; y: number }; // Shadows
  gamma: { r: number; g: number; b: number; y: number }; // Midtones
  gain: { r: number; g: number; b: number; y: number }; // Highlights
  offset: { r: number; g: number; b: number; y: number }; // Overall
  contrast: number; // 0 - 200, default 100
  pivot: number; // 0 - 100, default 50
  saturation: number; // 0 - 200, default 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  activeLut: 'none' | 'teal_orange' | 'kodak_2383' | 'cyberpunk_2077' | 'golden_hour' | 'bleach_bypass' | 'monochrome_noir' | 'vintage_super8';
}

export interface AudioChannelStrip {
  trackId: string;
  name: string;
  faderDb: number; // -60 to +12
  pan: number; // -100 to 100
  mute: boolean;
  solo: boolean;
  recordArm: boolean;
  eq: {
    lowCutHz: number;
    lowMidGain: number; // dB
    highMidGain: number; // dB
    highShelfGain: number; // dB
    enabled: boolean;
  };
  dynamics: {
    compressor: boolean;
    compThreshold: number; // dB
    compRatio: number;
    limiter: boolean;
  };
}

export interface RenderJob {
  id: string;
  name: string;
  format: 'mp4' | 'webm' | 'mov';
  resolution: string;
  fps: number;
  bitrate: string;
  preset: string;
  progress: number; // 0 - 100
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  downloadUrl?: string;
  sizeEstimate?: string;
}

export interface AiVideoGeneration {
  prompt: string;
  model: 'Veo 3 (veo-3.1-fast-generate-preview)' | 'MiniMax Hailuo H3 Ultra' | 'Sora Video Engine 2' | 'Luma Dream Machine' | 'Runway Gen-3 Alpha';
  cameraMotion: 'Orbit Drone' | 'FPV Dive' | 'Pan Left' | 'Pan Right' | 'Zoom In' | 'Static Studio';
  aspectRatio: '16:9' | '9:16' | '2.39:1';
  style?: string;
}
