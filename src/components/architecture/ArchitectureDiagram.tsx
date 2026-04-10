'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ComponentNode } from './ComponentNode';
import { TrustBoundaryNode } from './TrustBoundary';
import { DataFlowEdge } from './DataFlowEdge';
import { useScenarioStore } from '@/stores/scenarioStore';
import { computeTierLayout, computeTierBands, TIER_CONFIG } from '@/lib/layout';
import type { ArchitectureSchema } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeTypes: any = {
  componentNode: ComponentNode,
  trustBoundary: TrustBoundaryNode,
  tierLabel: TierLabelNode,
};

const edgeTypes: any = {
  dataFlow: DataFlowEdge,
};

/** Simple label node for tier headers */
function TierLabelNode({ data }: any) {
  const d = data as { label: string; color: string };
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg select-none pointer-events-none"
      style={{ backgroundColor: `${d.color}10`, border: `1px solid ${d.color}20` }}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
      <span
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: d.color }}
      >
        {d.label}
      </span>
    </div>
  );
}

interface ArchitectureDiagramProps {
  architecture: ArchitectureSchema;
  onNodeClick?: (nodeId: string) => void;
}

export function ArchitectureDiagram({ architecture, onNodeClick }: ArchitectureDiagramProps) {
  const { nodeStates, highlightedNodeIds, attackPathEdgeIds } = useScenarioStore();
  const hasHighlights = highlightedNodeIds.length > 0;

  // Compute tier-based layout
  const tierPositions = useMemo(
    () => computeTierLayout(architecture.nodes),
    [architecture.nodes]
  );

  const tierBands = useMemo(
    () => computeTierBands(architecture.nodes, tierPositions),
    [architecture.nodes, tierPositions]
  );

  const nodes: Node[] = useMemo(() => {
    // Component nodes with computed positions
    const componentNodes: Node[] = architecture.nodes.map((node) => ({
      id: node.id,
      type: 'componentNode',
      position: tierPositions[node.id] ?? node.position,
      data: {
        ...node,
        state: nodeStates[node.id] ?? 'normal',
        isHighlighted: hasHighlights ? highlightedNodeIds.includes(node.id) : undefined,
        vulnerabilityCount: node.vulnerabilities.length,
        onClick: () => onNodeClick?.(node.id),
      },
    }));

    // Tier label nodes (placed to the left of each tier row)
    const labelNodes: Node[] = tierBands.map((band) => ({
      id: `tier-label-${band.tier.id}`,
      type: 'tierLabel',
      position: { x: 10, y: band.y + 15 },
      data: { label: band.tier.label, color: band.tier.color },
      selectable: false,
      draggable: false,
    }));

    return [...labelNodes, ...componentNodes];
  }, [architecture.nodes, tierPositions, tierBands, nodeStates, highlightedNodeIds, hasHighlights, onNodeClick]);

  const edges: Edge[] = useMemo(
    () =>
      architecture.edges.map((edge) => {
        const isAttack = attackPathEdgeIds.includes(edge.id);
        const markerColor = isAttack ? '#EF4444'
          : (edge.encrypted && edge.validated) ? '#22C55E'
          : edge.encrypted ? '#3B82F6'
          : edge.validated ? '#F59E0B'
          : '#475569';
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'dataFlow',
          data: {
            label: edge.label,
            encrypted: edge.encrypted,
            validated: edge.validated,
            isAttackPath: isAttack,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: markerColor,
            width: 16,
            height: 16,
          },
        };
      }),
    [architecture.edges, attackPathEdgeIds]
  );

  const onInit = useCallback(() => {}, []);

  return (
    <div className="w-full h-full bg-[#0F172A]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={3}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        panOnScroll={false}
        selectionOnDrag={false}
        proOptions={{ hideAttribution: true }}
        className="bg-[#0F172A]"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1E293B" />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="!bg-[#1E293B]/90 !border-slate-700/50 !rounded-lg !shadow-lg !shadow-black/30"
          style={{ marginBottom: 12, marginRight: 12 }}
        />
      </ReactFlow>
    </div>
  );
}
