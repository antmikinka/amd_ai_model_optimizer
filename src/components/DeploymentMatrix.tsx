import React from 'react';
import { CheckCircle2, XCircle, Server, Code2, Terminal, Cpu, Zap, Database, Shield, Layers, FileJson, FileCode } from 'lucide-react';

const executionModes = [
  { 
    mode: 'NPU-Only', 
    framework: 'OnnxRuntime GenAI (OGA)', 
    compute: 'NPU exclusive', 
    useCase: 'Maximum NPU utilization while preserving iGPU for parallel workloads', 
    r300: { supported: true, note: 'Full support (BF16 & INT8)' }, 
    r7000: { supported: false, note: 'Not supported for LLMs' } 
  },
  { 
    mode: 'Hybrid', 
    framework: 'OnnxRuntime GenAI (OGA)', 
    compute: 'Dynamic NPU + iGPU', 
    useCase: 'Interactive inference with optimal prefill/decode performance', 
    r300: { supported: true, note: 'Requires custom ops compilation' }, 
    r7000: { supported: false, note: 'Not supported' } 
  },
  { 
    mode: 'GPU (DirectML)', 
    framework: 'ORT DirectML / llama.cpp', 
    compute: 'Dedicated GPU', 
    useCase: 'High-throughput inference on discrete/integrated GPU', 
    r300: { supported: true, note: 'Supported via iGPU/dGPU' }, 
    r7000: { supported: true, note: 'Supported via iGPU/dGPU' } 
  },
  { 
    mode: 'CPU', 
    framework: 'OGA or llama.cpp', 
    compute: 'Traditional CPU', 
    useCase: 'Baseline compatibility across all processor generations', 
    r300: { supported: true, note: 'Universal fallback' }, 
    r7000: { supported: true, note: 'Universal fallback' } 
  },
];

const compilationTargets = [
  { 
    type: 'BF16', 
    devices: 'Ryzen AI 300 Series (STX/KRK)', 
    target: 'VAIML', 
    reqsLabel: 'config_file', 
    reqsIcon: FileJson,
    reqsCode: 'provider_options={"config_file": "vaip_config.json"}',
    desc: 'Native BF16 support on newer NPU architectures. The compiler uses a JSON configuration file to define optimization passes rather than a pre-compiled binary.' 
  },
  { 
    type: 'INT8', 
    devices: 'Ryzen AI 300 Series (STX/KRK)', 
    target: 'X2 Compiler', 
    reqsLabel: 'Default Backend', 
    reqsIcon: Cpu,
    reqsCode: 'provider_options={} // Handled automatically',
    desc: 'Next-generation compiler backend. Provides improved ease of use and asymmetric quantization support without requiring explicit xclbin files.' 
  },
  { 
    type: 'INT8', 
    devices: 'Ryzen AI 7000/8000 Series (PHX/HPT)', 
    target: 'X1 Compiler', 
    reqsLabel: 'xclbin', 
    reqsIcon: FileCode,
    reqsCode: 'provider_options={"xclbin": "1x4.xclbin"}',
    desc: 'Legacy compiler backend. Requires a pre-compiled hardware-specific binary (.xclbin) to instruct the NPU on how to execute the graph.' 
  },
];

const cachingStrategies = [
  { name: 'VitisAI EP Cache', phase: 'Development', mechanism: 'cache_dir & cache_key', encryption: false, desc: 'Quick iteration during dev cycle. Automatically saves compiled model to directory.' },
  { name: 'ORT EP Context Cache', phase: 'Production', mechanism: 'ep.context_enable', encryption: true, desc: 'Dumps snapshot of EP context. Recommended for final applications. Supports AES256.' },
];

const interfaces = [
  { name: 'Server Interface (REST)', icon: Server, desc: 'Process isolation, Ollama/OpenAI API compatibility. Available via Lemonade GUI.' },
  { name: 'High-Level Python SDK', icon: Terminal, desc: 'Lemonade SDK via PyPI. 5-minute setup for rapid experimentation and validation.' },
  { name: 'Native C++/Python OGA', icon: Code2, desc: 'Full customizability for native apps. Direct integration with ONNX Runtime.' },
];

export default function DeploymentMatrix() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Deployment Matrix</h1>
        <p className="text-slate-500 mt-1">Comprehensive overview of LLM execution modes, hardware support, and compilation targets.</p>
      </div>

      {/* Execution Modes & Hardware Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center">
            <Cpu className="text-indigo-600 mr-3" size={20} />
            <h2 className="text-base font-semibold text-slate-900">Execution Modes & Hardware Compatibility</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Mode</th>
                <th className="px-6 py-3 font-medium">Framework</th>
                <th className="px-6 py-3 font-medium">Compute Allocation</th>
                <th className="px-6 py-3 font-medium text-center border-l border-slate-100">Ryzen AI 300 Series<br/><span className="text-xs font-normal">(Strix/Kraken)</span></th>
                <th className="px-6 py-3 font-medium text-center">Ryzen AI 7000/8000 Series<br/><span className="text-xs font-normal">(Phoenix/Hawk Point)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {executionModes.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{row.mode}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{row.framework}</td>
                  <td className="px-6 py-4 text-slate-700">{row.compute}</td>
                  <td className="px-6 py-4 text-center border-l border-slate-100">
                    <div className="flex flex-col items-center justify-center">
                      {row.r300.supported ? <CheckCircle2 size={18} className="text-emerald-500 mb-1" /> : <XCircle size={18} className="text-slate-300 mb-1" />}
                      <span className="text-[10px] text-slate-500 max-w-[120px] leading-tight">{row.r300.note}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {row.r7000.supported ? <CheckCircle2 size={18} className="text-emerald-500 mb-1" /> : <XCircle size={18} className="text-slate-300 mb-1" />}
                      <span className="text-[10px] text-slate-500 max-w-[120px] leading-tight">{row.r7000.note}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Types & Compilation Targets */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
            <Layers className="text-indigo-600 mr-3" size={20} />
            <h2 className="text-base font-semibold text-slate-900">Compilation Targets & Provider Options</h2>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {compilationTargets.map((target, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-200 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold font-mono">{target.type}</span>
                      <span className="text-sm font-semibold text-slate-900">{target.target}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{target.devices}</p>
                  </div>
                  <div className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <target.reqsIcon size={14} className="mr-1.5" />
                    {target.reqsLabel}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{target.desc}</p>
                <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                  <code className="text-xs font-mono text-emerald-400 whitespace-nowrap">
                    {target.reqsCode}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Caching Strategies */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
              <Database className="text-indigo-600 mr-3" size={20} />
              <h2 className="text-base font-semibold text-slate-900">Caching Strategies</h2>
            </div>
            <div className="p-6 space-y-4">
              {cachingStrategies.map((strategy, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
                  <div className={`p-2 rounded-lg ${strategy.phase === 'Production' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {strategy.phase === 'Production' ? <Shield size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">{strategy.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${strategy.phase === 'Production' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {strategy.phase}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mb-2">via {strategy.mechanism}</p>
                    <p className="text-xs text-slate-600">{strategy.desc}</p>
                    {strategy.encryption && (
                      <div className="mt-2 inline-flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        <Shield size={12} className="mr-1" /> Supports AES256 Encryption
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Interfaces */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
              <Code2 className="text-indigo-600 mr-3" size={20} />
              <h2 className="text-base font-semibold text-slate-900">Development Interfaces</h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-4">
              {interfaces.map((iface, i) => (
                <div key={i} className="flex items-center p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <iface.icon size={18} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-slate-900">{iface.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{iface.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
