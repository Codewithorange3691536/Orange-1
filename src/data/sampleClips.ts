import { MediaItem } from '../types/editor';

export const SAMPLE_MEDIA_LIBRARY: MediaItem[] = [
  {
    id: 'sample-1',
    name: 'Cyberpunk Metropolis Neon 4K',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    duration: 12.5,
    category: 'Cyberpunk',
    resolution: '3840 x 2160 (4K UHD)',
    fps: 60,
    codec: 'H.265 / HEVC Main 10',
    fileSize: '412 MB',
    channels: 'Stereo 48kHz 24-bit'
  },
  {
    id: 'sample-2',
    name: 'Golden Hour Coastal Drone Flight',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    duration: 15.0,
    category: 'Drone',
    resolution: '3840 x 2160 (4K UHD)',
    fps: 24,
    codec: 'Apple ProRes 422 HQ',
    fileSize: '820 MB',
    channels: '5.1 Surround 48kHz'
  },
  {
    id: 'sample-3',
    name: 'Cinematic Mountain Peak Sunset',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    duration: 15.0,
    category: 'Cinematic',
    resolution: '4096 x 2160 (DCI 4K)',
    fps: 23.976,
    codec: 'Cinema RAW 5:1',
    fileSize: '1.2 GB',
    channels: 'Stereo 96kHz'
  },
  {
    id: 'sample-4',
    name: 'Synthwave Neon Horizon Grid',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    duration: 10.0,
    category: 'Retro',
    resolution: '1920 x 1080 (FHD)',
    fps: 60,
    codec: 'H.264 / AVC High@L4.2',
    fileSize: '185 MB',
    channels: 'Stereo 48kHz'
  },
  {
    id: 'sample-5',
    name: 'Tokyo Rain Alley Night Atmosphere',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    duration: 14.2,
    category: 'Cinematic',
    resolution: '3840 x 2160 (4K)',
    fps: 30,
    codec: 'H.265 10-bit HDR',
    fileSize: '540 MB',
    channels: 'Stereo 48kHz'
  },
  {
    id: 'sample-audio-1',
    name: 'Midnight Synth Chillwave Beat',
    type: 'audio',
    url: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    duration: 18.0,
    category: 'Audio',
    codec: 'WAV PCM Uncompressed',
    fileSize: '42 MB',
    channels: 'Stereo 48kHz 24-bit'
  },
  {
    id: 'sample-audio-2',
    name: 'Cinematic Sub Bass Whoosh Impact',
    type: 'audio',
    url: 'https://actions.google.com/sounds/v1/science_fiction/teleport_whoosh.ogg',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    duration: 4.5,
    category: 'Sound FX',
    codec: 'Broadcast WAV (BWF)',
    fileSize: '12 MB',
    channels: 'Stereo 96kHz'
  }
];

export const LUT_PRESETS = [
  { id: 'none', name: 'Rec.709 Standard', description: 'Clean broadcast standard color profile', filter: 'none' },
  { id: 'teal_orange', name: 'Teal & Orange Hollywood', description: 'Blockbuster cinema split-tone grading', filter: 'contrast(1.15) saturate(1.2) hue-rotate(-10deg) sepia(0.2)' },
  { id: 'kodak_2383', name: 'Kodak 2383 Film Print', description: 'Legendary 35mm motion picture stock', filter: 'contrast(1.2) saturate(1.1) sepia(0.25) brightness(0.95)' },
  { id: 'cyberpunk_2077', name: 'Cyberpunk Neon 2077', description: 'Hyper-vibrant violet & electric cyan', filter: 'contrast(1.3) saturate(1.6) hue-rotate(35deg)' },
  { id: 'golden_hour', name: 'Golden Hour Warmth', description: 'Rich amber sunlight with soft roll-off', filter: 'contrast(1.08) saturate(1.25) sepia(0.35) brightness(1.05)' },
  { id: 'bleach_bypass', name: 'Bleach Bypass Thriller', description: 'High contrast silver retention film look', filter: 'contrast(1.45) saturate(0.55) brightness(0.9)' },
  { id: 'monochrome_noir', name: 'Monochrome Film Noir', description: 'Deep inky shadows and specular grain', filter: 'grayscale(1) contrast(1.4) brightness(0.92)' },
  { id: 'vintage_super8', name: 'Vintage Super 8 Grain', description: '1970s analog warmth with organic softness', filter: 'sepia(0.4) contrast(1.1) saturate(1.1) hue-rotate(-15deg)' }
] as const;

