export type AuthorizedBetaUser = 'Akash Sankar' | 'Alfa';

export type UserRole = 'System Architect' | 'Psychological Advisor';

export interface UserSession {
  token: string;
  user: {
    id: string;
    name: string;
    alias?: string;
    role: UserRole;
    avatarUrl?: string;
    clearance: string;
    loginTime: string;
  };
}

export type CaseStatus = 'ACTIVE' | 'OBSERVING' | 'EVALUATING' | 'CONCLUDED' | 'ARCHIVED';

export interface ResearchCase {
  id: string;
  code: string;
  name: string;
  environment: string;
  objective: string;
  description: string;
  researchQuestion: string;
  initialHypothesis: string;
  variables: string[];
  tags: string[];
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  assignedSubjectIds: string[];
  experimentCount: number;
  observationCount: number;
  anomalyCount: number;
}

export interface EmotionalState {
  happiness: number;
  sadness: number;
  anger: number;
  fear: number;
  anxiety: number;
  loneliness: number;
  excitement: number;
  frustration: number;
  trust: number;
  stress: number;
  // Deltas from previous observation cycle
  deltas: {
    stress: number;
    loneliness: number;
    trust: number;
    anxiety: number;
    happiness: number;
  };
}

export interface BehavioralDimension {
  name: string;
  value: number; // 0 to 100
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  delta: number;
  confidence: number; // 0 to 100%
  inferredFrom: string;
}

export interface BodyLanguageSignal {
  id: string;
  signal: string; // e.g. "Reduced eye contact", "Ventral denial / torso shift away"
  frequency: 'LOW' | 'MODERATE' | 'HIGH' | 'PERSISTENT';
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
  context: string;
  observedAt: string;
  referenceSource?: string;
}

export interface SubjectRelationship {
  targetSubjectId: string;
  targetName: string;
  relationType: 'Friendship' | 'Trust' | 'Conflict' | 'Romantic' | 'Professional' | 'Rivalry';
  strength: number; // 0 to 100
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'TENSE' | 'HOSTILE';
  historyNotes: string;
}

export interface HumanoidBreakingPointScenario {
  title: string;
  triggerMechanism: string;
  mentalCollapseManifestation: string;
  failureProbability: number; // 0 - 100%
  simulationContext: string;
}

export interface OrchestrationRecipe {
  phase1Priming: string;
  phase2StressInjection: string;
  phase3Catalyst: string;
  phase4BreakingPoint: string;
  requiredEnvironment: string;
  recommendedStimulus: string;
}

export interface HumanoidMindAnalysis {
  breakingPointThreshold: number; // 0 - 100%
  primaryVulnerability: string;
  psychologicalProfile: string;
  weakZones: string[];
  breakingPointScenarios: HumanoidBreakingPointScenario[];
  orchestrationRecipe: OrchestrationRecipe;
  observableKinesicSignals: string[];
  ragGrounding: Array<{
    source: string;
    concept: string;
    application: string;
  }>;
  analyzedAt: string;
  observationAnalyzed?: string;
}

export interface Subject {
  id: string;
  code: string; // e.g. "HX-071"
  name: string;
  age: number;
  occupation: string;
  education: string;
  environment: string;
  avatarUrl: string;
  personalityTraits: string[];
  // User Requested In-Depth Profile Fields
  familyEnvironment?: string;
  relationshipStatus?: string;
  currentStateSummary?: string;
  importantThings?: string[];
  weakZones?: string[];
  breakingPointAnalysis?: HumanoidMindAnalysis;
  recentObservations?: Array<{
    id: string;
    note: string;
    timestamp: string;
    observerName?: string;
  }>;
  emotionalState: EmotionalState;
  behavioralDimensions: BehavioralDimension[];
  bodyLanguageSignals: BodyLanguageSignal[];
  memoryState: {
    shortTermMemoryCount: number;
    longTermCoreMemories: string[];
    repressedContradictions: number;
  };
  currentGoals: string[];
  routine: string[];
  relationships: SubjectRelationship[];
  riskIndicators: {
    volatilityScore: number;
    isolationRisk: number;
    rebellionProbability: number;
  };
  observedPatterns: string[];
  totalObservations: number;
}

