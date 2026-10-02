import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  PillarType,
  MoodType,
  ActivityItem,
  CodingProblemState,
  CodingLanguage,
  GemmaDecision,
  ChallengeDifficulty,
  BadgeItem,
  RealWorldTreat,
  ChallengeCompletionRecord,
  RoadmapPlan,
  RoadmapProgressData,
} from '../types';
import { BADGE_DEFINITIONS } from '../data/badges';
import { REAL_WORLD_TREATS } from '../data/treatRewards';

interface NudgeState {
  currentPillar: PillarType;
  mood: MoodType;
  confidence: number; // kept silently in state for internal tracking, NEVER shown in UI
  problem: string;
  codingState: CodingProblemState;
  hintLevel: number;
  hintsUsed: number;
  lastAction: string;
  language: CodingLanguage;
  activities: ActivityItem[];
  tinyWinsCount: number;
  totalPoints: number; // Genuine challenge points earned from completions
  arcadeTokens: number; // Alias for backward compatibility
  claimedRewards: string[];
  completedChallenges: Record<string, ChallengeCompletionRecord>;
  unlockedBadges: string[]; // List of badge IDs unlocked
  unlockedTreats: string[]; // List of treat IDs unlocked
  claimedTreats: string[]; // List of treat IDs claimed from SK
  latestGemmaDecision: GemmaDecision | null;
  activeDifficulty: ChallengeDifficulty;
  activeTreatUnlock: RealWorldTreat | null;
  newlyUnlockedBadge: BadgeItem | null;
  activeRoadmap: RoadmapPlan | null;
  roadmapProgress: RoadmapProgressData | null;
}

interface CompleteChallengeResult {
  success: boolean;
  pointsEarned: number;
  message: string;
  unlockedBadge?: BadgeItem;
  unlockedTreat?: RealWorldTreat;
}

interface NudgeContextType extends NudgeState {
  setPillar: (pillar: PillarType) => void;
  setMood: (mood: MoodType) => void;
  setProblem: (prob: string) => void;
  setCodingState: (st: CodingProblemState) => void;
  setHintLevel: (level: number) => void;
  setHintsUsed: (count: number) => void;
  setLanguage: (lang: CodingLanguage) => void;
  setActiveDifficulty: (diff: ChallengeDifficulty) => void;
  setLatestGemmaDecision: (dec: GemmaDecision | null) => void;
  addActivity: (activity: { type: ActivityItem['type']; title: string; detail?: string }) => void;
  incrementTinyWin: () => void;
  claimArcadeReward: (rewardId: string, cost: number) => boolean;
  completeChallenge: (
    challengeId: string,
    title: string,
    difficulty: ChallengeDifficulty,
    basePoints: number,
    hintsUsed: number,
    fullSolutionRequested: boolean
  ) => CompleteChallengeResult;
  claimTreat: (treatId: string) => void;
  closeTreatModal: () => void;
  closeBadgeModal: () => void;
  getBadges: () => BadgeItem[];
  getTreats: () => RealWorldTreat[];
  isChallengeCompleted: (challengeId: string) => boolean;
  setActiveRoadmap: (plan: RoadmapPlan | null) => void;
  setRoadmapProgress: (prog: RoadmapProgressData | null) => void;
  toggleRoadmapTask: (topicId: string, taskIndex: number) => void;
  startTopicInThink: (topicTitle: string, phaseTitle: string) => void;
}

const STORAGE_KEY = 'nudge_veer_rewards_v2';

const defaultActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'arcade',
    title: 'Nudge Veer Challenge & Treat System Online',
    detail: 'Complete coding challenges to earn points, unlock badges, and claim treats from SK!',
    timestamp: 'Just now',
  },
  {
    id: 'act-2',
    type: 'think',
    title: 'Coding Companion Initialized',
    detail: 'Targeting LeetCode 209 (ACTUALLY_THINK)',
    timestamp: '15 mins ago',
  },
];

