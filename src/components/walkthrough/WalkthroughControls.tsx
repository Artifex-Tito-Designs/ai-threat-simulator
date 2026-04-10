'use client';

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useWalkthroughStore } from '@/stores/walkthroughStore';
import { WALKTHROUGH_TIMING } from '@/lib/constants';

export function WalkthroughControls() {
  const { status, scenario, currentStepIndex, speed, play, pause, stepForward, stepBackward, reset, setSpeed } =
    useWalkthroughStore();

  if (!scenario) return null;
  const totalSteps = scenario.steps.length;
  const isPlaying = status === 'playing';
  const isFinished = status === 'finished';
  const canStepBack = currentStepIndex > 0;
  const canStepForward = currentStepIndex < totalSteps - 1;
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex items-center gap-3" role="toolbar" aria-label="Walkthrough controls">
      {/* Transport controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={reset}
          disabled={status === 'idle'}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Reset"
          title="Reset walkthrough"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={stepBackward}
          disabled={!canStepBack}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Previous step"
          title="Previous step"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={isPlaying ? pause : play}
          className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play'}
          title={isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={stepForward}
          disabled={!canStepForward && !isFinished}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Next step"
          title="Next step"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Step counter */}
      <div aria-live="polite" className="text-xs text-slate-400 font-mono min-w-[80px]">
        Step {Math.max(0, currentStepIndex + 1)}/{totalSteps}
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden max-w-[200px]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: isFinished ? '#EF4444' : '#3B82F6',
          }}
        />
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1">
        {WALKTHROUGH_TIMING.speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
              speed === s
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            aria-label={`${s}x speed`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
