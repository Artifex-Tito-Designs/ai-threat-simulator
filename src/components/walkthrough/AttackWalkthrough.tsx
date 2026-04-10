'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { WalkthroughControls } from './WalkthroughControls';
import { WalkthroughStepDetail } from './WalkthroughStepDetail';
import { StepTimeline } from './StepTimeline';
import { useWalkthroughStore } from '@/stores/walkthroughStore';
import { SeverityBadge } from '@/components/ui/Badge';
import { WALKTHROUGH_TIMING } from '@/lib/constants';

interface AttackWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttackWalkthrough({ isOpen, onClose }: AttackWalkthroughProps) {
  const { scenario, status, speed, stepForward, reset } = useWalkthroughStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (status === 'playing') {
      intervalRef.current = setInterval(() => {
        stepForward();
      }, WALKTHROUGH_TIMING.autoPlayInterval / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, speed, stepForward]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const store = useWalkthroughStore.getState();
      switch (e.key) {
        case ' ':
          e.preventDefault();
          store.status === 'playing' ? store.pause() : store.play();
          break;
        case 'ArrowRight':
          e.preventDefault();
          store.stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          store.stepBackward();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && scenario && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="border-t border-slate-700 bg-[#0B1120] overflow-hidden"
        >
          <div className="p-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-slate-100">{scenario.name}</h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                  {scenario.threatId}
                </span>
                <SeverityBadge
                  severity={scenario.difficulty === 'advanced' ? 'high' : scenario.difficulty === 'intermediate' ? 'medium' : 'low'}
                />
              </div>
              <button
                onClick={() => { reset(); onClose(); }}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors
                  focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close walkthrough"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Controls + Timeline */}
            <div className="flex items-center justify-between mb-4">
              <WalkthroughControls />
              <StepTimeline />
            </div>

            {/* Step detail */}
            <div className="min-h-[160px]">
              <WalkthroughStepDetail />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
