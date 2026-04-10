'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { ThreatCard } from './ThreatCard';
import { useScenarioStore } from '@/stores/scenarioStore';
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons';
import { severityColors } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';
import type { Severity } from '@/lib/types';

interface ThreatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const severityFilters = [
  { key: 'all' as const, label: 'All' },
  { key: 'critical' as const, label: 'Critical' },
  { key: 'high' as const, label: 'High' },
  { key: 'medium' as const, label: 'Medium' },
  { key: 'low' as const, label: 'Low' },
];

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

  // Count by severity
  const severityCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applicableThreats.length };
    applicableThreats.forEach((t) => {
      counts[t.severity] = (counts[t.severity] ?? 0) + 1;
    });
    return counts;
  }, [applicableThreats]);

  if (isCollapsed) {
    return (
      <button
        onClick={onToggle}
        className="w-11 border-l border-slate-700/50 bg-[#0B1120] flex flex-col items-center
          hover:bg-slate-800/60 transition-colors cursor-pointer
          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
        aria-label="Expand threat sidebar"
        title="Show threats"
      >
        <div className="pt-4 pb-3">
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-[10px] text-slate-500 uppercase tracking-widest font-medium"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            OWASP LLM Top 10
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-[400px] border-l border-slate-700/50 bg-[#0B1120] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-700/40 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">OWASP LLM Top 10</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">2025 Threat Taxonomy</p>
          </div>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors
              focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Collapse sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search threats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-xs
              text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
              transition-all"
          />
        </div>

        {/* Severity filter pills */}
        <div className="flex gap-1.5">
          {severityFilters.map(({ key, label }) => {
            const isActive = severityFilter === key;
            const count = severityCounts[key] ?? 0;
            const pillColor = key === 'all' ? '#3B82F6' : severityColors[key as Severity];

            return (
              <button
                key={key}
                onClick={() => setSeverityFilter(key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'shadow-sm'
                    : 'bg-slate-800/40 text-slate-500 border border-slate-700/30 hover:border-slate-600/50 hover:text-slate-400'
                }`}
                style={isActive ? {
                  color: pillColor,
                  backgroundColor: `${pillColor}15`,
                  border: `1px solid ${pillColor}30`,
                  boxShadow: `0 0 8px ${pillColor}10`,
                } : undefined}
              >
                <span>{label}</span>
                <span className={`text-[9px] ${isActive ? '' : 'text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Threat list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="wait">
          {filteredThreats.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center mb-3">
                <Search className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-xs text-slate-500">No matching threats</p>
              <p className="text-[10px] text-slate-600 mt-1">Try adjusting your filters</p>
            </motion.div>
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

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-700/40 shrink-0 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-medium">
          {filteredThreats.length} of {applicableThreats.length} threats
        </span>
        {severityFilter !== 'all' && (
          <button
            onClick={() => setSeverityFilter('all')}
            className="text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
