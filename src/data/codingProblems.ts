import type { ProblemCodingData, ChallengeDifficulty } from '../types';

export const CODING_PROBLEMS: Record<string, ProblemCodingData> = {
  'leetcode-1': {
    id: 'leetcode-1',
    title: 'LeetCode 1: Two Sum',
    difficulty: 'Easy',
    challengeDifficulty: 'WARM_UP',
    basePoints: 5,
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    example: 'nums = [2, 7, 11, 15], target = 9 → Output: [0, 1]',
    functionName: 'twoSum',
    defaultCode: `function twoSum(nums, target) {
  // Your code here: return indices [i, j]
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      {
        id: 'tc-1-1',
        name: 'Basic Pair',
        inputDescription: 'nums = [2, 7, 11, 15], target = 9',
        expectedDescription: '[0, 1]',
        inputs: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        id: 'tc-1-2',
        name: 'Subsequent indices',
        inputDescription: 'nums = [3, 2, 4], target = 6',
        expectedDescription: '[1, 2]',
        inputs: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        id: 'tc-1-3',
        name: 'Duplicate numbers',
        inputDescription: 'nums = [3, 3], target = 6',
        expectedDescription: '[0, 1]',
        inputs: [[3, 3], 6],
        expected: [0, 1],
      },
    ],
    levels: {
      level0:
        'The classic problem that started everybody’s journey. No stress here, Veer. Let’s do it cleanly.',
      level1:
        'For every number x you encounter, what exact second number are you wishing exists in the array?',
      level2:
        'Instead of scanning the whole array again for (target - x) in O(N) time, can you remember past numbers in O(1) lookup time?',
      level3:
        'Pattern clue: Hash Map (Complement Lookup). Trade O(N) space for an instant O(1) existence check.',
      level4:
        'Pseudocode structure:\n1. map = new Map() // value -> index\n2. For i = 0 to nums.length - 1:\n     complement = target - nums[i]\n     if complement in map:\n         return [map.get(complement), i]\n     map.set(nums[i], i)',
      level5:
        'Implementation checkpoints:\n• Make sure you check if complement is in the map BEFORE you put the current number in, so you never use the same index twice.\n• Return an empty array if no pair is found.',
      level6:
        `// Java Solution (Explicitly Requested)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    },
  },

  'leetcode-102': {
    id: 'leetcode-102',
    title: 'LeetCode 102: Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    challengeDifficulty: 'BRAIN_STARTER',
    basePoints: 10,
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level). For testing: input is represented as an array or simulated nested tree node.',
    example: 'root = [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]',
    functionName: 'levelOrder',
    defaultCode: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
    testCases: [
      {
        id: 'tc-102-1',
        name: 'Standard 3-level tree',
        inputDescription: '{val: 3, left: {val: 9}, right: {val: 20, left: {val: 15}, right: {val: 7}}}',
        expectedDescription: '[[3], [9, 20], [15, 7]]',
        inputs: [
          { val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } },
        ],
        expected: [[3], [9, 20], [15, 7]],
      },
      {
        id: 'tc-102-2',
        name: 'Single root node',
        inputDescription: '{val: 1}',
        expectedDescription: '[[1]]',
        inputs: [{ val: 1 }],
        expected: [[1]],
      },
      {
        id: 'tc-102-3',
        name: 'Empty tree',
        inputDescription: 'null',
        expectedDescription: '[]',
        inputs: [null],
        expected: [],
      },
    ],
    levels: {
      level0:
        'Breadth-first search is like peeling an onion. One layer at a time. No jumping around.',
      level1:
        'How do you know when you have finished processing all nodes in the current depth before moving to the next depth?',
      level2:
        'Snapshot the queue length at the start of each while-iteration (`levelSize = queue.length`). That tells you exactly how many nodes belong to this layer!',
      level3:
        'Pattern clue: Queue-based BFS with batch layer processing.',
      level4:
        'Pseudocode structure:\n1. queue = [root]\n2. while queue not empty:\n     levelSize = queue.length\n     currentLevel = []\n     loop levelSize times:\n       node = queue.shift()\n       add node.val to currentLevel\n       enqueue node.left & node.right if present\n     add currentLevel to result',
      level5:
        'Implementation checkpoints:\n• Handle null root immediately.\n• In languages like Java/JS, make sure you don’t use queue.length dynamically inside the for loop!',
      level6:
        `// Java BFS Solution
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode curr = queue.poll();
                level.add(curr.val);
                if (curr.left != null) queue.offer(curr.left);
                if (curr.right != null) queue.offer(curr.right);
            }
            result.add(level);
        }
        return result;
    }
}`,
    },
  },

  'leetcode-209': {
    id: 'leetcode-209',
    title: 'LeetCode 209: Minimum Size Subarray Sum',
    difficulty: 'Medium',
    challengeDifficulty: 'ACTUALLY_THINK',
    basePoints: 20,
    description:
      'Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray [nums[l], ..., nums[r]] of which the sum is greater than or equal to target. If there is no such subarray, return 0 instead.',
    example: 'nums = [2, 3, 1, 2, 4, 3], target = 7 → Output: 2 (subarray [4, 3])',
    functionName: 'minSubArrayLen',
    defaultCode: `function minSubArrayLen(target, nums) {
  // Your code here: return minimal length
  let left = 0;
  let currentSum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}`,
    testCases: [
      {
        id: 'tc-209-1',
        name: 'Standard Subarray',
        inputDescription: 'target = 7, nums = [2, 3, 1, 2, 4, 3]',
        expectedDescription: '2',
        inputs: [7, [2, 3, 1, 2, 4, 3]],
        expected: 2,
      },
      {
        id: 'tc-209-2',
        name: 'Single element satisfies target',
        inputDescription: 'target = 4, nums = [1, 4, 4]',
        expectedDescription: '1',
        inputs: [4, [1, 4, 4]],
        expected: 1,
      },
      {
        id: 'tc-209-3',
        name: 'No valid subarray',
        inputDescription: 'target = 11, nums = [1, 1, 1, 1, 1, 1, 1, 1]',
        expectedDescription: '0',
        inputs: [11, [1, 1, 1, 1, 1, 1, 1, 1]],
        expected: 0,
      },
    ],
    levels: {
      level0:
        "Take a breath, PM. We’re not getting bullied by an array today. Don't worry about the fastest code right now—let's just understand what happens as we traverse the numbers.",
      level1:
        'Okay. Before we reach for any pattern: what information do we actually need to keep track of while moving through the array? If you add a number to your running sum, how do you know if you are satisfied or if you have too much?',
      level2:
        'Notice: all numbers are POSITIVE. That means adding numbers makes the sum strictly grow, and removing numbers from the left makes the sum strictly shrink. Can you use this property so you never have to re-scan from scratch?',
      level3:
        'Pattern clue: Sliding Window (Two Pointers). Expand a right pointer to include elements until sum >= target. Once the condition is met, what should your left pointer do to find the MINIMAL length?',
      level4:
        'Pseudocode structure:\n1. Initialize left = 0, currentSum = 0, minLen = Infinity\n2. For right from 0 to nums.length - 1:\n     currentSum += nums[right]\n     while currentSum >= target:\n         minLen = min(minLen, right - left + 1)\n         currentSum -= nums[left]\n         left++\n3. Return minLen == Infinity ? 0 : minLen',
      level5:
        'Implementation checkpoints:\n• Watch out for edge cases where the sum of all elements is still < target (return 0).\n• Keep minLen initialized to Integer.MAX_VALUE / Infinity.\n• Make sure the while loop shrinks left pointer as long as currentSum >= target.',
      level6:
        `// Java Solution (Explicitly Requested)
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int currentSum = 0;
        int minLen = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];

            while (currentSum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                currentSum -= nums[left];
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }
}`,
    },
    visualization: {
      type: 'sliding-window',
      array: [2, 3, 1, 2, 4, 3],
      target: 7,
      initialWindow: [0, 3],
    },
  },

  'leetcode-3': {
    id: 'leetcode-3',
    title: 'LeetCode 3: Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    challengeDifficulty: 'ACTUALLY_THINK',
    basePoints: 20,
    description:
      'Given a string s, find the length of the longest substring without duplicate characters.',
    example: 's = "abcabcbb" → Output: 3 ("abc")',
    functionName: 'lengthOfLongestSubstring',
    defaultCode: `function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let left = 0;
  const lastSeen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
    testCases: [
      {
        id: 'tc-3-1',
        name: 'Repeated characters',
        inputDescription: 's = "abcabcbb"',
        expectedDescription: '3',
        inputs: ['abcabcbb'],
        expected: 3,
      },
      {
        id: 'tc-3-2',
        name: 'All identical characters',
        inputDescription: 's = "bbbbb"',
        expectedDescription: '1',
        inputs: ['bbbbb'],
        expected: 1,
      },
      {
        id: 'tc-3-3',
        name: 'Substring in middle',
        inputDescription: 's = "pwwkew"',
        expectedDescription: '3',
        inputs: ['pwwkew'],
        expected: 3,
      },
    ],
    levels: {
      level0:
        "Strings with duplicates love to play mind games. Don't panic. You know this pattern deep down.",
      level1:
        'When you inspect each character from left to right, what tells you that your current streak just got broken? When do you know you have to drop an old character?',
      level2:
        'Think of a rubber band. As long as you see unique characters, stretch the right end. The moment you see a character already inside your rubber band, the left end must snap past its previous appearance.',
      level3:
        'Pattern clue: Sliding Window with Hash Map / Set. Map each char to its most recent index, so when a duplicate appears, your left pointer jumps immediately.',
      level4:
        'Pseudocode structure:\n1. map = new Map()\n2. left = 0, maxLen = 0\n3. For right = 0 to s.length - 1:\n     char = s[right]\n     if char in map and map[char] >= left:\n         left = map[char] + 1\n     map[char] = right\n     maxLen = max(maxLen, right - left + 1)\n4. Return maxLen',
      level5:
        'Implementation checkpoints:\n• In Java/C++, ensure you only jump left forward (Math.max(left, map.get(c) + 1)), never backward!\n• Account for empty string "" (should return 0) and string with 1 char "a" (should return 1).',
      level6:
        `// Java Solution (Explicitly Requested)
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLen = 0;
        int left = 0;
        Map<Character, Integer> lastSeen = new HashMap<>();

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c)) {
                left = Math.max(left, lastSeen.get(c) + 1);
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}`,
    },
  },

  'leetcode-42': {
    id: 'leetcode-42',
    title: 'LeetCode 42: Trapping Rain Water',
    difficulty: 'Hard',
    challengeDifficulty: "DON'T_CRY",
    basePoints: 35,
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    example: 'height = [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6',
    functionName: 'trap',
    defaultCode: `function trap(height) {
  if (!height || height.length < 3) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      total += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      total += rightMax - height[right];
      right--;
    }
  }

  return total;
}`,
    testCases: [
      {
        id: 'tc-42-1',
        name: 'Elevation Map 1',
        inputDescription: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedDescription: '6',
        inputs: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        expected: 6,
      },
      {
        id: 'tc-42-2',
        name: 'Elevation Map 2',
        inputDescription: 'height = [4,2,0,3,2,5]',
        expectedDescription: '9',
        inputs: [[4, 2, 0, 3, 2, 5]],
        expected: 9,
      },
      {
        id: 'tc-42-3',
        name: 'Flat Ground (No Water)',
        inputDescription: 'height = [1, 1, 1]',
        expectedDescription: '0',
        inputs: [[1, 1, 1]],
        expected: 0,
      },
    ],
    levels: {
      level0:
        "Okay, deep breath. Hard problems are just two Medium problems wearing a trench coat. We're not crying today.",
      level1:
        "For any single index i, what physically restricts how high water can rise directly above bar i?",
      level2:
        "Water at index i is determined by min(maxHeightToLeft, maxHeightToRight) - height[i]. Can you find the bottlenecks from both edges inwards?",
      level3:
        "Pattern clue: Two Pointers inward. The smaller of leftMax and rightMax is always the bottleneck, so you only need to advance that side!",
      level4:
        "Pseudocode structure:\n1. left = 0, right = n - 1, leftMax = 0, rightMax = 0, water = 0\n2. While left < right:\n     if height[left] < height[right]:\n         leftMax = max(leftMax, height[left])\n         water += leftMax - height[left]\n         left++\n     else:\n         rightMax = max(rightMax, height[right])\n         water += rightMax - height[right]\n         right--\n3. Return water",
      level5:
        "Implementation checkpoints:\n• Inwards movement guarantees you never need extra O(N) memory arrays.\n• Boundary check: array length < 3 returns 0 immediately.",
      level6:
        `// Java Solution (Explicitly Requested)
