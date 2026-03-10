import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Activity, Zap, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const opsData = [
  { name: 'Conv2D', P1: 120, P2: 45, CPU: 0 },
  { name: 'MatMul', P1: 80, P2: 60, CPU: 0 },
  { name: 'Add', P1: 200, P2: 150, CPU: 10 },
  { name: 'Relu', P1: 180, P2: 140, CPU: 0 },
  { name: 'Softmax', P1: 0, P2: 0, CPU: 12 },
];

const gmacsData = [
  { name: 'Layer 1', NPU: 450, CPU: 0 },
  { name: 'Layer 2', NPU: 820, CPU: 0 },
  { name: 'Layer 3', NPU: 310, CPU: 45 },
  { name: 'Layer 4', NPU: 950, CPU: 0 },
  { name: 'Layer 5', NPU: 200, CPU: 120 },
];

export default function NpuInsightsSummary({ selectedModel }: { selectedModel?: string }) {
  const modelName = selectedModel || 'deepseek-v3';
  
  const stats = {
    'deepseek-v3': { 
      partitions: '2', 
      gmacs: '2,730', 
      failsafe: '165',
      tier: 'Tier 2',
      tierDesc: 'Hybrid NPU+iGPU Execution',
      l1Residency: 'Partial (Requires L2)',
      bandwidth: '120 GB/s (Off-chip bottleneck)',
      works: ['INT4 Quantization (AWQ)', 'NPU Prefill + iGPU Decode'],
      fails: ['Dynamic Computation Graphs', 'CPU-NPU Frequent Sync']
    },
    'llama-3-8b': { 
      partitions: '1', 
      gmacs: '1,420', 
      failsafe: '80',
      tier: 'Tier 1',
      tierDesc: 'Standard OGA Flow',
      l1Residency: 'High (128 KB per core)',
      bandwidth: '800 GB/s (On-chip)',
      works: ['INT4 Quantization (AWQ)', 'Double-Buffered DMA'],
      fails: ['NF4/FP8 Quantization', 'Unstructured Sparsity']
    },
    'mistral-7b': { 
      partitions: '1', 
      gmacs: '1,210', 
      failsafe: '65',
      tier: 'Tier 1',
      tierDesc: 'Standard OGA Flow',
      l1Residency: 'High (128 KB per core)',
      bandwidth: '800 GB/s (On-chip)',
      works: ['INT4 Quantization (AWQ)', 'Double-Buffered DMA'],
      fails: ['NF4/FP8 Quantization', 'Unstructured Sparsity']
    },
    'qwen-1.5-7b': { 
      partitions: '2', 
      gmacs: '1,350', 
      failsafe: '90',
      tier: 'Tier 3',
      tierDesc: 'Custom Operator via MLIR-AIR',
      l1Residency: 'Full (Custom Spatial Kernel)',
      bandwidth: '800 GB/s (On-chip)',
      works: ['L1-Resident Kernels', 'Explicit Dataflow Scheduling'],
      fails: ['Implicit Memory Management']
    }
  }[modelName] || { 
    partitions: '2', 
    gmacs: '2,730', 
    failsafe: '165',
    tier: 'Tier 1',
    tierDesc: 'Standard OGA Flow',
    l1Residency: 'Moderate',
    bandwidth: '120 GB/s',
    works: ['INT4 Quantization'],
    fails: ['FP8 Quantization']
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">NPU Insights Summary</h1>
        <p className="text-slate-500 mt-1">Detailed look at how your model was optimized for inference execution on NPU</p>
      </div>

      {/* Hardware Reality & Utilization Tiers */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-indigo-900 flex items-center">
              <Zap className="mr-2 text-indigo-600" size={20} />
              XDNA Ecosystem Utilization: {stats.tier}
            </h2>
            <p className="text-sm text-indigo-800/80 mt-1">
              <strong>{stats.tierDesc}</strong> — {stats.tier === 'Tier 1' ? 'Achieves ~80% of peak NPU capability. Quick to deploy but lacks custom operator optimizations.' : stats.tier === 'Tier 2' ? 'Achieves ~90% of peak capability. NPU handles prefill (TTFT), iGPU handles decode token generation.' : 'Achieves 95%+ of peak capability using MLIR-AIR custom spatial kernels mapped directly to AI Engine tiles.'}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {stats.tier === 'Tier 1' ? '80% Peak Perf' : stats.tier === 'Tier 2' ? '90% Peak Perf' : '95%+ Peak Perf'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/60 p-4 rounded-lg border border-indigo-100/50">
            <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">L1 Memory Residency</p>
            <p className="text-sm text-indigo-800">{stats.l1Residency}</p>
            <p className="text-[10px] text-indigo-600/70 mt-1">Target: &gt;95% L1 utilization (128 KB per core)</p>
          </div>
          <div className="bg-white/60 p-4 rounded-lg border border-indigo-100/50">
            <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">Memory Bandwidth</p>
            <p className="text-sm text-indigo-800">{stats.bandwidth}</p>
            <p className="text-[10px] text-indigo-600/70 mt-1">On-chip residency = 10× bandwidth vs off-chip</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total NPU Partitions</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{stats.partitions}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total GMACs (NPU)</p>
          <p className="text-2xl font-semibold text-indigo-600 mt-1">{stats.gmacs}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Failsafe CPU GMACs</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{stats.failsafe}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Optimization Level</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">O3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-medium text-slate-900 mb-6">Operators Mapped to NPU/CPU</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="P1" name="NPU Partition 1" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="P2" name="NPU Partition 2" stackId="a" fill="#818cf8" />
                <Bar dataKey="CPU" name="Failsafe CPU" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-medium text-slate-900 mb-6">GMACs Distribution across Layers</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmacsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorNPU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCPU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="NPU" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorNPU)" />
                <Area type="monotone" dataKey="CPU" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCPU)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* XDNA Native Mindset Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-emerald-900 flex items-center mb-4">
            <CheckCircle2 className="mr-2 text-emerald-600" size={18} />
            What Works (XDNA Native)
          </h3>
          <ul className="space-y-3">
            {stats.works.map((item, i) => (
              <li key={i} className="flex items-start text-sm text-emerald-800">
                <span className="mr-2 text-emerald-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-rose-900 flex items-center mb-4">
            <AlertTriangle className="mr-2 text-rose-600" size={18} />
            Anti-Patterns (Avoid)
          </h3>
          <ul className="space-y-3">
            {stats.fails.map((item, i) => (
              <li key={i} className="flex items-start text-sm text-rose-800">
                <span className="mr-2 text-rose-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
