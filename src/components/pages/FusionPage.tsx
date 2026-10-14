import React, { useState } from 'react';
import {
  Network,
  Plus,
  Sliders,
  Type,
  Sun,
  Eye,
  Layers,
  Sparkles,
  Move,
  RotateCcw,
  Trash2,
  Check
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { FusionNode } from '../../types/editor';

export const FusionPage: React.FC = () => {
  const {
    fusionNodes,
    selectedNodeId,
    setSelectedNodeId,
    updateFusionNode,
    addFusionNode,
    removeFusionNode,
    resetFusionTree,
    activeMediaPreview,
    showToast
  } = useEditor();

  const [activeViewer, setActiveViewer] = useState<'node' | 'final'>('final');

  const selectedNode = fusionNodes.find((n) => n.id === selectedNodeId);

  // Compute live preview styles based on active nodes
  const glowNode = fusionNodes.find((n) => n.type === 'glow');
  const blurNode = fusionNodes.find((n) => n.type === 'blur');
  const textNode = fusionNodes.find((n) => n.type === 'textPlus');
  const transformNode = fusionNodes.find((n) => n.type === 'transform');

  const previewStyle: React.CSSProperties = {
    filter: `blur(${blurNode?.params.blurRadius || 0}px) drop-shadow(0 0 ${
      (glowNode?.params.glowIntensity || 0) * 20
    }px #8b5cf6)`,
    transform: `scale(${transformNode?.params.scale || 1}) translate(${
      transformNode?.params.posX || 0
    }px, ${transformNode?.params.posY || 0}px)`
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#101115] text-gray-200 select-none">
      {/* Top Half: Fusion Dual Viewer Monitor */}
      <div className="h-[46%] flex border-b border-[#232630] bg-[#0c0d10]">
        {/* Main Composite Viewport */}
        <div className="flex-1 flex flex-col p-3 border-r border-[#232630]">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#1f222b]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-purple-400" />
                Fusion Compositor Viewport 1 (Node Graph Live Output)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 text-[10px] font-mono border border-purple-800/40">
                RGBA 32-bit Float
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
              <span>Fit 100%</span>
              <span className="text-emerald-400 font-bold">Proxy Off (Full Res)</span>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black rounded mt-2 border border-[#20232c]">
            {/* Live Visual VFX Composite */}
            <div className="relative max-h-full max-w-full aspect-video overflow-hidden flex items-center justify-center">
              <img
                src={
                  activeMediaPreview?.thumbnail ||
                  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop'
                }
                alt="Fusion Feed"
                style={previewStyle}
                className="w-full h-full object-cover transition-all"
              />

              {/* Text+ Node overlay */}
              {textNode && textNode.params.text && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                  style={{
                    fontSize: `${textNode.params.fontSize || 40}px`,
                    color: textNode.params.textColor || '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 800,
                    letterSpacing: '0.1em'
                  }}
                >
                  <span className="animate-pulse">{textNode.params.text}</span>
                </div>
              )}

              {/* On-screen node HUD info */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-purple-400 border border-purple-500/30">
                ACTIVE NODE: {selectedNode?.title || 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Node Inspector (Right Column) */}
        <div className="w-80 bg-[#14161c] flex flex-col text-xs">
          <div className="h-9 border-b border-[#232630] px-3 flex items-center justify-between bg-[#181a22]">
            <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Node Inspector (Tools)
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {selectedNode ? selectedNode.type : 'Select Node'}
            </span>
          </div>

          {selectedNode ? (
            <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Node Header</span>
                <p className="text-sm font-bold text-white mt-0.5">{selectedNode.title}</p>
              </div>

              {/* Node-specific controls */}
              {selectedNode.type === 'textPlus' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-[11px] block mb-1">Styled Text:</label>
                    <input
                      type="text"
                      value={selectedNode.params.text || ''}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, text: e.target.value }
                        })
                      }
                      className="w-full bg-[#1c1f28] border border-[#2a2f3d] rounded px-2.5 py-1.5 text-gray-200 text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Font Size (pt):</span>
                      <span className="font-mono text-emerald-400">{selectedNode.params.fontSize || 40}px</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="96"
                      value={selectedNode.params.fontSize || 40}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, fontSize: parseInt(e.target.value) }
                        })
                      }
                      className="w-full accent-purple-500 h-1 bg-[#252834] rounded"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'glow' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Glow Intensity:</span>
                      <span className="font-mono text-purple-400">
                        {Math.round((selectedNode.params.glowIntensity || 0.5) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={selectedNode.params.glowIntensity ?? 0.5}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, glowIntensity: parseFloat(e.target.value) }
                        })
                      }
                      className="w-full accent-purple-500 h-1 bg-[#252834] rounded"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Glow Radius:</span>
                      <span className="font-mono text-purple-400">{selectedNode.params.glowRadius || 15}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={selectedNode.params.glowRadius || 15}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, glowRadius: parseInt(e.target.value) }
                        })
                      }
                      className="w-full accent-purple-500 h-1 bg-[#252834] rounded"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'transform' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Scale Factor:</span>
                      <span className="font-mono text-cyan-400">{(selectedNode.params.scale || 1).toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.05"
                      value={selectedNode.params.scale ?? 1}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, scale: parseFloat(e.target.value) }
                        })
                      }
                      className="w-full accent-cyan-500 h-1 bg-[#252834] rounded"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'blur' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Gaussian Blur Radius:</span>
                      <span className="font-mono text-sky-400">{selectedNode.params.blurRadius || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={selectedNode.params.blurRadius || 0}
                      onChange={(e) =>
                        updateFusionNode(selectedNode.id, {
                          params: { ...selectedNode.params, blurRadius: parseInt(e.target.value) }
                        })
                      }
                      className="w-full accent-sky-500 h-1 bg-[#252834] rounded"
                    />
                  </div>
                </div>
              )}

              {/* Node actions */}
              <div className="pt-3 border-t border-[#232630] flex gap-2">
                <button
                  onClick={() => removeFusionNode(selectedNode.id)}
                  className="w-full py-1.5 px-3 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Node</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 text-center text-gray-500 flex flex-col items-center justify-center">
              <Network className="w-8 h-8 text-gray-600 mb-2" />
              <p className="font-semibold text-gray-400">No Node Selected</p>
              <p className="text-[10px] text-gray-500 mt-1">Click a node in the node flow below to inspect its parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Half: Fusion Node Graph Canvas */}
      <div className="flex-1 flex flex-col bg-[#121318] overflow-hidden">
        {/* Node Toolbar */}
        <div className="h-10 bg-[#161820] border-b border-[#232630] px-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mr-2">Add VFX Nodes:</span>
            <button
              onClick={() => addFusionNode('glow', 'Glow & Bloom')}
              className="px-2 py-1 rounded bg-[#20232c] hover:bg-[#2c303c] text-purple-300 border border-[#303442] flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>+ Glow</span>
            </button>
            <button
              onClick={() => addFusionNode('textPlus', 'Text+ Title')}
              className="px-2 py-1 rounded bg-[#20232c] hover:bg-[#2c303c] text-emerald-300 border border-[#303442] flex items-center gap-1"
            >
              <Type className="w-3 h-3 text-emerald-400" />
              <span>+ Text+</span>
            </button>
            <button
              onClick={() => addFusionNode('blur', 'Defocus Blur')}
              className="px-2 py-1 rounded bg-[#20232c] hover:bg-[#2c303c] text-sky-300 border border-[#303442] flex items-center gap-1"
            >
              <Sun className="w-3 h-3 text-sky-400" />
              <span>+ Blur</span>
            </button>
            <button
              onClick={() => addFusionNode('transform', 'Transform 2D')}
              className="px-2 py-1 rounded bg-[#20232c] hover:bg-[#2c303c] text-cyan-300 border border-[#303442] flex items-center gap-1"
            >
              <Move className="w-3 h-3 text-cyan-400" />
              <span>+ Transform</span>
            </button>
            <button
              onClick={() => {
                addFusionNode('chroma', 'AI Magic Mask');
                showToast('Added AI Neural Magic Mask node with subject matte rotoscoping');
              }}
              className="px-2 py-1 rounded bg-gradient-to-r from-fuchsia-950/60 to-purple-950/60 hover:from-fuchsia-900/60 hover:to-purple-900/60 text-fuchsia-300 border border-fuchsia-700/50 flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-fuchsia-400" />
              <span>+ AI Magic Mask</span>
            </button>
          </div>

          <button
            onClick={resetFusionTree}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e2029] hover:bg-[#272a36] text-gray-300 border border-[#2e323e]"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Reset Tree</span>
          </button>
        </div>

        {/* Node Graph Flow Workspace */}
        <div className="flex-1 relative overflow-auto bg-[#0d0e12] p-6 cursor-grab active:cursor-grabbing">
          {/* Subtle Grid Dot Matrix Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Connection Lines between nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {fusionNodes.map((node) =>
              node.outputs.map((outId) => {
                const targetNode = fusionNodes.find((n) => n.id === outId);
                if (!targetNode) return null;

                const startX = node.x + 130;
                const startY = node.y + 24;
                const endX = targetNode.x;
                const endY = targetNode.y + 24;
                const cpx1 = startX + (endX - startX) * 0.5;
                const cpy1 = startY;
                const cpx2 = endX - (endX - startX) * 0.5;
                const cpy2 = endY;

                return (
                  <path
                    key={`${node.id}-${outId}`}
                    d={`M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`}
                    stroke="#4b5563"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="4 2"
                    className="hover:stroke-purple-400 transition-colors"
                  />
                );
              })
            )}
          </svg>

          {/* Render Interactive Fusion Nodes */}
          {fusionNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`
                }}
                className={`absolute w-36 rounded-md bg-[#181a22] border transition-all cursor-pointer shadow-lg z-10 ${
                  isSelected
                    ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400'
                    : 'border-[#2d313d] hover:border-gray-500'
                }`}
              >
                {/* Node Top Header */}
                <div
                  style={{ backgroundColor: node.color }}
                  className="px-2.5 py-1 text-white font-bold text-[11px] rounded-t-md flex items-center justify-between shadow-inner"
                >
                  <span className="truncate">{node.title}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>

                {/* Node Body */}
                <div className="p-2 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>In</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Out</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
