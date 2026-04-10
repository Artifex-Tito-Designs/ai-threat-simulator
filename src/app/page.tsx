'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Layers, GitBranch, Crosshair, ArrowRight, Zap } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/Icons';
import { RiskScoreGauge } from '@/components/ui/RiskScoreGauge';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/motion';
import type { LucideIcon } from 'lucide-react';

const categories = [
  {
    slug: 'generative',
    label: 'Generative',
    color: '#EF4444',
    count: 25,
    threats: ['Prompt Injection', 'Data Disclosure', 'Supply Chain'],
  },
  {
    slug: 'agentic',
    label: 'Agentic',
    color: '#3B82F6',
    count: 18,
    threats: ['Excessive Agency', 'Insecure Plugins', 'Prompt Injection'],
  },
  {
    slug: 'interpretive',
    label: 'Interpretive',
    color: '#22C55E',
    count: 15,
    threats: ['Data Poisoning', 'Model Theft', 'Output Handling'],
  },
  {
    slug: 'predictive',
    label: 'Predictive',
    color: '#A855F7',
    count: 20,
    threats: ['Training Poisoning', 'Model Inversion', 'Denial of Service'],
  },
  {
    slug: 'prescriptive',
    label: 'Prescriptive',
    color: '#EAB308',
    count: 8,
    threats: ['Excessive Agency', 'Insecure Output', 'Data Poisoning'],
  },
  {
    slug: 'descriptive',
    label: 'Descriptive',
    color: '#F97316',
    count: 9,
    threats: ['Data Poisoning', 'Supply Chain', 'Model Theft'],
  },
];

const stats: { label: string; value: string; color: string; Icon: LucideIcon }[] = [
  { label: 'AI Solutions Mapped', value: '95', color: '#3B82F6', Icon: Layers },
  { label: 'OWASP LLM Threats', value: '10', color: '#EF4444', Icon: Shield },
  { label: 'Architecture Patterns', value: '6', color: '#22C55E', Icon: GitBranch },
  { label: 'Attack Scenarios', value: '1', color: '#F59E0B', Icon: Crosshair },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #1E293B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Hero section with Risk Gauge */}
        <motion.div
          className="mb-8 flex flex-col lg:flex-row items-start lg:items-center gap-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/20">
                <Zap className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-red-400/80">
                Security Training Platform
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-50 mb-3 tracking-tight">
              AI Threat Simulator
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Interactive training platform for understanding, simulating, and defending against
              AI-specific security threats across logistics and freight forwarding operations.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <Link
                href="/scenarios"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-blue-500/15 text-blue-400 border border-blue-500/25
                  hover:bg-blue-500/25 hover:border-blue-500/40 transition-all duration-200
                  focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Launch Scenarios
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Risk Score Gauge */}
          <motion.div
            className="relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50
              backdrop-blur-sm shadow-xl shadow-black/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <RiskScoreGauge
              score={68}
              label="Overall AI Risk Posture"
              size={180}
            />
            <div className="mt-4 pt-3 border-t border-slate-700/50 grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">4</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">6</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">High</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-xl border border-slate-700/60
                bg-slate-800/40 backdrop-blur-sm px-4 py-4
                hover:border-slate-600/80 hover:bg-slate-800/60
                hover:shadow-lg hover:shadow-black/30 transition-all duration-300"
            >
              {/* Top gradient bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}00)` }}
              />
              {/* Corner glow */}
              <div
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: stat.color }}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-50 tracking-tight">{stat.value}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{stat.label}</div>
                </div>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${stat.color}12` }}
                >
                  <stat.Icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Categories */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Solution Categories
          </h2>
          <Link
            href="/scenarios"
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={staggerItem}>
              <Link
                href={`/scenarios?category=${cat.slug}`}
                className="group block rounded-xl border border-slate-700/60
                  bg-slate-800/40 backdrop-blur-sm p-4
                  hover:border-slate-600/80 hover:bg-slate-800/60
                  hover:shadow-lg hover:shadow-black/30
                  transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                      group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: `${cat.color}12`,
                      boxShadow: `0 0 0 1px ${cat.color}15`,
                    }}
                  >
                    <CategoryIcon slug={cat.slug} className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] text-slate-500">{cat.count} solutions</span>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-slate-600 group-hover:text-slate-400
                      group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  />
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full bg-slate-700/40 mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: cat.color,
                      width: `${(cat.count / 25) * 100}%`,
                      boxShadow: `0 0 8px ${cat.color}40`,
                    }}
                  />
                </div>

                {/* Threat tags */}
                <div className="flex flex-wrap gap-1">
                  {cat.threats.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-500
                        border border-slate-700/30 group-hover:text-slate-400 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-5"
        >
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-blue-300">Quick Start</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Select a category above to explore architecture diagrams, threat mappings, and
                interactive attack walkthroughs for each AI solution pattern.
              </p>
            </div>
            <Link
              href="/scenarios"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-blue-500/15 text-blue-400 border border-blue-500/25
                hover:bg-blue-500/25 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Explore
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