export const SOUND_FX_LIBRARY = [
  { id: 'sfx-1', name: 'Sub Boom Hit 808', duration: '2.4s', category: 'Impact', type: 'impact' },
  { id: 'sfx-2', name: 'Cinematic Whoosh Transition', duration: '1.8s', category: 'Transition', type: 'whoosh' },
  { id: 'sfx-3', name: 'Tape Glitch & Rewind', duration: '1.2s', category: 'Glitch', type: 'glitch' },
  { id: 'sfx-4', name: 'Camera Shutter Mechanical', duration: '0.6s', category: 'Foley', type: 'foley' },
  { id: 'sfx-5', name: 'Dark Drone Atmosphere', duration: '8.0s', category: 'Ambience', type: 'ambience' },
  { id: 'sfx-6', name: 'Laser Zap Sci-Fi Blast', duration: '1.5s', category: 'Sci-Fi', type: 'scifi' }
];

export const INITIAL_PROJECT_LIBRARIES = [
  {
    id: 'lib-local',
    name: 'Local Database',
    type: 'local' as const,
    path: '/Users/Studio/Library/Great Editing/Project Library',
    size: '2.8 GB',
    projectCount: 5,
    isDefault: true
  },
  {
    id: 'lib-fast-raid',
    name: 'RAID 01 Fast Master',
    type: 'local' as const,
    path: '/Volumes/Studio_RAID_01/Studio_Projects',
    size: '18.4 GB',
    projectCount: 3
  },
  {
    id: 'lib-cloud',
    name: 'Studio Cloud Workspace',
    type: 'cloud' as const,
    path: 'cloud.greatediting.studio/team-workspace',
    size: 'Synced (Ultra Speed)',
    projectCount: 2
  },
  {
    id: 'lib-network',
    name: 'PostgreSQL Post Server',
    type: 'network' as const,
    path: '192.168.1.140:5432/studio_master_db',
    size: 'Multi-User Network',
    projectCount: 1
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-untitled',
    name: 'Untitled Project',
    libraryId: 'lib-local',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    resolution: '3840 x 2160 UHD',
    fps: 24,
    duration: 0,
    modifiedAt: 'Just now',
    createdAt: 'Today',
    clipsCount: 0,
    tracksCount: 4,
    notes: 'Blank studio project ready for media ingest'
  },
  {
    id: 'proj-cyberpunk',
    name: 'Cyberpunk 2077 Film Trailer',
    libraryId: 'lib-local',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    resolution: '3840 x 2160 UHD',
    fps: 24,
    duration: 25.5,
    modifiedAt: 'Today 11:42 AM',
    createdAt: 'Yesterday',
    clipsCount: 4,
    tracksCount: 4,
    colorManaged: true,
    notes: 'Teal & Orange 4K Master with Neon Fusion Titles'
  },
  {
    id: 'proj-drone-reel',
    name: 'Coastal Aerial 4K Drone Reel',
    libraryId: 'lib-local',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    resolution: '3840 x 2160 UHD',
    fps: 60,
    duration: 15.0,
    modifiedAt: 'Yesterday 04:15 PM',
    createdAt: '2 days ago',
    clipsCount: 3,
    tracksCount: 4,
    colorManaged: true,
    notes: 'Cinematic golden hour Pacific coastline flight'
  },
  {
    id: 'proj-tokyo-noir',
    name: 'Tokyo Rain Alley Night Atmosphere',
    libraryId: 'lib-local',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    resolution: '3840 x 2160 UHD',
    fps: 24,
    duration: 14.2,
    modifiedAt: 'Oct 12, 2026',
    createdAt: 'Oct 10, 2026',
    clipsCount: 2,
    tracksCount: 4,
    colorManaged: true,
    notes: 'Kodak 2383 35mm film emulation with rain foley'
  },
  {
    id: 'proj-synthwave',
    name: 'Synthwave Neon Horizon Grid',
    libraryId: 'lib-local',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    resolution: '1920 x 1080 FHD',
    fps: 29.97,
    duration: 10.0,
    modifiedAt: 'Oct 11, 2026',
    createdAt: 'Oct 09, 2026',
    clipsCount: 3,
    tracksCount: 4,
    colorManaged: false,
    notes: 'Retro analog VHS glitch with 80s synth chords'
  },
  {
    id: 'proj-vertical-reels',
    name: 'Viral 9:16 Vertical Reel',
    libraryId: 'lib-fast-raid',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    resolution: '1080 x 1920 Vertical',
    fps: 30,
    duration: 15.0,
    modifiedAt: 'Oct 08, 2026',
    createdAt: 'Oct 08, 2026',
    clipsCount: 3,
    tracksCount: 4,
    colorManaged: true,
    notes: 'Mobile vertical edit with punchy transitions'
  }
];

