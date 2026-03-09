import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Cpu, 
  Layers, 
  Database, 
  Code2, 
  AlertCircle,
  Terminal,
  Target,
  CheckSquare,
  Wrench,
  PlayCircle,
  Copy
} from 'lucide-react';

type ExecutionMode = 'npu' | 'gpu_dml' | 'hybrid_custom';
type Hardware = 'stx' | 'phx';
type DataType = 'int8' | 'bf16';
type CacheType = 'dev' | 'prod';

interface ConfigState {
  hardware: Hardware;
  dataType: DataType;
  cache: CacheType;
}

export default function ModelConversionFlow() {
  const [mode, setMode] = useState<ExecutionMode>('npu');
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    hardware: 'stx',
    dataType: 'int8',
    cache: 'dev'
  });

  const updateConfig = (key: keyof ConfigState, value: any) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'hardware' && value === 'phx') {
        next.dataType = 'int8';
      }
      return next;
    });
  };

  const handleModeChange = (newMode: ExecutionMode) => {
    setMode(newMode);
    setStep(2); // Auto-advance to step 2 when a mode is selected
  };

  const getSteps = () => {
    switch(mode) {
      case 'npu': return [
        { num: 1, title: 'Target', icon: Target },
        { num: 2, title: 'Hardware', icon: Cpu },
        { num: 3, title: 'Data Type', icon: Layers },
        { num: 4, title: 'Caching', icon: Database },
        { num: 5, title: 'Deploy', icon: Code2 }
      ];
      case 'gpu_dml': return [
        { num: 1, title: 'Target', icon: Target },
        { num: 2, title: 'Prereqs', icon: CheckSquare },
        { num: 3, title: 'Optimize', icon: Wrench },
        { num: 4, title: 'Deploy', icon: Code2 }
      ];
      case 'hybrid_custom': return [
        { num: 1, title: 'Target', icon: Target },
        { num: 2, title: 'Build DML', icon: Settings },
        { num: 3, title: 'Compile Ops', icon: Layers },
        { num: 4, title: 'Gen Hybrid', icon: Database },
        { num: 5, title: 'Run', icon: PlayCircle }
      ];
      default: return [];
    }
  };

  // Mock Settings icon for hybrid_custom step 2 since it wasn't imported at top
  const Settings = Wrench; 

  const steps = getSteps();
  const maxSteps = steps.length;

  const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const generateNpuCode = () => {
    let code = `import onnxruntime\nimport os\n\n`;
    code += `session_options = onnxruntime.SessionOptions()\n`;
    
    if (config.cache === 'prod') {
      code += `session_options.add_session_config_entry('ep.context_enable', '1')\n`;
      code += `session_options.add_session_config_entry('ep.context_file_path', 'context_model.onnx')\n`;
    }

    code += `\nvai_ep_options = {\n`;

    if (config.dataType === 'bf16') {
      code += `    'config_file': 'vai_ep_config.json',\n`;
    } else if (config.dataType === 'int8') {
      if (config.hardware === 'stx') {
        code += `    'target': 'X2',\n`;
      } else {
        code += `    'target': 'X1',\n`;
        code += `    'xclbin': r'%RYZEN_AI_INSTALLATION_PATH%\\voe-4.0-win_amd64\\xclbins\\phoenix\\4x4.xclbin',\n`;
      }
    }

    if (config.cache === 'dev') {
      code += `    'cache_dir': '.\\\\cache',\n`;
      code += `    'cache_key': 'my_compiled_model',\n`;
      if (config.dataType === 'int8') {
        code += `    'enable_cache_file_io_in_mem': '0',\n`;
      }
    }

    code += `}\n\n`;
    code += `session = onnxruntime.InferenceSession(\n`;
    code += `    "model_${config.dataType}.onnx",\n`;
    code += `    sess_options=session_options,\n`;
    code += `    providers=['VitisAIExecutionProvider'],\n`;
    code += `    provider_options=[vai_ep_options]\n`;
    code += `)\n`;

    return code;
  };

  const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner mt-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center text-slate-400 text-xs font-mono">
          <Terminal size={14} className="mr-2" />
          {language === 'python' ? 'script.py' : 'terminal'}
        </div>
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center"
        >
          <Copy size={12} className="mr-1" /> Copy
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Model Conversion Wizard</h1>
        <p className="text-slate-500 mt-1">Interactive guide for preparing and deploying models on Ryzen AI.</p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / (maxSteps - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-slate-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step >= s.num 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                <s.icon size={18} />
              </div>
              <span className={`text-xs font-medium mt-2 ${step >= s.num ? 'text-indigo-900' : 'text-slate-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 flex-1">
          
          {/* COMMON STEP 1: Target Mode */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Execution Target</h2>
                <p className="text-slate-500 mt-1">Select your intended deployment flow and execution mode.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleModeChange('npu')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${mode === 'npu' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">NPU-Only (Vitis AI EP)</span>
                    {mode === 'npu' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600">Standard deployment for precompiled models. Maximum NPU utilization.</p>
                </button>

                <button 
                  onClick={() => handleModeChange('gpu_dml')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${mode === 'gpu_dml' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">GPU (DirectML)</span>
                    {mode === 'gpu_dml' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600">High-throughput inference on discrete or integrated GPU using MS Olive.</p>
                </button>

                <button 
                  onClick={() => handleModeChange('hybrid_custom')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${mode === 'hybrid_custom' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">Hybrid (Custom Ops)</span>
                    {mode === 'hybrid_custom' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600">For fine-tuned models with new operator shapes requiring custom compilation.</p>
                </button>
              </div>
            </div>
          )}

          {/* --- NPU FLOW --- */}
          {mode === 'npu' && step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hardware & Opset</h2>
                <p className="text-slate-500 mt-1">Ensure your model uses ONNX Opset 17. Select your target processor.</p>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start text-amber-800 mb-6">
                <AlertCircle className="mr-3 shrink-0 mt-0.5" size={18} />
                <p className="text-sm">
                  <strong>Note:</strong> Models with ONNX opset 17 are highly recommended. If using a different version, please convert your model using the ONNX Version Converter before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => updateConfig('hardware', 'stx')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.hardware === 'stx' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">Ryzen AI 300 Series</span>
                    {config.hardware === 'stx' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-xs font-mono text-slate-500 mb-3">STX / KRK</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">Supports BF16</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">Supports INT8 (X2)</span>
                  </div>
                </button>

                <button 
                  onClick={() => updateConfig('hardware', 'phx')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.hardware === 'phx' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">Ryzen AI 7000/8000 Series</span>
                    {config.hardware === 'phx' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-xs font-mono text-slate-500 mb-3">PHX / HPT</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">Supports INT8 (X1)</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'npu' && step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Data Type & Quantization</h2>
                <p className="text-slate-500 mt-1">Select the precision format for your compiled model.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => updateConfig('dataType', 'int8')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.dataType === 'int8' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">INT8 Quantized</span>
                    {config.dataType === 'int8' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Maximum performance and efficiency. Uses the {config.hardware === 'stx' ? 'X2' : 'X1'} compiler backend.</p>
                  {config.hardware === 'phx' && (
                    <p className="text-xs text-amber-600 font-medium">Requires 4x4.xclbin for PHX/HPT devices.</p>
                  )}
                </button>

                <button 
                  onClick={() => updateConfig('dataType', 'bf16')}
                  disabled={config.hardware === 'phx'}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.dataType === 'bf16' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'} ${config.hardware === 'phx' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">BF16 (BFloat16)</span>
                    {config.dataType === 'bf16' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Higher precision, no quantization required. Uses the VAIML compiler.</p>
                  {config.hardware === 'phx' ? (
                    <p className="text-xs text-red-500 font-medium">Not supported on Ryzen AI 7000/8000 series.</p>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">Requires vai_ep_config.json</p>
                  )}
                </button>
              </div>
            </div>
          )}

          {mode === 'npu' && step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Caching Strategy</h2>
                <p className="text-slate-500 mt-1">Choose how the compiled model should be saved to avoid recompilation overhead.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => updateConfig('cache', 'dev')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.cache === 'dev' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">VitisAI EP Cache (Development)</span>
                    {config.cache === 'dev' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600">Automatically saves compiled models to a cache directory. Best for quick iteration during the development cycle.</p>
                </button>

                <button 
                  onClick={() => updateConfig('cache', 'prod')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${config.cache === 'prod' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">ORT EP Context Cache (Production)</span>
                    {config.cache === 'prod' && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </div>
                  <p className="text-sm text-slate-600">Dumps a snapshot of the EP context. Recommended for the final version of the application. Supports optional AES256 encryption.</p>
                </button>
              </div>
            </div>
          )}

          {mode === 'npu' && step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Deployment Configuration</h2>
                <p className="text-slate-500 mt-1">Your ONNX Runtime session configuration is ready.</p>
              </div>
              <CodeBlock code={generateNpuCode()} language="python" />
            </div>
          )}

          {/* --- GPU DIRECTML FLOW --- */}
          {mode === 'gpu_dml' && step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Prerequisites</h2>
                <p className="text-slate-500 mt-1">Ensure your system meets the requirements for DirectML execution.</p>
              </div>
              <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center text-slate-700">
                  <CheckCircle2 className="text-emerald-500 mr-3" size={20} />
                  <span>DirectX12 capable Windows OS (Windows 11 recommended)</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle2 className="text-emerald-500 mr-3" size={20} />
                  <span>Latest AMD GPU device driver installed</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle2 className="text-emerald-500 mr-3" size={20} />
                  <span>Microsoft Olive for model conversion and optimization</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <CheckCircle2 className="text-emerald-500 mr-3" size={20} />
                  <span>Latest ONNX Runtime DirectML EP</span>
                </div>
              </div>
            </div>
          )}

          {mode === 'gpu_dml' && step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Model Conversion & Optimization</h2>
                <p className="text-slate-500 mt-1">Use Microsoft Olive to prepare your model.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                <p className="text-slate-700 mb-4">
                  After the model is trained, Microsoft Olive Optimizer can be used to convert the model to ONNX and optimize it for optimal target execution on the AMD Ryzen AI GPU.
                </p>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
                  Refer to Microsoft Olive Documentation <ChevronRight size={16} />
                </a>
              </div>
            </div>
          )}

          {mode === 'gpu_dml' && step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Deployment</h2>
                <p className="text-slate-500 mt-1">Run the model using the ONNX Runtime DirectML Execution Provider.</p>
              </div>
              <CodeBlock 
                language="python"
                code={`import onnxruntime as ort

# Initialize session options
session_options = ort.SessionOptions()

# Create inference session with DirectML Execution Provider
session = ort.InferenceSession(
    "optimized_model.onnx",
    sess_options=session_options,
    providers=['DmlExecutionProvider']
)

# Run inference
# outputs = session.run(None, input_data)`} 
              />
            </div>
          )}

          {/* --- HYBRID CUSTOM OPS FLOW --- */}
          {mode === 'hybrid_custom' && step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Build OGA DML Model</h2>
                <p className="text-slate-500 mt-1">Use the ONNX Runtime GenAI Model Builder included in the Ryzen AI software environment.</p>
              </div>
              <CodeBlock 
                code={`conda activate ryzen-ai-<version>\n\npython -m onnxruntime_genai.models.builder \\\n     -i <quantized model folder> -o <dml model folder> \\\n     -p int4 -e dml`} 
              />
            </div>
          )}

          {mode === 'hybrid_custom' && step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Compile Operators</h2>
                <p className="text-slate-500 mt-1">Compile the operators extracted from the OGA DML model.</p>
              </div>
              <CodeBlock 
                code={`onnx_utils vaiml --model-dir <dml model folder> --plugin_name my_plugin --compile --ops_type bfp16`} 
              />
              <p className="text-sm text-slate-600 mt-2">
                This generates a compiled operator package at: <code className="bg-slate-100 px-1 py-0.5 rounded">transaction-plugin\my_plugin.zip</code>
              </p>
            </div>
          )}

          {mode === 'hybrid_custom' && step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Generate Hybrid Model</h2>
                <p className="text-slate-500 mt-1">Package the plugins and generate the final hybrid model.</p>
              </div>
              <CodeBlock 
                code={`# Create plugins directory and copy the compiled operators\nmkdir dd_plugins\ncopy transaction-plugin\\my_plugin.zip dd_plugins\\\n\n# Optional: enable tracing for debug purposes\nset DD_PLUGINS_TRACING=1\n\n# Generate the hybrid model\nmodel_generate --hybrid <output hybrid model folder> <dml model folder>`} 
              />
              <p className="text-sm text-slate-600 mt-2">
                If the zip is not placed in <code>dd_plugins</code>, set the <code>DD_PLUGINS_ROOT</code> environment variable to point to its location.
              </p>
            </div>
          )}

          {mode === 'hybrid_custom' && step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Run Hybrid Model</h2>
                <p className="text-slate-500 mt-1">Execute the model using the benchmark tool.</p>
              </div>
              <CodeBlock 
                code={`# Ensure model_benchmark.exe and DLLs are in the working directory\n.\\model_benchmark.exe -i <hybrid_model_folder> -f amd_genai_prompt.txt -l "128, 256, 512, 1024, 2048" --verbose`} 
              />
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              step === 1 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </button>
          
          <button
            onClick={nextStep}
            disabled={step === maxSteps}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              step === maxSteps 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {step === maxSteps - 1 && mode === 'npu' ? 'Generate Code' : 'Next'} <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
