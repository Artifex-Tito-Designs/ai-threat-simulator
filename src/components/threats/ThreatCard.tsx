'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ThreatDefinition } from '@/lib/types';
import { SeverityBadge } from '@/components/ui/Badge';
import { useScenarioStore } from '@/stores/scenarioStore';
import { severityColors } from '@/lib/utils';
import { expandCollapse } from '@/lib/motion';

interface ThreatCardProps {
  threat: ThreatDefinition;
}

export function ThreatCard({ threat }: ThreatCardProps) {
  const { selectedThreatId, selectThreat } = useScenarioStore();
  const isSelected = selectedThreatId === threat.id;
  const accentColor = severityColors[threat.severity];

  return (
    <button
      onClick={() => selectThreat(isSelected ? null : threat.id)}
      className={`w-full text-left rounded-xl border transition-all duration-200 overflow-hidden
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1E293B] ${
        isSelected
          ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-900/20'
          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/80 hover:bg-slate-800/50 hover:shadow-md hover:shadow-black/20'
      }`}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: isSelected ? accentColor : 'transparent',
      }}
      aria-pressed={isSelected}
      aria-label={`${threat.id}: ${threat.name}`}
    >
      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
            {threat.id}
          </span>
          <SeverityBadge severity={threat.severity} />
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-semibold text-slate-100 mb-1.5 leading-snug">
          {threat.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-2">
          {threat.description}
        </p>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={expandCollapse}
            className="border-t border-slate-700/40"
          >
            <div className="p-3.5 space-y-3.5">
              {/* Logistics example */}
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Logistics Example
                </h4>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  {threat.logisticsExample}
                </p>
              </div>

              {/* Vendor questions */}
              {threat.vendorQuestions.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                    Vendor Questions
                  </h4>
                  <ul className="space-y-1.5">
                    {threat.vendorQuestions.slice(0, 3).map((q, i) => (
                      <li key={i} className="text-[12px] text-slate-400 flex gap-2 leading-relaxed">
                        <span className="text-slate-600 shrink-0 mt-0.5">&#8226;</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Affected components count */}
              <div className="flex items-center gap-2 pt-1">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    color: accentColor,
                    backgroundColor: `${accentColor}10`,
                    border: `1px solid ${accentColor}20`,
                  }}
                >
                  {threat.affectedComponents.length} affected components
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
