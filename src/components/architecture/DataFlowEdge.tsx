'use client';

import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { Lock, Unlock, AlertTriangle, Check } from '@/components/ui/Icons';

function DataFlowEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const d = data as {
    label?: string;
    encrypted?: boolean;
    validated?: boolean;
    isAttackPath?: boolean;
  } | undefined;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 8,
  });

  const isAttack = d?.isAttackPath ?? false;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isAttack ? '#EF4444' : '#475569',
          strokeWidth: isAttack ? 2.5 : 1.5,
          strokeDasharray: isAttack ? '8 4' : undefined,
        }}
        className={isAttack ? 'edge--attack-path' : ''}
      />
      {d?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-slate-400 bg-[#0F172A]/90 backdrop-blur-sm px-2 py-0.5 rounded
              border border-slate-700/50 pointer-events-none flex items-center gap-1"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {d.encrypted === true && <Lock className="w-2.5 h-2.5 text-green-500" />}
            {d.encrypted === false && <Unlock className="w-2.5 h-2.5 text-slate-500" />}
            {d.validated === false && <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />}
            {d.validated === true && <Check className="w-2.5 h-2.5 text-green-500" />}
            <span>{d.label}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DataFlowEdge = memo(DataFlowEdgeInner);
