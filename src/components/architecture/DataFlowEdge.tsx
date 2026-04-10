'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
// Icons no longer shown inline — security posture indicated by edge color

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

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 16,
  });

  const isAttack = d?.isAttackPath ?? false;
  const isEncrypted = d?.encrypted === true;
  const isValidated = d?.validated === true;
  const showLabel = hovered || clicked || isAttack;

  // Color-code by security posture
  const edgeColor = isAttack ? '#EF4444'
    : (isEncrypted && isValidated) ? '#22C55E'
    : isEncrypted ? '#3B82F6'
    : isValidated ? '#F59E0B'
    : '#334155';

  return (
    <>
      {/* Glow layer for attack paths */}
      {isAttack && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: '#EF4444',
            strokeWidth: 8,
            strokeOpacity: 0.12,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* Invisible wide hit area for hover/click */}
      <BaseEdge
        id={`${id}-hitarea`}
        path={edgePath}
        style={{
          stroke: 'transparent',
          strokeWidth: 20,
          cursor: 'pointer',
        }}
        interactionWidth={20}
      />

      {/* Subtle glow for secure connections */}
      {!isAttack && (isEncrypted || isValidated) && hovered && (
        <BaseEdge
          id={`${id}-secglow`}
          path={edgePath}
          style={{
            stroke: edgeColor,
            strokeWidth: 5,
            strokeOpacity: 0.1,
            filter: 'blur(3px)',
          }}
        />
      )}

      {/* Main visible edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: hovered ? edgeColor : isAttack ? '#EF4444' : `${edgeColor}90`,
          strokeWidth: isAttack ? 2.5 : hovered ? 2 : 1.5,
          strokeDasharray: isAttack ? '8 4' : undefined,
          transition: 'stroke 150ms, stroke-width 150ms',
        }}
        className={isAttack ? 'edge--attack-path' : ''}
      />

      {/* Hover/click zone overlay */}
      {d?.label && (
        <EdgeLabelRenderer>
          {/* Invisible hover target */}
          <div
            className="absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              width: 40,
              height: 40,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setClicked(false); }}
            onClick={(e) => { e.stopPropagation(); setClicked(!clicked); }}
          />

          {/* Label — only visible on hover or click */}
          {showLabel && (
            <div
              className="absolute text-[11px] px-3 py-1.5 rounded-lg
                flex items-center gap-1.5 pointer-events-none
                animate-in fade-in duration-150"
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                border: isAttack
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid rgba(71, 85, 105, 0.6)',
                boxShadow: isAttack
                  ? '0 0 12px rgba(239, 68, 68, 0.2), 0 4px 8px rgba(0,0,0,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.4)',
                color: isAttack ? '#FCA5A5' : '#CBD5E1',
                maxWidth: clicked ? 300 : 200,
                whiteSpace: clicked ? 'normal' : 'nowrap',
                zIndex: 50,
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: edgeColor }}
                title={
                  isEncrypted && isValidated ? 'Encrypted + Validated'
                  : isEncrypted ? 'Encrypted'
                  : isValidated ? 'Validated'
                  : 'Unsecured'
                }
              />
              <span className="font-medium">{d.label}</span>
            </div>
          )}
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DataFlowEdge = memo(DataFlowEdgeInner);
