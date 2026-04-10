import { FlaskConical } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
        <FlaskConical className="w-8 h-8 text-blue-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">Prompt Playground</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Live LLM sandbox for testing prompt injection attacks against simulated logistics AI systems
        with configurable defense toggles.
      </p>
      <span className="text-xs text-slate-500 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1">
        Coming in Phase 3
      </span>
    </div>
  );
}