export type ExperimentStatus =
  | 'DRAFT'
  | 'READY'
  | 'DEPLOYED'
  | 'RUNNING'
  | 'OBSERVING'
  | 'COMPLETED'
  | 'ANALYZED';

export interface Experiment {
  id: string;
  code: string; // e.g. "EXP-038"
  caseId: string;
  caseName?: string;
  title: string;
  objective: string;
  environment: string;
  subjectIds: string[];
  variables: {
    socialPressure: number;
    emotionalPressure: number;
    authorityPresence: number;
    uncertainty: number;
    isolation: number;
    rewardIncentive: number;
  };
  scenario: string;
  trigger: string;
  expectedBehavior: string;
  observationWindow: string; // e.g. "30 minutes post-trigger"
  successCriteria: string;
  hypothesisId?: string;
  status: ExperimentStatus;
  prediction?: {
    predictedOutcome: string;
    confidence: number;
    historicalBaselineProbability: number;
    rationale: string;
    timestamp: string;
  };
  actualOutcome?: {
    observedBehavior: string;
    deviationScore: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    predictionErrorPct: number;
    actualNotes: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type AnomalyScore = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface Anomaly {
  id: string;
  code: string; // e.g. "ANOM-012"
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  category:
    | 'Behavioral anomaly'
    | 'Memory inconsistency'
    | 'Decision inconsistency'
    | 'Relationship anomaly'
    | 'Routine deviation'
    | 'Emotional inconsistency'
    | 'Social prediction failure';
  title: string;
  description: string;
  historicalBaseline: string;
  observedSignal: string;
  anomalyScore: AnomalyScore;
  status: 'DETECTED' | 'INVESTIGATING' | 'CONFIRMED' | 'RESOLVED';
  timestamp: string;
  aiExplanation?: string;
}

export interface Hypothesis {
  id: string;
  code: string; // e.g. "H-019"
  caseId: string;
  statement: string;
  status: 'UNTESTED' | 'SUPPORTED' | 'CONTRADICTED' | 'REFINED';
  evidenceEvents: string[];
  contradictoryEvents: string[];
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  type: 'Emotional' | 'Social' | 'Academic' | 'Professional' | 'Relationship' | 'Experiment' | 'Anomaly' | 'System';
  title: string;
  detail: string;
  location: string;
  involvedSubjects?: string[];
  deviationDetected?: boolean;
}

export interface RAGDocument {
  id: string;
  title: string;
  author: string;
  domain: string;
  topic: string;
  chunkCount: number;
  lastIngested: string;
  description: string;
}

export interface RAGChunk {
  id: string;
  docId: string;
  sourceTitle: string;
  author: string;
  chapter: string;
  topic: string;
  domain: string;
  content: string;
  similarity?: number;
}

export interface RAGQueryResult {
  query: string;
  topChunks: RAGChunk[];
  contextSentToGemini?: string;
  geminiSynthesis?: string;
  retrievedAt: string;
}

export interface StructuredAIBehaviorAnalysis {
  observation: string;
  context: string;
  pattern: string;
  hypothesis: string;
  evidence: string[];
  contradictoryEvidence: string[];
  prediction: string;
  suggestedExperiment: string;
  simulationConfidence: number; // 0.0 to 1.0
  ragReferences: Array<{
    source: string;
    concept: string;
    relevance: string;
  }>;
}

export interface SystemStatus {
  frontend: 'ONLINE' | 'OFFLINE';
  server: 'ONLINE' | 'OFFLINE';
  gemini: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED';
  rag: 'INDEXED' | 'UNINDEXED';
  vectorStore: 'READY' | 'INITIALIZING';
  vectorCount: number;
  lastIngestion: string;
  activeResearcher: string;
  systemVersion: string;
  latencyMs: number;
}
