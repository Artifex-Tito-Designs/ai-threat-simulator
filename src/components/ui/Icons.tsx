'use client';

import {
  Cog, Database, Globe, User, Brain, Bot, BarChart3, MessageSquare,
  FileText, TrendingUp, Compass, Shield, Lock, Unlock, AlertTriangle,
  Check, Map, FlaskConical, ClipboardList, LayoutDashboard, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { NodeType } from '@/lib/types';

const nodeTypeIcons: Record<NodeType, typeof Cog> = {
  component: Cog,
  datastore: Database,
  external: Globe,
  user: User,
  model: Brain,
};

const categoryIcons: Record<string, typeof Bot> = {
  agentic: Bot,
  descriptive: BarChart3,
  generative: MessageSquare,
  interpretive: FileText,
  predictive: TrendingUp,
  prescriptive: Compass,
};

export function NodeTypeIcon({ type, className = '', style }: { type: NodeType; className?: string; style?: React.CSSProperties }) {
  const Icon = nodeTypeIcons[type] ?? Cog;
  return <Icon className={className} style={style} />;
}

export function CategoryIcon({ slug, className = '', style }: { slug: string; className?: string; style?: React.CSSProperties }) {
  const Icon = categoryIcons[slug] ?? BarChart3;
  return <Icon className={className} style={style} />;
}

export {
  Shield, Lock, Unlock, AlertTriangle, Check, Map, FlaskConical,
  ClipboardList, LayoutDashboard, X, ChevronLeft, ChevronRight,
  Bot, BarChart3, MessageSquare, FileText, TrendingUp, Compass,
};
