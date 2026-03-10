import React, { useState } from 'react';
import { 
  Terminal, 
  Wrench, 
  Copy,
  Settings2,
  Info,
  Beaker,
  Combine,
  FileCode2,
  Wand2,
  Bug
} from 'lucide-react';

type Tab = 'pipeline' | 'builder' | 'generate' | 'recipes';

export default function CliBuilder({ selectedModel }: { selectedModel?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const modelName = selectedModel || 'deepseek-v3';

  // Builder State
  const [bInput, setBInput] = useState(modelName);
  const [bOutput, setBOutput] = useState('qwen2-7b-dml');
  const [bPrecision, setBPrecision] = useState('int4');
  const [bEp, setBEp] = useState('dml');
  const [bExtra, setBExtra] = useState('');

  // Generate State
  const [gTarget, setGTarget] = useState('--hybrid');
  const [gInput, setGInput] = useState('qwen2-7b-dml');
  const [gOutput, setGOutput] = useState('qwen2-7b-hybrid');
  const [gOptimize, setGOptimize] = useState('');

  const generateBuilderCmd = () => {
    let cmd = `python -m onnxruntime_genai.models.builder \\\n`;
    cmd += `  -i ${bInput} \\\n`;
    cmd += `  -o ${bOutput} \\\n`;
    cmd += `  -p ${bPrecision} \\\n`;
    cmd += `  -e ${bEp}`;
    if (bExtra) {
      cmd += ` \\\n  --extra_options ${bExtra}`;
    }
    return cmd;
  };

  const generateModelCmd = () => {
    let cmd = `model_generate ${gTarget} \\\n`;
    if (gOptimize) {
      cmd += `  --optimize ${gOptimize} \\\n`;
    }
    cmd += `  ${gOutput} \\\n`;
    cmd += `  ${gInput}`;
    return cmd;
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
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Quantization & CLI Tools</h1>
        <p className="text-slate-500 mt-1">Reference guides and interactive command builders for Ryzen AI model preparation.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit mb-8">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recipes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Beaker size={16} className="mr-2" /> Real-World Recipes
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pipeline' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wand2 size={16} className="mr-2" /> Optimization Pipeline
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'builder' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench size={16} className="mr-2" /> ORT GenAI Builder
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'generate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings2 size={16} className="mr-2" /> Model Generate
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        
        {/* REAL-WORLD RECIPES */}
        {activeTab === 'recipes' && (
          <div className="p-8 animate-in fade-in duration-300">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Real-World Recipes</h2>
            <p className="text-sm text-slate-500 mb-6">Step-by-step breakdowns of how production models are prepared for Ryzen AI.</p>
            
            <div className="space-y-8">
              {/* Recipe 1: Qwen2-72B */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Qwen2-72B (Massive Model Edge Deployment)</h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">Qwen2ForCausalLM • 80 Layers • 5120 Hidden Dim</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    INT4 / Hybrid
                  </span>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Context */}
                  <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                      <Info size={16} className="mr-2" /> Why this strategy?
                    </h4>
                    <p className="text-sm text-amber-800/80">
                      A 72B parameter model requires ~144GB of RAM in BF16. To run this efficiently on a local Ryzen AI PC (e.g., Strix Point with 64GB unified memory), aggressive <strong>4-bit quantization (INT4)</strong> is mandatory. This reduces the footprint to ~36-40GB. <strong>Hybrid execution</strong> is recommended to maximize memory bandwidth across the NPU and iGPU.
                    </p>
                  </div>

                  {/* Strategy Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 text-indigo-600">1. The Quantization Strategy</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Algorithm</p>
                        <p className="font-semibold text-slate-900">AWQ</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Group Size</p>
                        <p className="font-semibold text-slate-900">128</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Weights</p>
                        <p className="font-semibold text-slate-900">UINT4 (Asymmetric)</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Activations</p>
                        <p className="font-semibold text-slate-900">BFP16</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Quark */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">2. AMD Quark Configuration</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Configure AMD Quark to pack the 80 layers of weights into unsigned 4-bit integers while keeping activations in BFloat16 to preserve accuracy.
                    </p>
                    <CodeBlock 
                      language="python"
                      code={`from quark.torch.quantization.config.config import QuantizationConfig, Config
from quark.torch.quantization.config.type import QuantType, ScaleType

quant_config = QuantizationConfig(
    calibrate_method="AWQ",
    weight_type=QuantType.QUInt4,       # Pack to 4-bit to fit in RAM
    activation_type=QuantType.BFloat16, # Maintain activation precision
    group_size=128,                     
    extra_options={'WeightSymmetric': False} 
)

config = Config(global_quant_config=quant_config)`} 
                    />
                  </div>

                  {/* Step 2: ORT Builder */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">3. ORT GenAI Builder Translation</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Build the ONNX model targeting the DirectML execution provider first, passing the INT4 parameters.
                    </p>
                    <CodeBlock 
                      language="bash"
                      code={`python -m onnxruntime_genai.models.builder \\
  -i <path_to_qwen2_72b_hf> \\
  -o <dml_output_dir> \\
  -p int4 \\
  -e dml \\
  --extra_options int4_block_size=128 int4_is_symmetric=false int4_accuracy_level=3`} 
                    />
                  </div>

                  {/* Step 3: Hybrid Generation */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">4. Hybrid Packaging</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Package the model for Hybrid execution to leverage both the NPU and iGPU for this massive workload.
                    </p>
                    <CodeBlock 
                      language="bash"
                      code={`model_generate --hybrid <final_hybrid_dir> <dml_output_dir>`} 
                    />
                  </div>

                </div>
              </div>

              {/* Recipe 2: Qwen3-8B */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Qwen3-8B Hybrid</h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">amd/Qwen3-8B-awq-quant-onnx-ryzenai-1.7-hybrid</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Hybrid Execution
                  </span>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Strategy Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 text-indigo-600">1. The Quantization Strategy</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Algorithm</p>
                        <p className="font-semibold text-slate-900">AWQ</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Group Size</p>
                        <p className="font-semibold text-slate-900">128</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Weights</p>
                        <p className="font-semibold text-slate-900">UINT4 (Asymmetric)</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Activations</p>
                        <p className="font-semibold text-slate-900">BFP16</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Quark */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">2. AMD Quark Configuration</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      To achieve this specific quantization strategy, the AMD Quark <code>QuantizationConfig</code> is configured to use AWQ calibration, unsigned 4-bit weights, and BFloat16 activations.
                    </p>
                    <CodeBlock 
                      language="python"
                      code={`from quark.torch.quantization.config.config import QuantizationConfig, Config
from quark.torch.quantization.config.type import QuantType, ScaleType

quant_config = QuantizationConfig(
    calibrate_method="AWQ",
    weight_type=QuantType.QUInt4,       # UINT4 Weights
    activation_type=QuantType.BFloat16, # BFP16 Activations
    group_size=128,                     # Group 128
    extra_options={'WeightSymmetric': False} # Asymmetric
)

config = Config(global_quant_config=quant_config)`} 
                    />
                  </div>

                  {/* Step 2: ORT Builder */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">3. ORT GenAI Builder Translation</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      When building the ONNX model, these exact parameters map to specific <code>--extra_options</code> in the ORT GenAI Builder CLI:
                    </p>
                    <ul className="text-sm text-slate-600 list-disc list-inside mb-4 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <li><code>int4_block_size=128</code> maps to <strong>Group 128</strong>.</li>
                      <li><code>int4_is_symmetric=false</code> maps to <strong>Asymmetric UINT4</strong>.</li>
                      <li><code>int4_accuracy_level=3</code> maps to <strong>BFP16 activations</strong>.</li>
                    </ul>
                    <CodeBlock 
                      language="bash"
                      code={`python -m onnxruntime_genai.models.builder \\
  -i <hf_model_path> \\
  -o <dml_output_dir> \\
  -p int4 \\
  -e dml \\
  --extra_options int4_block_size=128 int4_is_symmetric=false int4_accuracy_level=3`} 
                    />
                  </div>

                  {/* Step 3: Hybrid Generation */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">4. Hybrid Packaging</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Finally, because this is a Hybrid model, the DML output is packaged into a hybrid format that can dynamically split the workload between the NPU and iGPU.
                    </p>
                    <CodeBlock 
                      language="bash"
                      code={`model_generate --hybrid <final_hybrid_dir> <dml_output_dir>`} 
                    />
                  </div>

                </div>
              </div>

              {/* Recipe 3: Qwen2-7B Advanced Vitis Config */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Qwen2-7B-Instruct (Advanced Architecture Mapping)</h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">Vitis AI Compiler JSON Configuration</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Vitis AI / Quark
                  </span>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Context */}
                  <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-2 flex items-center">
                      <Info size={16} className="mr-2" /> Handling Architecture Differences
                    </h4>
                    <p className="text-sm text-emerald-800/80">
                      Different models (e.g., Llama vs Qwen2) name their internal layers differently (like <code>self_attn.q_proj</code> vs <code>attn.Wq</code>). When applying advanced quantization like AWQ, the compiler needs to know exactly which layers to scale. This recipe uses a direct JSON configuration pass to explicitly map the Qwen2 architecture for the Vitis AI compiler.
                    </p>
                  </div>

                  {/* Step 1: The JSON Config */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">1. Compiler Pass Configuration</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Instead of using the Python API, you can pass a highly detailed JSON configuration directly to the compiler. Notice the <code>scaling_layers</code> array—this is where we explicitly tell the AWQ algorithm how to navigate the Qwen2 attention and MLP blocks.
                    </p>
                    <CodeBlock 
                      language="json"
                      code={`{
    "input_model": { "type": "HFModel", "model_path": "Qwen/Qwen2-7B-Instruct" },
    "passes": {
        "qq": {
            "type": "QuarkQuantization",
            "quant_scheme": "w_uint4_per_group_asym",
            "quant_algo": "awq",
            "dataset": "pileval_for_awq_benchmark",
            "data_type": "bfloat16",
            "num_calib_data": 128,
            "model_export": [ "hf_format" ],
            "exclude_layers": [  ],
            "quant_config": {
                "name": "awq",
                "scaling_layers": [
                    {
                        "prev_op": "input_layernorm",
                        "layers": [ "self_attn.q_proj", "self_attn.k_proj", "self_attn.v_proj" ],
                        "inp": "self_attn.q_proj",
                        "module2inspect": "self_attn"
                    },
                    { "prev_op": "self_attn.v_proj", "layers": [ "self_attn.o_proj" ], "inp": "self_attn.o_proj" },
                    {
                        "prev_op": "post_attention_layernorm",
                        "layers": [ "mlp.gate_proj", "mlp.up_proj" ],
                        "inp": "mlp.gate_proj",
                        "module2inspect": "mlp"
                    },
                    { "prev_op": "mlp.up_proj", "layers": [ "mlp.down_proj" ], "inp": "mlp.down_proj" }
                ],
                "model_decoder_layers": "model.layers"
            }
        },
        "mg": { "type": "VitisGenerateModelLLM", "packed_const": false, "cpu_only": false }
    },
    "log_severity_level": 1,
    "output_dir": "models/Qwen2-7B-Instruct-vai",
    "cache_dir": "cache",
    "no_artifacts": true
}`} 
                    />
                  </div>

                  {/* Strategy Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 text-indigo-600">2. Why these specific settings?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 mb-2">w_uint4_per_group_asym</p>
                        <p className="text-xs text-slate-600">
                          This is the optimal setting for edge devices. It packs the weights into Unsigned 4-bit integers asymmetrically per group. This drastically reduces memory bandwidth requirements (the main bottleneck for LLMs on edge) while maintaining accuracy.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 mb-2">scaling_layers Mapping</p>
                        <p className="text-xs text-slate-600">
                          AWQ works by observing activations and scaling salient weights. By explicitly defining <code>prev_op</code> and <code>layers</code>, we prevent the compiler from guessing the architecture, ensuring the AWQ scales are applied perfectly to Qwen2's specific <code>self_attn</code> and <code>mlp</code> projections.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Recipe 4: KAT-40B Hybrid */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Kwaipilot-AutoThink (KAT-40B) Hybrid Deployment</h3>
                    <p className="text-sm text-slate-500 font-mono mt-1">40B Parameters • 80 Layers • AutoThink Architecture</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Hybrid / Full Fusion
                  </span>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Context */}
                  <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center">
                      <Info size={16} className="mr-2" /> Why this strategy?
                    </h4>
                    <p className="text-sm text-indigo-800/80">
                      The KAT-40B model is massive. Even at INT4, the weights alone consume ~20GB of RAM. Furthermore, its "AutoThink" capability means it dynamically switches between reasoning and non-reasoning modes, leading to highly variable KV cache sizes. <strong>Hybrid execution with Full Fusion</strong> is the only way to run this efficiently on a Ryzen AI PC. It offloads the heavy matrix multiplications to the NPU while keeping the dynamic KV cache management and attention mechanisms on the high-bandwidth iGPU.
                    </p>
                  </div>

                  {/* Step 1: ORT Builder */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">1. ORT GenAI Builder Configuration</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      First, we build the ONNX model targeting DirectML (DML) with aggressive INT4 quantization. The <code>int4_accuracy_level=3</code> flag ensures we use BFP16 for activations, which is critical to maintain the logical reasoning capabilities of the AutoThink model.
                    </p>
                    <CodeBlock 
                      language="bash"
                      code={`python -m onnxruntime_genai.models.builder \\
  -i <path_to_kat_40b_hf> \\
  -o <dml_output_dir> \\
  -p int4 \\
  -e dml \\
  --extra_options int4_block_size=128 int4_is_symmetric=false int4_accuracy_level=3`} 
                    />
                  </div>

                  {/* Step 2: Hybrid Generation */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 text-indigo-600">2. Hybrid Packaging & Optimization</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      This is the crucial step for KAT-40B. We use <code>model_generate</code> to package the DML model into a Hybrid format. We specifically apply the <code>--optimize full_fusion</code> flag.
                    </p>
                    <CodeBlock 
                      language="bash"
                      code={`model_generate --hybrid \\
  --optimize full_fusion \\
  <final_hybrid_dir> \\
  <dml_output_dir>`} 
                    />
                  </div>

                  {/* Strategy Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 text-indigo-600">3. Why these specific settings?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 mb-2">--hybrid Target</p>
                        <p className="text-xs text-slate-600">
                          For a 40B model, the NPU alone cannot hold the entire graph and KV cache. The hybrid target splits the ONNX graph: compute-heavy linear layers go to the NPU (XDNA), while memory-bound attention layers stay on the iGPU (DirectML).
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 mb-2">--optimize full_fusion</p>
                        <p className="text-xs text-slate-600">
                          This flag tells the compiler to aggressively fuse operations (like MatMul + Add + Activation) into single, monolithic nodes for the NPU. This minimizes the data transfer overhead between the CPU, iGPU, and NPU, which is critical for maintaining high token generation rates during KAT's "Think-on" reasoning phases.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* OPTIMIZATION PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="p-8 animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">End-to-End Optimization Pipeline</h2>
              <p className="text-slate-600">A coherent, step-by-step workflow for preparing, optimizing, and quantizing models for Ryzen AI NPUs.</p>
            </div>

            <div className="space-y-12">
              
              {/* Phase 1: Export & Sanitize */}
              <div className="relative pl-8 border-l-2 border-indigo-200 pb-4">
                <div className="absolute -left-[13px] top-0 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><FileCode2 className="mr-2 text-indigo-600" size={24}/> Export & Sanitize</h3>
                <p className="text-sm text-slate-600 mb-6">Start by exporting your PyTorch model to ONNX and fixing common export artifacts.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* PyTorch Export */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">A. Export PyTorch to ONNX</h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Use the TorchScript-based exporter. Run <code>model.eval()</code> first, use <strong>opset 21+</strong>, and ensure fixed input shapes with batch size 1 for NPU_CNN platforms.
                    </p>
                    <CodeBlock 
                      language="python"
                      code={`import torch
model.eval()
torch.onnx.export(
    model, input, "qwen2_7b_instruct.onnx",
    opset_version=21,
    input_names=['input'], output_names=['output'],
)`} 
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Fix Shapes */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">B. Fix Missing Tensor Shapes</h4>
                      <p className="text-xs text-slate-500 mb-2">ONNX models often miss tensor shapes, causing Vitis AI compilation to fail. This tool infers and assigns them.</p>
                      <CodeBlock 
                        language="bash"
                        code={`python -m quark.onnx.tools.fix_shapes \\
  --input_model_path qwen2_7b_instruct.onnx \\
  --output_model_path qwen2_7b_instruct_fixed.onnx`} 
                      />
                    </div>

                    {/* Replace INF */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">C. Sanitize Weights (Replace Inf)</h4>
                      <p className="text-xs text-slate-500 mb-2">PyTorch exports sometimes leave <code>inf</code> or <code>-inf</code> values in weights, breaking quantization.</p>
                      <CodeBlock 
                        language="bash"
                        code={`python -m quark.onnx.tools.replace_inf_weights \\
  --input_model qwen2_7b_instruct_fixed.onnx \\
  --output_model qwen2_7b_instruct_clean.onnx`} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2: Pre-process */}
              <div className="relative pl-8 border-l-2 border-emerald-200 pb-4">
                <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Settings2 className="mr-2 text-emerald-600" size={24}/> Pre-process Float Model</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Pre-processing prepares the float model for quantization by performing symbolic shape inference, model optimization (fusing nodes like Conv+BatchNorm), and ONNX shape inference. 
                </p>
                
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-emerald-900">Run Shape Inference & Optimization</h4>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Warning for &gt; 2GB Models</span>
                  </div>
                  <p className="text-xs text-emerald-800/80 mb-4">
                    ONNX Runtime model optimization cannot output models larger than 2GB. For large LLMs, you <strong>must</strong> set <code>skip_optimization=True</code> and <code>save_as_external_data=True</code>.
                  </p>
                  <CodeBlock 
                    language="python"
                    code={`from onnxruntime.quantization import shape_inference

shape_inference.quant_pre_process(
    input_model_path="qwen2_7b_instruct_clean.onnx",
    output_model_path="qwen2_7b_instruct_preprocessed.onnx",
    skip_optimization=True, # MUST be True for models > 2GB
    skip_onnx_shape=False,
    skip_symbolic_shape=False,
    save_as_external_data=True, # Required for models > 2GB
)`} 
                  />
                </div>
              </div>

              {/* Phase 3: Precision Strategy */}
              <div className="relative pl-8 border-l-2 border-amber-200 pb-4">
                <div className="absolute -left-[13px] top-0 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Combine className="mr-2 text-amber-600" size={24}/> Precision Strategy</h3>
                <p className="text-sm text-slate-600 mb-6">Choose between fast direct data type conversion or highly compressed calibration-based quantization.</p>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Path A: Direct Conversion */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Path A: Direct Conversion</h4>
                    <p className="text-xs text-slate-500 mb-4">No calibration dataset required. Fast conversion to NPU-friendly formats.</p>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-900 mb-1">Convert FP16 to BFP16</h5>
                        <CodeBlock 
                          language="bash"
                          code={`python -m quark.onnx.tools.convert_fp16_to_bfp16 \\
  --input qwen2_7b_instruct_preprocessed.onnx --output qwen2_7b_instruct_bfp16.onnx \\
  --save_as_external_data`} 
                        />
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-900 mb-1">Convert FP16 to BF16</h5>
                        <CodeBlock 
                          language="bash"
                          code={`python -m quark.onnx.tools.convert_fp16_to_bf16 \\
  --input qwen2_7b_instruct_preprocessed.onnx --output qwen2_7b_instruct_bf16.onnx \\
  --format with_cast --save_as_external_data`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Path B: AMD Quark Quantization */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Path B: AMD Quark Quantization</h4>
                    <p className="text-xs text-slate-500 mb-4">Requires calibration dataset. Achieves maximum compression (INT8, BFP16 AdaQuant).</p>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-900 mb-1">Basic BFP16 Configuration</h5>
                        <p className="text-[10px] text-slate-500 mb-2">Enable BFP16 for both input tensors and weights.</p>
                        <CodeBlock 
                          language="python"
                          code={`from quark.onnx import QConfig, QLayerConfig, BFP16Spec
config = QConfig(global_config=QLayerConfig(input_tensors=BFP16Spec(), weight=BFP16Spec()))`} 
                        />
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-900 mb-1">BFP16 with AdaQuant (fast_finetune)</h5>
                        <p className="text-[10px] text-slate-500 mb-2">
                          <strong>Note:</strong> BFP QuantType only supports <code>AdaQuant</code> (not AdaRound). Install <code>onnxruntime-gpu</code> and set <code>InferDevice</code> and <code>OptimDevice</code> to <code>cuda:0</code> to accelerate training.
                        </p>
                        <CodeBlock 
                          language="python"
                          code={`from quark.onnx import QConfig, QLayerConfig, BFP16Spec, AdaQuantConfig
config = QConfig(
    global_config=QLayerConfig(input_tensors=BFP16Spec(), weight=BFP16Spec()), 
    algo_config=[AdaQuantConfig(num_iterations=100, learning_rate=1e-6, batch_size=5, data_size=100, early_stop=True)]
)`} 
                        />
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-900 mb-1 flex justify-between">
                          Dummy Quantization (Profiling)
                          <span className="text-[10px] text-amber-600 font-normal">No dataset needed</span>
                        </h5>
                        <CodeBlock 
                          language="bash"
                          code={`python -m quark.onnx.tools.random_quantize \\
  --input_model_path qwen2_7b_instruct_preprocessed.onnx \\
  --quantized_model_path qwen2_7b_instruct_quant.onnx`} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 4: Evaluate & Debug */}
              <div className="relative pl-8 border-l-2 border-transparent pb-4">
                <div className="absolute -left-[13px] top-0 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">4</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Bug className="mr-2 text-rose-600" size={24}/> Evaluate & Debug</h3>
                <p className="text-sm text-slate-600 mb-6">Run inference on the quantized model and dump simulation results to compare against DPU hardware.</p>
                
                <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100 shadow-sm">
                  <h4 className="text-sm font-semibold text-rose-900 mb-2">Register Custom Ops & Dump Results</h4>
                  <p className="text-xs text-rose-800/80 mb-4">
                    If using BFP/BF16/FP16/int32, you <strong>must register the custom ops library</strong> before creating the InferenceSession. Use <code>dump_model</code> to extract intermediate tensor values.
                  </p>
                  <CodeBlock 
                    language="python"
                    code={`import onnxruntime as ort
from quark.onnx import get_library_path as vai_lib_path

# 1. Register Custom Ops for Evaluation (Dynamic Device Detection)
if 'ROCMExecutionProvider' in ort.get_available_providers():
    device = 'ROCM'
    providers = ['ROCMExecutionProvider']
elif 'CUDAExecutionProvider' in ort.get_available_providers():
    device = 'CUDA'
    providers = ['CUDAExecutionProvider']
else:
    device = 'CPU'
    providers = ['CPUExecutionProvider']

so = ort.SessionOptions()
so.register_custom_ops_library(vai_lib_path(device))
session = ort.InferenceSession("qwen2_7b_instruct_quant.onnx", so, providers=providers)

# 2. Dump Simulation Results for DPU Debugging
import quark.onnx
quark.onnx.dump_model(
    "qwen2_7b_instruct_quant.onnx",
    dump_data_reader=None, # Set to None to use random data for quick testing
    dump_float=False,      # Set to True to save float data (requires massive storage)
    output_dir='./dump_results'
)`} 
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ORT GENAI BUILDER */}
        {activeTab === 'builder' && (
          <div className="p-8 animate-in fade-in duration-300 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">ORT GenAI Model Builder</h2>
                <p className="text-sm text-slate-500 mt-1">Configure parameters for <code className="text-xs bg-slate-100 px-1 rounded">onnxruntime_genai.models.builder</code></p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Input Source (-i)</label>
                  <input 
                    type="text" 
                    value={bInput}
                    onChange={(e) => setBInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Path to HF config/model or GGUF file"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Output Directory (-o)</label>
                  <input 
                    type="text" 
                    value={bOutput}
                    onChange={(e) => setBOutput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Path to store ONNX model"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Precision (-p)</label>
                    <select 
                      value={bPrecision}
                      onChange={(e) => setBPrecision(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="int4">int4</option>
                      <option value="bf16">bf16</option>
                      <option value="fp16">fp16</option>
                      <option value="fp32">fp32</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Execution Provider (-e)</label>
                    <select 
                      value={bEp}
                      onChange={(e) => setBEp(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="dml">dml (DirectML)</option>
                      <option value="cpu">cpu</option>
                      <option value="cuda">cuda</option>
                      <option value="webgpu">webgpu</option>
                      <option value="NvTensorRtRtx">NvTensorRtRtx</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Extra Options</label>
                  <input 
                    type="text" 
                    value={bExtra}
                    onChange={(e) => setBExtra(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. int4_block_size=32 int4_is_symmetric=true"
                  />
                  <p className="text-xs text-slate-500 mt-1">Space-separated KEY=VALUE pairs.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Generated Command</h3>
              <div className="flex-1">
                <CodeBlock code={generateBuilderCmd()} />
              </div>
              <div className="mt-4 text-xs text-slate-500 bg-white p-3 rounded border border-slate-200">
                <strong>Tip:</strong> Ensure you have activated your conda environment (<code>conda activate ryzen-ai-&lt;version&gt;</code>) before running this command.
              </div>
            </div>
          </div>
        )}

        {/* MODEL GENERATE */}
        {activeTab === 'generate' && (
          <div className="p-8 animate-in fade-in duration-300 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Model Generate Tool</h2>
                <p className="text-sm text-slate-500 mt-1">Configure parameters for <code className="text-xs bg-slate-100 px-1 rounded">model_generate</code></p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Mode</label>
                  <select 
                    value={gTarget}
                    onChange={(e) => setGTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="--hybrid">--hybrid</option>
                    <option value="--npu">--npu</option>
                    <option value="--dml">--dml</option>
                    <option value="--cpu">--cpu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Input Model</label>
                  <input 
                    type="text" 
                    value={gInput}
                    onChange={(e) => setGInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Path to input model directory"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Output Directory</label>
                  <input 
                    type="text" 
                    value={gOutput}
                    onChange={(e) => setGOutput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Path to store generated model"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Optimize (Optional)</label>
                  <select 
                    value={gOptimize}
                    onChange={(e) => setGOptimize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">None</option>
                    <option value="prefill">prefill</option>
                    <option value="prefill_llama3">prefill_llama3</option>
                    <option value="decode">decode</option>
                    <option value="full_fusion">full_fusion</option>
                    <option value="full_fusion_llama3">full_fusion_llama3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Generated Command</h3>
              <div className="flex-1">
                <CodeBlock code={generateModelCmd()} />
              </div>
              <div className="mt-4 text-xs text-slate-500 bg-white p-3 rounded border border-slate-200">
                <strong>Usage:</strong> Used to generate hybrid models or package models for specific execution targets after initial ONNX conversion.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
