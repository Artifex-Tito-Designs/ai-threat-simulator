import type { Severity } from '@/lib/types';
import { severityColors } from '@/lib/utils';

interface BadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className = '' }: BadgeProps) {
  const color = severityColors[severity];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${className}`}
      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
    >
      {severity}
    </span>
  );
}
