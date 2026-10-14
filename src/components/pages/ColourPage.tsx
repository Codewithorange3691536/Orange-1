import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Activity,
  Layers,
  Sparkles,
  Sun,
  Eye,
  Check
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { LUT_PRESETS } from '../../data/sampleClips';

export const ColourPage: React.FC = () => {
  const {
    colorGrading,
    updateColorGrading,
    updateColorWheel,
    resetColorGrading,
    activeMediaPreview,
    timecode,
    showToast
  } = useEditor();

  const [activeScope, setActiveScope] = useState<'parade' | 'waveform' | 'vectorscope'>('parade');
  const [activeTab, setActiveTab] = useState<'wheels' | 'luts'>('wheels');

  const activeLutObj = LUT_PRESETS.find((l) => l.id === colorGrading.activeLut);
  const lutFilter = activeLutObj ? activeLutObj.filter : 'none';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#101115] text-gray-200 select-none">
      {/* Top Workspace: Program Monitor + Live Scopes */}
      <div className="h-[48%] flex border-b border-[#232630] bg-[#0c0d10]">
        {/* Main Color Grading Monitor */}
        <div className="flex-1 flex flex-col p-3 border-r border-[#232630]">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#1f222b]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                Colour Viewport (Studio YRGB Color Managed)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] font-mono border border-emerald-800/40">
                Rec.709 / Studio Wide Gamut
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>{activeLutObj?.name || 'Rec.709 Standard'}</span>
              <span className="text-emerald-400 font-bold">{timecode}</span>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black rounded mt-2 border border-[#20232c]">
            {/* Live Graded Video Screen */}
            <div className="relative max-h-full max-w-full aspect-video overflow-hidden flex items-center justify-center">
              <img
                src={
                  activeMediaPreview?.thumbnail ||
                  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop'
                }
                alt="Colour Preview"
                style={{
                  filter: `${lutFilter} contrast(${colorGrading.contrast}%) saturate(${colorGrading.saturation}%)`
                }}
                className="w-full h-full object-cover transition-all duration-100"
              />

              {/* Scope/Grading HUD Indicator */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                GRADE NODE 01 • ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Video Scopes Panel */}
        <div className="w-84 bg-[#14161c] flex flex-col text-xs">
          <div className="h-9 border-b border-[#232630] px-3 flex items-center justify-between bg-[#181a22]">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <button
                onClick={() => setActiveScope('parade')}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  activeScope === 'parade' ? 'bg-[#252834] text-cyan-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                RGB Parade
              </button>
              <button
                onClick={() => setActiveScope('waveform')}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  activeScope === 'waveform' ? 'bg-[#252834] text-emerald-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Waveform
              </button>
              <button
                onClick={() => setActiveScope('vectorscope')}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  activeScope === 'vectorscope' ? 'bg-[#252834] text-amber-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Vectorscope
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 flex flex-col items-center justify-center bg-[#0d0e12]">
            {activeScope === 'parade' && (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1023 IRE</span>
                  <span>RGB PARADE (24-BIT)</span>
                  <span>0 IRE</span>
                </div>
                {/* 3 Columns: Red, Green, Blue Parade graph lines */}
                <div className="flex-1 grid grid-cols-3 gap-2 my-2 bg-black/60 rounded p-2 border border-[#20232c] overflow-hidden">
                  {/* Red Channel */}
                  <div className="h-full flex items-end justify-center bg-red-950/20 rounded border border-red-900/30 p-1">
                    <div
                      style={{ height: `${Math.min(95, Math.max(15, colorGrading.contrast * 0.7))} %` }}
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 opacity-80 rounded-sm"
                    />
                  </div>
                  {/* Green Channel */}
                  <div className="h-full flex items-end justify-center bg-green-950/20 rounded border border-green-900/30 p-1">
                    <div
                      style={{ height: `${Math.min(95, Math.max(15, colorGrading.contrast * 0.65))} %` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 rounded-sm"
                    />
                  </div>
                  {/* Blue Channel */}
                  <div className="h-full flex items-end justify-center bg-blue-950/20 rounded border border-blue-900/30 p-1">
                    <div
                      style={{ height: `${Math.min(95, Math.max(15, colorGrading.contrast * 0.75))} %` }}
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 rounded-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-around text-[10px] font-mono">
                  <span className="text-red-400 font-bold">R</span>
                  <span className="text-emerald-400 font-bold">G</span>
                  <span className="text-blue-400 font-bold">B</span>
                </div>
              </div>
            )}

            {activeScope === 'waveform' && (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>100 IRE (Highlights)</span>
                  <span>WAVEFORM LUMINANCE</span>
                  <span>0 IRE (Blacks)</span>
                </div>
                <div className="flex-1 my-2 bg-black/70 rounded p-2 border border-[#20232c] flex items-center justify-center relative overflow-hidden">
                  <div className="w-full h-24 bg-gradient-to-r from-emerald-500/20 via-emerald-400/40 to-emerald-500/20 flex items-center justify-around">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          height: `${Math.sin(i * 0.4) * 25 + 40}px`
                        }}
                        className="w-1 bg-emerald-400 rounded-full opacity-70"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-center text-gray-500">Luma Y (IRE Scale 0 - 100)</span>
              </div>
            )}

            {activeScope === 'vectorscope' && (
              <div className="w-full h-full flex flex-col items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">VECTORSCOPE CHROMINANCE</span>
                <div className="w-40 h-40 rounded-full border border-[#2a2e3a] relative flex items-center justify-center bg-black/50">
                  <div className="w-28 h-28 rounded-full border border-dashed border-[#3a3f50] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75" />
                  </div>
                  <span className="absolute top-1 text-[9px] text-red-400 font-mono">R</span>
                  <span className="absolute right-1 text-[9px] text-emerald-400 font-mono">G</span>
                  <span className="absolute bottom-1 text-[9px] text-blue-400 font-mono">B</span>
                  <span className="absolute left-1 text-[9px] text-yellow-400 font-mono">Y</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Skin Tone Vector Line OK</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Color Console: 4 Wheels vs 3D LUTs */}
      <div className="flex-1 flex flex-col bg-[#12141a] overflow-hidden">
        {/* Navigation Bar */}
        <div className="h-10 bg-[#161820] border-b border-[#232630] px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('wheels')}
              className={`px-3 py-1 font-semibold rounded ${
                activeTab === 'wheels' ? 'bg-[#252834] text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Primary Color Wheels (Lift / Gamma / Gain / Offset)
            </button>
            <button
              onClick={() => setActiveTab('luts')}
              className={`px-3 py-1 font-semibold rounded ${
                activeTab === 'luts' ? 'bg-[#252834] text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              3D LUT Film Print Emulations ({LUT_PRESETS.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                updateColorGrading({
                  contrast: 112,
                  saturation: 108,
                  temperature: 3,
                  tint: -2,
                  highlights: -6,
                  shadows: 8
                });
                showToast('AI Neural Balance: Auto-corrected dynamic range, shadows & cinematic skin tones');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-fuchsia-950/60 via-purple-950/50 to-emerald-950/60 hover:from-fuchsia-900/60 hover:to-emerald-900/60 text-emerald-300 border border-emerald-600/40 text-xs font-semibold shadow transition-all active:scale-95"
              title="AI Neural Auto-Balance Color & Contrast"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Auto-Balance</span>
            </button>

            <button
              onClick={resetColorGrading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e2029] hover:bg-[#272a36] text-gray-300 border border-[#2e323e] text-xs"
              title="Reset All Color Grades"
            >
              <RotateCcw className="w-3 h-3 text-gray-400" />
              <span>Reset Grade</span>
            </button>
          </div>
        </div>

        {activeTab === 'wheels' ? (
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            {/* The 4 Wheels Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Lift (Shadows) */}
              <div className="flex flex-col items-center bg-[#161820] p-3 rounded-lg border border-[#252834]">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Lift (Shadows)</span>
                {/* Color Wheel Disk */}
                <div className="w-24 h-24 rounded-full relative flex items-center justify-center bg-gradient-to-tr from-blue-700 via-gray-900 to-amber-700 border border-[#3b4050] shadow-inner">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-gray-900" />
                </div>
                {/* Master Wheel Y slider */}
                <div className="w-full mt-3">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Master Y:</span>
                    <span className="font-mono text-emerald-400">{colorGrading.lift.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={colorGrading.lift.y}
                    onChange={(e) => updateColorWheel('lift', 'y', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                  />
                </div>
              </div>

              {/* Gamma (Midtones) */}
              <div className="flex flex-col items-center bg-[#161820] p-3 rounded-lg border border-[#252834]">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Gamma (Midtones)</span>
                <div className="w-24 h-24 rounded-full relative flex items-center justify-center bg-gradient-to-tr from-green-700 via-gray-900 to-rose-700 border border-[#3b4050] shadow-inner">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-gray-900" />
                </div>
                <div className="w-full mt-3">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Master Y:</span>
                    <span className="font-mono text-emerald-400">{colorGrading.gamma.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={colorGrading.gamma.y}
                    onChange={(e) => updateColorWheel('gamma', 'y', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                  />
                </div>
              </div>

              {/* Gain (Highlights) */}
              <div className="flex flex-col items-center bg-[#161820] p-3 rounded-lg border border-[#252834]">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Gain (Highlights)</span>
                <div className="w-24 h-24 rounded-full relative flex items-center justify-center bg-gradient-to-tr from-yellow-600 via-gray-900 to-purple-700 border border-[#3b4050] shadow-inner">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-gray-900" />
                </div>
                <div className="w-full mt-3">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Master Y:</span>
                    <span className="font-mono text-emerald-400">{colorGrading.gain.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={colorGrading.gain.y}
                    onChange={(e) => updateColorWheel('gain', 'y', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                  />
                </div>
              </div>

              {/* Offset (Global) */}
              <div className="flex flex-col items-center bg-[#161820] p-3 rounded-lg border border-[#252834]">
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Offset (Exposure)</span>
                <div className="w-24 h-24 rounded-full relative flex items-center justify-center bg-gradient-to-tr from-cyan-600 via-gray-900 to-orange-600 border border-[#3b4050] shadow-inner">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-gray-900" />
                </div>
                <div className="w-full mt-3">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Master Y:</span>
                    <span className="font-mono text-emerald-400">{colorGrading.offset.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={colorGrading.offset.y}
                    onChange={(e) => updateColorWheel('offset', 'y', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Parameter Sliders: Contrast, Saturation, Temperature, Tint */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-[#15171f] rounded-lg border border-[#242732] text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Contrast:</span>
                  <span className="font-mono text-white">{colorGrading.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={colorGrading.contrast}
                  onChange={(e) => updateColorGrading({ contrast: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Saturation:</span>
                  <span className="font-mono text-white">{colorGrading.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={colorGrading.saturation}
                  onChange={(e) => updateColorGrading({ saturation: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 h-1 bg-[#252834] rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Color Temp:</span>
                  <span className="font-mono text-amber-400">{colorGrading.temperature > 0 ? `+${colorGrading.temperature}K` : `${colorGrading.temperature}K`}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={colorGrading.temperature}
                  onChange={(e) => updateColorGrading({ temperature: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 h-1 bg-[#252834] rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Tint:</span>
                  <span className="font-mono text-purple-400">{colorGrading.tint}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={colorGrading.tint}
                  onChange={(e) => updateColorGrading({ tint: parseInt(e.target.value) })}
                  className="w-full accent-purple-500 h-1 bg-[#252834] rounded"
                />
              </div>
            </div>
          </div>
        ) : (
          /* 3D LUT Presets Gallery */
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {LUT_PRESETS.map((lut) => {
              const isActive = colorGrading.activeLut === lut.id;
              return (
                <div
                  key={lut.id}
                  onClick={() => {
                    updateColorGrading({ activeLut: lut.id as any });
                    showToast(`Applied 3D LUT: ${lut.name}`);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500'
                      : 'bg-[#161820] border-[#262934] hover:border-gray-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-gray-200 text-xs">{lut.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{lut.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#262934] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">.cube 33x33</span>
                    <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {isActive ? 'Applied' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
