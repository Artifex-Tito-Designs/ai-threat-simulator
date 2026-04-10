'use client';

import { useWalkthroughStore } from '@/stores/walkthroughStore';

export function StepTimeline() {
  const { scenario, currentStepIndex, jumpToStep } = useWalkthroughStore();

  if (!scenario) return null;

  return (
    <div className="flex items-center gap-1" role="tablist" aria-label="Walkthrough steps">
      {scenario.steps.map((step, i) => {
        const isCurrent = i === currentStepIndex;
        const isCompleted = i < currentStepIndex;
        const isFuture = i > currentStepIndex;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isCurrent}
            aria-label={`Step ${i + 1}: ${step.title}`}
            onClick={() => jumpToStep(i)}
            className={`relative w-8 h-1.5 rounded-full transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1E293B] ${
              isCurrent ? 'bg-blue-500 shadow-sm shadow-blue-500/30'
              : isCompleted ? 'bg-red-500/60 hover:bg-red-500/80'
              : isFuture ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-700'
            }`}
            title={`Step ${i + 1}: ${step.title}`}
          />
        );
      })}
    </div>
  );
}
