import React from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Minimize, 
  Cpu, 
  Package, 
  Play,
  ArrowRight,
  Info
} from 'lucide-react';

export default function LifecycleGlossary() {
  const steps = [
    {
      id: 1,
      title: '1. Base Model',
      icon: BrainCircuit,
      desc: 'Start with a standard trained model (e.g., PyTorch, HuggingFace).',
      why: 'Models are typically trained in high precision (FP32) on powerful cloud GPUs. They are too large and slow to run efficiently on edge devices like laptops.'
    },
    {
      id: 2,
      title: '2. Quantize & Build',
      icon: Minimize,
      desc: 'Convert to ONNX and reduce precision (INT8, INT4, BF16).',
      why: 'Shrinks the model size so it fits in device memory (RAM/VRAM) and replaces heavy math with faster, lower-precision math. Tools: ORT GenAI Builder, AMD Quark.'
    },
    {
      id: 3,
      title: '3. Compile',
      icon: Cpu,
      desc: 'Translate ONNX into hardware-specific instructions.',
      why: 'The NPU (Neural Processing Unit) has a unique architecture. Compilation creates an "xclbin" or "context" file that tells the NPU exactly how to execute the math operations.'
    },
    {
      id: 4,
      title: '4. Package (Hybrid)',
      icon: Package,
      desc: 'Combine model and compiled custom operators.',
      why: 'For large LLMs, some parts run best on the NPU and others on the GPU/CPU. Packaging creates a "Hybrid" model that the runtime can seamlessly split across hardware.'
    },
    {
      id: 5,
      title: '5. Deploy',
      icon: Play,
      desc: 'Run inference using C++ or Python APIs.',
      why: 'The final step where your application actually loads the optimized, compiled model into memory and passes user prompts to generate responses.'
    }
  ];

  const glossary = [
    {
      term: 'NPU (Neural Processing Unit)',
      def: 'A dedicated AI accelerator built into Ryzen AI processors. It is highly efficient, meaning it runs AI tasks while using very little battery power, leaving the CPU and GPU free for other tasks.'
    },
    {
      term: 'iGPU / Discrete GPU',
      def: 'Graphics Processing Units. They consume more power than the NPU but offer massive parallel compute throughput. Best for very large models or when plugged into power.'
    },
    {
      term: 'Hybrid Execution',
      def: 'A mode where the workload is dynamically split. For example, the NPU handles the heavy matrix math, while the iGPU handles memory-bandwidth-intensive token generation.'
    },
    {
      term: 'ONNX (Open Neural Network Exchange)',
      def: 'A universal, open-source format for AI models. Ryzen AI tools require your model to be converted to ONNX before they can optimize or compile it.'
    },
    {
      term: 'Execution Provider (EP)',
      def: 'A plugin for ONNX Runtime that tells it how to talk to specific hardware. "Vitis AI EP" talks to the AMD NPU. "DirectML EP" talks to the Windows GPU.'
    },
    {
      term: 'Quantization (INT8 / INT4 / BF16)',
      def: 'The process of rounding numbers. FP32 (32-bit) is highly accurate but huge. INT8 (8-bit) is 4x smaller and faster, but requires careful calibration to avoid losing AI "smartness". BF16 is a middle ground.'
    },
    {
      term: 'Prefill vs. Decode (Optimization)',
      def: '"Prefill" is processing the user\'s initial prompt (reading). "Decode" is generating the answer one word at a time (writing). You can optimize models specifically for one phase or the other.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Lifecycle & Glossary</h1>
        <p className="text-slate-500 mt-1">Understand the "Why" and "When" of the Ryzen AI deployment process.</p>
      </div>

      {/* The Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">The AI Deployment Order of Operations</h2>
          <p className="text-sm text-slate-500 mt-1">Why do we have so many steps? Here is how a model goes from the cloud to your local hardware.</p>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="flex items-start min-w-[800px]">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <step.icon size={24} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 pr-4">{step.desc}</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 pr-4 relative">
                    <span className="font-semibold text-indigo-600 block mb-1">Why do this?</span>
                    {step.why}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="pt-6 px-2 text-slate-300 shrink-0">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
          <BookOpen className="text-indigo-600 mr-3" size={20} />
          <h2 className="text-base font-semibold text-slate-900">Terminology Glossary</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {glossary.map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center">
                {item.term}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.def}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
