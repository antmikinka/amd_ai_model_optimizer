import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Activity, Zap } from 'lucide-react';

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

export default function NpuInsightsSummary() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">NPU Insights Summary</h1>
        <p className="text-slate-500 mt-1">Detailed look at how your model was optimized for inference execution on NPU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total NPU Partitions</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">2</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total GMACs (NPU)</p>
          <p className="text-2xl font-semibold text-indigo-600 mt-1">2,730</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Failsafe CPU GMACs</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">165</p>
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
    </div>
  );
}
