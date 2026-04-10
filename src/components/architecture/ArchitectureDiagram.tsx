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
        defaultViewport={{ x: 50, y: 20, zoom: 0.6 }}
        minZoom={0.2}
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
