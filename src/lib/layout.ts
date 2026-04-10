import type { ArchitectureNode, ArchitectureTier } from './types';

/**
 * Tier configuration for the layered architecture layout.
 * Order determines vertical position (top to bottom).
 */
export const TIER_CONFIG: {
  id: ArchitectureTier;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { id: 'client', label: 'Client Tier', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.03)' },
  { id: 'presentation', label: 'Presentation Tier', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.03)' },
  { id: 'application', label: 'Application Tier', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.03)' },
  { id: 'middleware', label: 'Middleware Tier', color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.03)' },
  { id: 'data', label: 'Data Tier', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.03)' },
  { id: 'operations', label: 'Operations Tier', color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.03)' },
];

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 120;
const TIER_PADDING_TOP = 45;
const TIER_LABEL_WIDTH = 160;
const LEFT_OFFSET = TIER_LABEL_WIDTH + 30;

/**
 * Compute positions for nodes arranged in horizontal tier rows.
 * Returns a map of nodeId -> { x, y } positions.
 */
export function computeTierLayout(nodes: ArchitectureNode[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};

  // Group nodes by tier
  const tierGroups: Record<string, ArchitectureNode[]> = {};
  for (const node of nodes) {
    const tier = node.tier ?? 'application';
    if (!tierGroups[tier]) tierGroups[tier] = [];
    tierGroups[tier].push(node);
  }

  // Layout each tier as a horizontal row
  let currentY = 40;

  for (const tierConfig of TIER_CONFIG) {
    const tierNodes = tierGroups[tierConfig.id];
    if (!tierNodes || tierNodes.length === 0) continue;

    const rowY = currentY + TIER_PADDING_TOP;

    // Center nodes horizontally within the tier
    const totalWidth = tierNodes.length * NODE_WIDTH + (tierNodes.length - 1) * HORIZONTAL_GAP;
    const startX = LEFT_OFFSET + Math.max(0, (800 - totalWidth) / 2);

    tierNodes.forEach((node, i) => {
      positions[node.id] = {
        x: startX + i * (NODE_WIDTH + HORIZONTAL_GAP),
        y: rowY,
      };
    });

    // Move to next tier row
    currentY = rowY + NODE_HEIGHT + VERTICAL_GAP;
  }

  return positions;
}

/**
 * Compute tier background bands for visual grouping.
 * Returns an array of { tier, y, height, nodeCount } for rendering.
 */
export function computeTierBands(
  nodes: ArchitectureNode[],
  positions: Record<string, { x: number; y: number }>
): { tier: typeof TIER_CONFIG[number]; y: number; height: number; nodeCount: number; maxX: number }[] {
  const bands: { tier: typeof TIER_CONFIG[number]; y: number; height: number; nodeCount: number; maxX: number }[] = [];

  const tierGroups: Record<string, ArchitectureNode[]> = {};
  for (const node of nodes) {
    const tier = node.tier ?? 'application';
    if (!tierGroups[tier]) tierGroups[tier] = [];
    tierGroups[tier].push(node);
  }

  for (const tierConfig of TIER_CONFIG) {
    const tierNodes = tierGroups[tierConfig.id];
    if (!tierNodes || tierNodes.length === 0) continue;

    const tierPositions = tierNodes.map(n => positions[n.id]).filter(Boolean);
    const minY = Math.min(...tierPositions.map(p => p.y));
    const maxX = Math.max(...tierPositions.map(p => p.x)) + NODE_WIDTH;

    bands.push({
      tier: tierConfig,
      y: minY - 30,
      height: NODE_HEIGHT + 60,
      nodeCount: tierNodes.length,
      maxX: maxX + 40,
    });
  }

  return bands;
}
