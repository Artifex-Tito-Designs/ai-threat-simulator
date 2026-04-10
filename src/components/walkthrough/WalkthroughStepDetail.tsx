'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Server, AlertTriangle } from 'lucide-react';
import { useWalkthroughStore } from '@/stores/walkthroughStore';
import { fadeIn } from '@/lib/motion';

export function WalkthroughStepDetail() {
  const { scenario, currentStepIndex, status } = useWalkthroughStore();

  if (!scenario || currentStepIndex < 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-xs">
        {status === 'idle' ? 'Press Play to begin the attack simulation' : 'Loading...'}
      </div>
    );
  }

  const step = scenario.steps[currentStepIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepIndex}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeIn}
        className="space-y-3"
      >
        {/* Step title */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
            {step.order}/{scenario.steps.length}
          </span>
          <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
        </div>

        {/* Three-column: Attacker | System | Impact */}
        <div className="grid grid-cols-3 gap-3">
          {/* Attacker action */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Crosshair className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Attacker</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{step.attackerAction}</p>
          </div>

          {/* System response */}
          <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Server className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">System</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{step.systemResponse}</p>
          </div>

          {/* Impact */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Impact</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{step.impact}</p>
          </div>
        </div>

        {/* Affected nodes chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-500">Affected:</span>
          {step.affectedNodeIds.map((nodeId) => (
            <span
              key={nodeId}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50"
            >
              {nodeId.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
