import React, { useState } from 'react';
import { Info, Table as TableIcon, Download, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function PerformanceTimeline() {
  const [showProperties, setShowProperties] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [selectedInference, setSelectedInference] = useState('Inference 1');
  const [selectedPartition, setSelectedPartition] = useState('Overall Model');

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Performance Timeline</h1>
          <p className="text-slate-500 mt-1">Layer-by-layer breakdown of model execution</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative">
            <select 
              value={selectedInference}
              onChange={(e) => setSelectedInference(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Inference 1</option>
              <option>Inference 2</option>
              <option>Inference 3</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select 
              value={selectedPartition}
              onChange={(e) => setSelectedPartition(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Overall Model</option>
              <option>NPU Partition 1</option>
              <option>NPU Partition 2</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          
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
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md flex items-center text-sm font-medium">
            <Download size={16} className="mr-2" />
            Export SVG
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main Timeline Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-700">Graphical Timeline</h3>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded-sm mr-1.5"></div> NPU Execution</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-amber-500 rounded-sm mr-1.5"></div> CPU Execution</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-slate-300 rounded-sm mr-1.5"></div> Idle/Transfer</div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto bg-[#fafafa]">
            {/* Mock Timeline Visualization */}
            <div className="min-w-[800px] space-y-8">
              {/* Time Axis */}
              <div className="relative h-6 border-b border-slate-300 flex text-xs text-slate-400 font-mono">
                <div className="absolute left-0 -bottom-4">0ms</div>
                <div className="absolute left-1/4 -bottom-4">8ms</div>
                <div className="absolute left-2/4 -bottom-4">16ms</div>
                <div className="absolute left-3/4 -bottom-4">24ms</div>
                <div className="absolute right-0 -bottom-4">32ms</div>
                
                {/* Grid Lines */}
                <div className="absolute left-1/4 top-0 bottom-[-400px] w-px bg-slate-200/50"></div>
                <div className="absolute left-2/4 top-0 bottom-[-400px] w-px bg-slate-200/50"></div>
                <div className="absolute left-3/4 top-0 bottom-[-400px] w-px bg-slate-200/50"></div>
              </div>

              {/* Tracks */}
              <div className="space-y-6 pt-4">
                {/* Track 1: NPU Core 0 */}
                <div className="flex items-center">
                  <div className="w-24 text-xs font-medium text-slate-600 shrink-0">NPU Core 0</div>
                  <div className="flex-1 h-8 bg-slate-100 rounded relative border border-slate-200 overflow-hidden">
                    <div className="absolute left-[5%] w-[20%] h-full bg-indigo-500 hover:bg-indigo-400 cursor-pointer transition-colors border-r border-indigo-600" title="Conv2D_1"></div>
                    <div className="absolute left-[25%] w-[15%] h-full bg-indigo-500 hover:bg-indigo-400 cursor-pointer transition-colors border-r border-indigo-600" title="Relu_1"></div>
                    <div className="absolute left-[45%] w-[30%] h-full bg-indigo-500 hover:bg-indigo-400 cursor-pointer transition-colors border-r border-indigo-600" title="MatMul_1"></div>
                  </div>
                </div>

                {/* Track 2: NPU Core 1 */}
                <div className="flex items-center">
                  <div className="w-24 text-xs font-medium text-slate-600 shrink-0">NPU Core 1</div>
                  <div className="flex-1 h-8 bg-slate-100 rounded relative border border-slate-200 overflow-hidden">
                    <div className="absolute left-[10%] w-[15%] h-full bg-indigo-400 hover:bg-indigo-300 cursor-pointer transition-colors border-r border-indigo-500" title="Conv2D_2"></div>
                    <div className="absolute left-[50%] w-[20%] h-full bg-indigo-400 hover:bg-indigo-300 cursor-pointer transition-colors border-r border-indigo-500" title="Add_1"></div>
                  </div>
                </div>

                {/* Track 3: CPU Fallback */}
                <div className="flex items-center">
                  <div className="w-24 text-xs font-medium text-slate-600 shrink-0">CPU</div>
                  <div className="flex-1 h-8 bg-slate-100 rounded relative border border-slate-200 overflow-hidden">
                    <div className="absolute left-[80%] w-[15%] h-full bg-amber-500 hover:bg-amber-400 cursor-pointer transition-colors border-r border-amber-600" title="Softmax_1"></div>
                  </div>
                </div>
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
              Select a timeline block to view properties
            </div>
          </div>
        )}
      </div>

      {/* Model Table */}
      {showTable && (
        <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-medium text-slate-900 text-sm">Execution Details</h3>
            <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 shadow-sm">
                <tr>
                  <th className="px-4 py-2 font-medium text-slate-500">Layer Name</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Type</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Processor</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Start Time (ms)</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Duration (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-2 font-mono text-xs">Conv2D_1</td>
                  <td className="px-4 py-2">Conv</td>
                  <td className="px-4 py-2"><span className="text-indigo-600 font-medium">NPU Core 0</span></td>
                  <td className="px-4 py-2 font-mono text-xs">1.6</td>
                  <td className="px-4 py-2 font-mono text-xs">6.4</td>
                </tr>
                <tr className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-2 font-mono text-xs">Conv2D_2</td>
                  <td className="px-4 py-2">Conv</td>
                  <td className="px-4 py-2"><span className="text-indigo-600 font-medium">NPU Core 1</span></td>
                  <td className="px-4 py-2 font-mono text-xs">3.2</td>
                  <td className="px-4 py-2 font-mono text-xs">4.8</td>
                </tr>
                <tr className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-2 font-mono text-xs">Relu_1</td>
                  <td className="px-4 py-2">Relu</td>
                  <td className="px-4 py-2"><span className="text-indigo-600 font-medium">NPU Core 0</span></td>
                  <td className="px-4 py-2 font-mono text-xs">8.0</td>
                  <td className="px-4 py-2 font-mono text-xs">4.8</td>
                </tr>
                <tr className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-2 font-mono text-xs">Softmax_1</td>
                  <td className="px-4 py-2">Softmax</td>
                  <td className="px-4 py-2"><span className="text-amber-600 font-medium">CPU</span></td>
                  <td className="px-4 py-2 font-mono text-xs">25.6</td>
                  <td className="px-4 py-2 font-mono text-xs">4.8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
