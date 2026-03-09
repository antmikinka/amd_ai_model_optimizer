import React, { useState } from 'react';
import { Play, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

const operations = [
  { id: 1, name: 'pos_offset', type: 'sub', time: '< 1', cpu: true, npu: true },
  { id: 3, name: 'pos_1', type: 'sub', time: '< 1', cpu: true, npu: true },
  { id: 5, name: 'pos', type: 'max', time: '< 1', cpu: true, npu: true },
  { id: 7, name: 'input_1', type: 'expand_dims', time: '< 1', cpu: true, npu: true },
  { id: 9, name: 'var_147', type: 'less', time: '< 1', cpu: true, npu: false },
  { id: 11, name: 'var_147_after_broadcast', type: 'tile', time: '< 1', cpu: true, npu: false },
  { id: 13, name: 'attention_mask', type: 'matmul', time: '12', cpu: false, npu: true },
  { id: 15, name: 'layer_norm_1', type: 'layer_normalization', time: '4', cpu: false, npu: true },
];

export default function PerformanceSummary() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedComputeUnit, setSelectedComputeUnit] = useState('All');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Performance Report</h1>
          <p className="text-slate-500 mt-1">Detailed profiling metrics across compute units</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export...
          </button>
          <button 
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
          >
            <Play size={16} className="mr-2" />
            Run Test
          </button>
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My PC</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Device Type</p>
            <p className="text-sm text-slate-900">AMD Ryzen™ 9 7940HS</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Software Version</p>
            <p className="text-sm text-slate-900">Windows 11 (22H2)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Compute Units Selected</p>
            <p className="text-sm text-slate-900">All (CPU, NPU)</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Prediction Function</p>
            <p className="text-sm text-slate-900">Default</p>
          </div>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-900 mb-2">Prediction</p>
          <div className="flex items-baseline space-x-1 mb-4">
            <span className="text-4xl font-bold text-slate-900">62.78</span>
            <span className="text-sm font-medium text-slate-500">ms</span>
          </div>
          <div className="relative inline-block w-full">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Median</option>
              <option>Mean</option>
              <option>Max</option>
              <option>Min</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-900 mb-2">Load</p>
          <div className="flex items-baseline space-x-1 mb-4">
            <span className="text-4xl font-bold text-slate-900">83.34</span>
            <span className="text-sm font-medium text-slate-500">ms</span>
          </div>
          <div className="relative inline-block w-full">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Median</option>
              <option>Mean</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-900 mb-2">Compilation</p>
          <div className="flex items-baseline space-x-1 mb-4">
            <span className="text-4xl font-bold text-slate-900">129.05</span>
            <span className="text-sm font-medium text-slate-500">ms</span>
          </div>
          <div className="relative inline-block w-full">
            <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Median</option>
              <option>Mean</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Compute Unit Mapping */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-6">Compute Unit Mapping</h3>
        
        {/* The Bar */}
        <div className="h-8 w-full rounded-full overflow-hidden flex mb-4 shadow-inner bg-slate-100">
          <div className="h-full bg-amber-400" style={{ width: '2.4%' }} title="CPU: 17 ops"></div>
          <div className="h-full bg-indigo-500" style={{ width: '97.6%' }} title="NPU: 690 ops"></div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 border-b border-slate-100 pb-6 mb-2">
          <div className="flex items-center text-sm font-medium text-slate-900">
            <span className="border-b-2 border-slate-900 pb-1">All: 707</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
            CPU: 17
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            NPU: 690
          </div>
        </div>

        {/* Operations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 font-medium w-16">#</th>
                <th className="py-3 font-medium">Name</th>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3 font-medium text-right pr-8">Est. Time (µs)</th>
                <th className="py-3 font-medium text-center w-24">CPU</th>
                <th className="py-3 font-medium text-center w-24">NPU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operations.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 text-slate-500">{op.id}</td>
                  <td className="py-3 font-mono text-slate-900">{op.name}</td>
                  <td className="py-3 text-slate-600">{op.type}</td>
                  <td className="py-3 text-right pr-8 text-slate-600">{op.time}</td>
                  <td className="py-3 text-center">
                    {op.cpu ? <CheckCircle2 size={16} className="mx-auto text-amber-500" /> : <Circle size={16} className="mx-auto text-slate-200" />}
                  </td>
                  <td className="py-3 text-center">
                    {op.npu ? <CheckCircle2 size={16} className="mx-auto text-indigo-500" /> : <Circle size={16} className="mx-auto text-slate-200" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Choose compute unit</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="computeUnit" 
                  value="All"
                  checked={selectedComputeUnit === 'All'}
                  onChange={(e) => setSelectedComputeUnit(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">All (CPU and NPU)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="computeUnit" 
                  value="CPU only"
                  checked={selectedComputeUnit === 'CPU only'}
                  onChange={(e) => setSelectedComputeUnit(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">CPU only</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="computeUnit" 
                  value="NPU only"
                  checked={selectedComputeUnit === 'NPU only'}
                  onChange={(e) => setSelectedComputeUnit(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">NPU only</span>
              </label>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Run Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
