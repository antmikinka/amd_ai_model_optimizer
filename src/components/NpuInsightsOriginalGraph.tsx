import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Table as TableIcon, Info, Code, Maximize2 } from 'lucide-react';

export default function NpuInsightsOriginalGraph() {
  const [showProperties, setShowProperties] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showTable, setShowTable] = useState(true);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Original Graph</h1>
          <p className="text-slate-500 mt-1">Model lowered to supported NPU primitive operators</p>
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
            onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-md flex items-center text-sm font-medium ${showCode ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Code size={16} className="mr-2" />
            Code View
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
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <button className="p-2 bg-white border border-slate-200 rounded-md shadow-sm text-slate-500 hover:bg-slate-50"><Maximize2 size={18} /></button>
          </div>
          <div className="text-center">
            <div className="w-64 h-64 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center bg-slate-50 mx-auto mb-4">
              <span className="text-slate-400 font-medium">Interactive Graph Visualization</span>
            </div>
            <p className="text-sm text-slate-500">Showing primitive NPU operators before fusion</p>
          </div>
        </div>

        {/* Code View Panel */}
        {showCode && (
          <div className="w-96 bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col overflow-hidden text-slate-300">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <h3 className="font-medium text-slate-200 text-sm flex items-center"><Code size={16} className="mr-2"/> MLIR Source</h3>
              <button onClick={() => setShowCode(false)} className="text-slate-500 hover:text-slate-300">×</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed">
              <pre>
{`module {
  func.func @main(%arg0: tensor<1x3x224x224xf32>) -> tensor<1x1000xf32> {
    %0 = "xir.const"() {value = dense<...> : tensor<64x3x7x7xf32>} : () -> tensor<64x3x7x7xf32>
    %1 = "xir.conv2d"(%arg0, %0) {
      dilations = [1, 1], 
      pads = [3, 3, 3, 3], 
      strides = [2, 2]
    } : (tensor<1x3x224x224xf32>, tensor<64x3x7x7xf32>) -> tensor<1x64x112x112xf32>
    %2 = "xir.relu"(%1) : (tensor<1x64x112x112xf32>) -> tensor<1x64x112x112xf32>
    // ...
    return %99 : tensor<1x1000xf32>
  }
}`}
              </pre>
            </div>
          </div>
        )}

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
            <h3 className="font-medium text-slate-900 text-sm">Primitive Elements</h3>
            <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="overflow-auto flex-1 p-4 flex items-center justify-center text-sm text-slate-500">
            Table data corresponding to primitive graph
          </div>
        </div>
      )}
    </div>
  );
}
