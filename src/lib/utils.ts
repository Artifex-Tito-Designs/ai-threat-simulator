import type { TrustLevel, Severity, NodeState, NodeType } from './types';

export const trustColors: Record<TrustLevel, { border: string; bg: string }> = {
  trusted: { border: '#22C55E', bg: '#052E16' },
  'semi-trusted': { border: '#F59E0B', bg: '#422006' },
  untrusted: { border: '#EF4444', bg: '#450A0A' },
};

export const severityColors: Record<Severity, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#3B82F6',
};

export const severityLabels: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const nodeStateStyles: Record<NodeState, string> = {
  normal: '',
  targeted: 'node-targeted',
  compromised: 'node-compromised',
  defended: 'node-defended',
};

export const nodeTypeIconMap: Record<NodeType, string> = {
  component: 'Cog',
  datastore: 'Database',
  external: 'Globe',
  user: 'User',
  model: 'Brain',
};

export const categoryIconMap: Record<string, string> = {
  agentic: 'Bot',
  descriptive: 'BarChart3',
  generative: 'MessageSquare',
  interpretive: 'FileText',
  predictive: 'TrendingUp',
  prescriptive: 'Compass',
};

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
