import type { Severity } from '@/lib/types';
import { severityColors } from '@/lib/utils';

interface BadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, className = '', size = 'sm' }: BadgeProps) {
  const color = severityColors[severity];
  const sizeClasses = size === 'md'
    ? 'px-2.5 py-1 text-[11px]'
    : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold uppercase tracking-wider ${sizeClasses} ${className}`}
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 8px ${color}10`,
      }}
    >
      {severity}
    </span>
  );
}
