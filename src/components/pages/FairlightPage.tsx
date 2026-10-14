import React, { useState } from 'react';
import {
  Sliders,
  Volume2,
  VolumeX,
  Music,
  Activity,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Radio
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { SOUND_FX_LIBRARY } from '../../data/sampleClips';

export const FairlightPage: React.FC = () => {
  const {
    audioMixer,
    updateAudioChannel,
    masterFaderDb,
    setMasterFaderDb,
    masterMuted,
    setMasterMuted,
    isPlaying,
    addClipToTimeline,
    showToast
  } = useEditor();

  const [selectedTrackId, setSelectedTrackId] = useState<string>('a1');

  const selectedChannel = audioMixer.find((c) => c.trackId === selectedTrackId) || audioMixer[0];

  const handleInsertSfx = (sfx: typeof SOUND_FX_LIBRARY[0]) => {
    const sfxMedia = {
      id: `sfx-imported-${Date.now()}`,
      name: sfx.name,
      type: 'audio' as const,
      url: 'https://actions.google.com/sounds/v1/science_fiction/teleport_whoosh.ogg',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
      duration: parseFloat(sfx.duration) || 2.0,
      category: 'Sound FX' as const
    };
    addClipToTimeline(sfxMedia, 'a2');
    showToast(`Added "${sfx.name}" sound effect to Audio Track A2`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#101115] text-gray-200 select-none">
      {/* Top Half: 4-Band Parametric EQ & Dynamics Visualizer */}
      <div className="h-[44%] flex border-b border-[#232630] bg-[#0c0d10]">
        {/* Parametric EQ Frequency Curve */}
        <div className="flex-1 flex flex-col p-3 border-r border-[#232630]">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#1f222b]">
            <span className="font-bold text-gray-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Fairlight 4-Band Parametric Equalizer ({selectedChannel?.name || 'A1'})
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <button
                onClick={() => showToast(`AI Voice Isolation activated on ${selectedChannel?.name || 'A1'}: Background rumble, AC hum and room reverb eliminated`)}
                className="px-2.5 py-0.5 rounded bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/50 text-cyan-300 font-sans text-[11px] font-semibold flex items-center gap-1 hover:brightness-125 transition-all shadow-xs active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>AI Voice Isolation</span>
              </button>
              <span className="text-emerald-400 font-semibold">48.000 kHz 24-bit</span>
            </div>
          </div>

          <div className="flex-1 relative flex flex-col justify-between p-3 bg-black rounded mt-2 border border-[#20232c] overflow-hidden">
            {/* EQ Frequency Grid Axis */}
            <div className="flex justify-between text-[10px] text-gray-600 font-mono">
              <span>20 Hz</span>
              <span>100 Hz</span>
              <span>1 kHz</span>
              <span>5 kHz</span>
              <span>20 kHz</span>
            </div>

            {/* Visual Frequency Response Curve Curve SVG */}
            <div className="relative flex-1 my-2 flex items-center justify-center">
              <svg className="w-full h-full">
                {/* Horizontal reference 0dB line */}
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#262934" strokeDasharray="3 3" />
                {/* Curve */}
                <path
                  d={`M 0 50 Q 150 ${50 - (selectedChannel?.eq.lowMidGain || 0) * 4}, 300 50 T 600 ${
                    50 - (selectedChannel?.eq.highMidGain || 0) * 4
                  } T 1000 ${50 - (selectedChannel?.eq.highShelfGain || 0) * 4}`}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
              </svg>
            </div>

            {/* EQ Sliders */}
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-[#1c1f28] text-xs">
              <div>
                <span className="text-[10px] text-gray-400">Low Cut (Hz)</span>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={selectedChannel?.eq.lowCutHz || 80}
                  onChange={(e) =>
                    updateAudioChannel(selectedTrackId, {
                      eq: { ...selectedChannel.eq, lowCutHz: parseInt(e.target.value) }
                    })
                  }
                  className="w-full accent-cyan-500 h-1 bg-[#252834] rounded mt-1"
                />
                <span className="text-[10px] font-mono text-cyan-400">{selectedChannel?.eq.lowCutHz} Hz</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400">Low Mid Gain</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={selectedChannel?.eq.lowMidGain || 0}
                  onChange={(e) =>
                    updateAudioChannel(selectedTrackId, {
                      eq: { ...selectedChannel.eq, lowMidGain: parseInt(e.target.value) }
                    })
                  }
                  className="w-full accent-cyan-500 h-1 bg-[#252834] rounded mt-1"
                />
                <span className="text-[10px] font-mono text-cyan-400">{selectedChannel?.eq.lowMidGain} dB</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400">High Mid Gain</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={selectedChannel?.eq.highMidGain || 0}
                  onChange={(e) =>
                    updateAudioChannel(selectedTrackId, {
                      eq: { ...selectedChannel.eq, highMidGain: parseInt(e.target.value) }
                    })
                  }
                  className="w-full accent-cyan-500 h-1 bg-[#252834] rounded mt-1"
                />
                <span className="text-[10px] font-mono text-cyan-400">{selectedChannel?.eq.highMidGain} dB</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400">High Shelf Gain</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={selectedChannel?.eq.highShelfGain || 0}
                  onChange={(e) =>
                    updateAudioChannel(selectedTrackId, {
                      eq: { ...selectedChannel.eq, highShelfGain: parseInt(e.target.value) }
                    })
                  }
                  className="w-full accent-cyan-500 h-1 bg-[#252834] rounded mt-1"
                />
                <span className="text-[10px] font-mono text-cyan-400">{selectedChannel?.eq.highShelfGain} dB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamics & Sound FX Library Tab */}
        <div className="w-80 bg-[#14161c] flex flex-col text-xs">
          <div className="h-9 border-b border-[#232630] px-3 flex items-center justify-between bg-[#181a22]">
            <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              Sound FX Library
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Insert to A2</span>
          </div>

          <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5">
            {SOUND_FX_LIBRARY.map((sfx) => (
              <div
                key={sfx.id}
                onClick={() => handleInsertSfx(sfx)}
                className="p-2 bg-[#1b1e26] hover:bg-[#252935] rounded border border-[#2a2e3b] cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div>
                  <p className="text-gray-200 font-medium group-hover:text-cyan-400">{sfx.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {sfx.category} • {sfx.duration}
                  </p>
                </div>
                <button className="p-1 rounded bg-[#252935] text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Half: Multi-Channel Console Strips */}
      <div className="flex-1 flex bg-[#12141a] overflow-x-auto p-4 gap-4 justify-center items-stretch">
        {/* Render Track Strips (A1, A2) */}
        {audioMixer.map((strip) => {
          const isSelected = selectedTrackId === strip.trackId;
          return (
            <div
              key={strip.trackId}
              onClick={() => setSelectedTrackId(strip.trackId)}
              className={`w-36 bg-[#161820] rounded-lg border flex flex-col justify-between p-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500'
                  : 'border-[#262934] hover:border-gray-600'
              }`}
            >
              {/* Strip Header */}
              <div className="text-center pb-2 border-b border-[#242732]">
                <span className="text-xs font-bold text-gray-200 block truncate">{strip.name}</span>
                <span className="text-[9px] font-mono text-cyan-400">BUS 1 (Main)</span>
              </div>

              {/* Mute, Solo, Record Arm */}
              <div className="flex justify-center gap-1.5 my-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateAudioChannel(strip.trackId, { mute: !strip.mute });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    strip.mute ? 'bg-rose-600 text-white' : 'bg-[#222530] text-gray-400 hover:text-white'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateAudioChannel(strip.trackId, { solo: !strip.solo });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    strip.solo ? 'bg-amber-500 text-black' : 'bg-[#222530] text-gray-400 hover:text-white'
                  }`}
                >
                  S
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateAudioChannel(strip.trackId, { recordArm: !strip.recordArm });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    strip.recordArm ? 'bg-red-600 text-white animate-pulse' : 'bg-[#222530] text-gray-400'
                  }`}
                >
                  R
                </button>
              </div>

              {/* Pan Slider */}
              <div className="my-1">
                <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 font-mono">
                  <span>L</span>
                  <span>{strip.pan === 0 ? 'C' : strip.pan > 0 ? `R${strip.pan}` : `L${Math.abs(strip.pan)}`}</span>
                  <span>R</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={strip.pan}
                  onChange={(e) => updateAudioChannel(strip.trackId, { pan: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 h-1 bg-[#252834] rounded"
                />
              </div>

              {/* Fader & Bouncing VU Meter */}
              <div className="flex-1 flex items-center justify-center gap-3 my-2">
                {/* Vertical Fader */}
                <input
                  type="range"
                  min="-60"
                  max="12"
                  value={strip.faderDb}
                  onChange={(e) => updateAudioChannel(strip.trackId, { faderDb: parseInt(e.target.value) })}
                  className="h-28 accent-cyan-500 [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
                />

                {/* LED VU Meter Bar */}
                <div className="h-28 w-3 bg-black rounded-sm border border-[#2b2f3d] flex flex-col-reverse p-0.5 overflow-hidden">
                  <div
                    style={{
                      height: isPlaying ? `${Math.min(95, Math.max(10, (strip.faderDb + 60) * 1.3))}%` : '5%'
                    }}
                    className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-75 rounded-xs"
                  />
                </div>
              </div>

              {/* dB Readout */}
              <div className="text-center pt-1 border-t border-[#242732]">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {strip.faderDb > 0 ? `+${strip.faderDb}` : strip.faderDb} dB
                </span>
              </div>
            </div>
          );
        })}

        {/* Master Bus Channel Strip */}
        <div className="w-36 bg-[#181a24] rounded-lg border border-amber-500/40 shadow-lg flex flex-col justify-between p-3">
          <div className="text-center pb-2 border-b border-[#242732]">
            <span className="text-xs font-bold text-amber-400 block">MASTER BUS</span>
            <span className="text-[9px] font-mono text-gray-400">Main Stereo Out</span>
          </div>

          <div className="flex justify-center my-2">
            <button
              onClick={() => setMasterMuted(!masterMuted)}
              className={`px-3 py-1 rounded text-[10px] font-bold font-mono ${
                masterMuted ? 'bg-rose-600 text-white' : 'bg-[#222530] text-gray-300'
              }`}
            >
              {masterMuted ? 'MUTED' : 'ON AIR'}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-3 my-2">
            <input
              type="range"
              min="-60"
              max="12"
              value={masterFaderDb}
              onChange={(e) => setMasterFaderDb(parseInt(e.target.value))}
              className="h-28 accent-amber-500 [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
            />
            {/* Dual Stereo LED Meter */}
            <div className="h-28 flex gap-1">
              <div className="w-2.5 bg-black rounded-sm border border-[#2b2f3d] flex flex-col-reverse p-0.5">
                <div
                  style={{ height: isPlaying && !masterMuted ? '72%' : '4%' }}
                  className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-75"
                />
              </div>
              <div className="w-2.5 bg-black rounded-sm border border-[#2b2f3d] flex flex-col-reverse p-0.5">
                <div
                  style={{ height: isPlaying && !masterMuted ? '68%' : '4%' }}
                  className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-75"
                />
              </div>
            </div>
          </div>

          <div className="text-center pt-1 border-t border-[#242732]">
            <span className="font-mono text-xs font-bold text-amber-400">
              {masterFaderDb > 0 ? `+${masterFaderDb}` : masterFaderDb} dB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
