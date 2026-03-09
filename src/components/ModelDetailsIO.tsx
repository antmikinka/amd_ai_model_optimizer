import React from 'react';
import { Share2 } from 'lucide-react';

const inputs = [
  {
    name: 'input_ids',
    type: 'Int32',
    shape: '1 × 64',
    description: 'Input tokens. e.g. from the huggingface gpt2 tokenizer. Pad to the full length with 50256 (eos) on the left.'
  },
  {
    name: 'full_sequence_length',
    type: 'Int32',
    shape: '1',
    description: 'The length of the full input tokens. This length excludes padding and includes tokens that have moved outside of input_ids\' sliding window.'
  },
  {
    name: 'kv_cache',
    type: 'Float16',
    shape: '24 × 1 × 448 × 2048',
    description: 'Intermediary outputs from the prior prediction. For the first prediction, pass nothing to use the default array of all zeros. For subsequent predictions, pass the appropriate cache.'
  }
];

const outputs = [
  {
    name: 'logits',
    type: 'Float16',
    shape: '1 × 1 × 50257',
    description: 'Predictions for the next element after input_ids in the shape (1, 1, 50257).'
  },
  {
    name: 'prompt_kv_cache',
    type: 'Float16',
    shape: '24 × 1 × 448 × 2048',
    description: 'Intermediary outputs for the next prediction. Pass as the kv_cache input to the next prediction when evaluating the initial prompt.'
  },
  {
    name: 'generation_kv_cache',
    type: 'Float16',
    shape: '24 × 1 × 448 × 2048',
    description: 'Intermediary outputs for the next prediction. Pass as the kv_cache input to the next prediction after evaluating the initial prompt.'
  }
];

export default function ModelDetailsIO() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Inputs & Outputs</h1>
        <p className="text-slate-500 mt-1">Model signature and tensor specifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inputs Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Input</h2>
          <div className="space-y-4">
            {inputs.map((input, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-semibold text-slate-900">{input.name}</h3>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
                <div className="text-sm text-slate-600 font-mono mb-3">
                  Tensor ({input.type} {input.shape})
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700 block mb-1">Description</span>
                  {input.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outputs Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Output</h2>
          <div className="space-y-4">
            {outputs.map((output, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-semibold text-slate-900">{output.name}</h3>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
                <div className="text-sm text-slate-600 font-mono mb-3">
                  Tensor ({output.type} {output.shape})
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700 block mb-1">Description</span>
                  {output.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
