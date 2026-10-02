import type { BadgeItem, ChallengeCompletionRecord } from '../types';

export interface BadgeDefinition extends BadgeItem {
  evaluate: (ctx: {
    totalPoints: number;
    completedRecords: ChallengeCompletionRecord[];
    unlockedTreatsCount: number;
  }) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_blood',
    title: 'FIRST BLOOD',
    icon: '🩸',
    description: 'Conquered your very first genuine coding or mental challenge without quitting.',
    requirementDesc: 'Complete 1 challenge.',
    category: 'progress',
    unlocked: false,
    evaluate: ({ completedRecords }) => completedRecords.length >= 1,
  },
  {
    id: 'brain_starter',
    title: 'BRAIN STARTER',
    icon: '⚡',
    description: 'Woke up working memory and accumulated 25 real challenge points.',
    requirementDesc: 'Earn 25 points.',
    category: 'progress',
    unlocked: false,
    evaluate: ({ totalPoints }) => totalPoints >= 25,
  },
  {
    id: 'array_menace',
    title: 'ARRAY MENACE',
    icon: '⚔️',
    description: 'Two pointers, sliding windows, and monotonic stacks submit to your will.',
    requirementDesc: 'Complete 2+ array challenges.',
    category: 'mastery',
    unlocked: false,
    evaluate: ({ completedRecords }) => {
      const arrayCount = completedRecords.filter(
        (r) =>
          r.title.toLowerCase().includes('subarray') ||
          r.title.toLowerCase().includes('two sum') ||
          r.title.toLowerCase().includes('array') ||
          r.title.toLowerCase().includes('rain water')
      ).length;
      return arrayCount >= 2;
    },
  },
  {
    id: 'frog_survivor',
    title: 'FROG SURVIVOR',
    icon: '🐸',
    description: 'Completed Frog Therapy in RESET mode and successfully un-fried your brain.',
    requirementDesc: 'Complete Frog Therapy reset.',
    category: 'resilience',
    unlocked: false,
    evaluate: ({ completedRecords }) =>
      completedRecords.some((r) => r.challengeId === 'frog_therapy'),
  },
  {
    id: 'canteen_candidate',
    title: 'CANTEEN CANDIDATE',
    icon: '🥟',
    description: '50 points in the bag. SK can no longer pretend you do not deserve samosas.',
    requirementDesc: 'Reach 50 points.',
    category: 'treat',
    unlocked: false,
    evaluate: ({ totalPoints }) => totalPoints >= 50,
  },
  {
    id: 'certified_menace',
    title: 'CERTIFIED MENACE',
    icon: '😈',
    description: 'Slapped down a hard problem (DON’T_CRY or WHY_DID_I_DO_THIS tier).',
    requirementDesc: 'Complete a DON’T_CRY or WHY_DID_I_DO_THIS challenge.',
    category: 'mastery',
    unlocked: false,
    evaluate: ({ completedRecords }) =>
      completedRecords.some(
        (r) => r.difficulty === "DON'T_CRY" || r.difficulty === 'WHY_DID_I_DO_THIS'
      ),
  },
  {
    id: 'leetcode_criminal',
    title: 'LEETCODE CRIMINAL',
    icon: '🔥',
    description: 'Crossed 100 points! An absolute menace to contest leaderboards and interviewer trick questions.',
    requirementDesc: 'Reach 100 points.',
    category: 'mastery',
    unlocked: false,
    evaluate: ({ totalPoints }) => totalPoints >= 100,
  },
  {
    id: 'treat_unlocked',
    title: 'TREAT UNLOCKED',
    icon: '🎁',
    description: 'Unlocked a real-world treat from SK. Now go collect what is rightfully yours.',
    requirementDesc: 'Reach a Treat Milestone (50+ points).',
    category: 'treat',
    unlocked: false,
    evaluate: ({ unlockedTreatsCount, totalPoints }) =>
      unlockedTreatsCount >= 1 || totalPoints >= 50,
  },
];
