import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Database, FileCode, Layers, Cpu, Network, ArrowRight, Zap, Combine } from 'lucide-react';

// --- DATA PROFILES ---
const profiles = {
  original: {
    id: 'original',
    name: 'Original (BF16)',
    badge: 'Baseline',
    icon: Database,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    size: '159.3 GB',
    totalSizeVal: '159348782592',
    precision: 'BF16',
    desc: 'Base pre-trained model. High memory footprint, unoptimized for edge deployment.',
    tensors: [
      {
        name: 'model', type: 'module', count: 3,
        children: [
          { name: 'embed_tokens.weight', shape: '[151936, 2048]', precision: 'BF16', type: 'tensor' },
          {
            name: 'layers', type: 'module', count: 40,
            children: [
              {
                name: '0', type: 'module', count: 4,
                children: [
                  { name: 'input_layernorm.weight', shape: '[2048]', precision: 'BF16', type: 'tensor' },
                  {
                    name: 'linear_attn', type: 'module', count: 7,
                    children: [
                      { name: 'A_log', shape: '[32]', precision: 'BF16', type: 'tensor' },
                      { name: 'conv1d.weight', shape: '[8192, 1, 4]', precision: 'BF16', type: 'tensor' },
                      { name: 'dt_bias', shape: '[32]', precision: 'BF16', type: 'tensor' },
                      { name: 'in_proj_ba.weight', shape: '[64, 2048]', precision: 'BF16', type: 'tensor' },
                      { name: 'in_proj_qkvz.weight', shape: '[12288, 2048]', precision: 'BF16', type: 'tensor' },
                      { name: 'norm.weight', shape: '[128]', precision: 'BF16', type: 'tensor' },
                      { name: 'out_proj.weight', shape: '[2048, 4096]', precision: 'BF16', type: 'tensor' },
                    ]
                  },
                  {
                    name: 'mlp', type: 'module', count: 4,
                    children: [
                      {
                        name: 'shared_expert', type: 'module', count: 3,
                        children: [
                          { name: 'down_proj.weight', shape: '[2048, 512]', precision: 'BF16', type: 'tensor' },
                          { name: 'gate_proj.weight', shape: '[512, 2048]', precision: 'BF16', type: 'tensor' },
                          { name: 'up_proj.weight', shape: '[512, 2048]', precision: 'BF16', type: 'tensor' },
                        ]
                      },
                      { name: 'shared_expert_gate.weight', shape: '[1, 2048]', precision: 'BF16', type: 'tensor' },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  quantized: {
    id: 'quantized',
    name: 'Quantized (AWQ INT4)',
    badge: 'Optimized',
    icon: Zap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    size: '39.8 GB',
    totalSizeVal: '39837195648',
    precision: 'UINT4 / BF16',
    desc: 'Post-training quantization applied. Weights packed to 4-bit, scales/zeros added for recovery.',
    tensors: [
      {
        name: 'model', type: 'module', count: 3,
        children: [
          { name: 'embed_tokens.weight', shape: '[151936, 2048]', precision: 'BF16', type: 'tensor' },
          {
            name: 'layers', type: 'module', count: 40,
            children: [
              {
                name: '0', type: 'module', count: 4,
                children: [
                  { name: 'input_layernorm.weight', shape: '[2048]', precision: 'BF16', type: 'tensor' },
                  {
                    name: 'linear_attn', type: 'module', count: 11, // Increased count due to scales/zeros
                    children: [
                      { name: 'A_log', shape: '[32]', precision: 'BF16', type: 'tensor' },
                      { name: 'conv1d.weight', shape: '[8192, 1, 4]', precision: 'BF16', type: 'tensor' },
                      { name: 'dt_bias', shape: '[32]', precision: 'BF16', type: 'tensor' },
                      { name: 'in_proj_ba.qweight', shape: '[64, 256]', precision: 'UINT4', type: 'tensor' },
                      { name: 'in_proj_ba.scales', shape: '[64, 16]', precision: 'BF16', type: 'tensor' },
                      { name: 'in_proj_qkvz.qweight', shape: '[12288, 256]', precision: 'UINT4', type: 'tensor' },
                      { name: 'in_proj_qkvz.scales', shape: '[12288, 16]', precision: 'BF16', type: 'tensor' },
                      { name: 'in_proj_qkvz.qzeros', shape: '[12288, 16]', precision: 'UINT4', type: 'tensor' },
                      { name: 'norm.weight', shape: '[128]', precision: 'BF16', type: 'tensor' },
                      { name: 'out_proj.qweight', shape: '[2048, 512]', precision: 'UINT4', type: 'tensor' },
                      { name: 'out_proj.scales', shape: '[2048, 32]', precision: 'BF16', type: 'tensor' },
                    ]
                  },
                  {
                    name: 'mlp', type: 'module', count: 4,
                    children: [
                      {
                        name: 'shared_expert', type: 'module', count: 9,
                        children: [
                          { name: 'down_proj.qweight', shape: '[2048, 64]', precision: 'UINT4', type: 'tensor' },
                          { name: 'down_proj.scales', shape: '[2048, 4]', precision: 'BF16', type: 'tensor' },
                          { name: 'gate_proj.qweight', shape: '[512, 256]', precision: 'UINT4', type: 'tensor' },
                          { name: 'gate_proj.scales', shape: '[512, 16]', precision: 'BF16', type: 'tensor' },
                          { name: 'up_proj.qweight', shape: '[512, 256]', precision: 'UINT4', type: 'tensor' },
                          { name: 'up_proj.scales', shape: '[512, 16]', precision: 'BF16', type: 'tensor' },
                        ]
                      },
                      { name: 'shared_expert_gate.weight', shape: '[1, 2048]', precision: 'BF16', type: 'tensor' },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  compiled: {
    id: 'compiled',
    name: 'Compiled (Hybrid NPU)',
    badge: 'Deployed',
    icon: Combine,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    size: '40.1 GB',
    totalSizeVal: '40102934016',
    precision: 'Mixed (NPU+iGPU)',
    desc: 'ONNX Runtime compilation. Layers fused into custom NPU subgraphs for hardware execution.',
    tensors: [
      {
        name: 'model', type: 'module', count: 3,
        children: [
          { name: 'embed_tokens.weight', shape: '[151936, 2048]', precision: 'BF16', type: 'tensor' },
          {
            name: 'layers', type: 'module', count: 40,
            children: [
              {
                name: '0', type: 'module', count: 3,
                children: [
                  { name: 'input_layernorm.weight', shape: '[2048]', precision: 'BF16', type: 'tensor' },
                  {
                    name: 'RyzenAI_Fused_Linear_Attn', type: 'module', count: 1,
                    children: [
                      { name: 'npu_subgraph_0', shape: 'OPAQUE', precision: 'XCLBIN', type: 'tensor' },
                    ]
                  },
                  {
                    name: 'RyzenAI_Fused_MLP', type: 'module', count: 1,
                    children: [
                      { name: 'npu_subgraph_1', shape: 'OPAQUE', precision: 'XCLBIN', type: 'tensor' },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

const TreeNode = ({ node, level = 0, defaultExpanded = false, path = '', highlightChanges = false }: any) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isModule = node.type === 'module';
  const currentPath = path ? `${path}.${node.name}` : node.name;

  // Highlight logic for quantized/compiled states
  const isQuantized = node.precision === 'UINT4' || node.name.includes('scales') || node.name.includes('qzeros') || node.name.includes('qweight');
  const isCompiled = node.name.includes('RyzenAI') || node.precision === 'XCLBIN';

  return (
    <div className="font-mono text-[13px]">
      <div 
        className={`flex items-center py-1.5 px-2 hover:bg-slate-800/80 cursor-pointer ${level === 0 ? '' : 'ml-4'} border-l border-slate-700/30 transition-colors`}
        onClick={() => isModule && setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 flex items-center overflow-hidden">
          {isModule ? (
            <span className="text-slate-500 mr-1.5 shrink-0">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span className="w-4 mr-1.5 shrink-0 inline-block"></span>
          )}
          <span className={`truncate ${isModule ? (isCompiled ? 'text-emerald-400 font-bold' : 'text-indigo-300') : (isQuantized ? 'text-amber-200' : 'text-slate-300')}`}>
            {level === 0 ? node.name : (
              <>
                <span className="text-slate-500">{path}.</span>{node.name}
              </>
            )}
          </span>
          {node.count !== undefined && (
            <span className="ml-2 text-xs text-slate-500 shrink-0">({node.count})</span>
          )}
        </div>
        
        {!isModule && (
          <div className="flex items-center space-x-6 text-xs shrink-0 ml-4">
            <span className="text-emerald-400/90 w-32 text-right tracking-tight">{node.shape}</span>
            <span className={`w-16 text-right font-bold ${isQuantized ? 'text-amber-400' : isCompiled ? 'text-emerald-500' : 'text-slate-400'}`}>
              {node.precision}
            </span>
          </div>
        )}
      </div>
      
      {isModule && isExpanded && node.children && (
        <div>
          {node.children.map((child: any, idx: number) => (
            <TreeNode key={idx} node={child} level={level + 1} defaultExpanded={level < 2} path={currentPath} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ModelArchitecture({ selectedModel }: { selectedModel?: string }) {
  const [activeProfileId, setActiveProfileId] = useState<keyof typeof profiles>('original');
  const activeProfile = profiles[activeProfileId];

  // Map model ID to display name and parameters
  const modelInfo = {
    'deepseek-v3': { params: '35B (3B active)', dim: '2048', layout: '10 × (3 × (DeltaNet) → 1 × (Attn))' },
    'llama-3-8b': { params: '8B', dim: '4096', layout: '32 × (Attn → MLP)' },
    'mistral-7b': { params: '7B', dim: '4096', layout: '32 × (Attn → MLP)' },
    'qwen-1.5-7b': { params: '7B', dim: '4096', layout: '32 × (Attn → MLP)' }
  }[selectedModel || 'deepseek-v3'] || { params: '35B (3B active)', dim: '2048', layout: '10 × (3 × (DeltaNet) → 1 × (Attn))' };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Architecture & Tensors</h1>
        <p className="text-slate-500 mt-1">Visualize how quantization and compilation actively shape the resulting model's architecture.</p>
      </div>

      {/* State Selector */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-8 inline-flex space-x-2">
        {(Object.keys(profiles) as Array<keyof typeof profiles>).map((key, index) => {
          const profile = profiles[key];
          const isActive = activeProfileId === key;
          const Icon = profile.icon;
          return (
            <React.Fragment key={key}>
              <button
                onClick={() => setActiveProfileId(key)}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={`mr-2 ${isActive ? profile.color : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-none">{profile.name}</div>
                  <div className={`text-[10px] mt-1 ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                    {profile.size} • {profile.precision}
                  </div>
                </div>
              </button>
              {index < Object.keys(profiles).length - 1 && (
                <div className="flex items-center px-1">
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Model Overview */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center">
                <activeProfile.icon className={`${activeProfile.color} mr-2`} size={18} />
                <h2 className="text-sm font-semibold text-slate-900">Model State Overview</h2>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${activeProfile.bgColor} ${activeProfile.color}`}>
                {activeProfile.badge}
              </span>
            </div>
            <div className="p-5 space-y-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">{activeProfile.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Size</p>
                  <p className={`text-lg font-bold ${activeProfileId !== 'original' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {activeProfile.size}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Primary Precision</p>
                  <p className="text-sm font-medium text-slate-900">{activeProfile.precision}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                  <Layers className="mr-1.5 text-slate-400" size={14} /> Base Architecture
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Parameters</p>
                    <p className="text-sm font-medium text-slate-900">{modelInfo.params}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Hidden Dim</p>
                    <p className="text-sm font-medium text-slate-900">{modelInfo.dim}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Hidden Layout</p>
                    <p className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 mt-1">
                      {modelInfo.layout}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tensor Explorer */}
        <div className="xl:col-span-2">
          <div className="bg-[#0D1117] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[800px] transition-all duration-300">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#161B22] flex items-center justify-between">
              <div className="flex items-center text-slate-300">
                <FileCode className="mr-2 text-slate-400" size={16} />
                <span className="text-sm font-medium">model.safetensors.index.json</span>
                <span className="ml-3 text-xs text-slate-500">
                  {activeProfileId === 'original' ? '6.76 MB' : activeProfileId === 'quantized' ? '2.14 MB' : '1.89 MB'}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs font-medium text-slate-400">
                <span>total_size: <span className={`transition-colors duration-500 ${activeProfileId !== 'original' ? 'text-emerald-400' : 'text-slate-300'}`}>{activeProfile.totalSizeVal}</span></span>
              </div>
            </div>
            
            <div className="flex bg-[#161B22] border-b border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="flex-1">Tensors</div>
              <div className="w-32 text-right mr-6">Shape</div>
              <div className="w-16 text-right">Precision</div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 bg-[#0D1117]">
              {/* Key/Legend */}
              {activeProfileId !== 'original' && (
                <div className="mb-4 mx-2 p-3 rounded-lg border border-slate-800 bg-[#161B22] flex items-center space-x-6 text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider font-sans font-bold text-[10px]">Changes applied:</span>
                  {activeProfileId === 'quantized' && (
                    <>
                      <span className="flex items-center text-amber-200"><span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span> UINT4 Packing</span>
                      <span className="flex items-center text-amber-200"><span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span> Added Scales/Zeros</span>
                    </>
                  )}
                  {activeProfileId === 'compiled' && (
                    <>
                      <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Layer Fusion</span>
                      <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Opaque Subgraphs</span>
                    </>
                  )}
                </div>
              )}

              {activeProfile.tensors.map((node, idx) => (
                <TreeNode key={`${activeProfileId}-${idx}`} node={node} defaultExpanded={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
