import { create } from 'zustand';
import type { ArchitectureSchema, ThreatDefinition, NodeState } from '@/lib/types';

interface ScenarioState {
  architecture: ArchitectureSchema | null;
  threats: ThreatDefinition[];
  selectedThreatId: string | null;
  nodeStates: Record<string, NodeState>;
  highlightedNodeIds: string[];
  attackPathEdgeIds: string[];

  setArchitecture: (arch: ArchitectureSchema) => void;
  setThreats: (threats: ThreatDefinition[]) => void;
  selectThreat: (threatId: string | null) => void;
  setNodeState: (nodeId: string, state: NodeState) => void;
  setHighlightedNodes: (nodeIds: string[]) => void;
  setAttackPathEdges: (edgeIds: string[]) => void;
  clearAttackPathEdges: () => void;
  resetNodeStates: () => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  architecture: null,
  threats: [],
  selectedThreatId: null,
  nodeStates: {},
  highlightedNodeIds: [],
  attackPathEdgeIds: [],

  setArchitecture: (architecture) => {
    const nodeStates: Record<string, NodeState> = {};
    architecture.nodes.forEach((node) => {
      nodeStates[node.id] = 'normal';
    });
    set({ architecture, nodeStates });
  },

  setThreats: (threats) => set({ threats }),

  selectThreat: (threatId) => {
    const { threats, architecture } = get();
    if (!threatId || !architecture) {
      set({ selectedThreatId: null, highlightedNodeIds: [] });
      return;
    }
    const threat = threats.find((t) => t.id === threatId);
    const highlightedNodeIds = threat?.affectedComponents ?? [];
    set({ selectedThreatId: threatId, highlightedNodeIds });
  },

  setNodeState: (nodeId, state) =>
    set((s) => ({
      nodeStates: { ...s.nodeStates, [nodeId]: state },
    })),

  setHighlightedNodes: (nodeIds) => set({ highlightedNodeIds: nodeIds }),

  setAttackPathEdges: (edgeIds) => set({ attackPathEdgeIds: edgeIds }),
  clearAttackPathEdges: () => set({ attackPathEdgeIds: [] }),

  resetNodeStates: () => {
    const { architecture } = get();
    if (!architecture) return;
    const nodeStates: Record<string, NodeState> = {};
    architecture.nodes.forEach((node) => {
      nodeStates[node.id] = 'normal';
    });
    set({ nodeStates, highlightedNodeIds: [], selectedThreatId: null, attackPathEdgeIds: [] });
  },
}));
