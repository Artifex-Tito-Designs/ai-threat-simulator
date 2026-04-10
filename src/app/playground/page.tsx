'use client';

import { motion } from 'framer-motion';
import { FlaskConical, Terminal, Shield, ToggleLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const features = [
  { Icon: Terminal, label: 'Live Prompt Testing', description: 'Send prompts to sandboxed logistics AI and observe responses in real time' },
  { Icon: Shield, label: 'Defense Toggles', description: 'Enable or disable input validation, output filtering, and system prompt guards' },
  { Icon: ToggleLeft, label: 'Attack Modes', description: 'Switch between direct injection, indirect injection, and data exfiltration scenarios' },
];

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Playground"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Playground' }]}
      />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15
            border border-blue-500/20 flex items-center justify-center mb-5 mx-auto">
            <FlaskConical className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Prompt Playground</h1>
          <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
            Live LLM sandbox for testing prompt injection attacks against simulated logistics AI systems
            with configurable defense toggles.
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
              <f.Icon className="w-5 h-5 text-blue-400/70 mb-2" />
              <h3 className="text-xs font-semibold text-slate-200 mb-1">{f.label}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <span className="text-xs text-slate-500 bg-slate-800/40 border border-slate-700/40 rounded-full px-4 py-1.5 font-medium">
          Coming in Phase 3
        </span>
      </div>
    </div>
  );
}
