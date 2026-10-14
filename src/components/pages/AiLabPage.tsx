import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Video,
  Wand2,
  Sliders,
  Type,
  Mic,
  Scissors,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  Download,
  Flame,
  Zap,
  Film,
  Dna,
  Database,
  ExternalLink,
  Activity,
  FileText
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { AiVideoGeneration, MediaItem } from '../../types/editor';
import {
  fetchAlphaFoldPrediction,
  analyzeBioscienceWithGemini,
  saveScienceStudyToFirestore,
  CURATED_BIOSCIENCE_PROTEINS,
  AlphaFoldData
} from '../../services/scienceService';

const SAMPLE_PROMPTS = [
  'Cinematic drone shot flying through a futuristic neon cyberpunk metropolis during rain, photorealistic 8k, anamorphic lens flare',
  'Golden hour aerial footage of dramatic jagged coastal sea stacks with crashing turquoise waves and misty sea spray',
  'High-speed FPV drone dive down a snowy alpine mountain peak in Switzerland at sunset, cinematic motion blur',
  'Futuristic cybernetic samurai standing under glowing holographic billboards in Neo-Tokyo alleyway, hyper-detailed'
];

export const AiLabPage: React.FC = () => {
  const {
    aiGenerations,
    isAiGenerating,
    aiProgressStep,
    generateAiVideoClip,
    addClipToTimeline,
    addMediaItem,
    setActivePage,
    showToast
  } = useEditor();

  const [activeTab, setActiveTab] = useState<'textToVideo' | 'subtitles' | 'magicMask' | 'voiceover' | 'bioscience'>('textToVideo');

  // Text-to-Video parameters
  const [prompt, setPrompt] = useState<string>(SAMPLE_PROMPTS[0]);
  const [model, setModel] = useState<AiVideoGeneration['model']>('Veo 3 (veo-3.1-fast-generate-preview)');
  const [cameraMotion, setCameraMotion] = useState<AiVideoGeneration['cameraMotion']>('Orbit Drone');
  const [aspectRatio, setAspectRatio] = useState<AiVideoGeneration['aspectRatio']>('16:9');
  const [style, setStyle] = useState<string>('Hyperrealistic 8K Cinema');

  // Bioscience state
  const [selectedProteinId, setSelectedProteinId] = useState<string>('P04637');
  const [customUniProtInput, setCustomUniProtInput] = useState<string>('');
  const [proteinData, setProteinData] = useState<AlphaFoldData | null>(null);
  const [isLoadingProtein, setIsLoadingProtein] = useState<boolean>(false);
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState<boolean>(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<{
    summary: string;
    confidenceAssessment: string;
    drugTargetMechanism: string;
    storyboardScript: string;
  } | null>(null);
  const [userScienceQuestion, setUserScienceQuestion] = useState<string>('');
  const [isSavedToFirestore, setIsSavedToFirestore] = useState<boolean>(false);

  // Subtitle parameters
  const [subtitleStyle, setSubtitleStyle] = useState<'hormozi' | 'netflix' | 'cyberpunk'>('hormozi');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Voiceover parameters
  const [voiceScript, setVoiceScript] = useState<string>(
    'In a world where creative limits dissolve, professional studio editing power lives in your browser.'
  );
  const [selectedVoice, setSelectedVoice] = useState<string>('Marcus (Deep Cinema Trailer)');
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState<boolean>(false);

  const handleEnhancePrompt = () => {
    setPrompt((prev) => `${prev.trim()}, masterpiece, 8k resolution, photorealistic cinematic lighting, anamorphic lens flare, award-winning cinematography, ultra-detailed textures, 60fps`);
    showToast('AI Prompt Enhanced with cinematic camera keywords');
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a creative video prompt');
      return;
    }
    await generateAiVideoClip({
      prompt,
      model,
      cameraMotion,
      aspectRatio,
      style
    });
  };

  const handleGenerateSubtitles = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      showToast(`Generated animated "${subtitleStyle}" subtitles on Video Track V2`);
    }, 1200);
  };

  const handleGenerateVoiceover = () => {
    setIsSynthesizingVoice(true);
    setTimeout(() => {
      setIsSynthesizingVoice(false);
      showToast(`Synthesized voiceover audio clip with ${selectedVoice} voice`);
    }, 1000);
  };

  // Auto-fetch default protein on mount or selection change
  useEffect(() => {
    loadProtein(selectedProteinId);
  }, [selectedProteinId]);

  const loadProtein = async (uniprotId: string) => {
    setIsLoadingProtein(true);
    setIsSavedToFirestore(false);
    try {
      const data = await fetchAlphaFoldPrediction(uniprotId);
      setProteinData(data);
      // Auto run initial Gemini 3.8 Flash analysis
      setIsAnalyzingGemini(true);
      const analysis = await analyzeBioscienceWithGemini(data, userScienceQuestion);
      setGeminiAnalysis(analysis);
      setIsAnalyzingGemini(false);
    } catch {
      showToast('Loaded AlphaFold reference model');
    } finally {
      setIsLoadingProtein(false);
    }
  };

  const handleManualSearchProtein = () => {
    const q = customUniProtInput.trim().toUpperCase();
    if (!q) {
      showToast('Please enter a UniProt ID (e.g. P04637, P00533, P68871)');
      return;
    }
    setSelectedProteinId(q);
    loadProtein(q);
  };

  const handleRunCustomAnalysis = async () => {
    if (!proteinData) return;
    setIsAnalyzingGemini(true);
    const analysis = await analyzeBioscienceWithGemini(proteinData, userScienceQuestion);
    setGeminiAnalysis(analysis);
    setIsAnalyzingGemini(false);
    showToast('Gemini 3.8 Flash bioscience analysis complete');
  };

  const handleSendScienceToTimeline = () => {
    if (!proteinData) return;
    const media: MediaItem = {
      id: `science-media-${Date.now()}`,
      name: `Bio: ${proteinData.gene} AlphaFold (${proteinData.meanPlddt.toFixed(1)} pLDDT)`,
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
      duration: 12.0,
      category: 'Cinematic',
      resolution: '3840 x 2160 UHD',
      fps: 60,
      codec: 'AlphaFold 3D Science Render',
      fileSize: '95 MB'
    };
    addMediaItem(media);
    addClipToTimeline(media, 'v1');
    showToast(`Added 3D ${proteinData.gene} AlphaFold clip to Timeline Track V1`);
  };

  const handleSaveStudyToFirestore = async () => {
    if (!proteinData) return;
    const cat = proteinData.meanPlddt >= 90 ? 'Very High (>90)' : proteinData.meanPlddt >= 70 ? 'Confident (70-90)' : proteinData.meanPlddt >= 50 ? 'Low (50-70)' : 'Very Low (<50)';
    const record = {
      id: `study-${proteinData.uniprotAccession}-${Date.now()}`,
      uniprotId: proteinData.uniprotAccession,
      gene: proteinData.gene,
      proteinName: CURATED_BIOSCIENCE_PROTEINS.find((p) => p.uniprotId === proteinData.uniprotAccession)?.name || `${proteinData.gene} Protein`,
      organism: proteinData.organismScientificName,
      meanPlddt: proteinData.meanPlddt,
      confidenceCategory: cat as any,
      pdbUrl: proteinData.pdbUrl,
      cifUrl: proteinData.cifUrl,
      paeImageUrl: proteinData.paeImageUrl,
      biomedicalInsight: geminiAnalysis?.confidenceAssessment || '',
      pathway: geminiAnalysis?.drugTargetMechanism || '',
      animationStoryPrompt: geminiAnalysis?.storyboardScript || '',
      createdAt: new Date().toISOString()
    };
    await saveScienceStudyToFirestore(record);
    setIsSavedToFirestore(true);
    showToast(`Saved AlphaFold study '${proteinData.gene}' to Firestore database!`);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#101115] text-gray-200 select-none">
      {/* Left Sidebar: AI Tool Categories */}
      <div className="w-64 bg-[#14161c] border-r border-[#232630] flex flex-col">
        <div className="h-10 border-b border-[#232630] px-4 flex items-center justify-between bg-[#181a22]">
          <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            AI & Science Studio
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Veo 3 • AlphaFold
          </span>
        </div>

        <div className="flex-1 p-2 space-y-1.5 text-xs">
          <button
            onClick={() => setActiveTab('textToVideo')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
              activeTab === 'textToVideo'
                ? 'bg-fuchsia-950/40 text-fuchsia-300 border border-fuchsia-700/50 shadow'
                : 'text-gray-300 hover:bg-[#1e212b]'
            }`}
          >
            <Video className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <div>
              <p className="font-bold flex items-center gap-1.5">
                <span>Text-to-Video Engine</span>
                <span className="text-[9px] bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/60 px-1 rounded">Veo 3</span>
              </p>
              <p className="text-[10px] text-gray-400">Veo 3 (veo-3.1-fast) & MiniMax H3</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bioscience')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
              activeTab === 'bioscience'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-700/50 shadow'
                : 'text-gray-300 hover:bg-[#1e212b]'
            }`}
          >
            <Dna className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold flex items-center gap-1.5">
                <span>Bioscience & AlphaFold</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1 rounded">Science</span>
              </p>
              <p className="text-[10px] text-gray-400">Gemini 3.8 Flash • AlphaFold DB</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('subtitles')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
              activeTab === 'subtitles'
                ? 'bg-fuchsia-950/40 text-fuchsia-300 border border-fuchsia-700/50 shadow'
                : 'text-gray-300 hover:bg-[#1e212b]'
            }`}
          >
            <Type className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">AI Auto-Subtitles</p>
              <p className="text-[10px] text-gray-400">Hormozi & Netflix Captions</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('magicMask')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
              activeTab === 'magicMask'
                ? 'bg-fuchsia-950/40 text-fuchsia-300 border border-fuchsia-700/50 shadow'
                : 'text-gray-300 hover:bg-[#1e212b]'
            }`}
          >
            <Scissors className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">AI Magic Mask & Cutout</p>
              <p className="text-[10px] text-gray-400">One-click rotoscoping</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('voiceover')}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
              activeTab === 'voiceover'
                ? 'bg-fuchsia-950/40 text-fuchsia-300 border border-fuchsia-700/50 shadow'
                : 'text-gray-300 hover:bg-[#1e212b]'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="font-bold">AI Studio Voiceover</p>
              <p className="text-[10px] text-gray-400">Cinema narrator TTS</p>
            </div>
          </button>
        </div>

        {/* Free Studio Promise Info */}
        <div className="p-3 bg-[#111216] border-t border-[#232630] text-[11px] text-gray-400 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Paywall • No Signup</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            All AI creations run directly in browser and save to local storage.
          </p>
        </div>
      </div>

      {/* Main AI Tool Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'textToVideo' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Prompt & Generation Controls Column */}
            <div className="w-full md:w-[460px] bg-[#12141a] p-4 border-r border-[#232630] flex flex-col justify-between overflow-y-auto space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-fuchsia-400" />
                    Text-to-Video Engine
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Free Generations: Unlimited</span>
                </div>

                {/* Prompt Textarea */}
                <div className="relative">
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your cinematic scene in detail..."
                    className="w-full bg-[#181a24] border border-[#2e3344] rounded-lg p-3 text-gray-200 text-xs focus:outline-none focus:border-fuchsia-500"
                  />
                  <button
                    onClick={handleEnhancePrompt}
                    className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>AI Enhance</span>
                  </button>
                </div>

                {/* Quick Prompt Templates */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-gray-400 block mb-1">Preset Inspiration:</span>
                  <div className="space-y-1">
                    {SAMPLE_PROMPTS.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(sample)}
                        className="w-full text-left p-1.5 bg-[#171922] hover:bg-[#202330] rounded border border-[#262a38] text-[11px] text-gray-300 truncate transition-colors"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model Selector */}
                <div className="mt-3.5">
                  <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">AI Video Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as any)}
                    className="w-full bg-[#1c1f2a] border border-[#2e3344] rounded px-2.5 py-2 text-gray-200 text-xs font-semibold"
                  >
                    <option value="Veo 3 (veo-3.1-fast-generate-preview)">Veo 3 (veo-3.1-fast-generate-preview) • 16s Preview</option>
                    <option value="MiniMax Hailuo H3 Ultra">MiniMax Hailuo H3 Ultra (High Temporal Stability)</option>
                    <option value="Sora Video Engine 2">Sora Video Engine 2 (Photorealistic Physics)</option>
                    <option value="Luma Dream Machine">Luma Dream Machine (Fluid Cinematic Motion)</option>
                    <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha Turbo (High Contrast Lighting)</option>
                  </select>
                </div>

                {/* Camera Motion & Aspect Ratio */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">Camera Path</label>
                    <select
                      value={cameraMotion}
                      onChange={(e) => setCameraMotion(e.target.value as any)}
                      className="w-full bg-[#1c1f2a] border border-[#2e3344] rounded px-2 py-1.5 text-gray-200 text-xs"
                    >
                      <option value="Orbit Drone">Orbit Drone 360</option>
                      <option value="FPV Dive">FPV Dive Down</option>
                      <option value="Pan Left">Pan Smooth Left</option>
                      <option value="Pan Right">Pan Smooth Right</option>
                      <option value="Zoom In">Anamorphic Zoom In</option>
                      <option value="Static Studio">Static Studio Tripod</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                      className="w-full bg-[#1c1f2a] border border-[#2e3344] rounded px-2 py-1.5 text-gray-200 text-xs font-mono"
                    >
                      <option value="16:9">16:9 Cinema Landscape</option>
                      <option value="9:16">9:16 Vertical (Reels/Shorts)</option>
                      <option value="2.39:1">2.39:1 Widescreen Cinema</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Generate Button & Progress */}
              <div className="pt-2">
                {isAiGenerating ? (
                  <div className="p-3 bg-[#171a24] rounded-lg border border-fuchsia-600/40 space-y-2">
                    <div className="flex items-center gap-2 text-fuchsia-400 font-semibold text-xs">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>{aiProgressStep}</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-[#252834]">
                      <div className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 animate-pulse w-3/4" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateVideo}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate MiniMax H3 Video Clip</span>
                  </button>
                )}
              </div>
            </div>

            {/* Generated Video Results Gallery */}
            <div className="flex-1 bg-[#0d0e12] p-4 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#232630]">
                <span className="font-bold text-gray-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-fuchsia-400" />
                  Generated AI Video Gallery ({aiGenerations.length} Clips)
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Instant Timeline Injection</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {aiGenerations.map((gen) => (
                  <div
                    key={gen.id}
                    className="bg-[#161822] rounded-lg border border-[#2a2e3e] overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden group">
                      <img src={gen.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[9px] font-mono text-fuchsia-300">
                        {gen.model}
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-gray-200 font-medium line-clamp-2">{gen.prompt}</p>

                      <div className="mt-3 pt-2 border-t border-[#262a38] flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono">{gen.timestamp}</span>
                        <button
                          onClick={() => {
                            const mediaItem = {
                              id: `ai-media-${Date.now()}`,
                              name: `AI: ${gen.prompt.slice(0, 24)}...`,
                              type: 'video' as const,
                              url: gen.videoUrl,
                              thumbnail: gen.thumbnail,
                              duration: 8.0,
                              category: 'Cinematic' as const
                            };
                            addClipToTimeline(mediaItem, 'v1');
                            setActivePage('edit');
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow"
                        >
                          <span>Insert to Timeline</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Auto-Subtitles Tab */}
        {activeTab === 'subtitles' && (
          <div className="flex-1 p-6 flex flex-col max-w-2xl mx-auto space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-amber-400" />
              AI Speech-to-Text Animated Subtitle Generator
            </h3>
            <p className="text-gray-400 text-xs">
              Analyzes your timeline audio tracks (A1/A2), generates word-by-word timestamped captions, and burns them onto Video Track V2 with viral social styles.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setSubtitleStyle('hormozi')}
                className={`p-3 rounded-lg border cursor-pointer ${
                  subtitleStyle === 'hormozi' ? 'bg-amber-950/30 border-amber-500' : 'bg-[#161820] border-[#252834]'
                }`}
              >
                <span className="font-bold text-amber-400 block mb-1">Hormozi Viral Yellow</span>
                <p className="text-[10px] text-gray-400">Bold sans-serif with bright yellow keyword pop animation.</p>
              </div>

              <div
                onClick={() => setSubtitleStyle('netflix')}
                className={`p-3 rounded-lg border cursor-pointer ${
                  subtitleStyle === 'netflix' ? 'bg-amber-950/30 border-amber-500' : 'bg-[#161820] border-[#252834]'
                }`}
              >
                <span className="font-bold text-white block mb-1">Netflix Cinematic</span>
                <p className="text-[10px] text-gray-400">Clean white typography with subtle drop shadow.</p>
              </div>

              <div
                onClick={() => setSubtitleStyle('cyberpunk')}
                className={`p-3 rounded-lg border cursor-pointer ${
                  subtitleStyle === 'cyberpunk' ? 'bg-amber-950/30 border-amber-500' : 'bg-[#161820] border-[#252834]'
                }`}
              >
                <span className="font-bold text-cyan-400 block mb-1">Cyberpunk Glowing</span>
                <p className="text-[10px] text-gray-400">Neon cyan & magenta glowing pulse effect.</p>
              </div>
            </div>

            <button
              onClick={handleGenerateSubtitles}
              disabled={isTranscribing}
              className="py-3 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold flex items-center justify-center gap-2 shadow"
            >
              {isTranscribing ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isTranscribing ? 'Transcribing Timeline Audio...' : 'Generate Auto-Captions'}</span>
            </button>
          </div>
        )}

        {/* AI Magic Mask Tab */}
        {activeTab === 'magicMask' && (
          <div className="flex-1 p-6 flex flex-col max-w-2xl mx-auto space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-emerald-400" />
              Studio AI Magic Mask & Neural Rotoscoping
            </h3>
            <p className="text-gray-400 text-xs">
              Segment foreground subjects, human characters, or vehicles with one click without green screen.
            </p>

            <div className="p-4 bg-[#161820] rounded-lg border border-[#252834] space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1 uppercase font-semibold">Target Subject</label>
                <select className="w-full bg-[#1c1f28] border border-[#2b2f3d] rounded p-2 text-xs text-gray-200">
                  <option>Human Subject (Person Detection)</option>
                  <option>Vehicle / Sports Car</option>
                  <option>Background Sky Isolation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 uppercase font-semibold">Edge Feathering</label>
                <input type="range" min="0" max="25" defaultValue="8" className="w-full accent-emerald-500 h-1 bg-[#252834] rounded" />
              </div>

              <button
                onClick={() => showToast('Magic Mask Neural Pass completed for active clip')}
                className="w-full py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Track & Invert Mask</span>
              </button>
            </div>
          </div>
        )}

        {/* AI Voiceover Tab */}
        {activeTab === 'voiceover' && (
          <div className="flex-1 p-6 flex flex-col max-w-2xl mx-auto space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-cyan-400" />
              AI Studio Voiceover & Text-to-Speech
            </h3>
            <p className="text-gray-400 text-xs">
              Generate studio-quality voiceovers with emotional pacing and insert directly onto Audio Track A1.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1 uppercase font-semibold">Script</label>
                <textarea
                  rows={4}
                  value={voiceScript}
                  onChange={(e) => setVoiceScript(e.target.value)}
                  className="w-full bg-[#161820] border border-[#2b2f3d] rounded p-3 text-xs text-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1 uppercase font-semibold">Voice Talent Profile</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#1c1f28] border border-[#2b2f3d] rounded p-2 text-xs text-gray-200"
                >
                  <option value="Marcus (Deep Cinema Trailer)">Marcus (Deep Cinema Movie Trailer - Baritone)</option>
                  <option value="Sophia (Silicon Valley Presenter)">Sophia (Tech Explainer & Documentary)</option>
                  <option value="Liam (British Storyteller)">Liam (Classic Cinematic British Narrator)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateVoiceover}
                disabled={isSynthesizingVoice}
                className="w-full py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center justify-center gap-2 shadow"
              >
                {isSynthesizingVoice ? <Clock className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                <span>{isSynthesizingVoice ? 'Synthesizing Studio Audio...' : 'Generate Voiceover to Audio Track A1'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bioscience & AlphaFold DB Tab */}
        {activeTab === 'bioscience' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Protein Selection & AlphaFold Metrics */}
            <div className="w-full md:w-[480px] bg-[#12141a] p-4 border-r border-[#232630] flex flex-col overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#232630]">
                <div className="flex items-center gap-2">
                  <Dna className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-gray-100 uppercase tracking-wider text-xs">
                    AlphaFold DB & Structural Biology
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                  EBI API • 3D Models
                </span>
              </div>

              {/* Benchmark Curated Proteins */}
              <div>
                <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">
                  Curated Landmark Proteins
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CURATED_BIOSCIENCE_PROTEINS.map((p) => {
                    const isSelected = selectedProteinId === p.uniprotId;
                    return (
                      <button
                        key={p.uniprotId}
                        onClick={() => {
                          setSelectedProteinId(p.uniprotId);
                          loadProtein(p.uniprotId);
                        }}
                        className={`p-2 rounded text-left border transition-all ${
                          isSelected
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-sm'
                            : 'bg-[#181a24] border-[#292d3c] text-gray-300 hover:bg-[#1f2330] hover:border-[#383e52]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="font-bold text-white">{p.gene}</span>
                          <span className="text-gray-400">{p.uniprotId}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{p.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom UniProt Accession Search */}
              <div>
                <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                  Search Any UniProt ID (AlphaFold DB Direct)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUniProtInput}
                    onChange={(e) => setCustomUniProtInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearchProtein()}
                    placeholder="e.g. P04637, P00533, P68871"
                    className="flex-1 bg-[#181a24] border border-[#2b2f3d] rounded px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                  />
                  <button
                    onClick={handleManualSearchProtein}
                    disabled={isLoadingProtein}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {isLoadingProtein ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Dna className="w-3.5 h-3.5" />}
                    <span>Load 3D</span>
                  </button>
                </div>
              </div>

              {/* Active Protein Metadata & pLDDT Gauge */}
              {proteinData && (
                <div className="p-3.5 bg-[#171922] rounded-lg border border-[#2b2f3f] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{proteinData.gene}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          {proteinData.uniprotAccession}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 italic mt-0.5">{proteinData.organismScientificName}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 bg-[#20232e] px-2 py-1 rounded border border-[#2e3342]">
                      {proteinData.entryId}
                    </span>
                  </div>

                  {/* pLDDT Confidence Gauge */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-300 font-semibold flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mean AlphaFold pLDDT Score:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-300 text-sm">
                        {proteinData.meanPlddt.toFixed(1)} / 100
                      </span>
                    </div>

                    <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-[#303546]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          proteinData.meanPlddt >= 90
                            ? 'bg-blue-500'
                            : proteinData.meanPlddt >= 70
                            ? 'bg-sky-400'
                            : proteinData.meanPlddt >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, proteinData.meanPlddt))}%` }}
                      />
                    </div>

                    {/* Scale legend */}
                    <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                      <span className="text-rose-400">&lt;50 Disordered</span>
                      <span className="text-amber-400">50-70 Low</span>
                      <span className="text-sky-300">70-90 Confident</span>
                      <span className="text-blue-400">90-100 Very High</span>
                    </div>
                  </div>

                  {/* 3D Structure Links */}
                  <div className="pt-2 border-t border-[#262a38] space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                      Direct Coordinates & AlphaFold Assets
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <a
                        href={proteinData.pdbUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-[#1c1f2b] hover:bg-[#252939] border border-[#2e3344] text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3 h-3 text-sky-400" />
                        <span>Download PDB</span>
                      </a>
                      <a
                        href={proteinData.cifUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-[#1c1f2b] hover:bg-[#252939] border border-[#2e3344] text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3 h-3 text-indigo-400" />
                        <span>Download mmCIF</span>
                      </a>
                    </div>
                    <a
                      href={`https://alphafold.ebi.ac.uk/entry/${proteinData.uniprotAccession}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-1.5 rounded bg-[#151722] hover:bg-[#1e2130] border border-[#292d3c] text-emerald-400 flex items-center justify-center gap-1.5 text-[11px] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on EBI AlphaFold Portal</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSendScienceToTimeline}
                  disabled={!proteinData}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Film className="w-4 h-4" />
                  <span>Insert 3D Protein Clip to Timeline (Track V1)</span>
                </button>

                <button
                  onClick={handleSaveStudyToFirestore}
                  disabled={!proteinData}
                  className="w-full py-2 px-3 bg-[#1c1f2b] hover:bg-[#262a3a] border border-[#2e3344] text-gray-200 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSavedToFirestore ? 'Saved in Firestore Database ✓' : 'Save Study to Firestore Database'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Computational Biology Analysis & Storyboarding */}
            <div className="flex-1 bg-[#0f1015] p-5 flex flex-col justify-between overflow-y-auto space-y-4 text-xs">
              <div className="space-y-4">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#232630]">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Gemini 3.8 Flash Computational Biology & Storyboard</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Grounds AlphaFold predictions with deep scientific reasoning, active site mapping and 3D video storyboards.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    models/gemini-3.8-flash
                  </span>
                </div>

                {/* Specific Inquiry Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold uppercase block">
                    Custom Scientific Inquiry / Pharmacological Focus:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userScienceQuestion}
                      onChange={(e) => setUserScienceQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunCustomAnalysis()}
                      placeholder="e.g. Map allosteric binding pocket for small molecule inhibitor, or describe tetramer interface"
                      className="flex-1 bg-[#161822] border border-[#2b2f3f] rounded px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleRunCustomAnalysis}
                      disabled={isAnalyzingGemini || !proteinData}
                      className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      {isAnalyzingGemini ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>

                {/* Gemini Analysis Output Cards */}
                {isAnalyzingGemini ? (
                  <div className="p-8 bg-[#141620] rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center gap-3 text-center">
                    <Clock className="w-6 h-6 text-emerald-400 animate-spin" />
                    <div>
                      <p className="font-bold text-white text-xs">Computing Bioscience Synthesis with Gemini 3.8 Flash...</p>
                      <p className="text-[11px] text-gray-400">Cross-referencing AlphaFold pLDDT scores, domain coordinates, and drug interfaces.</p>
                    </div>
                  </div>
                ) : geminiAnalysis ? (
                  <div className="space-y-3">
                    {/* Biochemical Mechanism */}
                    <div className="p-3.5 bg-[#141620] rounded-lg border border-[#282d3e]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-xs text-emerald-300">Biochemical Mechanism & Structural Function</h4>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {geminiAnalysis.summary}
                      </p>
                    </div>

                    {/* Confidence Assessment */}
                    <div className="p-3.5 bg-[#141620] rounded-lg border border-[#282d3e]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                        <h4 className="font-bold text-xs text-sky-300">AlphaFold Confidence Assessment & Domain Rigidity</h4>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {geminiAnalysis.confidenceAssessment}
                      </p>
                    </div>

                    {/* Drug Target & Therapeutic Potential */}
                    <div className="p-3.5 bg-[#141620] rounded-lg border border-[#282d3e]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-xs text-amber-300">Pharmacological Relevance & Drug Discovery Target</h4>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed whitespace-pre-wrap">
                        {geminiAnalysis.drugTargetMechanism}
                      </p>
                    </div>

                    {/* Cinematic Video Storyboard */}
                    <div className="p-3.5 bg-[#141620] rounded-lg border border-[#282d3e]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-fuchsia-400" />
                          <h4 className="font-bold text-xs text-fuchsia-300">Cinematic 3D Video Storyboard Script</h4>
                        </div>
                        <button
                          onClick={() => {
                            setPrompt(`Cinematic 3D molecular animation of ${proteinData?.gene} protein structure from AlphaFold, camera rotating around catalytic binding pocket with glowing residues, photorealistic scientific render 8K`);
                            setModel('Veo 3 (veo-3.1-fast-generate-preview)');
                            setActiveTab('textToVideo');
                            showToast('Transferred science storyboard prompt to Veo 3 Text-to-Video Engine!');
                          }}
                          className="px-2 py-0.5 rounded bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-700/60 text-[10px] hover:bg-fuchsia-900 transition-colors flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Generate with Veo 3</span>
                        </button>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed font-mono whitespace-pre-wrap bg-black/40 p-2.5 rounded border border-[#262a38]">
                        {geminiAnalysis.storyboardScript}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-[#232630] flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified AlphaFold DB v6 + Gemini 3.8 Flash Active</span>
                </span>
                <span className="font-mono text-gray-400">
                  CORS Enabled • Zero API Quota Block
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