const initialState: NudgeState = {
  currentPillar: 'home',
  mood: 'locked-in',
  confidence: 60,
  problem: 'LeetCode 209: Minimum Size Subarray Sum',
  codingState: "I'm completely lost",
  hintLevel: 0,
  hintsUsed: 0,
  lastAction: 'App Loaded',
  language: 'Java',
  activities: defaultActivities,
  tinyWinsCount: 3,
  totalPoints: 0,
  arcadeTokens: 0,
  claimedRewards: [],
  completedChallenges: {},
  unlockedBadges: [],
  unlockedTreats: [],
  claimedTreats: [],
  latestGemmaDecision: null,
  activeDifficulty: 'ACTUALLY_THINK',
  activeTreatUnlock: null,
  newlyUnlockedBadge: null,
  activeRoadmap: null,
  roadmapProgress: null,
};

const NudgeContext = createContext<NudgeContextType | undefined>(undefined);

export const NudgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NudgeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          // Always start at home on fresh load — never restore old pillar
          currentPillar: 'home' as PillarType,
          arcadeTokens: parsed.totalPoints ?? parsed.arcadeTokens ?? 0,
          totalPoints: parsed.totalPoints ?? parsed.arcadeTokens ?? 0,
        };
      }
    } catch {
      // Fallback
    }
    return initialState;
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setPillar = (pillar: PillarType) => {
    setState((prev) => ({
      ...prev,
      currentPillar: pillar,
      lastAction: `Navigated to ${pillar}`,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setMood = (mood: MoodType) => {
    setState((prev) => {
      const moodLabels: Record<MoodType, string> = {
        'locked-in': 'Locked In ⚡',
        'brain-fog': 'Brain Fog 😵‍💫',
        frustrated: 'Frustrated 😤',
        exhausted: 'Exhausted 😴',
        confident: 'Confident 🚀',
        curious: 'Curious 💡',
      };
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'reset',
        title: `Updated Mood: ${moodLabels[mood]}`,
        timestamp: 'Just now',
      };
      return {
        ...prev,
        mood,
        lastAction: `Set mood to ${mood}`,
        activities: [newAct, ...prev.activities.slice(0, 20)],
      };
    });
  };

  const setProblem = (problem: string) => {
    setState((prev) => ({
      ...prev,
      problem,
      lastAction: `Selected problem: ${problem}`,
    }));
  };

  const setCodingState = (codingState: CodingProblemState) => {
    setState((prev) => ({
      ...prev,
      codingState,
      lastAction: `Updated coding state: ${codingState}`,
    }));
  };

  const setHintLevel = (hintLevel: number) => {
    setState((prev) => ({
      ...prev,
      hintLevel,
      lastAction: `Moved to hint level ${hintLevel}`,
    }));
  };

  const setHintsUsed = (hintsUsed: number) => {
    setState((prev) => ({ ...prev, hintsUsed }));
  };

  const setLanguage = (language: CodingLanguage) => {
    setState((prev) => ({
      ...prev,
      language,
      lastAction: `Switched language to ${language}`,
    }));
  };

  const setActiveDifficulty = (activeDifficulty: ChallengeDifficulty) => {
    setState((prev) => ({ ...prev, activeDifficulty }));
  };

  const setLatestGemmaDecision = (latestGemmaDecision: GemmaDecision | null) => {
    setState((prev) => ({ ...prev, latestGemmaDecision }));
  };

  const addActivity = (act: { type: ActivityItem['type']; title: string; detail?: string }) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: act.type,
      title: act.title,
      detail: act.detail,
      timestamp: 'Just now',
    };
    setState((prev) => ({
      ...prev,
      lastAction: act.title,
      activities: [newAct, ...prev.activities.slice(0, 20)],
    }));
  };

  // Tiny win is purely emotional/mindset; no points are awarded for merely clicking buttons
  const incrementTinyWin = () => {
    setState((prev) => ({
      ...prev,
      tinyWinsCount: prev.tinyWinsCount + 1,
      lastAction: 'Claimed mindset tiny win',
    }));
  };

  const claimArcadeReward = (rewardId: string, cost: number): boolean => {
    if (state.totalPoints < cost) return false;
    setState((prev) => {
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'arcade',
        title: `Redeemed Reward: ${rewardId}`,
        detail: `Spent ${cost} tokens`,
        timestamp: 'Just now',
      };
      const updatedPts = prev.totalPoints - cost;
      return {
        ...prev,
        totalPoints: updatedPts,
        arcadeTokens: updatedPts,
        claimedRewards: [...prev.claimedRewards, rewardId],
        activities: [newAct, ...prev.activities.slice(0, 20)],
      };
    });
    return true;
  };

  const isChallengeCompleted = (challengeId: string): boolean => {
    return Boolean(state.completedChallenges[challengeId]);
  };

  // GENUINE CHALLENGE COMPLETION ENGINE (WITH ANTI-CHEESE & HINT PENALTIES)
  const completeChallenge = (
    challengeId: string,
    title: string,
    difficulty: ChallengeDifficulty,
    basePoints: number,
    hintsUsed: number,
    fullSolutionRequested: boolean
  ): CompleteChallengeResult => {
    // 1. Anti-Cheese: Prevent duplicate points for already completed challenges
    if (state.completedChallenges[challengeId]) {
      return {
        success: false,
        pointsEarned: 0,
        message: '😈 You already claimed points for this challenge! Tackle a new problem to feed your treat fund.',
      };
    }

    // 2. Full solution requested rule: 0 challenge points (no shame, still learning)
    if (fullSolutionRequested || hintsUsed >= 6) {
      return {
        success: false,
        pointsEarned: 0,
        message: '😈 I saw you open the solution. 0 challenge points for this run. Study the invariants and try it tomorrow!',
      };
    }

    // 3. Exact Hint Penalty Formula:
    // 0 hints = 100%, 1 hint = 90%, 2 hints = 75%, 3 hints = 60%, 4+ hints = 40%
    let multiplier = 1.0;
    if (hintsUsed >= 4) multiplier = 0.4;
    else if (hintsUsed === 3) multiplier = 0.6;
    else if (hintsUsed === 2) multiplier = 0.75;
    else if (hintsUsed === 1) multiplier = 0.9;

    const pointsEarned = Math.max(1, Math.round(basePoints * multiplier));
    const newTotalPoints = state.totalPoints + pointsEarned;

    const newRecord: ChallengeCompletionRecord = {
      challengeId,
      title,
      pointsEarned,
      hintsUsed,
      difficulty,
      completedAt: new Date().toLocaleTimeString(),
    };

    const updatedCompleted = {
      ...state.completedChallenges,
      [challengeId]: newRecord,
    };
    const completedRecords = Object.values(updatedCompleted);

    // 4. Badge Evaluation
    const newlyUnlockedBadgeIds: string[] = [];
    let firstNewBadge: BadgeItem | undefined = undefined;

    for (const b of BADGE_DEFINITIONS) {
      const alreadyUnlocked = state.unlockedBadges.includes(b.id);
      if (!alreadyUnlocked) {
        const passed = b.evaluate({
          totalPoints: newTotalPoints,
          completedRecords,
          unlockedTreatsCount: state.unlockedTreats.length,
        });
        if (passed) {
          newlyUnlockedBadgeIds.push(b.id);
          if (!firstNewBadge) {
            firstNewBadge = { ...b, unlocked: true, unlockedAt: 'Just now' };
          }
        }
      }
    }

    // 5. Treat Milestones Check
    const newlyUnlockedTreatIds: string[] = [];
    let firstNewTreat: RealWorldTreat | undefined = undefined;

    for (const t of REAL_WORLD_TREATS) {
      const alreadyUnlocked = state.unlockedTreats.includes(t.id);
      if (!alreadyUnlocked && newTotalPoints >= t.requiredPoints) {
        newlyUnlockedTreatIds.push(t.id);
        if (!firstNewTreat) {
          firstNewTreat = { ...t, unlocked: true };
        }
      }
    }

    const newActivities: ActivityItem[] = [
      {
        id: `act-${Date.now()}-pts`,
        type: 'arcade',
        title: `+${pointsEarned} Points: Solved ${title}`,
        detail: hintsUsed === 0 ? 'Flawless independent solve (100% points)!' : `${hintsUsed} hints used (${Math.round(multiplier * 100)}% points). 😈 The treat department noticed the assistance.`,
        timestamp: 'Just now',
      },
    ];

    if (firstNewBadge) {
      newActivities.push({
        id: `act-${Date.now()}-badge`,
        type: 'badge',
        title: `Badge Unlocked: ${firstNewBadge.title}`,
        detail: firstNewBadge.requirementDesc,
        timestamp: 'Just now',
      });
    }

    if (firstNewTreat) {
      newActivities.push({
        id: `act-${Date.now()}-treat`,
        type: 'treat',
        title: `🎉 REAL-WORLD TREAT UNLOCKED: ${firstNewTreat.title}`,
        detail: 'Now go ask SK for a treat!',
        timestamp: 'Just now',
      });
    }

    setState((prev) => ({
      ...prev,
      totalPoints: newTotalPoints,
      arcadeTokens: newTotalPoints,
      completedChallenges: updatedCompleted,
      unlockedBadges: [...prev.unlockedBadges, ...newlyUnlockedBadgeIds],
      unlockedTreats: [...prev.unlockedTreats, ...newlyUnlockedTreatIds],
      activeTreatUnlock: firstNewTreat || prev.activeTreatUnlock,
      newlyUnlockedBadge: firstNewBadge || prev.newlyUnlockedBadge,
      activities: [...newActivities, ...prev.activities.slice(0, 20)],
      lastAction: `Completed ${title} (+${pointsEarned} pts)`,
    }));

    const tease =
      hintsUsed > 0
        ? ' 😈 Nice try. The treat department has noticed the assistance.'
        : ' 😈 Clean solve. Points added to your SK treat bank.';

    return {
      success: true,
      pointsEarned,
      message: `Completed "${title}"! Earned +${pointsEarned} points.${tease}`,
      unlockedBadge: firstNewBadge,
      unlockedTreat: firstNewTreat,
    };
  };

  const claimTreat = (treatId: string) => {
    setState((prev) => {
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'treat',
        title: `Claimed Treat from SK: ${treatId}`,
        detail: 'Marked as collected in real life!',
        timestamp: 'Just now',
      };
      return {
        ...prev,
        claimedTreats: [...prev.claimedTreats, treatId],
        activities: [newAct, ...prev.activities.slice(0, 20)],
      };
    });
  };

  const closeTreatModal = () => {
    setState((prev) => ({ ...prev, activeTreatUnlock: null }));
  };

  const closeBadgeModal = () => {
    setState((prev) => ({ ...prev, newlyUnlockedBadge: null }));
  };

  const getBadges = (): BadgeItem[] => {
    return BADGE_DEFINITIONS.map((b) => ({
      id: b.id,
      title: b.title,
      icon: b.icon,
      description: b.description,
      requirementDesc: b.requirementDesc,
      category: b.category,
      unlocked: state.unlockedBadges.includes(b.id),
      unlockedAt: state.unlockedBadges.includes(b.id) ? 'Unlocked' : undefined,
    }));
  };

  const getTreats = (): RealWorldTreat[] => {
    return REAL_WORLD_TREATS.map((t) => ({
      ...t,
      unlocked: state.totalPoints >= t.requiredPoints || state.unlockedTreats.includes(t.id),
      claimed: state.claimedTreats.includes(t.id),
    }));
  };

  const setActiveRoadmap = (activeRoadmap: RoadmapPlan | null) => {
    setState((prev) => ({
      ...prev,
      activeRoadmap,
      lastAction: activeRoadmap ? `Loaded Game Plan: ${activeRoadmap.goal}` : 'Cleared Game Plan',
    }));
  };

  const setRoadmapProgress = (roadmapProgress: RoadmapProgressData | null) => {
    setState((prev) => ({ ...prev, roadmapProgress }));
  };

  const toggleRoadmapTask = (topicId: string, taskIndex: number) => {
    setState((prev) => {
      if (!prev.activeRoadmap) return prev;
      const key = `${topicId}:${taskIndex}`;
      const currentTasks = prev.roadmapProgress?.completedTasks || [];
      const isAlreadyDone = currentTasks.includes(key);
      const newTasks = isAlreadyDone
        ? currentTasks.filter((k) => k !== key)
        : [...currentTasks, key];

      // Check which topics and phases are completed
      const completedTopics: string[] = [];
      const completedPhases: string[] = [];

      for (const phase of prev.activeRoadmap.phases) {
        let phaseAllTopicsDone = true;
        for (const topic of phase.topics) {
          const topicTasksDone = topic.tasks.every((_, idx) => newTasks.includes(`${topic.id}:${idx}`));
          if (topicTasksDone && topic.tasks.length > 0) {
            completedTopics.push(topic.id);
          } else {
            phaseAllTopicsDone = false;
          }
        }
        if (phaseAllTopicsDone && phase.topics.length > 0) {
          completedPhases.push(phase.id);
        }
      }

      const updatedProgress: RoadmapProgressData = {
        roadmapId: prev.activeRoadmap.id,
        userId: 'veer-01',
        completedTasks: newTasks,
        completedTopics,
        completedPhases,
        currentPhaseId: prev.roadmapProgress?.currentPhaseId || prev.activeRoadmap.phases[0]?.id || '',
        currentTopicId: topicId,
        currentTaskId: key,
        timeSpentMinutes: (prev.roadmapProgress?.timeSpentMinutes || 0) + 15,
        problemsCompleted: (prev.roadmapProgress?.problemsCompleted || 0) + (isAlreadyDone ? 0 : 1),
        lastUpdated: new Date().toISOString(),
      };

      // Background dispatch to MongoDB API
      fetch('/api/roadmap/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProgress),
      }).catch(() => {
        // Silent fallback
      });

      return {
        ...prev,
        roadmapProgress: updatedProgress,
        lastAction: `Toggled task in ${topicId}`,
      };
    });
  };

  const startTopicInThink = (topicTitle: string, phaseTitle: string) => {
    setState((prev) => ({
      ...prev,
      problem: topicTitle,
      codingState: 'I have an idea',
      hintLevel: 0,
      hintsUsed: 0,
      currentPillar: 'think',
      lastAction: `Jumped into Think mode from Game Plan: ${topicTitle}`,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'think',
          title: `Roadmap Focus: ${topicTitle}`,
          detail: `Working on ${phaseTitle}`,
          timestamp: 'Just now',
        },
        ...prev.activities.slice(0, 20),
      ],
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NudgeContext.Provider
      value={{
        ...state,
        setPillar,
        setMood,
        setProblem,
        setCodingState,
        setHintLevel,
        setHintsUsed,
        setLanguage,
        setActiveDifficulty,
        setLatestGemmaDecision,
        addActivity,
        incrementTinyWin,
        claimArcadeReward,
        completeChallenge,
        claimTreat,
        closeTreatModal,
        closeBadgeModal,
        getBadges,
        getTreats,
        isChallengeCompleted,
        setActiveRoadmap,
        setRoadmapProgress,
        toggleRoadmapTask,
        startTopicInThink,
      }}
    >
      {children}
    </NudgeContext.Provider>
  );
};

export const useNudge = () => {
  const context = useContext(NudgeContext);
  if (!context) {
    throw new Error('useNudge must be used within a NudgeProvider');
  }
  return context;
};