class Solution {
    public int trap(int[] height) {
        if (height == null || height.length < 3) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, total = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                total += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                total += rightMax - height[right];
                right--;
            }
        }
        return total;
    }
}`,
    },
  },

  'leetcode-322': {
    id: 'leetcode-322',
    title: 'LeetCode 322: Coin Change (Unbounded DP)',
    difficulty: 'Hard',
    challengeDifficulty: 'WHY_DID_I_DO_THIS',
    basePoints: 50,
    description:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    example: 'coins = [1, 2, 5], amount = 11 → Output: 3 (11 = 5 + 5 + 1)',
    functionName: 'coinChange',
    defaultCode: `function coinChange(coins, amount) {
  if (amount === 0) return 0;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    testCases: [
      {
        id: 'tc-322-1',
        name: 'Standard amount with multiple coin choices',
        inputDescription: 'coins = [1, 2, 5], amount = 11',
        expectedDescription: '3',
        inputs: [[1, 2, 5], 11],
        expected: 3,
      },
      {
        id: 'tc-322-2',
        name: 'Impossible amount',
        inputDescription: 'coins = [2], amount = 3',
        expectedDescription: '-1',
        inputs: [[2], 3],
        expected: -1,
      },
      {
        id: 'tc-322-3',
        name: 'Zero amount',
        inputDescription: 'coins = [1], amount = 0',
        expectedDescription: '0',
        inputs: [[1], 0],
        expected: 0,
      },
    ],
    levels: {
      level0:
        "Welcome to the WHY_DID_I_DO_THIS tier. Dynamic Programming is just recursion with amnesia medication. You got this.",
      level1:
        "If you want to make up amount A, and you decide your last coin was C, how many coins did you need for (A - C)?",
      level2:
        "Notice the optimal substructure: minCoins(A) = 1 + min(minCoins(A - c)) for all coins c <= A.",
      level3:
        "Pattern clue: Bottom-Up 1D Dynamic Programming. Initialize an array dp[amount + 1] with Infinity, dp[0] = 0.",
      level4:
        "Pseudocode structure:\n1. dp = Array(amount + 1).fill(Infinity)\n2. dp[0] = 0\n3. For i from 1 to amount:\n     for coin in coins:\n       if i - coin >= 0:\n         dp[i] = min(dp[i], dp[i - coin] + 1)\n4. Return dp[amount] === Infinity ? -1 : dp[amount]",
      level5:
        "Implementation checkpoints:\n• Fill with amount + 1 or Infinity instead of Integer.MAX_VALUE to prevent 32-bit integer overflow in Java.\n• Base case: dp[0] = 0.",
      level6:
        `// Java Unbounded DP Solution
class Solution {
    public int coinChange(int[] coins, int amount) {
        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, max);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    },
  },
};

export const getProblemData = (keyOrTitle: string): ProblemCodingData => {
  const normalized = keyOrTitle.toLowerCase().trim();
  
  // Direct number lookups
  if (normalized === '209' || normalized.includes('209') || normalized.includes('minimum size')) {
    return CODING_PROBLEMS['leetcode-209'];
  }
  if (normalized === '3' || (normalized.includes('3') && (normalized.includes('longest') || normalized.includes('substring')))) {
    return CODING_PROBLEMS['leetcode-3'];
  }
  if (normalized === '1' || (normalized.includes('1') && normalized.includes('two sum')) || normalized === 'two sum') {
    return CODING_PROBLEMS['leetcode-1'];
  }
  if (normalized === '102' || normalized.includes('102') || normalized.includes('level order')) {
    return CODING_PROBLEMS['leetcode-102'];
  }
  if (normalized === '42' || normalized.includes('42') || normalized.includes('rain') || normalized.includes('trapping')) {
    return CODING_PROBLEMS['leetcode-42'];
  }
  if (normalized === '322' || normalized.includes('322') || normalized.includes('coin')) {
    return CODING_PROBLEMS['leetcode-322'];
  }

  // Handle number patterns e.g. "15", "560", "739"
  const numberMatch = normalized.match(/\b\d+\b/);
  const questionNum = numberMatch ? numberMatch[0] : null;
  const displayTitle = questionNum ? `LeetCode ${questionNum}` : (keyOrTitle || 'Custom Coding Problem');
  let challengeDiff: ChallengeDifficulty = 'ACTUALLY_THINK';
  let points = 20;
  if (normalized.includes('hard') || normalized.includes('dp') || normalized.includes('graph')) {
    challengeDiff = 'WHY_DID_I_DO_THIS';
    points = 50;
  } else if (normalized.includes('rain') || normalized.includes('trap')) {
    challengeDiff = "DON'T_CRY";
    points = 35;
  } else if (normalized.includes('easy')) {
    challengeDiff = 'WARM_UP';
    points = 5;
  } else if (normalized.includes('tree') || normalized.includes('starter')) {
    challengeDiff = 'BRAIN_STARTER';
    points = 10;
  }

  return {
    id: 'custom-' + Date.now(),
    title: displayTitle,
    difficulty: points >= 35 ? 'Hard' : points <= 5 ? 'Easy' : 'Medium',
    challengeDifficulty: challengeDiff,
    basePoints: points,
    description: `Working through: "${displayTitle}". Let's dissect the inputs, constraints, and invariants.`,
    example: 'Break down inputs and expected outputs first.',
    functionName: 'solveCustom',
    defaultCode: `function solveCustom(input) {\n  // Write your logic here\n  return input;\n}`,
    testCases: [
      {
        id: 'tc-custom-1',
        name: 'Verification sanity test',
        inputDescription: 'input = "valid"',
        expectedDescription: '"valid"',
        inputs: ['valid'],
        expected: 'valid',
      },
    ],
    levels: {
      level0:
        "Take a breath, PM. We’re not getting bullied by this problem today. We break the code before the code breaks us.",
      level1:
        "Before reaching for syntax or a pattern: Can you explain the problem in plain English in one sentence? What are the inputs, and what does the answer represent?",
      level2:
        "Think about what work is being repeated if you used a naive brute-force loop. What data structure or pointer technique eliminates that repeated work?",
      level3:
        "Pattern clue: Consider whether the array/sequence is sorted (Two Pointers / Binary Search), whether contiguous elements matter (Sliding Window), or if you need fast lookups (Hash Map).",
      level4:
        "Pseudocode guidance: Write out the state variables you need (pointers, running accumulator, or frequency table) and the termination condition of your primary loop.",
      level5:
        "Implementation checkpoint: Double-check your loop boundary conditions (< vs <=), off-by-one indices, and empty or 1-element inputs.",
      level6:
        "// Custom solution note:\n// Formulate the final code using the pseudocode above! If you need language syntax, switch to Syntax Rescue below.",
    },
  };
};
