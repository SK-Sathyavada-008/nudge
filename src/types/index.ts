export type PillarType = 'home' | 'dashboard' | 'gameplan' | 'think' | 'reset' | 'play' | 'badges' | 'treats';

export type MoodType = 'locked-in' | 'brain-fog' | 'frustrated' | 'exhausted' | 'confident' | 'curious';

export type CodingProblemState =
  | 'I know the problem'
  | 'I have an idea'
  | 'I understand the logic'
  | "I can't code it"
  | "I'm completely lost";

export type CodingLanguage = 'Java' | 'Python' | 'C++' | 'JavaScript';

export type ChallengeDifficulty =
  | 'WARM_UP'
  | 'BRAIN_STARTER'
  | 'ACTUALLY_THINK'
  | "DON'T_CRY"
  | 'WHY_DID_I_DO_THIS';

export type GemmaAction =
  | 'HINT'
  | 'QUESTION'
  | 'SYNTAX_HELP'
  | 'VISUALIZATION'
  | 'JOKE'
  | 'RESET'
  | 'MINI_GAME'
  | 'CHALLENGE'
  | 'CELEBRATION'
  | 'PERSONAL_MESSAGE';

export interface GemmaDecision {
  action: GemmaAction;
  difficulty?: ChallengeDifficulty;
  message: string;
  points?: number;
  hintLevel?: number;
  nextQuestion?: string;
  game?: 'binary_duel' | 'frog_therapy' | 'trivia_roulette' | 'canteen_run';
  messageId?: string;
  syntaxLanguage?: CodingLanguage;
  syntaxSnippet?: string;
  completed?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  inputDescription: string;
  expectedDescription: string;
  inputs: any[];
  expected: any;
}

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  requirementDesc: string;
  category: 'progress' | 'mastery' | 'resilience' | 'treat';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface RealWorldTreat {
  id: string;
  requiredPoints: number;
  title: string;
  tagline: string;
  giver: string; // 'SK'
  message: string; // 'Now go ask SK for a treat.'
  evilScorekeeperQuote: string;
  icon: string;
  unlocked: boolean;
  claimed: boolean;
  claimedAt?: string;
}

export interface ChallengeCompletionRecord {
  challengeId: string;
  title: string;
  pointsEarned: number;
  hintsUsed: number;
  difficulty: ChallengeDifficulty;
  completedAt: string;
}

export interface ArcadeReward {
  id: string;
  name: string;
  cost: number;
  icon: string;
  tagline: string;
  unlocked: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'think' | 'reset' | 'play' | 'tiny-win' | 'arcade' | 'badge' | 'treat';
  title: string;
  timestamp: string;
  detail?: string;
}

export type PersonalMessageCategory =
  | 'leetcode-mode'
  | 'cooked'
  | 'solved'
  | 'failed'
  | 'motivation'
  | 'random'
  | 'krishna';

export interface PersonalMessageItem {
  id: string;
  category: PersonalMessageCategory;
  categoryLabel: string;
  authorTag: string;
  quote: string;
  contextNote?: string;
}

export interface HintItem {
  id: string;
  title: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  challengeDifficulty: ChallengeDifficulty;
  basePoints: number;
  levels: {
    level1: string;
    level2: string;
    level3: string;
  };
}

export interface ProblemCodingData {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  challengeDifficulty: ChallengeDifficulty;
  basePoints: number;
  description: string;
  example: string;
  levels: {
    level0: string; // Emotional support
    level1: string; // Thinking question
    level2: string; // Conceptual nudge
    level3: string; // Relevant pattern
    level4: string; // Pseudocode guidance
    level5: string; // Help implement
    level6: string; // Full solution ONLY when explicitly requested
  };
  visualization?: {
    type: 'sliding-window' | 'two-pointers' | 'hash-map';
    array: number[];
    target: number;
    initialWindow: [number, number];
  };
  functionName?: string;
  defaultCode?: string;
  testCases?: TestCase[];
}

export interface TriviaItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface JokeItem {
  id: string;
  setup: string;
  punchline: string;
  tag: string;
}

// ==========================================
// 🗺️ GAME PLAN & ROADMAP SCHEMAS
// ==========================================

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  practiceTasks: string[];
  dependencies: string[];
  completedTasks?: string[];
  isCompleted?: boolean;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  topics: RoadmapTopic[];
  isCompleted?: boolean;
}

export interface RoadmapPlan {
  id: string;
  userId: string;
  goal: string;
  summary: string;
  estimatedDuration: string;
  difficulty: 'MILD_CHAOS' | 'ACTUALLY_THINK' | 'DON_T_CRY' | 'SPEEDRUN' | 'BEAST_MODE';
  dailyCommitment: string;
  phases: RoadmapPhase[];
  generatedAt: string;
  originalInputs?: {
    goal: string;
    why?: string;
    level?: string;
    timeCommitment?: string;
    deadline?: string;
    language?: string;
    knownTopics?: string;
  };
  currentPhaseId?: string;
  currentTopicId?: string;
  currentTaskId?: string;
  status: 'active' | 'completed' | 'paused';
  savedLocally?: boolean;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  category: 'why' | 'level' | 'time' | 'deadline' | 'language' | 'knownTopics';
  placeholder: string;
  quickOptions?: string[];
  optional?: boolean;
}

export interface ClarificationResponse {
  needsClarification: boolean;
  friendlyMessage: string;
  questions: ClarificationQuestion[];
}

export interface RoadmapAdaptationSuggestion {
  reason: string;
  action: 'ADD_PRACTICE' | 'REVISIT_PREREQUISITE' | 'FAST_TRACK' | 'PACE_ADJUST' | 'MINI_CHALLENGE';
  title: string;
  description: string;
  targetPhaseId?: string;
  targetTopicId?: string;
  suggestedTasks?: string[];
}

export interface RoadmapProgressData {
  roadmapId: string;
  userId: string;
  completedTasks: string[]; // topicId:taskIndex
  completedTopics: string[];
  completedPhases: string[];
  currentPhaseId: string;
  currentTopicId: string;
  currentTaskId?: string;
  timeSpentMinutes: number;
  problemsCompleted: number;
  lastUpdated: string;
}

