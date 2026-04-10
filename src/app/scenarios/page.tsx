'use client';

import { useEffect, useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { ArchitectureDiagram } from '@/components/architecture/ArchitectureDiagram';
import { ThreatSidebar } from '@/components/threats/ThreatSidebar';
import { AttackWalkthrough } from '@/components/walkthrough/AttackWalkthrough';
import { Header } from '@/components/layout/Header';
import { CategoryIcon, X } from '@/components/ui/Icons';
import { useScenarioStore } from '@/stores/scenarioStore';
import { useWalkthroughStore } from '@/stores/walkthroughStore';
import { slideInLeft } from '@/lib/motion';
import type { ArchitectureSchema, ThreatDefinition, AttackScenario, ArchitectureNode } from '@/lib/types';

const categoryTabs = [
  { slug: 'generative', label: 'Generative', color: '#EF4444' },
  { slug: 'agentic', label: 'Agentic', color: '#3B82F6' },
  { slug: 'interpretive', label: 'Interpretive', color: '#22C55E' },
  { slug: 'predictive', label: 'Predictive', color: '#A855F7' },
  { slug: 'prescriptive', label: 'Prescriptive', color: '#EAB308' },
  { slug: 'descriptive', label: 'Descriptive', color: '#F97316' },
];

export default function ScenariosPage() {
  const { architecture, setArchitecture, setThreats } = useScenarioStore();
  const { loadScenario, reset: resetWalkthrough } = useWalkthroughStore();
  const [activeTab, setActiveTab] = useState('generative');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setSelectedNode(null);
      if (walkthroughOpen) handleCloseWalkthrough();
      try {
        const archMap: Record<string, () => Promise<{ default: ArchitectureSchema }>> = {
          generative: () => import('@/data/architectures/rag-chatbot.json') as Promise<{ default: ArchitectureSchema }>,
          agentic: () => import('@/data/architectures/agentic-workflow.json') as Promise<{ default: ArchitectureSchema }>,
          interpretive: () => import('@/data/architectures/document-extraction.json') as Promise<{ default: ArchitectureSchema }>,
          predictive: () => import('@/data/architectures/predictive-model.json') as Promise<{ default: ArchitectureSchema }>,
          prescriptive: () => import('@/data/architectures/optimization-engine.json') as Promise<{ default: ArchitectureSchema }>,
          descriptive: () => import('@/data/architectures/data-pipeline.json') as Promise<{ default: ArchitectureSchema }>,
        };
        const loader = archMap[activeTab] ?? archMap.generative;
        const [archModule, threatModule] = await Promise.all([
          loader(),
          import('@/data/threats/owasp-llm-top10.json') as Promise<{ default: ThreatDefinition[] }>,
        ]);
        setArchitecture(archModule.default);
        setThreats(threatModule.default);
      } catch (e) {
        // Error boundary will catch rendering failures
      }
      setLoading(false);
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, setArchitecture, setThreats]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (!architecture) return;
      const node = architecture.nodes.find((n) => n.id === nodeId);
      setSelectedNode(node ?? null);
    },
    [architecture]
  );

  const handleRunWalkthrough = useCallback(async () => {
    try {
      const scenarioModule = await import('@/data/scenarios/rag-llm01-001.json');
      loadScenario(scenarioModule.default as AttackScenario);
      setWalkthroughOpen(true);
      setSelectedNode(null);
    } catch (e) {
      // Error boundary will catch rendering failures
    }
  }, [loadScenario]);

  const handleCloseWalkthrough = useCallback(() => {
    resetWalkthrough();
    setWalkthroughOpen(false);
  }, [resetWalkthrough]);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Scenarios"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Scenarios' },
        ]}
      />

      {/* Category tabs */}
      <div className="border-b border-slate-700 bg-[#0F172A] px-3 sm:px-6 flex items-center justify-between shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <CategoryIcon slug={tab.slug} className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: tab.color }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Run walkthrough button */}
        {!walkthroughOpen && (
          <button
            onClick={handleRunWalkthrough}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              bg-red-500/10 text-red-400 border border-red-500/20
              hover:bg-red-500/20 hover:border-red-500/40 transition-all
              focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <Play className="w-3.5 h-3.5" />
            Run Attack Walkthrough
          </button>
        )}
      </div>

      {/* Split panel: Diagram + Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Diagram area */}
          <div className="flex-1 relative">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Loading architecture...
              </div>
            ) : architecture ? (
              <ReactFlowProvider>
                <ArchitectureDiagram
                  architecture={architecture}
                  onNodeClick={handleNodeClick}
                />
              </ReactFlowProvider>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                No architecture data found for this category.
              </div>
            )}

            {/* Node detail panel */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div
                  key={selectedNode.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideInLeft}
                  className="absolute top-4 left-4 w-72 backdrop-blur-xl bg-slate-900/85 border border-slate-600/50
                    rounded-lg shadow-2xl shadow-black/40 p-4 z-10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-100">{selectedNode.label}</h3>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-slate-700/50 transition-colors
                        focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Close panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{selectedNode.description}</p>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Trust Level</span>
                      <p className="text-xs text-slate-300 capitalize">{selectedNode.trustLevel}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Data Flows</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {selectedNode.dataFlows.map((flow, i) => (
                          <span key={i} className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                            {flow}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedNode.vulnerabilities.length > 0 && (
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Vulnerabilities</span>
                        <ul className="mt-0.5 space-y-0.5">
                          {selectedNode.vulnerabilities.map((vuln, i) => (
                            <li key={i} className="text-[10px] text-red-400 flex gap-1">
                              <span className="shrink-0">&#8226;</span>
                              <span>{vuln}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Threat sidebar */}
          <ThreatSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Attack walkthrough panel (bottom drawer) */}
        <AttackWalkthrough
          isOpen={walkthroughOpen}
          onClose={handleCloseWalkthrough}
        />
      </div>
    </div>
  );
}
