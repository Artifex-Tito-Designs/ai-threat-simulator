'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
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
import type { ArchitectureSchema } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeTypes: any = {
  componentNode: ComponentNode,
  trustBoundary: TrustBoundaryNode,
};

const edgeTypes: any = {
  dataFlow: DataFlowEdge,
};

interface ArchitectureDiagramProps {
  architecture: ArchitectureSchema;
  onNodeClick?: (nodeId: string) => void;
}

export function ArchitectureDiagram({ architecture, onNodeClick }: ArchitectureDiagramProps) {
  const { nodeStates, highlightedNodeIds, attackPathEdgeIds } = useScenarioStore();
  const hasHighlights = highlightedNodeIds.length > 0;

  const nodes: Node[] = useMemo(() => {
    return architecture.nodes.map((node) => ({
      id: node.id,
      type: 'componentNode',
      position: node.position,
      data: {
        ...node,
        state: nodeStates[node.id] ?? 'normal',
        isHighlighted: hasHighlights ? highlightedNodeIds.includes(node.id) : undefined,
        vulnerabilityCount: node.vulnerabilities.length,
        onClick: () => onNodeClick?.(node.id),
      },
    }));
  }, [architecture.nodes, nodeStates, highlightedNodeIds, hasHighlights, onNodeClick]);

  const edges: Edge[] = useMemo(
    () =>
      architecture.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'dataFlow',
        data: {
          label: edge.label,
          encrypted: edge.encrypted,
          validated: edge.validated,
          isAttackPath: attackPathEdgeIds.includes(edge.id),
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: attackPathEdgeIds.includes(edge.id) ? '#EF4444' : '#475569',
          width: 16,
          height: 16,
        },
      })),
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
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: false }}
        className="bg-[#0F172A]"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1E293B" />
        <Controls
          showInteractive={false}
          className="!bg-[#1E293B] !border-slate-700 !rounded-lg"
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => {
            const state = nodeStates[node.id];
            if (state === 'compromised') return '#EF4444';
            if (state === 'targeted') return '#F59E0B';
            if (state === 'defended') return '#22C55E';
            return '#64748B';
          }}
          nodeStrokeWidth={2}
          position="bottom-left"
          style={{ width: 200, height: 130 }}
          className="!bg-[#1E293B]/90 !border-slate-600 !rounded-lg"
          maskColor="rgba(15, 23, 42, 0.5)"
        />
      </ReactFlow>
    </div>
  );
}
