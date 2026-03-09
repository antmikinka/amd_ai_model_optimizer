import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Table as TableIcon, Info, Maximize2, Zap } from 'lucide-react';

export default function NpuInsightsOptimizedGraph() {
  const [showProperties, setShowProperties] = useState(false);
  const [showTable, setShowTable] = useState(true);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Optimized Graph</h1>
          <p className="text-slate-500 mt-1">Final model mapped to NPU after transformations (fusion, chaining)</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md flex items-center text-sm font-medium">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button 
            onClick={() => setShowProperties(!showProperties)}
            className={`p-2 rounded-md flex items-center text-sm font-medium ${showProperties ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Info size={16} className="mr-2" />
            Properties
          </button>
          <button 
            onClick={() => setShowTable(!showTable)}
            className={`p-2 rounded-md flex items-center text-sm font-medium ${showTable ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <TableIcon size={16} className="mr-2" />
            Table
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md flex items-center text-sm font-medium">
            <SlidersHorizontal size={16} className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main Graph Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <button className="p-2 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500 hover:bg-slate-50"><Maximize2 size={18} /></button>
          </div>
          
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-xs font-medium flex items-center shadow-sm">
              <Zap size={14} className="mr-1.5" />
              14 Fusions Applied
            </div>
          </div>

          <div className="flex-1 bg-[#fafafa] flex items-center justify-center p-8 overflow-auto">
            <div className="flex flex-col items-center space-y-8">
              {/* Mock Fused Node */}
              <div className="w-64 bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 shadow-sm relative">
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                  FUSED
                </div>
                <div className="text-xs font-bold text-indigo-800 mb-2">SuperNode_1</div>
                <div className="space-y-1">
                  <div className="text-xs font-mono bg-white/60 px-2 py-1 rounded text-slate-700">Conv2D</div>
                  <div className="text-xs font-mono bg-white/60 px-2 py-1 rounded text-slate-700">BatchNorm</div>
                  <div className="text-xs font-mono bg-white/60 px-2 py-1 rounded text-slate-700">Relu</div>
                </div>
              </div>

              <div className="h-8 w-0.5 bg-slate-300 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-300 rotate-45"></div>
              </div>

              {/* Failsafe CPU Node */}
              <div className="w-64 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-sm relative">
                <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                  FAILSAFE CPU
                </div>
                <div className="text-xs font-bold text-amber-800 mb-2">Fallback_Op</div>
                <div className="text-xs font-mono bg-white/60 px-2 py-1 rounded text-slate-700">DynamicReshape</div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {showProperties && (
          <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-medium text-slate-900">Properties</h3>
              <button onClick={() => setShowProperties(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center text-sm text-slate-500">
              Select a node to view properties
            </div>
          </div>
        )}
      </div>

      {/* Model Table */}
      {showTable && (
        <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-medium text-slate-900 text-sm">Optimized Elements</h3>
            <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="overflow-auto flex-1 p-4 flex items-center justify-center text-sm text-slate-500">
            Table data corresponding to optimized graph
          </div>
        </div>
      )}
    </div>
  );
}
