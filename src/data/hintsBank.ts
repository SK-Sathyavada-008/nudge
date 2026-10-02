import type { HintItem } from '../types';

export const HINTS_BANK: HintItem[] = [
  {
    id: 'two-sum-patterns',
    title: 'Two Sum & Complement Lookup',
    pattern: 'Hash Map / Two Pointers',
    difficulty: 'Easy',
    challengeDifficulty: 'WARM_UP',
    basePoints: 15,
    levels: {
      level1: "Before running nested loops: for any number x you look at, what exact counterpart (target - x) must already exist in your history?",
      level2: "Trade O(N) space for O(1) time lookups. Can you store elements you've already seen in a Hash Map alongside their indices?",
      level3: "As you iterate through with index i: check if target - nums[i] is already in the map. If yes, you're done! If not, register nums[i] -> i. Note: Watch for using the same element twice.",
    },
  },
  {
    id: 'sliding-window-max',
    title: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    challengeDifficulty: 'ACTUALLY_THINK',
    basePoints: 35,
    levels: {
      level1: "Think of an expanding rubber band with a left pointer and a right pointer. When does the right pointer violate the condition?",
      level2: "When the right pointer encounters a duplicate character that is within your current window, where MUST your left pointer teleport to?",
      level3: "Keep a map of `char -> last_seen_index`. If `char` is seen and `last_seen >= left`, move `left = last_seen + 1`. Calculate `max_len = max(max_len, right - left + 1)` at each step.",
    },
  },
  {
    id: 'binary-tree-bfs',
    title: 'Binary Tree Level Order Traversal',
    pattern: 'Breadth-First Search (Queue)',
    difficulty: 'Medium',
    challengeDifficulty: 'BRAIN_STARTER',
    basePoints: 25,
    levels: {
      level1: "You need to visit nodes floor-by-floor (top to bottom). Which data structure naturally processes items First-In, First-Out?",
      level2: "Use a Queue. How do you separate one level's nodes from the next level's nodes? Look at `queue.length` at the start of each level iteration.",
      level3: "Loop while queue is not empty: snap `levelSize = queue.length`. Run an inner loop for `levelSize` times, dequeue node, push node.val to current level, and enqueue valid left/right children.",
    },
  },
  {
    id: 'coin-change-dp',
    title: 'Coin Change (Min Coins for Amount)',
    pattern: 'Dynamic Programming (Knapsack/Unbounded)',
    difficulty: 'Medium',
    challengeDifficulty: "DON'T_CRY",
    basePoints: 50,
    levels: {
      level1: "Greedy choice often fails (e.g. coins [1, 3, 4], amount 6: greedy gives 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins). If you already know the answer for all amounts smaller than X, how does that help you for X?",
      level2: "Define `dp[i]` as the minimum coins needed for amount `i`. If you take a coin `c`, the remaining problem is `dp[i - c] + 1`.",
      level3: "Initialize `dp` array of size `amount + 1` with `Infinity`, `dp[0] = 0`. For each amount from 1 to `amount`: iterate every coin `c`. If `i - c >= 0`, `dp[i] = min(dp[i], 1 + dp[i - c])`. If `dp[amount]` is still Infinity, return -1.",
    },
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    pattern: 'Two Pointers / Monotonic Stack',
    difficulty: 'Hard',
    challengeDifficulty: "DON'T_CRY",
    basePoints: 50,
    levels: {
      level1: "For any single bar `i`, what determines how much water can sit directly on top of it? It's determined by the tallest wall to its left and the tallest wall to its right.",
      level2: "Water trapped at `i` is `max(0, min(maxLeft, maxRight) - height[i])`. You can find this using two arrays, or even better, two pointers moving inwards.",
      level3: "Maintain `left = 0, right = n - 1`, and track `leftMax, rightMax`. The smaller of `leftMax` and `rightMax` is the bottleneck! Move the pointer on the bottleneck side inward.",
    },
  },
];
