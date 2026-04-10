import { ClipboardList } from 'lucide-react';

export default function AssessmentsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-green-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">Assessments</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Generate structured security assessment documents from completed attack simulations
        for vendor evaluations and compliance reporting.
      </p>
      <span className="text-xs text-slate-500 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1">
        Coming in Phase 4
      </span>
    </div>
  );
}
