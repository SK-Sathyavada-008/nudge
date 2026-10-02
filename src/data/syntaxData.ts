import type { CodingLanguage } from '../types';

export interface SyntaxSnippet {
  id: string;
  name: string;
  category: string;
  code: string;
  explanation: string;
}

export const SYNTAX_SNIPPETS: Record<CodingLanguage, SyntaxSnippet[]> = {
  Java: [
    {
      id: 'java-hashmap',
      name: 'HashMap (Lookup & Frequency)',
      category: 'Data Structures',
      code: `Map<Integer, Integer> map = new HashMap<>();
// Put & Default
map.put(key, map.getOrDefault(key, 0) + 1);
// Check & Get
if (map.containsKey(key)) {
    int val = map.get(key);
}`,
      explanation: 'Use getOrDefault() to avoid null checks when counting frequencies.',
    },
    {
      id: 'java-sliding-window',
      name: 'Sliding Window Template',
      category: 'Algorithm Patterns',
      code: `int left = 0;
int currentSum = 0;
int minLen = Integer.MAX_VALUE;

for (int right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    
    while (currentSum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        currentSum -= nums[left];
        left++;
    }
}`,
      explanation: 'The right pointer expands the window; the while loop contracts the left pointer.',
    },
    {
      id: 'java-priority-queue',
      name: 'PriorityQueue (Min/Max Heap)',
      category: 'Data Structures',
      code: `// Min Heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max Heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
minHeap.offer(x);
int top = minHeap.poll();`,
      explanation: 'Remember: offer() to insert, poll() to extract min/max, peek() to view top.',
    },
    {
      id: 'java-string-sb',
      name: 'StringBuilder & Array Sort',
      category: 'Strings & Arrays',
      code: `StringBuilder sb = new StringBuilder();
sb.append("char");
String result = sb.reverse().toString();

Arrays.sort(nums); // O(N log N)`,
      explanation: 'Never concatenate Strings inside loops with `+`; always use StringBuilder.',
    },
  ],

  Python: [
    {
      id: 'py-dict',
      name: 'Counter & defaultdict',
      category: 'Data Structures',
      code: `from collections import defaultdict, Counter

# Count frequencies
counts = Counter(nums)

# Default value dict
graph = defaultdict(list)
graph[u].append(v)`,
      explanation: 'defaultdict eliminates KeyError when appending neighbors or counting.',
    },
    {
      id: 'py-sliding-window',
      name: 'Sliding Window Template',
      category: 'Algorithm Patterns',
      code: `left = 0
curr_sum = 0
min_len = float('inf')

for right in range(len(nums)):
    curr_sum += nums[right]
    while curr_sum >= target:
        min_len = min(min_len, right - left + 1)
        curr_sum -= nums[left]
        left += 1

return 0 if min_len == float('inf') else min_len`,
      explanation: 'Use float("inf") for clean minimum trackers.',
    },
    {
      id: 'py-heap',
      name: 'Heapq (Min Heap)',
      category: 'Data Structures',
      code: `import heapq

heap = []
heapq.heappush(heap, val)
smallest = heapq.heappop(heap)
# For max heap, push negative values: -val`,
      explanation: 'Python heapq is min-heap by default.',
    },
  ],

  'C++': [
    {
      id: 'cpp-unordered-map',
      name: 'unordered_map & vector',
      category: 'Data Structures',
      code: `#include <unordered_map>
#include <vector>

std::unordered_map<int, int> count;
count[key]++;

if (count.find(target) != count.end()) {
    // found
}`,
      explanation: 'unordered_map provides O(1) average lookup time via hashing.',
    },
    {
      id: 'cpp-sliding-window',
      name: 'Sliding Window Template',
      category: 'Algorithm Patterns',
      code: `int left = 0, currentSum = 0;
int minLen = INT_MAX;

for (int right = 0; right < nums.size(); right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
        minLen = std::min(minLen, right - left + 1);
        currentSum -= nums[left];
        left++;
    }
}
return minLen == INT_MAX ? 0 : minLen;`,
      explanation: 'Fast in-place pointers with INT_MAX initialization.',
    },
  ],

  JavaScript: [
    {
      id: 'js-map',
      name: 'Map & Set',
      category: 'Data Structures',
      code: `const map = new Map();
map.set(key, (map.get(key) || 0) + 1);

const seen = new Set();
seen.add(val);
if (seen.has(val)) { /* duplicate */ }`,
      explanation: 'Map preserves key types and provides O(1) lookups.',
    },
    {
      id: 'js-sliding-window',
      name: 'Sliding Window Template',
      category: 'Algorithm Patterns',
      code: `let left = 0;
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
return minLen === Infinity ? 0 : minLen;`,
      explanation: 'Use Infinity for initial minimum comparisons.',
    },
  ],
};
