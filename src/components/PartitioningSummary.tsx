import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Cpu, Layers, Zap } from 'lucide-react';

const gopData = [
  { name: 'Conv', NPU: 45.2, CPU: 2.1 },
  { name: 'MatMul', NPU: 32.1, CPU: 0.5 },
  { name: 'Add', NPU: 8.4, CPU: 1.2 },
  { name: 'Relu', NPU: 5.2, CPU: 0.1 },
  { name: 'MaxPool', NPU: 3.1, CPU: 0.8 },
  { name: 'Softmax', NPU: 0, CPU: 4.5 },
];

const cpuBecauseData = [
  { operator: 'Softmax_12', type: 'Softmax', reason: 'Unsupported data type (FP32) for NPU offload' },
  { operator: 'Reshape_45', type: 'Reshape', reason: 'Dynamic shape not supported on NPU' },
  { operator: 'Gather_89', type: 'Gather', reason: 'Operator not implemented in NPU compiler' },
];

const COLORS = ['#4f46e5', '#94a3b8'];

export default function PartitioningSummary({ selectedModel }: { selectedModel?: string }) {
  const modelName = selectedModel || 'deepseek-v3';
  
  // Adjust stats based on model
  const stats = {
    'deepseek-v3': { total: '2,456', rate: '96.4%', fallback: '88' },
    'llama-3-8b': { total: '1,248', rate: '94.2%', fallback: '72' },
    'mistral-7b': { total: '1,120', rate: '95.1%', fallback: '55' },
    'qwen-1.5-7b': { total: '1,340', rate: '93.8%', fallback: '83' }
  }[modelName] || { total: '1,248', rate: '94.2%', fallback: '72' };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Partitioning Summary</h1>
          <p className="text-slate-500 mt-1">Overview of operator assignment to Ryzen CPU and NPU</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Operators</p>
              <p className="text-3xl font-light text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <Layers size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">NPU Offload Rate</p>
              <p className="text-3xl font-light text-emerald-600 mt-2">{stats.rate}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <Zap size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">CPU Fallback</p>
              <p className="text-3xl font-light text-amber-600 mt-2">{stats.fallback}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Cpu size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-medium text-slate-900 mb-6">GOP Offloading by Operator Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gopData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="NPU" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="CPU" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-medium text-slate-900 mb-6">Operator Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'NPU Executed', value: 1176 },
                    { name: 'CPU Fallback', value: 72 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#4f46e5" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CPU Because Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-medium text-slate-900">CPU Because</h3>
          <p className="text-sm text-slate-500 mt-1">Reasons why certain operators were not offloaded to the NPU</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Operator Instance</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Reason for CPU Fallback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cpuBecauseData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-700">{row.operator}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
