import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Table as TableIcon, Info, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

const mockNodes = [
  { id: 'input', type: 'Input', processor: 'CPU', partition: null },
  { id: 'conv1', type: 'Conv', processor: 'NPU', partition: 'P1' },
  { id: 'relu1', type: 'Relu', processor: 'NPU', partition: 'P1' },
  { id: 'pool1', type: 'MaxPool', processor: 'NPU', partition: 'P1' },
  { id: 'reshape', type: 'Reshape', processor: 'CPU', partition: null },
  { id: 'matmul', type: 'MatMul', processor: 'NPU', partition: 'P2' },
  { id: 'softmax', type: 'Softmax', processor: 'CPU', partition: null },
];

export default function PartitioningGraph() {
  const [showProperties, setShowProperties] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>('conv1');

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Partitioning Graph</h1>
          <p className="text-slate-500 mt-1">Interactive diagram of the partitioned ONNX model</p>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md flex items-center text-sm font-medium" title="Filter by Partition">
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
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md flex items-center text-sm font-medium" title="Settings">
            <SlidersHorizontal size={16} className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main Graph Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          {/* Graph Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm z-10">
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"><ZoomIn size={18} /></button>
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"><ZoomOut size={18} /></button>
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"><Maximize2 size={18} /></button>
          </div>

          {/* Settings Overlay (Mock) */}
          <div className="absolute top-4 left-4 flex space-x-2 z-10">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 shadow-sm">Show Processor: ON</span>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 shadow-sm">Show Partition: ON</span>
          </div>

          {/* Mock Graph Visualization */}
          <div className="flex-1 bg-[#fafafa] flex items-center justify-center p-8 overflow-auto">
            <div className="flex flex-col items-center space-y-6">
              {mockNodes.map((node, i) => (
                <div key={node.id} className="flex flex-col items-center">
                  <div 
                    onClick={() => setSelectedNode(node.id)}
                    className={`
                      w-48 p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedNode === node.id ? 'border-indigo-500 shadow-md scale-105' : 'border-slate-300 hover:border-slate-400'}
                      ${node.processor === 'NPU' ? 'bg-indigo-50' : 'bg-amber-50'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{node.processor}</span>
                      {node.partition && (
                        <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                          {node.partition}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-medium text-slate-900">{node.id}</div>
                    <div className="text-xs text-slate-500 mt-1">{node.type}</div>
                  </div>
                  
                  {i < mockNodes.length - 1 && (
                    <div className="h-6 w-0.5 bg-slate-300 my-1 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-300 rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
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
            <div className="p-4 overflow-y-auto flex-1">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">General</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Name</span>
                        <span className="text-sm font-mono text-slate-900">{selectedNode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Type</span>
                        <span className="text-sm text-slate-900">{mockNodes.find(n => n.id === selectedNode)?.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Processor</span>
                        <span className={`text-sm font-medium ${mockNodes.find(n => n.id === selectedNode)?.processor === 'NPU' ? 'text-indigo-600' : 'text-amber-600'}`}>
                          {mockNodes.find(n => n.id === selectedNode)?.processor}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Attributes</h4>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100 font-mono text-xs text-slate-600 overflow-x-auto">
                      <pre>{JSON.stringify({
                        kernel_shape: [3, 3],
                        pads: [1, 1, 1, 1],
                        strides: [1, 1]
                      }, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center py-8">Select a node to view properties</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Model Table */}
      {showTable && (
        <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-medium text-slate-900 text-sm">Model Elements</h3>
            <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 shadow-sm">
                <tr>
                  <th className="px-4 py-2 font-medium text-slate-500">Processor</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Function (Layer)</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Operator</th>
                  <th className="px-4 py-2 font-medium text-slate-500">Ports</th>
                  <th className="px-4 py-2 font-medium text-slate-500">NPU Partitions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockNodes.map((node) => (
                  <tr 
                    key={node.id} 
                    className={`cursor-pointer transition-colors ${selectedNode === node.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${node.processor === 'NPU' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                        {node.processor}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{node.id}</td>
                    <td className="px-4 py-2">{node.type}</td>
                    <td className="px-4 py-2 text-slate-500 text-xs">In: 1, Out: 1</td>
                    <td className="px-4 py-2 font-mono text-xs">{node.partition || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
