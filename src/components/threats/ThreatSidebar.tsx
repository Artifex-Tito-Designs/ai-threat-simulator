'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreatCard } from './ThreatCard';
import { useScenarioStore } from '@/stores/scenarioStore';
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons';
import { staggerContainer, staggerItem } from '@/lib/motion';
import type { Severity } from '@/lib/types';

interface ThreatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ThreatSidebar({ isCollapsed, onToggle }: ThreatSidebarProps) {
  const { threats, architecture } = useScenarioStore();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');

  const applicableThreats = useMemo(() => {
    if (!architecture) return threats;
    return threats.filter((t) => architecture.applicableThreats.includes(t.id));
  }, [threats, architecture]);

  const filteredThreats = useMemo(() => {
    return applicableThreats.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || t.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [applicableThreats, search, severityFilter]);

  if (isCollapsed) {
    return (
      <div className="w-10 border-l border-slate-700 bg-[#1E293B] flex flex-col items-center pt-3">
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-700/50 transition-colors
            focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Expand threat sidebar"
          title="Show threats"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="mt-4 -rotate-90 whitespace-nowrap text-[10px] text-slate-500 uppercase tracking-widest">
          OWASP LLM Top 10
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[380px] border-l border-slate-700 bg-[#1E293B] flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-100">OWASP LLM Top 10</h2>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-700/50 transition-colors
              focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Collapse sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search threats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-600/50 rounded-md px-3 py-1.5 text-xs
            text-slate-200 placeholder:text-slate-500
            focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30
            transition-all"
        />

        {/* Severity filter */}
        <div className="flex gap-1 mt-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSeverityFilter(level)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150 ${
                severityFilter === level
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-sm shadow-blue-900/20'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Threat list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="wait">
          {filteredThreats.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-500 text-center py-8"
            >
              No matching threats
            </motion.p>
          ) : (
            <motion.div
              key={`${severityFilter}-${search}`}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-2"
            >
              {filteredThreats.map((threat) => (
                <motion.div key={threat.id} variants={staggerItem}>
                  <ThreatCard threat={threat} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer count */}
      <div className="px-4 py-2 border-t border-slate-700 shrink-0">
        <span className="text-[10px] text-slate-500">
          {filteredThreats.length} of {applicableThreats.length} threats
        </span>
      </div>
    </div>
  );
}
