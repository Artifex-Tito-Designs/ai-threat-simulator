// =============================================================================
// AI Threat Simulator — Core Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Architecture Types
// -----------------------------------------------------------------------------

export type SolutionCategory =
  | 'agentic'
  | 'generative'
  | 'interpretive'
  | 'predictive'
  | 'prescriptive'
  | 'descriptive';

export type NodeType = 'component' | 'datastore' | 'external' | 'user' | 'model';
export type ArchitectureTier = 'client' | 'presentation' | 'application' | 'middleware' | 'data' | 'operations';
export type TrustLevel = 'trusted' | 'semi-trusted' | 'untrusted';
export type BoundaryType = 'network' | 'auth' | 'privilege' | 'data-classification';

export interface ArchitectureNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  position: { x: number; y: number };
  tier: ArchitectureTier;
  dataFlows: string[];
  trustLevel: TrustLevel;
  vulnerabilities: string[];
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  dataType: string;
  encrypted: boolean;
  validated: boolean;
}

export interface TrustBoundary {
  id: string;
  label: string;
  nodeIds: string[];
  boundaryType: BoundaryType;
}

export interface ArchitectureSchema {
  id: string;
  name: string;
  category: SolutionCategory;
  description: string;
  logisticsContext: string;
  solutions: string[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  trustBoundaries: TrustBoundary[];
  applicableThreats: string[];
}

// -----------------------------------------------------------------------------
// Threat Types (OWASP LLM Top 10 2025)
// -----------------------------------------------------------------------------

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Mitigation {
  id: string;
  control: string;
  description: string;
  nistMapping: string;
  priority: Severity;
  implementationNotes: string;
}

export interface ThreatDefinition {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  description: string;
  logisticsExample: string;
  affectedComponents: string[];
  mitigations: Mitigation[];
  vendorQuestions: string[];
}

// -----------------------------------------------------------------------------
// Attack Scenario Types
// -----------------------------------------------------------------------------

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type NodeState = 'normal' | 'targeted' | 'compromised' | 'defended';

export interface AttackStep {
  order: number;
  title: string;
  attackerAction: string;
  systemResponse: string;
  impact: string;
  affectedNodeIds: string[];
  nodeState: NodeState;
  edgeIds?: string[];
}

export interface AttackScenario {
  id: string;
  threatId: string;
  architectureId: string;
  name: string;
  difficulty: Difficulty;
  steps: AttackStep[];
}

// -----------------------------------------------------------------------------
// Assessment Types
// -----------------------------------------------------------------------------

export interface Finding {
  id: string;
  description: string;
  severity: Severity;
  evidenceFromSimulation: string;
  affectedComponents: string[];
}

export interface RecommendedControl {
  id: string;
  control: string;
  priority: Severity;
  nistMapping: string;
  owaspMapping: string;
  implementationEffort: 'low' | 'medium' | 'high';
  description: string;
}

export interface ResidualRisk {
  id: string;
  description: string;
  likelihood: string;
  impact: string;
  compensatingControls: string[];
}

export interface VendorQuestion {
  category: string;
  question: string;
  expectedAnswer: string;
  redFlags: string[];
}

export interface IncidentResponseStep {
  order: number;
  action: string;
  responsible: string;
  timeframe: string;
}

export interface Assessment {
  id: string;
  timestamp: string;
  scenarioId: string;
  architectureId: string;
  completedBy: string;
  findings: Finding[];
  recommendedControls: RecommendedControl[];
  residualRisks: ResidualRisk[];
  vendorQuestions: VendorQuestion[];
  incidentResponse: IncidentResponseStep[];
  overallRiskRating: Severity;
}

// -----------------------------------------------------------------------------
// UI State Types
// -----------------------------------------------------------------------------

export interface CategoryInfo {
  slug: SolutionCategory;
  label: string;
  color: string;
  icon: string;
  solutionCount: number;
}

export type AttackAnimationState = 'idle' | 'playing' | 'paused' | 'stepping' | 'finished';
