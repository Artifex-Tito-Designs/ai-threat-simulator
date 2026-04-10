'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CategoryIcon } from '@/components/ui/Icons';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/motion';

const categories = [
  { slug: 'agentic', label: 'Agentic', color: '#3B82F6', count: 18 },
  { slug: 'descriptive', label: 'Descriptive', color: '#F97316', count: 9 },
  { slug: 'generative', label: 'Generative', color: '#EF4444', count: 25 },
  { slug: 'interpretive', label: 'Interpretive', color: '#22C55E', count: 15 },
  { slug: 'predictive', label: 'Predictive', color: '#A855F7', count: 20 },
  { slug: 'prescriptive', label: 'Prescriptive', color: '#EAB308', count: 8 },
];

const stats = [
  { label: 'AI Solutions', value: '95', color: '#3B82F6' },
  { label: 'OWASP Categories', value: '10', color: '#EF4444' },
  { label: 'Architecture Patterns', value: '6', color: '#22C55E' },
  { label: 'Attack Scenarios', value: '1', color: '#F59E0B' },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">AI Threat Simulator</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Interactive training platform for understanding, simulating, and defending against
          AI-specific security threats across logistics and freight forwarding operations.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className="relative overflow-hidden bg-slate-800/50 border border-slate-700/80 rounded-lg px-4 py-3
              hover:border-slate-600 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
            />
            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Categories */}
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        Solution Categories
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {categories.map((cat) => (
          <motion.div key={cat.slug} variants={staggerItem}>
            <Link
              href={`/scenarios?category=${cat.slug}`}
              className="block bg-slate-800/50 border border-slate-700/80 rounded-lg p-4
                hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-black/20
                transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <CategoryIcon slug={cat.slug} className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {cat.label}
                  </h3>
                  <span className="text-xs text-slate-500">{cat.count} solutions</span>
                </div>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: `${cat.color}15` }}>
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:shadow-sm"
                  style={{
                    backgroundColor: cat.color,
                    width: `${(cat.count / 25) * 100}%`,
                    boxShadow: `0 0 8px ${cat.color}40`,
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4"
      >
        <h3 className="text-sm font-semibold text-blue-400 mb-1">Quick Start</h3>
        <p className="text-xs text-slate-400">
          Select a category above or go to{' '}
          <Link href="/scenarios" className="text-blue-400 hover:underline">Scenarios</Link>{' '}
          to explore architecture diagrams and threat mappings for each AI solution pattern.
        </p>
      </motion.div>
    </div>
  );
}
