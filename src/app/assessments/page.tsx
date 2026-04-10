'use client';

import { motion } from 'framer-motion';
import { ClipboardList, FileText, BarChart3, Download } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const features = [
  { Icon: FileText, label: 'Assessment Reports', description: 'Generate structured security findings from completed attack simulations' },
  { Icon: BarChart3, label: 'Risk Scoring', description: 'NIST AI RMF aligned risk ratings with residual risk analysis' },
  { Icon: Download, label: 'PDF Export', description: 'Export vendor evaluation documents for compliance and procurement teams' },
];

export default function AssessmentsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Assessments"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Assessments' }]}
      />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 border border-green-500/20 flex items-center justify-center mb-5 mx-auto">
            <ClipboardList className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Assessments</h1>
          <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
            Generate structured security assessment documents from completed attack simulations
            for vendor evaluations and compliance reporting.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              variants={staggerItem}
              className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4 text-left"
            >
              <f.Icon className="w-5 h-5 text-green-400/70 mb-2" />
              <h3 className="text-xs font-semibold text-slate-200 mb-1">{f.label}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <span className="text-xs text-slate-500 bg-slate-800/40 border border-slate-700/40 rounded-full px-4 py-1.5 font-medium">
          Coming in Phase 4
        </span>
      </div>
    </div>
  );
}
