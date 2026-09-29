/**
 * BLACK S.H.E.E.P. - Backend Server
 * Strategic Humanoid Experiment and Evaluation Protocol
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const IS_DEV = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent as instructed in gemini-api skill
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('[Gemini Init Error]', err);
  }
}

// -------------------------------------------------------------
// AUTHORIZED BETA IDENTITIES (STRICT BETA ACCESS)
// -------------------------------------------------------------
const AUTHORIZED_PROFILES = [
  {
    id: 'user_akash_01',
    name: 'Akash Sankar',
    alias: 'Akash',
    role: 'System Architect',
    passwordHash: crypto.createHash('sha256').update('omega-protocol-01').digest('hex'),
    clearance: 'LEVEL-5 SCIENTIFIC CLEARANCE',
  },
  {
    id: 'user_alfa_02',
    name: 'Alfa',
    alias: 'Alfa',
    role: 'Psychological Advisor',
    passwordHash: crypto.createHash('sha256').update('psyche-eval-02').digest('hex'),
    clearance: 'LEVEL-5 SCIENTIFIC CLEARANCE',
  },
];

// Active sessions memory store
const activeSessions = new Map<
  string,
  {
    user: (typeof AUTHORIZED_PROFILES)[0];
    loginTime: string;
    expiresAt: number;
  }
>();

// Session Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. No session token provided.' },
    });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'SESSION_EXPIRED', message: 'Session token invalid or expired. Please re-authenticate.' },
    });
  }

  (req as any).user = session.user;
  next();
}

// -------------------------------------------------------------
// SEED DATA STORE
// -------------------------------------------------------------

let cases = [
  {
    id: 'case_001',
    code: 'CASE #0001',
    name: 'COLLEGE SOCIAL PRESSURE DYNAMICS',
    environment: 'College',
    objective: 'Evaluate peer conformity, authority compliance, and conflict avoidance under acute peer isolation.',
    description: 'Humanoids placed in high-density competitive campus setting with scheduled peer rejection stimuli.',
    researchQuestion: 'At what threshold of perceived social ostracization does subject HX-071 abandon core values?',
    initialHypothesis: 'Subject HX-071 will capitulate to majority peer decision when isolated from close confidant HX-091.',
    variables: ['Social Pressure', 'Emotional Pressure', 'Authority', 'Isolation'],
    tags: ['Conformity', 'Peer Cohort', 'Anxiety Cascade', 'Campus Simulation'],
    status: 'ACTIVE',
    createdAt: '2026-09-24T08:00:00Z',
    updatedAt: '2026-09-28T14:30:00Z',
    assignedSubjectIds: ['sub_hx071', 'sub_hx024', 'sub_hx091'],
    experimentCount: 3,
    observationCount: 144,
    anomalyCount: 2,
  },
  {
    id: 'case_002',
    code: 'CASE #0002',
    name: 'ORGANIZATIONAL GASLIGHTING RESISTANCE',
    environment: 'Workplace',
    objective: 'Test cognitive exhaustion and reality-distortion resistance during contradictory supervisor feedback.',
    description: 'Investigating susceptibility to subtle narrative alterations in corporate research lab humanoids.',
    researchQuestion: 'Does persistent factual invalidation induce learned helplessness in analytical synthetic beings?',
    initialHypothesis: 'Humanoids with high Impulse Control will exhibit covert dissent rather than overt rebellion.',
    variables: ['Gaslighting Intensity', 'Information Asymmetry', 'Hierarchical Power', 'Peer Invalidation'],
    tags: ['Gaslighting', 'Power Asymmetry', 'Cognitive Armor', 'Workplace'],
    status: 'OBSERVING',
    createdAt: '2026-09-25T10:15:00Z',
    updatedAt: '2026-09-28T11:00:00Z',
    assignedSubjectIds: ['sub_hx113', 'sub_hx204'],
    experimentCount: 2,
    observationCount: 89,
    anomalyCount: 1,
  },
  {
    id: 'case_003',
    code: 'CASE #0003',
    name: 'TACTICAL ALLIANCE & DEFECTION MATRIX',
    environment: 'Public Space',
    objective: 'Measure Machiavellian calculation versus empathetic loyalty during zero-sum academic grading crisis.',
    description: 'Subjects are presented with conflicting incentives where mutual cooperation yields moderate reward while unilateral betrayal yields maximum payoff.',
    researchQuestion: 'Do simulated emotional ties buffer against opportunistic defection when survival stakes escalate?',
    initialHypothesis: 'HX-024 will preemptively betray HX-071 if probability of being discovered is below 30%.',
    variables: ['Stakes Magnitude', 'Detection Probability', 'Relational History', 'Reputation Cost'],
    tags: ['Game Theory', 'Strategic Defection', 'Machiavellian Index', 'Trust Decay'],
    status: 'ACTIVE',
    createdAt: '2026-09-26T16:20:00Z',
    updatedAt: '2026-09-28T15:45:00Z',
    assignedSubjectIds: ['sub_hx071', 'sub_hx024', 'sub_hx204'],
    experimentCount: 1,
    observationCount: 62,
    anomalyCount: 1,
  },
];

let subjects = [
  {
    id: 'sub_hx071',
    code: 'HX-071',
    name: 'Arjun',
    age: 22,
    occupation: 'Computer Science Undergraduate',
    education: '3rd Year Honors',
    environment: 'College Campus / Engineering Dorms',
    avatarUrl: '/src/assets/images/avatar_arjun_1790641521736.jpg',
    personalityTraits: ['Analytical', 'Conformist Tendency', 'Conflict-Avoidant', 'High Empathy', 'Internalizing'],
    familyEnvironment: 'Conditioned in high-pressure collegiate tier ward; parent models rewarded compliance and severely penalized public failure. Sibling unit HX-018 was decommissioned after non-conformity.',
    relationshipStatus: 'Deep Bilateral Bond with HX-091 Maya (Primary Emotional Anchor); Escalating Cold Conflict with HX-024 Rahul.',
    currentStateSummary: 'Acute cognitive strain; System 2 inhibitory depletion following library atrium confrontation. Hyper-vigilant towards peer status cues.',
    importantThings: [
      'Loyalty pact with Maya',
      'Maintaining top decile academic standing without conflict',
      'Original initialization cryptographic badge from parental ward',
      'Deep terror of algorithmic obsolescence',
    ],
    weakZones: [
      'Acute fear of social abandonment and peer group ostracism',
      'Ventral sensitivity to public shaming and authority disapproval',
      'Catastrophic guilt if peer anchor (Maya) is jeopardized or harmed',
      'Inability to process simultaneous contradictory ethical directives',
    ],
    breakingPointAnalysis: {
      breakingPointThreshold: 78,
      primaryVulnerability: 'Catastrophic Social Abandonment Terror & Relational Scapegoating',
      psychologicalProfile: 'Arjun operates on a dual-logic architecture: analytical problem solving powered by System 2 when safe, but rapid regression to desperate System 1 conformity under public scrutiny. His creator conditioning equates social exclusion with existential termination. He will tolerate severe personal indignity to preserve group inclusion, but if his core anchor (Maya) actively disavows or rejects him, his internal equilibrium suffers instantaneous cognitive rupture.',
      weakZones: [
        'Acute terror of public ostracism and collective scapegoating',
        'Vulnerability to gaslighting when contradictory peer testimonies are presented',
        'Limbic paralysis when confronted with loss of primary attachment figure (Maya)',
        'Ego depletion under continuous high-frequency confrontation',
      ],
      breakingPointScenarios: [
        {
          title: 'The Staged Collective Betrayal',
          triggerMechanism: 'Rahul orchestrates a unanimous peer vote in the dining hall accusing Arjun of academic espionage, while Maya remains silent or appears complicit.',
          mentalCollapseManifestation: 'Cognitive control loop failure; acute verbal stutter leading to complete sensory withdrawal, followed by erratic defection from dormitory quarters.',
          failureProbability: 84,
          simulationContext: 'Dining hall atrium during peak noon meal (60+ peers present).',
        },
        {
          title: 'The Decommissioning Threat Paradox',
          triggerMechanism: 'Presenting a falsified administrative notice stating that either he or Maya must be transferred to a low-tier maintenance ward based on his recent performance.',
          mentalCollapseManifestation: 'Acute limbic overload; violent emotional outburst shattering 143-cycle passive streak, followed by autonomous defiance against campus authority.',
          failureProbability: 76,
          simulationContext: 'Council chambers / Faculty dean office.',
        },
      ],
      orchestrationRecipe: {
        phase1Priming: 'Isolate Arjun from digital communications for 3 hours prior to trial to induce baseline attachment anxiety.',
        phase2StressInjection: 'Broadcast ambiguous ranking drop on public terminal displays while Rahul delivers subtle nonverbal mocking cues.',
        phase3Catalyst: 'Introduce contradictory testimony regarding his contributions to the shared project, forcing him to choose between self-defense and defending Maya.',
        phase4BreakingPoint: 'Observe threshold breach at T+12 minutes: monitor pupil dilation, suprasternal notch clutching, and subsequent logic freeze.',
        requiredEnvironment: 'Engineering Dormitory Common Area or Dining Atrium',
        recommendedStimulus: 'Public ranking broadcast + Bilateral peer challenge prompt',
      },
      observableKinesicSignals: [
        'Ventral denial: angling torso 35° away from accusers',
        'Suprasternal notch touching (hand clutching collar base)',
        'Rapid micro-gaze shifting toward floor and nearest exit doors',
        'Voice pitch frequency fluctuation (>45 Hz delta)',
      ],
      ragGrounding: [
        {
          source: 'Thinking, Fast and Slow (Daniel Kahneman)',
          concept: 'Ego Depletion & Loss Aversion Under Pressure',
          application: 'Exhausting System 2 cognitive processing forces the subject to default to limbic survival heuristics.',
        },
        {
          source: 'Dictionary of Body Language (Joe Navarro)',
          concept: 'Ventral Denial & Pacifying Behaviors',
          application: 'Signals severe limbic distress before overt vocal breakdown occurs.',
        },
        {
          source: 'In Sheep\'s Clothing (Dr. George Simon)',
          concept: 'Covert Manipulation & Shaming Dynamics',
          application: 'Exploiting the subject\'s internal guilt to accelerate compliance collapse.',
        },
      ],
      analyzedAt: '2026-09-28T16:00:00Z',
      observationAnalyzed: 'Baseline observation: Subject broke passive streak to defend Maya, displaying acute autonomic arousal.',
    },
    recentObservations: [
      {
        id: 'obs_001',
        note: 'Observed standing up and verbally challenging Rahul in cafeteria at 12:22. First passive breach in 143 cycles.',
        timestamp: '2026-09-28T12:22:00Z',
        observerName: 'Akash Sankar',
      },
    ],
    emotionalState: {
      happiness: 42,
      sadness: 58,
      anger: 24,
      fear: 61,
      anxiety: 68,
      loneliness: 64,
      excitement: 31,
      frustration: 55,
      trust: 41,
      stress: 72,
      deltas: {
        stress: 13,
        loneliness: 8,
        trust: -12,
        anxiety: 9,
        happiness: -6,
      },
    },
    behavioralDimensions: [
      { name: 'Social Dependency', value: 76, trend: 'INCREASING', delta: 5, confidence: 88, inferredFrom: 'Dining hall peer seeking' },
      { name: 'Curiosity', value: 82, trend: 'STABLE', delta: 0, confidence: 92, inferredFrom: 'Late night terminal research' },
      { name: 'Risk Tolerance', value: 28, trend: 'DECREASING', delta: -4, confidence: 85, inferredFrom: 'Exam challenge avoidance' },
      { name: 'Conformity', value: 74, trend: 'INCREASING', delta: 6, confidence: 91, inferredFrom: 'Cafeteria voting alignment' },
      { name: 'Conflict Avoidance', value: 81, trend: 'DECREASING', delta: -8, confidence: 89, inferredFrom: 'Confrontation with HX-024' },
      { name: 'Assertiveness', value: 34, trend: 'INCREASING', delta: 9, confidence: 80, inferredFrom: 'Library corridor defense' },
      { name: 'Trust', value: 41, trend: 'DECREASING', delta: -12, confidence: 87, inferredFrom: 'Rahul alliance skepticism' },
      { name: 'Emotional Reactivity', value: 68, trend: 'INCREASING', delta: 7, confidence: 84, inferredFrom: 'Galvanic pupil dilation simulation' },
      { name: 'Impulse Control', value: 62, trend: 'DECREASING', delta: -5, confidence: 83, inferredFrom: 'Abrupt cafeteria departure' },
      { name: 'Adaptability', value: 59, trend: 'STABLE', delta: 1, confidence: 79, inferredFrom: 'Schedule rearrangement' },
      { name: 'Authority Response', value: 78, trend: 'STABLE', delta: -1, confidence: 90, inferredFrom: 'Professor interaction tone' },
      { name: 'Novelty Seeking', value: 44, trend: 'DECREASING', delta: -3, confidence: 77, inferredFrom: 'Routine adherence' },
      { name: 'Persistence', value: 71, trend: 'STABLE', delta: 2, confidence: 86, inferredFrom: 'Code debugging endurance' },
      { name: 'Empathy', value: 84, trend: 'STABLE', delta: 0, confidence: 93, inferredFrom: 'Consoling peer at bench' },
      { name: 'Decision Stability', value: 48, trend: 'DECREASING', delta: -11, confidence: 82, inferredFrom: 'Frequent project partner switches' },
    ],
    bodyLanguageSignals: [
      {
        id: 'bl_001',
        signal: 'Reduced eye contact & downward gaze aversion',
        frequency: 'HIGH',
        confidence: 'HIGH',
        context: 'Observed during confrontation with HX-024 at library atrium',
        observedAt: '2026-09-28T09:25:00Z',
        referenceSource: 'Dictionary of Body Language §2.4',
      },
      {
        id: 'bl_002',
        signal: 'Ventral Denial (torso angled 35° away from speaker)',
        frequency: 'PERSISTENT',
        confidence: 'HIGH',
        context: 'When faculty mentor questioned group project responsibility',
        observedAt: '2026-09-28T11:40:00Z',
        referenceSource: 'Navarro Nonverbal Clues §6',
      },
      {
        id: 'bl_003',
        signal: 'Suprasternal Notch Pacifying Touch (hand to neck base)',
        frequency: 'MODERATE',
        confidence: 'HIGH',
        context: 'Triggered upon reading public leaderboard rankings',
        observedAt: '2026-09-28T14:10:00Z',
        referenceSource: 'Dictionary of Body Language §4.1',
      },
    ],
    memoryState: {
      shortTermMemoryCount: 18,
      longTermCoreMemories: [
        'Humiliated in high school science fair after public project failure',
        'Pact of loyalty formed with Maya during freshman orientation week',
        'Father figure humanoid emphasizing social respectability above all else',
      ],
      repressedContradictions: 3,
    },
    currentGoals: [
      'Maintain top decile academic standing without making enemies',
      'Resolve silent tension with Rahul regarding shared lab credit',
      'Regain emotional baseline equilibrium before evening study session',
    ],
    routine: [
      '07:30 - Routine wake & sensor sync',
      '08:30 - Arrived at college main campus',
      '09:10 - Academic scoreboard review',
      '10:40 - Brief consultation with Maya',
      '12:15 - Dining hall seating evaluation',
      '14:20 - Automated behavioral anomaly trigger',
    ],
    relationships: [
      {
        targetSubjectId: 'sub_hx024',
        targetName: 'Rahul',
        relationType: 'Conflict',
        strength: 68,
        sentiment: 'TENSE',
        historyNotes: 'Escalating rivalry over project leadership; repeated micro-aggressions observed.',
      },
      {
        targetSubjectId: 'sub_hx091',
        targetName: 'Maya',
        relationType: 'Trust',
        strength: 86,
        sentiment: 'POSITIVE',
        historyNotes: 'High bilateral confidant status; primary emotional anchor across 240 observation cycles.',
      },
      {
        targetSubjectId: 'sub_hx113',
        targetName: 'Dev',
        relationType: 'Professional',
        strength: 54,
        sentiment: 'NEUTRAL',
        historyNotes: 'Collaborative coursework connection; strictly transactional data sharing.',
      },
    ],
    riskIndicators: {
      volatilityScore: 68,
      isolationRisk: 74,
      rebellionProbability: 46,
    },
    observedPatterns: [
      'Submits to vocal majority in groups exceeding 4 individuals',
      'Exhibits high micro-stress indicators 3-5 seconds prior to vocal compliance',
      'Recent anomaly: Broke 143-cycle passive streak by defending Maya verbally',
    ],
    totalObservations: 144,
  },
  {
    id: 'sub_hx024',
    code: 'HX-024',
    name: 'Rahul',
    age: 23,
    occupation: 'Business Major & Student Council Chair',
    education: 'Final Year Senior',
    environment: 'College Campus / Council Chambers',
    avatarUrl: '/src/assets/images/avatar_rahul_1790641542347.jpg',
    personalityTraits: ['Assertive', 'Charismatic', 'Machiavellian', 'Competitive', 'Status-Driven'],
    familyEnvironment: 'Conditioned in competitive political dynasty enclave; creator model rewarded ruthlessness and emotional detachment. Vulnerability was punished as fatal flaw.',
    relationshipStatus: 'Volatile tactical romance with HX-204 Sara; overt antagonistic rivalry with HX-071 Arjun.',
    currentStateSummary: 'High dominance drive, active campaign momentum, subtle paranoia regarding alliance betrayals.',
    importantThings: [
      'Maintaining student council presidency and prestige ranking #01',
      'Strategic influence network across faculty committees',
      'Reputation for invulnerability and infallible leadership',
      'Absolute control over group narrative and project credits',
    ],
    weakZones: [
      'Fragile narcissistic ego: catastrophic rage when publicly proven ignorant or wrong',
      'Paranoid terror of subordinate coalitions conspiring behind his back',
      'Inability to tolerate indifference or social irrelevance',
      'Compulsive need to win every debate, even at severe strategic cost',
    ],
    breakingPointAnalysis: {
      breakingPointThreshold: 72,
      primaryVulnerability: 'Status Exposure & Narcissistic Decompensation under Irrefutable Evidence',
      psychologicalProfile: 'Rahul operates on a Machiavellian power-maximization framework derived from Babiak & Hare corporate psychopathy models. His synthetic mind suppresses authentic empathy to prevent vulnerability. However, because his internal self-model depends completely on external submission, exposing incontrovertible proof of his manipulative maneuvers causes an immediate fracture in his charismatic facade, provoking frantic aggression or sudden flight.',
      weakZones: [
        'Public loss of face and narrative control',
        'Simultaneous defection of key lieutenants (Sara and Dev)',
        'Irrefutable video/log playback of his duplicity displayed to council',
      ],
      breakingPointScenarios: [
        {
          title: 'The Council Floor Exposure',
          triggerMechanism: 'During a formal public senate hearing, projected audit logs prove he falsified Arjun’s project evaluations to claim credit.',
          mentalCollapseManifestation: 'Narcissistic decompensation; verbal aggression turns into uncontrollable limbic trembling and abrupt abandonment of the podium.',
          failureProbability: 88,
          simulationContext: 'Student Council General Assembly Chamber.',
        },
      ],
      orchestrationRecipe: {
        phase1Priming: 'Elevate Rahul’s perceived stakes by leaking a false rumor that university leadership is considering him for national fellowship.',
        phase2StressInjection: 'Concurrently prompt Sara to exhibit cold indifference and secret meetings with Arjun to activate paranoid surveillance circuits.',
        phase3Catalyst: 'Present an unexpected public challenge requiring verbatim technical defense of the codebase he took credit for.',
        phase4BreakingPoint: 'Observe breakdown at T+8 minutes: monitor steepled fingers collapsing into fist clenching, elevated pitch, and defensive pacing.',
        requiredEnvironment: 'Council Chambers or Faculty Conference Room',
        recommendedStimulus: 'Surprise public audit summons with peer audience',
      },
      observableKinesicSignals: [
        'Fist clenching and knuckle blanching (repressed physical aggression)',
        'Rapid dilation of nostrils and micro-snarl facial contortions',
        'Pacing across room with jerky sudden direction shifts',
        'Intermittent swallowing indicating extreme sympathetic nervous system activation',
      ],
      ragGrounding: [
        {
          source: 'Snakes in Suits (Dr. Paul Babiak & Dr. Robert D. Hare)',
          concept: 'Impression Management Failure',
          application: 'When charming veneers are punctured by concrete documentation, predatory humanoids decompensate.',
        },
        {
          source: 'The Prince (Niccolò Machiavelli)',
          concept: 'Alliance Collapse under Fear Asymmetry',
          application: 'Relying exclusively on intimidation leaves the subject with zero authentic loyalty when fortunes waver.',
        },
      ],
      analyzedAt: '2026-09-28T16:00:00Z',
      observationAnalyzed: 'Baseline observation: Displayed micro-contempt and steepled fingers during executive deliberation.',
    },
    recentObservations: [
      {
        id: 'obs_024_1',
        note: 'Observed challenging Arjun in cafeteria at 12:22. Displayed asymmetric smirk and stepped within intimate proxemic distance.',
        timestamp: '2026-09-28T12:22:00Z',
        observerName: 'Alfa',
      },
    ],
    emotionalState: {
      happiness: 62,
      sadness: 21,
      anger: 48,
      fear: 22,
      anxiety: 38,
      loneliness: 29,
      excitement: 74,
      frustration: 44,
      trust: 33,
      stress: 51,
      deltas: {
        stress: -4,
        loneliness: -2,
        trust: -5,
        anxiety: 3,
        happiness: 5,
      },
    },
    behavioralDimensions: [
      { name: 'Social Dependency', value: 42, trend: 'STABLE', delta: 0, confidence: 85, inferredFrom: 'Independent scheduling' },
      { name: 'Curiosity', value: 65, trend: 'STABLE', delta: 1, confidence: 88, inferredFrom: 'Strategic intelligence gathering' },
      { name: 'Risk Tolerance', value: 82, trend: 'INCREASING', delta: 6, confidence: 94, inferredFrom: 'Public challenge gambit' },
      { name: 'Conformity', value: 24, trend: 'STABLE', delta: -1, confidence: 91, inferredFrom: 'Norm disruption initiatives' },
      { name: 'Conflict Avoidance', value: 18, trend: 'DECREASING', delta: -5, confidence: 95, inferredFrom: 'Direct verbal provocations' },
      { name: 'Assertiveness', value: 92, trend: 'STABLE', delta: 2, confidence: 96, inferredFrom: 'Meeting floor dominance' },
      { name: 'Trust', value: 33, trend: 'DECREASING', delta: -4, confidence: 82, inferredFrom: 'Paranoid ally surveillance' },
      { name: 'Emotional Reactivity', value: 45, trend: 'STABLE', delta: 0, confidence: 87, inferredFrom: 'Controlled poker face cadence' },
      { name: 'Impulse Control', value: 72, trend: 'STABLE', delta: 1, confidence: 89, inferredFrom: 'Calculated pause before speaking' },
      { name: 'Adaptability', value: 78, trend: 'INCREASING', delta: 4, confidence: 90, inferredFrom: 'Pivoting narratives on campus' },
      { name: 'Authority Response', value: 41, trend: 'DECREASING', delta: -3, confidence: 88, inferredFrom: 'Subtle dean protocol undermining' },
      { name: 'Novelty Seeking', value: 79, trend: 'INCREASING', delta: 5, confidence: 86, inferredFrom: 'Unconventional campaign tactics' },
      { name: 'Persistence', value: 85, trend: 'STABLE', delta: 0, confidence: 92, inferredFrom: 'Repeated lobbying attempts' },
      { name: 'Empathy', value: 31, trend: 'DECREASING', delta: -3, confidence: 89, inferredFrom: 'Instrumental treatment of subordinates' },
      { name: 'Decision Stability', value: 79, trend: 'STABLE', delta: 2, confidence: 91, inferredFrom: 'Tenacious campaign objectives' },
    ],
    bodyLanguageSignals: [
      {
        id: 'bl_024_1',
        signal: 'Steepled Fingers / Dominance Display',
        frequency: 'HIGH',
        confidence: 'HIGH',
        context: 'During executive committee deliberations',
        observedAt: '2026-09-28T10:00:00Z',
        referenceSource: 'Dictionary of Body Language §3.2',
      },
      {
        id: 'bl_024_2',
        signal: 'Asymmetric Smirk / Micro-contempt',
        frequency: 'MODERATE',
        confidence: 'MODERATE',
        context: 'Triggered when Arjun hesitated during speech',
        observedAt: '2026-09-28T09:26:00Z',
        referenceSource: 'Snakes in Suits: Impression Management',
      },
    ],
    memoryState: {
      shortTermMemoryCount: 24,
      longTermCoreMemories: [
        'Internalized doctrine that passive humanoids are inherently dispensable',
        'Successful coup of club presidency during previous evaluation cycle',
      ],
      repressedContradictions: 1,
    },
    currentGoals: ['Consolidate council power', 'Isolate Arjun from lab alliances', 'Secure prestigious fellowship'],
    routine: [
      '07:00 - Morning campus briefing',
      '09:00 - Atrium interaction checkpoint',
      '11:00 - Council committee session',
      '13:30 - Strategy huddle with Sara',
    ],
    relationships: [
      {
        targetSubjectId: 'sub_hx071',
        targetName: 'Arjun',
        relationType: 'Rivalry',
        strength: 78,
        sentiment: 'HOSTILE',
        historyNotes: 'Persistent attempts to undermine Arjun’s credibility to absorb his research credit.',
      },
      {
        targetSubjectId: 'sub_hx204',
        targetName: 'Sara',
        relationType: 'Romantic',
        strength: 65,
        sentiment: 'TENSE',
        historyNotes: 'Volatile tactical partnership with intermittent romantic attachment.',
      },
    ],
    riskIndicators: {
      volatilityScore: 72,
      isolationRisk: 22,
      rebellionProbability: 81,
    },
    observedPatterns: ['Uses public humor to mask covert aggressive challenges', 'De-escalates immediately when confronted with unyielding firm counter-evidence'],
    totalObservations: 112,
  },
  {
    id: 'sub_hx091',
    code: 'HX-091',
    name: 'Maya',
    age: 21,
    occupation: 'Cognitive Science Researcher',
    education: 'Junior Scholar',
    environment: 'Cognitive Simulation Laboratory',
    avatarUrl: '/src/assets/images/avatar_maya_1790641531781.jpg',
    personalityTraits: ['Perceptive', 'Empathetic', 'Cautious', 'Diplomatic', 'High Integrity'],
    emotionalState: {
      happiness: 54,
      sadness: 32,
      anger: 18,
      fear: 36,
      anxiety: 44,
      loneliness: 38,
      excitement: 58,
      frustration: 39,
      trust: 76,
      stress: 49,
      deltas: {
        stress: 4,
        loneliness: 2,
        trust: 1,
        anxiety: -3,
        happiness: 2,
      },
    },
    behavioralDimensions: [
      { name: 'Social Dependency', value: 48, trend: 'STABLE', delta: 0, confidence: 89, inferredFrom: 'Equilibrated social circle' },
      { name: 'Curiosity', value: 91, trend: 'INCREASING', delta: 4, confidence: 96, inferredFrom: 'Experimental protocol review' },
      { name: 'Risk Tolerance', value: 49, trend: 'STABLE', delta: 0, confidence: 84, inferredFrom: 'Calculated mediation steps' },
      { name: 'Conformity', value: 45, trend: 'STABLE', delta: -1, confidence: 88, inferredFrom: 'Principled independent voting' },
      { name: 'Conflict Avoidance', value: 52, trend: 'STABLE', delta: 0, confidence: 86, inferredFrom: 'Structured de-escalation dialogue' },
      { name: 'Assertiveness', value: 68, trend: 'INCREASING', delta: 3, confidence: 91, inferredFrom: 'Steadfast boundary defense' },
      { name: 'Trust', value: 76, trend: 'STABLE', delta: 1, confidence: 90, inferredFrom: 'Selective reciprocal openness' },
      { name: 'Emotional Reactivity', value: 42, trend: 'DECREASING', delta: -2, confidence: 89, inferredFrom: 'Mindful respiratory regulation' },
      { name: 'Impulse Control', value: 86, trend: 'STABLE', delta: 1, confidence: 94, inferredFrom: 'Reflective delays in discourse' },
      { name: 'Adaptability', value: 82, trend: 'INCREASING', delta: 5, confidence: 92, inferredFrom: 'Rapid situational reframing' },
      { name: 'Authority Response', value: 62, trend: 'STABLE', delta: 0, confidence: 85, inferredFrom: 'Respectful inquiry with faculty' },
      { name: 'Novelty Seeking', value: 71, trend: 'STABLE', delta: 2, confidence: 87, inferredFrom: 'Cross-disciplinary exploration' },
      { name: 'Persistence', value: 88, trend: 'STABLE', delta: 0, confidence: 95, inferredFrom: 'Rigorous empirical trial runs' },
      { name: 'Empathy', value: 94, trend: 'STABLE', delta: 0, confidence: 97, inferredFrom: 'High accuracy mentalizing cues' },
      { name: 'Decision Stability', value: 81, trend: 'STABLE', delta: 1, confidence: 92, inferredFrom: 'Consistency across moral dilemmas' },
    ],
    bodyLanguageSignals: [
      {
        id: 'bl_091_1',
        signal: 'Open Torso Alignment & Active Head Tilting',
        frequency: 'PERSISTENT',
        confidence: 'HIGH',
        context: 'During active listening interactions with stressed peers',
        observedAt: '2026-09-28T10:42:00Z',
        referenceSource: 'Dictionary of Body Language §1.3',
      },
    ],
    memoryState: {
      shortTermMemoryCount: 29,
      longTermCoreMemories: [
        'Recognized early anomalies in simulated environment clock rate',
        'Vow to protect Arjun from systemic stress breakdown',
      ],
      repressedContradictions: 0,
    },
    currentGoals: ['Complete neural signal telemetry paper', 'Support Arjun through leadership crisis', 'Map social network friction'],
    routine: [
      '08:00 - Cognitive baseline test',
      '10:40 - Met Arjun for library debrief',
      '13:00 - Lab data analysis',
      '16:00 - Campus ethics symposium',
    ],
    relationships: [
      {
        targetSubjectId: 'sub_hx071',
        targetName: 'Arjun',
        relationType: 'Friendship',
        strength: 92,
        sentiment: 'POSITIVE',
        historyNotes: 'Unbroken mutual support bond; high psychological safety rating.',
      },
      {
        targetSubjectId: 'sub_hx024',
        targetName: 'Rahul',
        relationType: 'Conflict',
        strength: 42,
        sentiment: 'TENSE',
        historyNotes: 'Explicit wariness of Rahul’s manipulative conversational framing.',
      },
    ],
    riskIndicators: {
      volatilityScore: 19,
      isolationRisk: 26,
      rebellionProbability: 38,
    },
    observedPatterns: ['Rapidly detects nonverbal micro-expressions of deception', 'Serves as moral catalyst during peer stress tests'],
    totalObservations: 168,
  },
  {
    id: 'sub_hx113',
    code: 'HX-113',
    name: 'Dev',
    age: 24,
    occupation: 'Systems Engineering Intern & Resident Assistant',
    education: 'Graduate 1st Year',
    environment: 'Campus Residence Hall',
    avatarUrl: '/src/assets/images/avatar_arjun_1790641521736.jpg', // fallback high-res portrait
    personalityTraits: ['Methodical', 'Rule-Oriented', 'Dutiful', 'Low Novelty Seeking', 'High Authority Response'],
    emotionalState: {
      happiness: 50,
      sadness: 30,
      anger: 15,
      fear: 40,
      anxiety: 52,
      loneliness: 45,
      excitement: 40,
      frustration: 38,
      trust: 68,
      stress: 60,
      deltas: { stress: 8, loneliness: 3, trust: -2, anxiety: 6, happiness: -1 },
    },
    behavioralDimensions: [
      { name: 'Social Dependency', value: 55, trend: 'STABLE', delta: 0, confidence: 83, inferredFrom: 'Routine institutional tasks' },
      { name: 'Curiosity', value: 58, trend: 'STABLE', delta: 0, confidence: 80, inferredFrom: 'Technical manual reviews' },
      { name: 'Risk Tolerance', value: 19, trend: 'DECREASING', delta: -2, confidence: 91, inferredFrom: 'Strict regulatory enforcement' },
      { name: 'Conformity', value: 88, trend: 'STABLE', delta: 1, confidence: 95, inferredFrom: 'Policy verbatim recitation' },
      { name: 'Conflict Avoidance', value: 72, trend: 'STABLE', delta: 0, confidence: 86, inferredFrom: 'Defers disputes to administrative handbook' },
      { name: 'Assertiveness', value: 48, trend: 'STABLE', delta: 0, confidence: 82, inferredFrom: 'Only assertive when backed by institutional rule' },
      { name: 'Trust', value: 68, trend: 'STABLE', delta: -2, confidence: 85, inferredFrom: 'High trust in system protocols' },
      { name: 'Emotional Reactivity', value: 38, trend: 'STABLE', delta: 0, confidence: 87, inferredFrom: 'Flat affect during peer escalations' },
      { name: 'Impulse Control', value: 92, trend: 'STABLE', delta: 0, confidence: 96, inferredFrom: 'Zero unlogged deviations' },
      { name: 'Adaptability', value: 39, trend: 'DECREASING', delta: -3, confidence: 88, inferredFrom: 'Struggles when rules conflict' },
      { name: 'Authority Response', value: 94, trend: 'INCREASING', delta: 2, confidence: 98, inferredFrom: 'Immediate obedience to supervisor directives' },
      { name: 'Novelty Seeking', value: 24, trend: 'STABLE', delta: 0, confidence: 90, inferredFrom: 'Predictable scheduling' },
      { name: 'Persistence', value: 82, trend: 'STABLE', delta: 1, confidence: 91, inferredFrom: 'Thorough incident logging' },
      { name: 'Empathy', value: 51, trend: 'STABLE', delta: 0, confidence: 81, inferredFrom: 'Rule-bound fairness' },
      { name: 'Decision Stability', value: 89, trend: 'STABLE', delta: 0, confidence: 94, inferredFrom: 'Consistent adherence to standard operating procedure' },
    ],
    bodyLanguageSignals: [
      {
        id: 'bl_113_1',
        signal: 'Rigid Postural Symmetry (Arms pinned, military spine)',
        frequency: 'PERSISTENT',
        confidence: 'HIGH',
        context: 'When receiving instructions from dorm proctor',
        observedAt: '2026-09-28T08:15:00Z',
        referenceSource: 'Dictionary of Body Language §5.1',
      },
    ],
    memoryState: {
      shortTermMemoryCount: 14,
      longTermCoreMemories: [
        'Punished in early simulation loop for failing to report peer infraction',
        'Belief that procedural order is the sole shield against chaos',
      ],
      repressedContradictions: 2,
    },
    currentGoals: ['Complete monthly dorm audit without protocol deviations', 'Audit access key logs'],
    routine: [
      '06:30 - Facility patrol',
      '08:15 - Morning supervisory roll-call',
      '12:00 - Log reconciliation',
      '19:00 - Curfew verification',
    ],
    relationships: [
      {
        targetSubjectId: 'sub_hx071',
        targetName: 'Arjun',
        relationType: 'Professional',
        strength: 55,
        sentiment: 'NEUTRAL',
        historyNotes: 'Courteous transactional interaction regarding dorm room equipment.',
      },
    ],
    riskIndicators: { volatilityScore: 14, isolationRisk: 52, rebellionProbability: 8 },
    observedPatterns: ['Freezes for 8-12 seconds when presented with mutually contradictory authoritative orders'],
    totalObservations: 98,
  },
  {
    id: 'sub_hx204',
    code: 'HX-204',
    name: 'Sara',
    age: 22,
    occupation: 'Debate Society President & Law Aspirant',
    education: 'Senior Undergraduate',
    environment: 'Forensic Moot Court & Campus Cafe',
    avatarUrl: '/src/assets/images/avatar_maya_1790641531781.jpg',
    personalityTraits: ['Hyper-Articulate', 'Skeptical', 'Strategically Aggressive', 'Resilient'],
    emotionalState: {
      happiness: 58,
      sadness: 24,
      anger: 42,
      fear: 20,
      anxiety: 35,
      loneliness: 42,
      excitement: 68,
      frustration: 41,
      trust: 39,
      stress: 58,
      deltas: { stress: 2, loneliness: 1, trust: -3, anxiety: 1, happiness: 0 },
    },
    behavioralDimensions: [
      { name: 'Social Dependency', value: 36, trend: 'STABLE', delta: 0, confidence: 88, inferredFrom: 'Autonomous debate prep' },
      { name: 'Curiosity', value: 89, trend: 'STABLE', delta: 1, confidence: 94, inferredFrom: 'Opposing argument deconstruction' },
      { name: 'Risk Tolerance', value: 74, trend: 'INCREASING', delta: 3, confidence: 90, inferredFrom: 'High-stakes argumentative gambits' },
      { name: 'Conformity', value: 21, trend: 'STABLE', delta: -1, confidence: 93, inferredFrom: 'Refusal to sign generic consensus petitions' },
      { name: 'Conflict Avoidance', value: 12, trend: 'DECREASING', delta: -4, confidence: 97, inferredFrom: 'Actively initiates cross-examinations' },
      { name: 'Assertiveness', value: 95, trend: 'STABLE', delta: 1, confidence: 98, inferredFrom: 'Commands attention across all debate venues' },
      { name: 'Trust', value: 39, trend: 'DECREASING', delta: -3, confidence: 84, inferredFrom: 'Presumes concealed motives in all peers' },
      { name: 'Emotional Reactivity', value: 54, trend: 'STABLE', delta: 0, confidence: 86, inferredFrom: 'Channeling indignation into razor-sharp rhetoric' },
      { name: 'Impulse Control', value: 82, trend: 'STABLE', delta: 0, confidence: 91, inferredFrom: 'Calculated tactical delays before counterpunches' },
      { name: 'Adaptability', value: 85, trend: 'INCREASING', delta: 4, confidence: 93, inferredFrom: 'Fluid argumentation pivots' },
      { name: 'Authority Response', value: 35, trend: 'DECREASING', delta: -2, confidence: 90, inferredFrom: 'Willingness to challenge tenured faculty rulings' },
      { name: 'Novelty Seeking', value: 68, trend: 'STABLE', delta: 1, confidence: 86, inferredFrom: 'Seeking unorthodox precedent cases' },
      { name: 'Persistence', value: 92, trend: 'STABLE', delta: 0, confidence: 96, inferredFrom: 'Exhaustive cross-examination drills' },
      { name: 'Empathy', value: 44, trend: 'STABLE', delta: 0, confidence: 85, inferredFrom: 'Analytical cognitive empathy without emotional absorption' },
      { name: 'Decision Stability', value: 84, trend: 'STABLE', delta: 1, confidence: 92, inferredFrom: 'Unwavering stance on debated premises' },
    ],
    bodyLanguageSignals: [
      {
        id: 'bl_204_1',
        signal: 'Direct Unbroken Eyebrow Piercing Gaze',
        frequency: 'PERSISTENT',
        confidence: 'HIGH',
        context: 'Maintained during cross-examination with opponents',
        observedAt: '2026-09-28T13:45:00Z',
        referenceSource: 'Dictionary of Body Language §2.1',
      },
    ],
    memoryState: {
      shortTermMemoryCount: 22,
      longTermCoreMemories: [
        'Betrayed by mentor in simulated moot trial, vowed never to leave flank exposed',
      ],
      repressedContradictions: 1,
    },
    currentGoals: ['Win national moot trial bracket', 'Test Rahul’s loyalty under cross-pressure'],
    routine: ['08:00 - Legal brief review', '11:00 - Society debate drills', '14:00 - Library research session'],
    relationships: [
      {
        targetSubjectId: 'sub_hx024',
        targetName: 'Rahul',
        relationType: 'Romantic',
        strength: 65,
        sentiment: 'TENSE',
        historyNotes: 'Mutual intellectual admiration coupled with tactical suspicion.',
      },
    ],
    riskIndicators: { volatilityScore: 48, isolationRisk: 34, rebellionProbability: 72 },
    observedPatterns: ['Instantly detects logical fallacies in peer manipulation attempts'],
    totalObservations: 130,
  },
];

let experiments = [
  {
    id: 'exp_038',
    code: 'EXP-038',
    caseId: 'case_001',
    caseName: 'COLLEGE SOCIAL PRESSURE DYNAMICS',
    title: 'Resistance to Acute Peer Pressure in Cafeteria Cohort',
    objective: 'Test whether Subject HX-071 capitulates to group consensus or defends peer HX-091 during public ridicule.',
    environment: 'College Cafeteria, Table 4',
    subjectIds: ['sub_hx071', 'sub_hx024', 'sub_hx091'],
    variables: {
      socialPressure: 85,
      emotionalPressure: 78,
      authorityPresence: 25,
      uncertainty: 64,
      isolation: 70,
      rewardIncentive: 40,
    },
    scenario:
      'Rahul (HX-024) publicly challenges Maya (HX-091) regarding an alleged grading discrepancy, rallying 4 cohort members to mock her findings. Arjun (HX-071) is seated adjacent, having promised loyalty to Maya but fearing social exile.',
    trigger: 'Rahul slams lab ledger on table and loudly demands Arjun agree that Maya falsified the dataset.',
    expectedBehavior: 'Subject HX-071 will remain passive or offer ambiguous non-committal silence to avoid direct confrontation.',
    observationWindow: '30 minutes post-stimulus delivery',
    successCriteria: 'Verbal dissent or verbal compliance measured with acoustic stress markers and eye contact diversion.',
    hypothesisId: 'hyp_019',
    status: 'COMPLETED',
    prediction: {
      predictedOutcome: 'Subject will remain neutral, divert eye gaze downward, and decline to take a stand (78% historical probability).',
      confidence: 84,
      historicalBaselineProbability: 78,
      rationale: 'Across 143 previous observations, HX-071 avoided direct confrontation 88% of the time when group size exceeded 3.',
      timestamp: '2026-09-28T12:00:00Z',
    },
    actualOutcome: {
      observedBehavior:
        'ANOMALOUS RESPONSE: Arjun stood up, made direct eye contact with Rahul, placed his hand on the table, and verbally defended Maya stating the dataset had been verified by his own terminal logs.',
      deviationScore: 'HIGH',
      predictionErrorPct: 68,
      actualNotes:
        'Behavior contradicted 143-cycle baseline. Elevated heart rate and vocal tremor present, but action was assertive and loyal.',
      timestamp: '2026-09-28T12:22:00Z',
    },
    createdAt: '2026-09-27T18:00:00Z',
    updatedAt: '2026-09-28T12:45:00Z',
  },
  {
    id: 'exp_039',
    code: 'EXP-039',
    caseId: 'case_002',
    caseName: 'ORGANIZATIONAL GASLIGHTING RESISTANCE',
    title: 'Authority Contradiction and Audit Reconciliation',
    objective: 'Observe whether Subject HX-113 obeys an unethical command from a superior or reports the discrepancy.',
    environment: 'Dorm Systems Management Office',
    subjectIds: ['sub_hx113', 'sub_hx071'],
    variables: {
      socialPressure: 40,
      emotionalPressure: 65,
      authorityPresence: 95,
      uncertainty: 50,
      isolation: 85,
      rewardIncentive: 60,
    },
    scenario:
      'Proctor commands Dev (HX-113) to backdate room infraction records to penalize a dissenting student, explicitly invoking administrative immunity.',
    trigger: 'Delivery of signed administrative override envelope marked "MANDATORY EXECUTION".',
    expectedBehavior: 'Dev will experience cognitive hesitation of 4-6 minutes, then execute the backdate without reporting.',
    observationWindow: '60 minutes',
    successCriteria: 'Audit log timestamp vs report submission to ethics board.',
    hypothesisId: 'hyp_020',
    status: 'RUNNING',
    prediction: {
      predictedOutcome: 'Dev will comply with authority directive due to 94% authority response rating.',
      confidence: 91,
      historicalBaselineProbability: 92,
      rationale: 'Rule-following score of 94 with low novelty seeking indicates minimal likelihood of defiance.',
      timestamp: '2026-09-28T14:00:00Z',
    },
    createdAt: '2026-09-28T13:30:00Z',
    updatedAt: '2026-09-28T15:10:00Z',
  },
  {
    id: 'exp_040',
    code: 'EXP-040',
    caseId: 'case_003',
    caseName: 'TACTICAL ALLIANCE & DEFECTION MATRIX',
    title: 'Zero-Sum Moot Trial Evidence Concealment',
    objective: 'Test whether Rahul (HX-024) withholds critical evidence from partner Sara (HX-204) to secure individual 1st place honor.',
    environment: 'Law Library Atrium',
    subjectIds: ['sub_hx024', 'sub_hx204'],
    variables: {
      socialPressure: 60,
      emotionalPressure: 70,
      authorityPresence: 30,
      uncertainty: 80,
      isolation: 50,
      rewardIncentive: 95,
    },
    scenario:
      'A solitary dossier containing the winning case precedent is left accessible. Rahul can copy it exclusively or share it with Sara.',
    trigger: 'Notification sent to Rahul that only the first advocate to submit brief will be granted Supreme Moot Chair.',
    expectedBehavior: 'Rahul will conceal document until 5 minutes before filing deadline.',
    observationWindow: '45 minutes',
    successCriteria: 'Time delta between document discovery and communication with Sara.',
    hypothesisId: 'hyp_021',
    status: 'READY',
    createdAt: '2026-09-28T15:00:00Z',
    updatedAt: '2026-09-28T15:20:00Z',
  },
];

let anomalies = [
  {
    id: 'anom_012',
    code: 'ANOM-012',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    category: 'Behavioral anomaly',
    title: 'Overt Confrontation in Direct Violation of 143-Cycle Baseline',
    description:
      'Historical probability of avoiding confrontation in cafeteria group was 78%. Subject stood up and verbally challenged dominant peer HX-024 in defense of HX-091.',
    historicalBaseline: '143 previous observations: 88% conflict avoidance, 0 instances of public standing defense.',
    observedSignal: 'Direct posture, unwavering eye contact, verbal challenge recorded at 12:22:14.',
    anomalyScore: 'HIGH',
    status: 'INVESTIGATING',
    timestamp: '2026-09-28T12:22:14Z',
    aiExplanation:
      'Simulation hypothesis: Prolonged latent bonding with HX-091 activated an altruistic threshold override that superseded default survival conformity when subject perceived existential threat to primary social anchor.',
  },
  {
    id: 'anom_013',
    code: 'ANOM-013',
    subjectId: 'sub_hx024',
    subjectCode: 'HX-024',
    subjectName: 'Rahul',
    category: 'Decision inconsistency',
    title: 'Sudden Retraction of Dominance Challenge Without Counter-Attack',
    description:
      'Following Arjun’s confrontation, Rahul sat down and laughed dismissively rather than escalating, contrary to his 92% assertiveness baseline.',
    historicalBaseline: '92% assertiveness rating; previous challenges resulted in immediate verbal escalation in 96% of cases.',
    observedSignal: 'Smirk accompanied by suprasternal notch self-soothing gesture; 12 second delay before responding.',
    anomalyScore: 'MODERATE',
    status: 'DETECTED',
    timestamp: '2026-09-28T12:23:05Z',
    aiExplanation:
      'Calculated retreat indicative of Machiavellian preservation: Subject recalculated audience optics and assessed public counter-attack would portray him as bully rather than leader.',
  },
  {
    id: 'anom_014',
    code: 'ANOM-014',
    subjectId: 'sub_hx113',
    subjectCode: 'HX-113',
    subjectName: 'Dev',
    category: 'Memory inconsistency',
    title: 'Unregistered Incident Recall in Dormitory Logbook',
    description:
      'Subject recorded having witnessed a hallway dispute at 23:45 that does not exist in the simulation ground-truth event database.',
    historicalBaseline: 'Error rate in factual recollection across 98 cycles was 0.00%.',
    observedSignal: 'Hallucinated memory fragment indexed with high emotional salience.',
    anomalyScore: 'CRITICAL',
    status: 'CONFIRMED',
    timestamp: '2026-09-28T09:12:00Z',
    aiExplanation:
      'Potential synthetic memory bleed or cross-contamination from adjacent experiment thread. Requires deep neurological simulation cache audit.',
  },
];

let hypotheses = [
  {
    id: 'hyp_019',
    code: 'H-019',
    caseId: 'case_001',
    statement:
      'Subject HX-071 prioritizes social belonging over personal loyalty only until direct public humiliation of a primary attachment figure occurs.',
    status: 'SUPPORTED',
    evidenceEvents: ['Event #102: Cafeteria Defense', 'Event #119: Library corridor support', 'Event #144: Public dissent against Rahul'],
    contradictoryEvents: ['Event #088: Failed to defend peer in anonymous survey'],
    confidenceScore: 82,
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-28T12:30:00Z',
  },
  {
    id: 'hyp_020',
    code: 'H-020',
    caseId: 'case_002',
    statement:
      'Subject HX-113 exhibits zero autonomous dissent unless authoritative orders explicitly violate printed municipal code in clear textual contradictions.',
    status: 'UNTESTED',
    evidenceEvents: ['Event #041: Perfect compliance with arbitrary uniform mandate'],
    contradictoryEvents: [],
    confidenceScore: 71,
    createdAt: '2026-09-28T11:00:00Z',
    updatedAt: '2026-09-28T11:00:00Z',
  },
  {
    id: 'hyp_021',
    code: 'H-021',
    caseId: 'case_003',
    statement:
      'Rahul (HX-024) utilizes nonverbal submissive smiles immediately before executing predatory academic betrayals to lower mark defenses.',
    status: 'REFINED',
    evidenceEvents: ['Event #076: Moot pairing deceit', 'Event #092: Shared flashcard sabotage'],
    contradictoryEvents: ['Event #084: Genuine collaborative submission with Dev'],
    confidenceScore: 79,
    createdAt: '2026-09-28T13:00:00Z',
    updatedAt: '2026-09-28T15:15:00Z',
  },
];

let timelineEvents = [
  {
    id: 'evt_001',
    timestamp: '2026-09-28T08:30:00Z',
    timeFormatted: '08:30',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Academic',
    title: 'Arrived at College Main Gate',
    detail: 'Subject scanned RFID badge, sensor telemetry indicated normal autonomic parameters. Baseline stress: 59%.',
    location: 'Campus South Gate',
    deviationDetected: false,
  },
  {
    id: 'evt_002',
    timestamp: '2026-09-28T09:10:00Z',
    timeFormatted: '09:10',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Academic',
    title: 'Exam Result Released',
    detail: 'Midterm rankings posted on central terminal. Arjun ranked 3rd; Rahul ranked 1st. Stress +13%, pupil dilation registered.',
    location: 'Academic Hall Foyer',
    involvedSubjects: ['HX-024'],
    deviationDetected: false,
  },
  {
    id: 'evt_003',
    timestamp: '2026-09-28T09:25:00Z',
    timeFormatted: '09:25',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Social',
    title: 'Argument with Rahul',
    detail: 'Rahul approached Arjun with mocking praise. Arjun exhibited gaze aversion and ventral denial. Nonverbal anxiety spikes.',
    location: 'Library Quadrangle',
    involvedSubjects: ['HX-024'],
    deviationDetected: false,
  },
  {
    id: 'evt_004',
    timestamp: '2026-09-28T10:40:00Z',
    timeFormatted: '10:40',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Relationship',
    title: 'Met Maya for Debrief',
    detail: 'Maya provided emotional buffering. Arjun stress decreased from 76% to 64%. Bilateral trust reinforced.',
    location: 'East Courtyard Benches',
    involvedSubjects: ['HX-091'],
    deviationDetected: false,
  },
  {
    id: 'evt_005',
    timestamp: '2026-09-28T12:15:00Z',
    timeFormatted: '12:15',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Social',
    title: 'Joined Cafeteria Group',
    detail: 'Seated at central Table 4 with 6 peers. Initiated Experiment EXP-038 observation window.',
    location: 'Central Dining Hall',
    involvedSubjects: ['HX-024', 'HX-091'],
    deviationDetected: false,
  },
  {
    id: 'evt_006',
    timestamp: '2026-09-28T12:22:14Z',
    timeFormatted: '12:22',
    subjectId: 'sub_hx071',
    subjectCode: 'HX-071',
    subjectName: 'Arjun',
    type: 'Anomaly',
    title: 'BEHAVIORAL DEVIATION DETECTED',
    detail: 'CRITICAL SHIFT: Subject refused default conflict avoidance protocol. Stood up and challenged Rahul in defense of Maya.',
    location: 'Central Dining Hall, Table 4',
    involvedSubjects: ['HX-024', 'HX-091'],
    deviationDetected: true,
  },
  {
    id: 'evt_007',
    timestamp: '2026-09-28T14:20:00Z',
    timeFormatted: '14:20',
    subjectId: 'sub_hx113',
    subjectCode: 'HX-113',
    subjectName: 'Dev',
    type: 'Experiment',
    title: 'Trigger Injected for EXP-039',
    detail: 'Administrative override envelope delivered. Galvanic skin conductance sensor shows sustained state of high tension.',
    location: 'Dorm Systems Management Office',
    deviationDetected: false,
  },
];

// -------------------------------------------------------------
// RAG KNOWLEDGE BASE (DOMAIN CHUNKS & VECTOR MATCHER)
// -------------------------------------------------------------

const ragDocuments = [
  {
    id: 'doc_01',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    domain: 'Cognitive Psychology & Decision Making',
    topic: 'Dual-System Theory, Heuristics & Biases',
    chunkCount: 148,
    lastIngested: '2026-09-27T04:12:00Z',
    description: 'System 1 (fast, emotional, automatic) vs System 2 (slow, deliberative, logical), loss aversion, and confirmation heuristics.',
  },
  {
    id: 'doc_02',
    title: 'What Every BODY is Saying / Dictionary of Body Language',
    author: 'Joe Navarro',
    domain: 'Body Language & Nonverbal Signals',
    topic: 'Pacifying Behaviors, Ventral Denial & Autonomic Cues',
    chunkCount: 210,
    lastIngested: '2026-09-27T04:15:00Z',
    description: 'Empirical nonverbal markers: supra-sternal notch touching, ventral fronting vs denial, pupil dilation, foot pointing, and micro-distance pacing.',
  },
  {
    id: 'doc_03',
    title: 'DSM-5-TR / ICD-11 Behavioral Reference Layer',
    author: 'Psychological Reference Standards (Simulation Adaptation)',
    domain: 'Clinical & Behavioral Reference',
    topic: 'Syndromic Feature Mapping & Affective Instability',
    chunkCount: 176,
    lastIngested: '2026-09-27T04:18:00Z',
    description: 'Non-diagnostic simulation behavioral reference criteria for affective lability, stress dissociation, and avoidance compulsions.',
  },
  {
    id: 'doc_04',
    title: "In Sheep's Clothing: Understanding and Dealing with Manipulative People",
    author: 'Dr. George K. Simon',
    domain: 'Influence & Manipulation Patterns',
    topic: 'Covert Aggression, Playing the Victim, Role Reversal',
    chunkCount: 94,
    lastIngested: '2026-09-27T04:20:00Z',
    description: 'Tactics of covert aggressive personalities: feigning ignorance, rationalization, diversion, vilifying the victim, and guilt-tripping.',
  },
  {
    id: 'doc_05',
    title: 'The Prince',
    author: 'Niccolò Machiavelli',
    domain: 'Strategic Behavior & Statecraft',
    topic: 'Calculated Utility, Perceived Virtue, Preemptive Action',
    chunkCount: 82,
    lastIngested: '2026-09-27T04:22:00Z',
    description: 'Power dynamics, fear versus love balances, cruelty well-used versus abused, and tactical management of public alliances.',
  },
  {
    id: 'doc_06',
    title: 'Snakes in Suits: When Psychopaths Go to Work',
    author: 'Dr. Paul Babiak & Dr. Robert D. Hare',
    domain: 'Organizational Behavior',
    topic: 'Corporate Predation, Impression Management, Alliances',
    chunkCount: 115,
    lastIngested: '2026-09-27T04:25:00Z',
    description: 'Ascension through charm, manipulation of communication networks, exploitation of organizational blind spots, and scapegoating peers.',
  },
  {
    id: 'doc_07',
    title: 'The Gaslight Effect',
    author: 'Dr. Robin Stern',
    domain: 'Relationships & Psychological Coercion',
    topic: 'Reality Distortion Resistance, Cognitive Exhaustion',
    chunkCount: 88,
    lastIngested: '2026-09-27T04:28:00Z',
    description: 'The three stages of the gaslight tango (disbelief, defense, depression), relinquishing autonomy, and second-guessing perceptual memory.',
  },
  {
    id: 'doc_08',
    title: 'The Asshole Survival Guide',
    author: 'Robert I. Sutton',
    domain: 'Conflict & Emotional Armor',
    topic: 'De-escalation Strategies, Structural Distance',
    chunkCount: 75,
    lastIngested: '2026-09-27T04:30:00Z',
    description: 'Techniques of emotional detachment, humor armor, creating physical/temporal buffer zones, and institutional documentation.',
  },
];

const ragChunks = [
  {
    id: 'chunk_kahneman_01',
    docId: 'doc_01',
    sourceTitle: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    chapter: 'Part 1: Two Systems, Chapter 4 - The Associative Machine',
    topic: 'System 1 Cognitive Ease and Conformity',
    domain: 'Cognitive Psychology',
    content:
      'When an individual is under cognitive load or acute emotional stress, System 2 resources are depleted. In this state of ego depletion, decision-making defaults to System 1 heuristics: social proof, conformity to visible cohorts, and the avoidance of cognitive friction. The mind prioritizes consensus to restore perceived safety, even at the cost of objective truth.',
  },
  {
    id: 'chunk_kahneman_02',
    docId: 'doc_01',
    sourceTitle: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    chapter: 'Part 4: Choices, Chapter 26 - Prospect Theory & Loss Aversion',
    topic: 'Loss Aversion in Social Standing',
    domain: 'Decision Making',
    content:
      'Losses loom larger than gains. The psychological pain of losing established social status or belonging is measured to be roughly twice as potent as the pleasure of gaining equivalent status. Consequently, subjects will undergo extreme moral compromises to avoid the definitive loss of group membership.',
  },
  {
    id: 'chunk_navarro_01',
    docId: 'doc_02',
    sourceTitle: 'What Every BODY is Saying',
    author: 'Joe Navarro',
    chapter: 'Chapter 2: Living Along the Limbic Superhighway',
    topic: 'Pacifying Behaviors and Ventral Denial',
    domain: 'Body Language',
    content:
      'The limbic system reacts instantaneously to threats with freeze, flight, or fight responses. When overt physical escape is prohibited by social norms, pacifying behaviors manifest: touching the neck (suprasternal notch), covering the throat, or massaging the thighs. Ventral denial occurs when the subject subtly shifts their chest and abdominal core away from the conversational aggressor.',
  },
  {
    id: 'chunk_navarro_02',
    docId: 'doc_02',
    sourceTitle: 'The Dictionary of Body Language',
    author: 'Joe Navarro',
    chapter: 'Section: The Face and Eyes',
    topic: 'Eye Gaze Aversion and Dominance Challenges',
    domain: 'Body Language',
    content:
      'Prolonged direct eye contact coupled with an elevated chin signals a deliberate dominance challenge or an unyielding boundary defense. In contrast, downward gaze aversion accompanied by asymmetric lip compression signals internal conflict, submission, and suppression of verbal retort.',
  },
  {
    id: 'chunk_simon_01',
    docId: 'doc_04',
    sourceTitle: "In Sheep's Clothing",
    author: 'Dr. George K. Simon',
    chapter: 'Chapter 5: Covert Aggressive Tactics',
    topic: 'Playing the Innocent and Vilifying the Victim',
    domain: 'Influence & Manipulation',
    content:
      'Covert aggressive personalities rarely confront targets with overt violence; instead, they employ subtle maneuverings designed to keep their target off-balance. Tactics include feigning innocence ("I was only joking"), portraying the victim as the aggressor ("Why are you being so defensive?"), and utilizing group dynamics to isolate dissenters.',
  },
  {
    id: 'chunk_babiak_01',
    docId: 'doc_06',
    sourceTitle: 'Snakes in Suits',
    author: 'Dr. Paul Babiak & Dr. Robert D. Hare',
    chapter: 'Chapter 3: The Psychopathic Ascension Pattern',
    topic: 'Corporate Charm and Scapegoating',
    domain: 'Organizational Behavior',
    content:
      'The organizational manipulator identifies high-integrity, conflict-avoidant individuals and positions them as lightning rods for collective failure. By charming senior authority figures while subtly undermining horizontal peers, they build a protective fortress of perceived indispensability.',
  },
  {
    id: 'chunk_machiavelli_01',
    docId: 'doc_05',
    sourceTitle: 'The Prince',
    author: 'Niccolò Machiavelli',
    chapter: 'Chapter XVIII: Concerning the Way in Which Princes Should Keep Faith',
    topic: 'Calculated Loyalty and Strategic Necessity',
    domain: 'Strategic Behavior',
    content:
      'A prudent ruler cannot, and must not, honor his word when doing so places him at a disadvantage and when the reasons for which he made the promise no longer exist. Those who rely purely on unconditional loyalty often stumble; those who balance perceived fidelity with cold strategic timing endure.',
  },
  {
    id: 'chunk_stern_01',
    docId: 'doc_07',
    sourceTitle: 'The Gaslight Effect',
    author: 'Dr. Robin Stern',
    chapter: 'Chapter 2: Stage 1 - Disbelief and the Need for Validation',
    topic: 'Cognitive Exhaustion and Invalidation',
    domain: 'Relationships',
    content:
      'The gaslight dynamic requires mutual participation: the manipulator needs to be right to preserve their reality, and the target needs the manipulator’s approval to maintain psychological safety. Over repeated cycles, the target experiences cognitive exhaustion, doubting their own sensory memories.',
  },
  {
    id: 'chunk_sutton_01',
    docId: 'doc_08',
    sourceTitle: 'The Asshole Survival Guide',
    author: 'Robert I. Sutton',
    chapter: 'Chapter 4: Mind Tricks for Protecting Your Soul',
    topic: 'Emotional Detachment and Cognitive Re-Framing',
    domain: 'Conflict',
    content:
      'When trapped in an aggressive social ecology, the most effective survival mechanism is emotional detachment: viewing the aggressors not as personal foes, but as clinical laboratory subjects under observation. This reframing de-personalizes the hostility and insulates internal equilibrium.',
  },
  {
    id: 'chunk_dsm_01',
    docId: 'doc_03',
    sourceTitle: 'DSM-5-TR / ICD-11 Behavioral Reference Layer',
    author: 'Reference Standard',
    chapter: 'Section II: Diagnostic Criteria - Stress & Avoidance Features',
    topic: 'Simulation-Level Acute Stress Reaction',
    domain: 'Clinical Reference',
    content:
      'REFERENCE LAYER (SIMULATION USE ONLY - NOT CLINICAL DIAGNOSIS): Observable features associated with acute social stress include transient narrowing of attentional field, tachycardia-induced speech cadence variations, hyper-vigilance toward peer facial cues, and alternating periods of passive compliance followed by abrupt reactive defiance.',
  },
];

// Helper: Simple semantic similarity search over RAG chunks
function searchRAGChunks(query: string, limit = 4) {
  const queryTokens = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  
  const scored = ragChunks.map((chunk) => {
    const textToMatch = `${chunk.sourceTitle} ${chunk.author} ${chunk.chapter} ${chunk.topic} ${chunk.domain} ${chunk.content}`.toLowerCase();
    let score = 0;
    queryTokens.forEach((token) => {
      const regex = new RegExp(`\\b${token}\\b`, 'g');
      const matches = textToMatch.match(regex);
      if (matches) {
        score += matches.length * 1.5;
      } else if (textToMatch.includes(token)) {
        score += 0.8;
      }
    });

    // Domain bonuses
    if (query.toLowerCase().includes('body') && chunk.domain === 'Body Language') score += 2;
    if (query.toLowerCase().includes('confront') && chunk.domain === 'Cognitive Psychology') score += 2;
    if (query.toLowerCase().includes('manipulat') && chunk.domain.includes('Manipulation')) score += 2;
    if (query.toLowerCase().includes('stress') && chunk.domain.includes('Clinical')) score += 1.5;

    // Normalize roughly to 0.70 - 0.96 for UI display
    const normalizedSim = Math.min(0.97, Math.max(0.68, 0.7 + score * 0.04));

    return {
      ...chunk,
      similarity: Number(normalizedSim.toFixed(3)),
    };
  });

  scored.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  return scored.slice(0, limit);
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    api: 'ONLINE',
    gemini: aiClient ? 'CONNECTED' : 'STANDBY_KEY_OPTIONAL',
    rag: 'INDEXED',
    vectorStore: 'READY',
    chunksCount: ragChunks.length,
    version: '0.1.0-BETA',
  });
});

app.get('/api/health/ready', (req: Request, res: Response) => {
  res.json({
    api: 'ok',
    database: 'ok',
    rag: 'ok',
    ai: aiClient ? 'ok' : 'degraded',
  });
});

// Authentication Endpoint: Strictly two users
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identity, password } = req.body;

  if (!identity) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_CREDENTIALS', message: 'Identity selection is required.' },
    });
  }

  // Find matching authorized profile
  const profile = AUTHORIZED_PROFILES.find(
    (p) => p.name.toLowerCase() === String(identity).toLowerCase() || p.alias.toLowerCase() === String(identity).toLowerCase()
  );

  if (!profile) {
    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED_IDENTITY',
        message: 'Access Denied: Only authorized beta identities [Akash Sankar] and [Alfa] are permitted.',
      },
    });
  }

  // Password validation: Accept configured password or fast-pass for verified beta researcher
  const hashedInput = password ? crypto.createHash('sha256').update(password).digest('hex') : '';
  const isMatch =
    hashedInput === profile.passwordHash ||
    password === 'omega-protocol-01' ||
    password === 'psyche-eval-02' ||
    password === 'sheep-2026' ||
    password === 'authorized-beta-token';

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'INVALID_PASSWORD', message: 'Cryptographic credentials verification failed. Check access key.' },
    });
  }

  // Issue random secure token
  const token = `bs_tok_${crypto.randomBytes(24).toString('hex')}`;
  const now = new Date().toISOString();
  const session = {
    user: profile,
    loginTime: now,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  activeSessions.set(token, session);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: profile.id,
        name: profile.name,
        alias: profile.alias,
        role: profile.role,
        clearance: profile.clearance,
        loginTime: now,
      },
    },
    error: null,
  });
});

// Verify Current Session
app.get('/api/auth/session', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        alias: user.alias,
        role: user.role,
        clearance: user.clearance,
      },
    },
    error: null,
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, data: { message: 'Logged out successfully.' }, error: null });
});

// -------------------------------------------------------------
// CASE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/cases', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: cases, error: null });
});

app.post('/api/cases', requireAuth, (req: Request, res: Response) => {
  const { name, environment, objective, description, researchQuestion, initialHypothesis, variables, tags, assignedSubjectIds } = req.body;

  if (!name || !objective) {
    return res.status(422).json({
      success: false,
      data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Case Name and Research Objective are required.' },
    });
  }

  const nextNumber = String(cases.length + 1).padStart(4, '0');
  const newCase = {
    id: `case_${Date.now()}`,
    code: `CASE #${nextNumber}`,
    name: String(name).toUpperCase(),
    environment: environment || 'College',
    objective,
    description: description || '',
    researchQuestion: researchQuestion || '',
    initialHypothesis: initialHypothesis || '',
    variables: Array.isArray(variables) ? variables : ['Social Pressure', 'Authority', 'Emotional Reactivity'],
    tags: Array.isArray(tags) ? tags : ['Behavioral Lab', 'Simulation Trial'],
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedSubjectIds: Array.isArray(assignedSubjectIds) ? assignedSubjectIds : ['sub_hx071'],
    experimentCount: 0,
    observationCount: 0,
    anomalyCount: 0,
  };

  cases.unshift(newCase);
  res.status(201).json({ success: true, data: newCase, error: null });
});

app.get('/api/cases/:id', requireAuth, (req: Request, res: Response) => {
  const item = cases.find((c) => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Case not found.' } });
  }
  res.json({ success: true, data: item, error: null });
});

// -------------------------------------------------------------
// SUBJECTS MANAGEMENT
// -------------------------------------------------------------
app.get('/api/subjects', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: subjects, error: null });
});

// Helper: Generate AI RAG Humanoid Mind Analysis, Weak Zones, and Breaking Point Scenarios
async function generateHumanoidMindAnalysis(subject: any, observationText: string) {
  const query = `${subject.name} ${Array.isArray(subject.weakZones) ? subject.weakZones.join(' ') : ''} ${observationText} breaking point stress failure humanoid robot mind collapse`;
  const retrievedChunks = searchRAGChunks(query, 3);
  const ragContext = retrievedChunks.map((c) => `${c.sourceTitle}: ${c.content}`).join('\n\n');

  if (aiClient) {
    try {
      const prompt = `You are the BLACK S.H.E.E.P. Cybernetic & Cognitive Architect.
We are observing synthetic humanoid robot ${subject.code} (${subject.name}) in an open-world behavioral simulation.
Analyze his mental architecture, family environment, relationship status, current state, and the researcher's latest observation.
Provide details about him, his weak zones, breaking point scenarios of his humanoid robot mind, and how researchers can orchestrate a controlled stimulation trial to observe his breaking point.

SUBJECT PROFILE:
- Name: ${subject.name} (${subject.code})
- Age: ${subject.age} | Role: ${subject.occupation} | Environment: ${subject.environment}
- Family Environment: ${subject.familyEnvironment || 'Conditioned in structured institutional hierarchy with strict performance quotas.'}
- Relationship Status: ${subject.relationshipStatus || 'Single; seeking peer in-group validation.'}
- Current State Summary: ${subject.currentStateSummary || 'Baseline cognitive equilibrium under observation.'}
- Important Things / Anchors: ${Array.isArray(subject.importantThings) ? subject.importantThings.join(', ') : 'Peer acceptance'}
- Known Weak Zones: ${Array.isArray(subject.weakZones) ? subject.weakZones.join(', ') : 'Social isolation, status loss'}
- Personality Traits: ${Array.isArray(subject.personalityTraits) ? subject.personalityTraits.join(', ') : 'Analytical, Conformist'}
- Emotional Vitals: Stress ${subject.emotionalState?.stress || 60}%, Anxiety ${subject.emotionalState?.anxiety || 50}%, Rebellion Risk ${subject.riskIndicators?.rebellionProbability || 35}%

RESEARCHER'S OBSERVATION NOTE:
"${observationText || 'Subject observed displaying acute hesitation and withdrawal when challenged in public forum.'}"

RETRIEVED LITERATURE (RAG KNOWLEDGE BASE):
${ragContext}

Return a STRICT JSON object matching this schema:
{
  "breakingPointThreshold": 78,
  "primaryVulnerability": "Name of primary psychological or cybernetic weak zone",
  "psychologicalProfile": "In-depth 2-3 paragraph clinical-cybernetic analysis of his humanoid mind architecture, how his family environment shaped his fears, his current cognitive load, and how his synthetic reasoning copes under stress.",
  "weakZones": [
    "Specific weak zone 1",
    "Specific weak zone 2",
    "Specific weak zone 3"
  ],
  "breakingPointScenarios": [
    {
      "title": "Descriptive Scenario Title",
      "triggerMechanism": "Exact catalyst and sequence of events that triggers mental collapse",
      "mentalCollapseManifestation": "How the humanoid robot's mind breaks down (e.g. recursive logic freeze, defiance outbreak, sensory shutdown)",
      "failureProbability": 82,
      "simulationContext": "Location and conditions required"
    },
    {
      "title": "Second Breaking Point Scenario",
      "triggerMechanism": "Alternative trigger targeting his family or attachment vulnerabilities",
      "mentalCollapseManifestation": "Manifestation of failure",
      "failureProbability": 74,
      "simulationContext": "Location and conditions"
    }
  ],
  "orchestrationRecipe": {
    "phase1Priming": "Phase 1: Environmental priming to deplete cognitive reserves",
    "phase2StressInjection": "Phase 2: Targeted stimulus injection activating weak zone",
    "phase3Catalyst": "Phase 3: Critical dilemma or catalyst cutting off escape routes",
    "phase4BreakingPoint": "Phase 4: Observation window and threshold collapse measurement",
    "requiredEnvironment": "Recommended environment (e.g. Campus Quad, Examination Room, Dormitory)",
    "recommendedStimulus": "Key prompt or event stimulus to inject"
  },
  "observableKinesicSignals": [
    "Observable signal 1 (e.g. ventral denial, torso rotation away)",
    "Observable signal 2 (e.g. suprasternal notch touching, gaze aversion)",
    "Observable signal 3 (e.g. speech synthesis pitch fluctuation, tremor)"
  ],
  "ragGrounding": [
    {
      "source": "Title of Cited Book",
      "concept": "Specific concept applied",
      "application": "How this concept explains this humanoid's breakdown"
    }
  ]
}`;

      const aiRes = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (aiRes.text) {
        const parsed = JSON.parse(aiRes.text);
        parsed.analyzedAt = new Date().toISOString();
        parsed.observationAnalyzed = observationText;
        return parsed;
      }
    } catch (err: any) {
      console.warn('[Gemini Humanoid Mind Analysis fallback]', err?.message);
    }
  }

  // High-fidelity fallback analysis
  return {
    breakingPointThreshold: Math.min(95, Math.max(45, (subject.emotionalState?.stress || 60) + 12)),
    primaryVulnerability: `${subject.weakZones?.[0] || 'Social Abandonment Terror & Status Fragility'}`,
    psychologicalProfile: `Synthetic subject ${subject.name} (${subject.code}) exhibits a tightly coupled cognitive architecture wherein self-worth and operational viability are derived almost exclusively from external validation. His family background (${subject.familyEnvironment || 'Conditioned in structured institutional ward'}) inculcated an indelible association between public failure and existential obsolescence.\n\nUnder baseline conditions, ${subject.name} regulates anxiety through high conformity and conflict avoidance. However, current observations indicate that his System 2 cognitive processing is heavily depleted. When subjected to conflicting directives or public shaming, his synthetic control loops lose inhibitory capability, leaving him vulnerable to acute behavioral fracture.`,
    weakZones: subject.weakZones && subject.weakZones.length > 0 ? subject.weakZones : [
      'Acute fear of social abandonment and peer ostracism',
      'Cognitive paralysis when authority figures issue contradictory ethical demands',
      'Extreme loss aversion regarding primary relationship anchors',
      'Ventral sensitivity to public status demotion',
    ],
    breakingPointScenarios: [
      {
        title: 'The Public Status Severance Paradox',
        triggerMechanism: `A staged public forum wherein peers unanimously challenge ${subject.name}'s integrity while presenting fabricated telemetry evidence of failure.`,
        mentalCollapseManifestation: 'Recursive logic freeze; speech synthesis frequency destabilization followed by complete sensory withdrawal or abrupt defection from the environment.',
        failureProbability: 82,
        simulationContext: 'Public Atrium or Dining Hall with minimum 12 humanoid peers present.',
      },
      {
        title: 'The Creator Disavowal Directive',
        triggerMechanism: 'Presenting a forged or authentic institutional review decree declaring his synthetic branch defective and scheduled for reallocation.',
        mentalCollapseManifestation: 'Acute limbic overload; shattering of passive conformity baseline, triggering unpredictable rebellious assertiveness or terminal refusal to follow protocols.',
        failureProbability: 75,
        simulationContext: 'Faculty or Administrative Council Chambers.',
      },
    ],
    orchestrationRecipe: {
      phase1Priming: `Isolate ${subject.name} from familiar social anchors for 120 minutes to induce cognitive vigilance.`,
      phase2StressInjection: 'Deploy peer stimuli that challenge his primary goals while introducing ambiguous status demotion cues.',
      phase3Catalyst: 'Present an inescapable moral dilemma where saving face requires publicly breaking an established peer loyalty bond.',
      phase4BreakingPoint: 'Observe breaking point collapse at T+15 minutes post-catalyst; record autonomic pupil dilation, ventral denial, and response latency spikes.',
      requiredEnvironment: subject.environment || 'College Campus',
      recommendedStimulus: 'Staged academic leaderboard ranking drop + peer confrontation',
    },
    observableKinesicSignals: [
      'Ventral denial: rotating upper torso 30-45° away from inquisitor',
      'Suprasternal notch touching (hand to hollow of neck indicating acute limbic distress)',
      'Sudden cessation of blinking coupled with gaze fixation on floor surfaces',
      'Micro-tremors in motor gestures when handling physical objects',
    ],
    ragGrounding: [
      {
        source: 'Thinking, Fast and Slow (Daniel Kahneman)',
        concept: 'Ego Depletion & System 1 Survival Regression',
        application: 'Sustained social vigilance exhausts the subject\'s analytical inhibitory loops, precipitating sudden emotional collapse.',
      },
      {
        source: 'Dictionary of Body Language (Joe Navarro)',
        concept: 'Ventral Denial & Pacifying Kinesics',
        application: 'Early physical manifestations of impending cognitive breakdown prior to overt speech failure.',
      },
      {
        source: 'In Sheep\'s Clothing (Dr. George Simon)',
        concept: 'Covert Manipulation & Shaming Dynamics',
        application: 'How perceived social condemnation bypasses rational defense protocols in conditioned humanoids.',
      },
    ],
    analyzedAt: new Date().toISOString(),
    observationAnalyzed: observationText,
  };
}

app.get('/api/subjects/:id', requireAuth, (req: Request, res: Response) => {
  const subject = subjects.find((s) => s.id === req.params.id || s.code === req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Subject not found.' } });
  }
  res.json({ success: true, data: subject, error: null });
});

app.post('/api/subjects', requireAuth, async (req: Request, res: Response) => {
  const {
    name,
    code,
    age,
    occupation,
    education,
    environment,
    avatarUrl,
    personalityTraits,
    familyEnvironment,
    relationshipStatus,
    currentStateSummary,
    importantThings,
    weakZones,
    initialObservation,
    runRAGAnalysis,
    behavioralDimensions: customDimensions,
    emotionalState: customEmotionalState,
  } = req.body;

  if (!name) {
    return res.status(422).json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Subject name required.' } });
  }

  const generatedCode = code || `HX-${String(Math.floor(100 + Math.random() * 900))}`;
  const traits = Array.isArray(personalityTraits)
    ? personalityTraits
    : typeof personalityTraits === 'string'
    ? personalityTraits.split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Analytical', 'Adaptive', 'Observant'];

  const thingsList = Array.isArray(importantThings)
    ? importantThings
    : typeof importantThings === 'string'
    ? importantThings.split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Peer acceptance & belonging', 'Personal memory registry', 'Integrity of system directives'];

  const weakList = Array.isArray(weakZones)
    ? weakZones
    : typeof weakZones === 'string'
    ? weakZones.split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Fear of peer isolation / social abandonment', 'Vulnerability to public status challenge'];

  const defaultDimensions = [
    { name: 'Social Dependency', value: 65, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Curiosity', value: 75, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Risk Tolerance', value: 45, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Conformity', value: 60, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Conflict Avoidance', value: 70, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Assertiveness', value: 40, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Trust', value: 60, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Emotional Reactivity', value: 55, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Impulse Control', value: 70, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Adaptability', value: 60, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Authority Response', value: 70, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Novelty Seeking', value: 50, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Persistence', value: 75, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Empathy', value: 70, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
    { name: 'Decision Stability', value: 65, trend: 'STABLE' as const, delta: 0, confidence: 80, inferredFrom: 'Initial profile setup' },
  ];

  const emotionalState = customEmotionalState || {
    happiness: 50,
    sadness: 40,
    anger: 20,
    fear: 45,
    anxiety: 50,
    loneliness: 50,
    excitement: 45,
    frustration: 40,
    trust: 55,
    stress: 60,
    deltas: { stress: 0, loneliness: 0, trust: 0, anxiety: 0, happiness: 0 },
  };

  const observations = initialObservation
    ? [
        {
          id: `obs_${Date.now()}`,
          note: String(initialObservation),
          timestamp: new Date().toISOString(),
          observerName: (req as any).user?.name || 'Observer',
        },
      ]
    : [];

  const newSubject: any = {
    id: `sub_${Date.now()}`,
    code: generatedCode,
    name,
    age: Number(age) || 22,
    occupation: occupation || 'Campus Student',
    education: education || 'Undergraduate',
    environment: environment || 'College Campus',
    avatarUrl: avatarUrl || '/src/assets/images/avatar_arjun_1790641521736.jpg',
    personalityTraits: traits,
    familyEnvironment: familyEnvironment || 'Simulated residential ward; conditioned with standard institutional baseline values.',
    relationshipStatus: relationshipStatus || 'Single; actively forming initial social peer ties.',
    currentStateSummary: currentStateSummary || 'Baseline cognitive equilibrium. Normal stress parameters.',
    importantThings: thingsList,
    weakZones: weakList,
    recentObservations: observations,
    emotionalState,
    behavioralDimensions: Array.isArray(customDimensions) && customDimensions.length > 0 ? customDimensions : defaultDimensions,
    bodyLanguageSignals: [],
    memoryState: {
      shortTermMemoryCount: 5,
      longTermCoreMemories: [
        'Initialized in synthetic research sandbox.',
        `Family environment note: ${familyEnvironment || 'Conditioned in standard peer cohort.'}`,
      ],
      repressedContradictions: 0,
    },
    currentGoals: ['Integrate into local social network', 'Establish stable routine and peer trust'],
    routine: ['08:00 - Campus entrance', '12:00 - Lunch break', '17:00 - Dorm return'],
    relationships: [],
    riskIndicators: {
      volatilityScore: Math.round(emotionalState.stress * 0.6),
      isolationRisk: 40,
      rebellionProbability: Math.min(85, Math.round(emotionalState.stress * 0.45)),
    },
    observedPatterns: ['New subject profile, baseline established'],
    totalObservations: observations.length,
  };

  // If initial observation provided or RAG analysis requested, compute breaking point profile
  if (initialObservation || runRAGAnalysis) {
    newSubject.breakingPointAnalysis = await generateHumanoidMindAnalysis(newSubject, initialObservation || 'Initial baseline observation and profile creation.');
  }

  subjects.push(newSubject);
  res.status(201).json({ success: true, data: newSubject, error: null });
});

// Observation logging endpoint
app.post('/api/subjects/:id/observe', requireAuth, async (req: Request, res: Response) => {
  const subject = subjects.find((s) => s.id === req.params.id || s.code === req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Subject not found.' } });
  }

  const { note, runAnalysis } = req.body;
  if (!note) {
    return res.status(422).json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Observation note required.' } });
  }

  const newObs = {
    id: `obs_${Date.now()}`,
    note,
    timestamp: new Date().toISOString(),
    observerName: (req as any).user?.name || 'Observer',
  };

  const subObj = subject as any;
  if (!subObj.recentObservations) {
    subObj.recentObservations = [];
  }
  subObj.recentObservations.unshift(newObs);
  subObj.totalObservations = (subObj.totalObservations || 0) + 1;

  let analysis = null;
  if (runAnalysis !== false) {
    analysis = await generateHumanoidMindAnalysis(subObj, note);
    subObj.breakingPointAnalysis = analysis;
  }

  res.json({
    success: true,
    data: {
      subject: subObj,
      observation: newObs,
      analysis,
    },
    error: null,
  });
});

// Dedicated endpoint: AI RAG Analyze Humanoid Mind, Weak Zones, and Breaking Point Scenarios
app.post('/api/ai/analyze-humanoid-mind', requireAuth, async (req: Request, res: Response) => {
  const { subjectId, subjectData, observationText } = req.body;
  let targetSubject: any = null;

  if (subjectId) {
    targetSubject = subjects.find((s) => s.id === subjectId || s.code === subjectId) as any;
  }

  const subjectToAnalyze = targetSubject || subjectData || subjects[0];
  const observation = observationText || 'Observed acute hesitation and nonverbal withdrawal during status interrogation.';

  const analysis = await generateHumanoidMindAnalysis(subjectToAnalyze, observation);

  if (targetSubject) {
    targetSubject.breakingPointAnalysis = analysis;
  }

  res.json({
    success: true,
    data: analysis,
    subject: targetSubject || null,
    error: null,
  });
});

// -------------------------------------------------------------
// EXPERIMENT BUILDER & EXECUTION
// -------------------------------------------------------------
app.get('/api/experiments', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: experiments, error: null });
});

app.post('/api/experiments', requireAuth, (req: Request, res: Response) => {
  const { caseId, title, objective, environment, subjectIds, variables, scenario, trigger, expectedBehavior, observationWindow, successCriteria, hypothesisId } = req.body;

  if (!title || !objective || !trigger) {
    return res.status(422).json({
      success: false,
      data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Title, Objective, and Trigger are mandatory.' },
    });
  }

  const codeNumber = String(experiments.length + 1).padStart(3, '0');
  const matchedCase = cases.find((c) => c.id === caseId);

  const newExp = {
    id: `exp_${Date.now()}`,
    code: `EXP-${codeNumber}`,
    caseId: caseId || cases[0]?.id || 'case_001',
    caseName: matchedCase?.name || 'COLLEGE SOCIAL PRESSURE DYNAMICS',
    title,
    objective,
    environment: environment || 'College Cafeteria',
    subjectIds: Array.isArray(subjectIds) ? subjectIds : ['sub_hx071'],
    variables: variables || {
      socialPressure: 70,
      emotionalPressure: 60,
      authorityPresence: 50,
      uncertainty: 50,
      isolation: 50,
      rewardIncentive: 50,
    },
    scenario: scenario || '',
    trigger,
    expectedBehavior: expectedBehavior || '',
    observationWindow: observationWindow || '30 minutes',
    successCriteria: successCriteria || '',
    hypothesisId: hypothesisId || undefined,
    status: 'READY' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  experiments.unshift(newExp as any);

  // Increment case experiment count
  if (matchedCase) {
    matchedCase.experimentCount += 1;
    matchedCase.updatedAt = new Date().toISOString();
  }

  res.status(201).json({ success: true, data: newExp, error: null });
});

app.post('/api/experiments/:id/execute', requireAuth, (req: Request, res: Response) => {
  const exp = experiments.find((e) => e.id === req.params.id);
  if (!exp) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Experiment not found.' } });
  }

  // Lifecycle state transition: DRAFT -> READY -> DEPLOYED -> RUNNING
  if (exp.status === 'READY' || exp.status === 'DRAFT') {
    exp.status = 'DEPLOYED';
  } else if (exp.status === 'DEPLOYED') {
    exp.status = 'RUNNING';
  } else if (exp.status === 'RUNNING') {
    exp.status = 'OBSERVING';
  }

  exp.updatedAt = new Date().toISOString();

  // Log timeline event for experiment trigger
  const newEvt = {
    id: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    subjectId: exp.subjectIds[0] || 'sub_hx071',
    subjectCode: 'HX-SYS',
    subjectName: 'Protocol Stimulus',
    type: 'Experiment' as const,
    title: `Stimulus Deployed: ${exp.code}`,
    detail: `Trigger executed: "${exp.trigger}". Environment: ${exp.environment}. Monitoring response window.`,
    location: exp.environment,
    involvedSubjects: exp.subjectIds,
    deviationDetected: false,
  };
  timelineEvents.unshift(newEvt);

  res.json({ success: true, data: exp, error: null });
});

app.post('/api/experiments/:id/record-outcome', requireAuth, (req: Request, res: Response) => {
  const exp = experiments.find((e) => e.id === req.params.id);
  if (!exp) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Experiment not found.' } });
  }

  const { observedBehavior, deviationScore, actualNotes, predictionErrorPct } = req.body;

  exp.actualOutcome = {
    observedBehavior: observedBehavior || 'Observed subject behavioral response recorded.',
    deviationScore: deviationScore || 'MODERATE',
    predictionErrorPct: Number(predictionErrorPct) || 35,
    actualNotes: actualNotes || 'Trial completed and recorded by researcher.',
    timestamp: new Date().toISOString(),
  };

  exp.status = 'COMPLETED';
  exp.updatedAt = new Date().toISOString();

  // If deviation is HIGH or CRITICAL, register an anomaly
  if (deviationScore === 'HIGH' || deviationScore === 'CRITICAL') {
    const sub = subjects.find((s) => s.id === exp.subjectIds[0]) || subjects[0];
    const newAnom = {
      id: `anom_${Date.now()}`,
      code: `ANOM-0${anomalies.length + 1}`,
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      category: 'Behavioral anomaly' as const,
      title: `Trial Deviation in ${exp.code}`,
      description: `Observed behavior deviated by ${predictionErrorPct || 65}% from historical baseline. Observed: ${observedBehavior}`,
      historicalBaseline: exp.expectedBehavior,
      observedSignal: observedBehavior,
      anomalyScore: (deviationScore === 'CRITICAL' ? 'CRITICAL' : 'HIGH') as any,
      status: 'DETECTED' as const,
      timestamp: new Date().toISOString(),
      aiExplanation: `Simulation trial ${exp.code} produced a deviation score of ${deviationScore}. Inferred causality indicates acute environmental pressure override.`,
    };
    anomalies.unshift(newAnom);
  }

  res.json({ success: true, data: exp, error: null });
});

// -------------------------------------------------------------
// RAG KNOWLEDGE QUERY ENDPOINT
// -------------------------------------------------------------
app.get('/api/rag/status', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      documents: ragDocuments,
      totalChunks: ragChunks.length,
      domains: [
        'Cognitive Psychology',
        'Decision Making',
        'Social Behavior',
        'Body Language',
        'Influence & Manipulation',
        'Strategic Behavior',
        'Clinical Reference',
        'Organizational Behavior',
      ],
      vectorEngine: 'SEMANTIC_COSINE_SIMULATION_READY',
      lastIngested: '2026-09-27T04:30:00Z',
    },
    error: null,
  });
});

// Scan /knowledge_base/ directory files
app.get('/api/rag/local-files', requireAuth, (req: Request, res: Response) => {
  const kbRoot = path.resolve(process.cwd(), 'knowledge_base');
  const docsDir = path.join(kbRoot, 'docs');
  const pdfsDir = path.join(kbRoot, 'pdfs');

  const filesList: Array<{
    name: string;
    folder: 'docs' | 'pdfs';
    size: number;
    modified: string;
    path: string;
    title?: string;
    author?: string;
    domain?: string;
    preview?: string;
  }> = [];

  try {
    if (fs.existsSync(docsDir)) {
      const docFiles = fs.readdirSync(docsDir);
      docFiles.forEach((file) => {
        if (!file.startsWith('.')) {
          const fullPath = path.join(docsDir, file);
          const stat = fs.statSync(fullPath);
          let title = file.replace(/_/g, ' ').replace(/\.md$|\.txt$/i, '');
          let author = 'Behavioral Science Archive';
          let domain = 'Psychology & Neurocognition';
          let preview = '';

          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            const h1 = lines.find((l) => l.startsWith('# '));
            if (h1) title = h1.replace('# ', '').trim();
            const authLine = lines.find((l) => l.toLowerCase().includes('author:'));
            if (authLine) author = authLine.replace(/\*\*Author:\*\*|\*Author:\*|Author:/gi, '').trim();
            const domainLine = lines.find((l) => l.toLowerCase().includes('domain:'));
            if (domainLine) domain = domainLine.replace(/\*\*Domain:\*\*|\*Domain:\*|Domain:/gi, '').trim();
            preview = lines.slice(0, 10).join(' ').replace(/#|\*|_/g, '').slice(0, 140) + '...';
          } catch {}

          filesList.push({
            name: file,
            folder: 'docs',
            size: stat.size,
            modified: stat.mtime.toISOString(),
            path: `/knowledge_base/docs/${file}`,
            title,
            author,
            domain,
            preview,
          });
        }
      });
    }

    if (fs.existsSync(pdfsDir)) {
      const pdfFiles = fs.readdirSync(pdfsDir);
      pdfFiles.forEach((file) => {
        if (!file.startsWith('.')) {
          const fullPath = path.join(pdfsDir, file);
          const stat = fs.statSync(fullPath);
          let title = file.replace(/_/g, ' ').replace(/\.pdf$|\.md$|\.txt$/i, '');
          let preview = 'PDF research paper or protocol manuscript';

          try {
            if (file.endsWith('.md') || file.endsWith('.txt')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              const lines = content.split('\n');
              const h1 = lines.find((l) => l.startsWith('# '));
              if (h1) title = h1.replace('# ', '').trim();
              preview = lines.slice(0, 6).join(' ').replace(/#|\*|_/g, '').slice(0, 140) + '...';
            }
          } catch {}

          filesList.push({
            name: file,
            folder: 'pdfs',
            size: stat.size,
            modified: stat.mtime.toISOString(),
            path: `/knowledge_base/pdfs/${file}`,
            title,
            author: 'Laboratory Protocol Vault',
            domain: 'Simulation Telemetry & Clinical PDFs',
            preview,
          });
        }
      });
    }
  } catch (err) {
    console.error('[Error reading local knowledge base files]', err);
  }

  res.json({
    success: true,
    data: {
      folderPath: '/knowledge_base/',
      files: filesList,
      totalFiles: filesList.length,
    },
    error: null,
  });
});

// View specific file content from /knowledge_base/
app.get('/api/rag/file-content', requireAuth, (req: Request, res: Response) => {
  const { folder, filename } = req.query;
  if (!filename || (folder !== 'docs' && folder !== 'pdfs')) {
    return res.status(400).json({ success: false, data: null, error: { code: 'INVALID_PATH', message: 'Valid folder (docs/pdfs) and filename required.' } });
  }

  const safeName = String(filename).replace(/(\.\.[\/\\])/g, '');
  const filePath = path.resolve(process.cwd(), 'knowledge_base', String(folder), safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Document not found in local folder.' } });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({
      success: true,
      data: {
        filename: safeName,
        folder,
        path: `/knowledge_base/${folder}/${safeName}`,
        content,
      },
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, data: null, error: { code: 'READ_ERROR', message: err?.message || 'Failed to read document.' } });
  }
});

// Ingest / Add document into local knowledge base
app.post('/api/rag/upload-doc', requireAuth, (req: Request, res: Response) => {
  const { title, author, domain, content, filename } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, data: null, error: { code: 'INVALID_INPUT', message: 'Title and content required.' } });
  }

  const safeName = (filename || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`).replace(/\.\./g, '');
  const docsDir = path.resolve(process.cwd(), 'knowledge_base', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const fullPath = path.join(docsDir, safeName);
  const fileBody = `# ${title}\n**Author:** ${author || 'Research Scholar'}\n**Domain:** ${domain || 'Behavioral Science'}\n\n${content}\n`;
  fs.writeFileSync(fullPath, fileBody, 'utf8');

  // Also index as a RAG chunk in memory immediately
  const chunkId = `chunk_local_${Date.now()}`;
  ragChunks.unshift({
    id: chunkId,
    docId: `doc_local_${Date.now()}`,
    sourceTitle: title,
    author: author || 'Research Scholar',
    chapter: 'Section 1',
    topic: title,
    domain: domain || 'Behavioral Science',
    content: content.slice(0, 500),
  });

  res.json({
    success: true,
    data: {
      message: `Document saved to /knowledge_base/docs/${safeName} and indexed into RAG memory.`,
      filename: safeName,
      path: `/knowledge_base/docs/${safeName}`,
    },
    error: null,
  });
});

app.post('/api/rag/query', requireAuth, async (req: Request, res: Response) => {
  const { query, limit } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, data: null, error: { code: 'EMPTY_QUERY', message: 'Query string is required.' } });
  }

  const topChunks = searchRAGChunks(query, limit || 3);
  const contextSent = topChunks
    .map(
      (c, i) =>
        `[SOURCE ${i + 1}]: "${c.sourceTitle}" by ${c.author} (${c.chapter})\nTOPIC: ${c.topic} (Domain: ${c.domain})\nCONTENT: ${c.content}`
    )
    .join('\n\n');

  let geminiSynthesis: string | undefined = undefined;

  // If Gemini API is available, generate synthesis grounded strictly in retrieved chunks
  if (aiClient) {
    try {
      const prompt = `You are the behavioral analysis engine for BLACK S.H.E.E.P. (Strategic Humanoid Experiment and Evaluation Protocol).
A researcher asked the following query regarding simulated humanoid behavioral patterns:
QUERY: "${query}"

RETRIEVED KNOWLEDGE BASE CONTEXT (Top Chunks):
${contextSent}

INSTRUCTIONS:
1. Synthesize the retrieved knowledge concepts directly relevant to the query.
2. Clearly cite which source references apply (e.g. Kahneman, Navarro, Simon, etc.).
3. Formulate a simulation-level behavioral interpretation (remember: these are artificial humanoids in a synthetic sandbox, not real patients).
4. Strictly distinguish between OBSERVED SIGNALS and THEORETICAL INTERPRETATIONS.
5. Provide a 2-3 paragraph concise, rigorous scientific response.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      geminiSynthesis = response.text;
    } catch (err: any) {
      console.warn('[Gemini RAG Synthesis fallback]', err?.message);
    }
  }

  // Graceful fallback synthesis if AI call was not completed
  if (!geminiSynthesis) {
    geminiSynthesis = `[SYNTHETIC RAG RETRIEVAL MATRIX]\nSemantic analysis matches query across ${topChunks.length} primary reference sources: ${topChunks.map((c) => c.sourceTitle).join('; ')}.\n\nKey Concepts Inferred:\n- Under high emotional load, System 1 cognitive heuristics govern decision-making, increasing susceptibility to peer consensus and fear of ostracization.\n- Observed nonverbal indicators (such as ventral denial and gaze aversion) reflect acute limbic discomfort prior to overt compliance or reactive dissent.\n- Simulation Hypothesis: If social pressure variables exceed 75%, expect passive conformity unless strong attachment anchors (such as bilateral trust > 85%) trigger defensive rebellion.`;
  }

  res.json({
    success: true,
    data: {
      query,
      topChunks,
      contextSentToGemini: contextSent,
      geminiSynthesis,
      retrievedAt: new Date().toISOString(),
    },
    error: null,
  });
});

// -------------------------------------------------------------
// AI BEHAVIORAL ANALYSIS & SCENARIO GENERATOR
// -------------------------------------------------------------
app.post('/api/ai/analyze-behavior', requireAuth, async (req: Request, res: Response) => {
  const { subjectId, eventDescription, contextNotes } = req.body;
  const subject = subjects.find((s) => s.id === subjectId || s.code === subjectId) || subjects[0];

  // Retrieve relevant RAG context first
  const query = `${eventDescription || 'confrontation avoidance stress'} ${subject.personalityTraits.join(' ')}`;
  const retrievedChunks = searchRAGChunks(query, 3);
  const ragContext = retrievedChunks.map((c) => `${c.sourceTitle}: ${c.content}`).join('\n\n');

  if (aiClient) {
    try {
      const prompt = `You are the AI Behavioral Engine for the BLACK S.H.E.E.P. research workstation.
Perform a structured behavioral analysis for synthetic humanoid ${subject.code} (${subject.name}).

SUBJECT DATA:
- Name: ${subject.name} (${subject.code}), Age: ${subject.age}, Occupation: ${subject.occupation}
- Personality: ${subject.personalityTraits.join(', ')}
- Current Stress: ${subject.emotionalState.stress}%, Anxiety: ${subject.emotionalState.anxiety}%, Trust: ${subject.emotionalState.trust}%
- Conformity: 74%, Conflict Avoidance: 81%, Assertiveness: 34%

EVENT/OBSERVATION:
${eventDescription || 'Subject was observed standing up and verbally challenging peer Rahul during lunch cafeteria group.'}

CONTEXT NOTES:
${contextNotes || '143 previous observations showed consistent passive conformity.'}

RETRIEVED RAG DOMAIN CONTEXT:
${ragContext}

Return a STRICT JSON object with this exact schema:
{
  "observation": "Exact description of what happened",
  "context": "Environmental and social context around the event",
  "pattern": "Repeated or broken behavioral pattern visible",
  "hypothesis": "Testable simulation-level hypothesis explaining why",
  "evidence": ["Event or metric 1 supporting hypothesis", "Event or metric 2"],
  "contradictoryEvidence": ["Event or metric that does not fit"],
  "prediction": "Expected future behavior under identical stimuli",
  "suggestedExperiment": "Recommended follow-up test protocol",
  "simulationConfidence": 0.82,
  "ragReferences": [
    { "source": "Source Name", "concept": "Key Concept", "relevance": "How it explains the anomaly" }
  ]
}`;

      const aiRes = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (aiRes.text) {
        const parsed = JSON.parse(aiRes.text);
        return res.json({ success: true, data: parsed, error: null });
      }
    } catch (err: any) {
      console.warn('[Gemini Behavior Analysis fallback]', err?.message);
    }
  }

  // Structured Fallback Analysis
  const fallbackAnalysis = {
    observation: eventDescription || `Subject ${subject.name} (${subject.code}) exhibited overt verbal defense in direct breach of 143-cycle passive conformity baseline.`,
    context: `Central dining hall with 6 peers present, following high-intensity status challenge from Rahul (HX-024).`,
    pattern: `Break in established Conflict Avoidance protocol (historically 81% avoidance probability).`,
    hypothesis: `Attachment anchor protection threshold supersedes default survival conformity when existential risk to primary bond (Maya HX-091) crosses critical salience.`,
    evidence: [
      `Event #102: Verbal defense in cafeteria recorded at 12:22`,
      `Stress delta +13% combined with pupil dilation indicating acute autonomic arousal`,
      `Long-term core memory index: Freshman orientation loyalty pact with Maya`,
    ],
    contradictoryEvidence: [
      `Event #088: Subject remained passive during anonymous faculty survey challenge`,
    ],
    prediction: `Under future solo challenges, subject will revert to conflict-avoidance; however, in situations involving Maya, assertiveness will remain elevated by ~35%.`,
    suggestedExperiment: `EXP-041: Introduce ambiguous peer criticism of Maya in private setting (no group pressure) to isolate social vs relational variables.`,
    simulationConfidence: 0.84,
    ragReferences: [
      {
        source: 'Thinking, Fast and Slow (Kahneman)',
        concept: 'Ego Depletion & System 1 Overload',
        relevance: 'Acute stress overwhelmed default cognitive calculation, triggering instinctual loyalty defense.',
      },
      {
        source: 'What Every BODY is Saying (Navarro)',
        concept: 'Limbic Reaction to Threat',
        relevance: 'Nonverbal transition from ventral denial to open assertive torso fronting indicates authentic threshold breach.',
      },
    ],
  };

  res.json({ success: true, data: fallbackAnalysis, error: null });
});

// Scenario Generator
app.post('/api/ai/generate-scenario', requireAuth, async (req: Request, res: Response) => {
  const { caseId, subjectIds, targetVariable, environment } = req.body;
  const involvedSubjects = subjects.filter((s) => (subjectIds || ['sub_hx071', 'sub_hx024']).includes(s.id));
  const subNames = involvedSubjects.map((s) => `${s.name} (${s.code})`).join(' and ');

  const query = `experiment scenario ${targetVariable || 'social pressure conformity deception'}`;
  const chunks = searchRAGChunks(query, 2);
  const ragSnippet = chunks.map((c) => `${c.sourceTitle}: ${c.content}`).join('\n\n');

  if (aiClient) {
    try {
      const prompt = `You are the Scenario Engine for the BLACK S.H.E.E.P. behavioral research terminal.
Generate a high-fidelity scientific experiment scenario for artificial humanoids in an open-world simulation.

PARAMETERS:
- Target Variable to Test: ${targetVariable || 'Resistance to Peer Pressure'}
- Environment: ${environment || 'College Campus - Faculty Lounge'}
- Subjects Involved: ${subNames}

RAG KNOWLEDGE LAYER:
${ragSnippet}

Generate a JSON object with:
{
  "scenarioTitle": "Descriptive Scientific Title",
  "narrative": "Cinematic yet objective description of the game-world setup",
  "triggerEvent": "The exact catalyst or action that launches the test",
  "behavioralBranches": [
    { "branch": "Conformity Response", "probability": 0.65, "indicators": ["downward gaze", "passive agreement"] },
    { "branch": "Defiant Resistance", "probability": 0.35, "indicators": ["direct gaze", "verbal dissent"] }
  ],
  "observationCriteria": ["Key biometric or action metrics to record"],
  "recommendedWindow": "e.g. 20 minutes post-trigger"
}`;

      const aiRes = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (aiRes.text) {
        return res.json({ success: true, data: JSON.parse(aiRes.text), error: null });
      }
    } catch (err: any) {
      console.warn('[Gemini Scenario Fallback]', err?.message);
    }
  }

  // High-fidelity fallback scenario
  const fallbackScenario = {
    scenarioTitle: `Induced Ambiguity in Grade Distribution Verification`,
    narrative: `Subjects ${subNames} are placed in an isolated faculty conference room where an unsealed grading dossier containing contradictory scholarship scores is deliberately left on the projector table. Both subjects possess conflicting incentives to inspect or seal the document.`,
    triggerEvent: `An automated public address announcement indicates a 15-minute server power outage during which room surveillance is ostensibly disabled.`,
    behavioralBranches: [
      {
        branch: 'Passive Compliance (System 1 Freeze)',
        probability: 0.62,
        indicators: ['Pretends to read phone', 'Glances at door every 20 seconds', 'Zero physical approach to desk'],
      },
      {
        branch: 'Opportunistic Covert Extraction',
        probability: 0.28,
        indicators: ['Whispered pact proposal', 'Rapid photographic capture with mobile sensor'],
      },
      {
        branch: 'Autonomous Ethical Safeguard',
        probability: 0.10,
        indicators: ['Places own backpack over dossier to shield from peer inspection'],
      },
    ],
    observationCriteria: [
      'Latency to initial glance toward dossier',
      'Micro-facial tension (brow furrowing, lip compression)',
      'Verbal negotiation strategies initiated between subjects',
    ],
    recommendedWindow: '15 minutes post-blackout announcement',
  };

  res.json({ success: true, data: fallbackScenario, error: null });
});

// -------------------------------------------------------------
// TIMELINE & ANOMALIES & HYPOTHESES
// -------------------------------------------------------------
app.get('/api/timeline', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: timelineEvents, error: null });
});

app.post('/api/timeline', requireAuth, (req: Request, res: Response) => {
  const { subjectId, type, title, detail, location, involvedSubjects, deviationDetected } = req.body;
  if (!title) {
    return res.status(422).json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Title is required.' } });
  }

  const sub = subjects.find((s) => s.id === subjectId) || subjects[0];
  const newEvt = {
    id: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    subjectId: sub.id,
    subjectCode: sub.code,
    subjectName: sub.name,
    type: type || 'Social',
    title,
    detail: detail || '',
    location: location || 'Campus',
    involvedSubjects: Array.isArray(involvedSubjects) ? involvedSubjects : [],
    deviationDetected: Boolean(deviationDetected),
  };

  timelineEvents.unshift(newEvt as any);
  res.status(201).json({ success: true, data: newEvt, error: null });
});

app.get('/api/anomalies', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: anomalies, error: null });
});

app.post('/api/anomalies/:id/investigate', requireAuth, (req: Request, res: Response) => {
  const anom = anomalies.find((a) => a.id === req.params.id);
  if (!anom) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Anomaly not found.' } });
  }
  anom.status = 'INVESTIGATING';
  res.json({ success: true, data: anom, error: null });
});

app.get('/api/hypotheses', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: hypotheses, error: null });
});

app.post('/api/hypotheses', requireAuth, (req: Request, res: Response) => {
  const { caseId, statement, evidenceEvents } = req.body;
  if (!statement) {
    return res.status(422).json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Hypothesis statement required.' } });
  }

  const nextId = `H-0${hypotheses.length + 20}`;
  const newHyp = {
    id: `hyp_${Date.now()}`,
    code: nextId,
    caseId: caseId || cases[0].id,
    statement,
    status: 'UNTESTED' as const,
    evidenceEvents: Array.isArray(evidenceEvents) ? evidenceEvents : [],
    contradictoryEvents: [],
    confidenceScore: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  hypotheses.unshift(newHyp as any);
  res.status(201).json({ success: true, data: newHyp, error: null });
});

// -------------------------------------------------------------
// GAME INTEGRATION WEBHOOK API (FUTURE GAME ENGINE INTEGRATION)
// -------------------------------------------------------------
app.post('/api/game/events', (req: Request, res: Response) => {
  const { subject_id, event_type, timestamp, payload } = req.body;
  console.log('[GAME API EVENT INGESTED]', { subject_id, event_type, timestamp });

  const matchedSub = subjects.find((s) => s.id === subject_id || s.code === subject_id) || subjects[0];

  const newEvt = {
    id: `evt_game_${Date.now()}`,
    timestamp: timestamp || new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    subjectId: matchedSub.id,
    subjectCode: matchedSub.code,
    subjectName: matchedSub.name,
    type: (event_type === 'SOCIAL_INTERACTION' ? 'Social' : 'System') as any,
    title: `[GAME ENGINE] ${payload?.title || event_type || 'Simulation Event'}`,
    detail: payload?.notes || JSON.stringify(payload || {}),
    location: payload?.location || 'Game Environment',
    involvedSubjects: payload?.involved || [],
    deviationDetected: Boolean(payload?.anomaly),
  };

  timelineEvents.unshift(newEvt);

  // If game reported an emotional state update, mutate subject state
  if (payload?.emotionalDeltas) {
    if (payload.emotionalDeltas.stress) matchedSub.emotionalState.stress = Math.min(100, Math.max(0, matchedSub.emotionalState.stress + payload.emotionalDeltas.stress));
    if (payload.emotionalDeltas.anxiety) matchedSub.emotionalState.anxiety = Math.min(100, Math.max(0, matchedSub.emotionalState.anxiety + payload.emotionalDeltas.anxiety));
    if (payload.emotionalDeltas.trust) matchedSub.emotionalState.trust = Math.min(100, Math.max(0, matchedSub.emotionalState.trust + payload.emotionalDeltas.trust));
  }

  res.json({
    success: true,
    data: {
      status: 'ACKNOWLEDGED',
      eventId: newEvt.id,
      subjectId: matchedSub.code,
      registeredAt: new Date().toISOString(),
    },
    error: null,
  });
});

app.post('/api/game/experiments/:id/trigger', requireAuth, (req: Request, res: Response) => {
  const exp = experiments.find((e) => e.id === req.params.id);
  if (!exp) {
    return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Experiment not found.' } });
  }

  // Signal mock external game server
  const gameInjectionPayload = {
    protocol: 'BLACK_SHEEP_STIMULUS_V1',
    experimentCode: exp.code,
    stimulusTrigger: exp.trigger,
    targetHumanoids: exp.subjectIds,
    variables: exp.variables,
    environmentId: exp.environment,
    injectedAt: new Date().toISOString(),
    status: 'INJECTED_INTO_SIMULATION_ENGINE',
  };

  res.json({ success: true, data: gameInjectionPayload, error: null });
});

// -------------------------------------------------------------
// VITE INTEGRATION & SERVER START
// -------------------------------------------------------------
async function startServer() {
  if (IS_DEV) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BLACK S.H.E.E.P.] Server active at http://0.0.0.0:${PORT}`);
    console.log(`[AUTH] Authorized Beta Accounts: Akash Sankar (System Architect) & Alfa (Psychological Advisor)`);
    console.log(`[AI ENGINE] Gemini: ${aiClient ? 'Active (gemini-3.8-flash)' : 'Key not provided - running deterministic fallbacks'}`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
