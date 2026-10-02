import type { JokeItem } from '../types';

export const DEV_JOKES: JokeItem[] = [
  {
    id: 'j-1',
    setup: 'Why do programmers prefer dark mode?',
    punchline: 'Because light attracts bugs... and dark mode hides the bags under our eyes from LeetCode contest #382.',
    tag: 'Classic Dev',
  },
  {
    id: 'j-2',
    setup: 'What is the most painful thing in computer science?',
    punchline: 'Naming variables, cache invalidation, and off-by-one errors... wait, that is 3 things.',
    tag: 'DSA Pain',
  },
  {
    id: 'j-3',
    setup: 'Why did the binary search tree break up with the linked list?',
    punchline: 'It said: "You take O(N) just to find anything. I need someone who operates at O(log N) efficiency."',
    tag: 'Tree Drama',
  },
  {
    id: 'j-4',
    setup: 'Interviewer: "Can you optimize this from O(N^2) to O(N)?"',
    punchline: 'Candidate: "Can I just buy 10 more AWS instances and call it distributed computing?"',
    tag: 'Interview Banter',
  },
  {
    id: 'j-5',
    setup: 'How does an engineer solve a hard Dynamic Programming problem?',
    punchline: 'Step 1: Stare at the problem. Step 2: Cry. Step 3: Draw a 2D matrix. Step 4: Realize it was just Fibonacci with extra steps.',
    tag: 'DP Relatable',
  },
  {
    id: 'j-6',
    setup: 'What does a Senior Dev say when your code passes all 57 test cases on the first try?',
    punchline: '"Something is horribly wrong. Check the test suite."',
    tag: 'Dev Wisdom',
  },
];

export const TINY_WINS = [
  {
    title: 'Code Invariant Check',
    task: 'Explain your current loop condition in ONE sentence out loud. If you can phrase it clearly, you understand it.',
    reward: '🧠 Mental Clarity +15',
  },
  {
    title: 'Hydration & Posture Reset',
    task: 'Drink a glass of water, drop your shoulders away from your ears, and unclench your jaw.',
    reward: '💧 Body Reset +20',
  },
  {
    title: 'Edge Case Bounty',
    task: 'Write down 3 tiny edge cases: empty array `[]`, single element `[1]`, and all duplicate elements `[2, 2, 2]`. Did your code handle them?',
    reward: '🛡️ Bug Defense +30',
  },
  {
    title: 'Time & Space Declaration',
    task: 'State the Big-O Time and Auxiliary Space of your brute-force attempt without shame.',
    reward: '⏱️ Foundation +25',
  },
  {
    title: '60-Second Eyes Off Screen',
    task: 'Close your eyes and breathe slowly for 60 seconds. Let your working memory flush its cache.',
    reward: '🔋 Cache Invalidation +40',
  },
];
