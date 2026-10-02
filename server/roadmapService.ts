import type {
  RoadmapPlan,
  RoadmapPhase,
  ClarificationResponse,
  RoadmapAdaptationSuggestion,
  RoadmapProgressData,
} from '../src/types';

interface GenerateRoadmapInput {
  goal: string;
  why?: string;
  level?: string;
  timeCommitment?: string;
  deadline?: string;
  language?: string;
  knownTopics?: string;
}

export class RoadmapService {
  private ollamaHost: string;
  private gemmaModel: string;
  private apiKey?: string;

  constructor() {
    this.ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.gemmaModel = process.env.GEMMA_MODEL || 'gemma2:latest';
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  // 1. CLARIFICATION CHECK
  public async checkClarification(goal: string): Promise<ClarificationResponse> {
    const trimmed = goal.trim();

    // If goal is extremely short or vague (under 20 chars or generic word)
    const isVague =
      trimmed.length < 25 ||
      /^(dsa|java|python|coding|interviews|react|ml|prepare|learn)$/i.test(trimmed);

    if (isVague) {
      return {
        needsClarification: true,
        friendlyMessage: "Alright. You bring the chaos. I'll bring the roadmap. But give me a few quick coordinates first so we don't build a 6-month rocket for a 2-week quiz. 😭",
        questions: [
          {
            id: 'why',
            category: 'why',
            question: 'Why are we doing this? What is the actual finish line?',
            placeholder: 'e.g., Campus placements, product company interviews, hackathon, building an app...',
            quickOptions: ['Job / Campus Interviews', 'Build Cool Projects', 'Semester Exams', 'Just for fun & bragging rights'],
          },
          {
            id: 'level',
            category: 'level',
            question: 'What is your current comfort level with this?',
            placeholder: 'Absolute beginner, know basics, or comfortable with core syntax?',
            quickOptions: ['Absolute Beginner', 'Know Basics / Syntax', 'Intermediate (done some problems)'],
          },
          {
            id: 'time',
            category: 'time',
            question: 'How much realistic time can you commit per day?',
            placeholder: 'Be honest, Veer. No 10-hour fantasy schedules.',
            quickOptions: ['45 mins - 1 hr/day', '1.5 - 2 hrs/day', '3+ hrs/day', 'Weekends intense'],
          },
          {
            id: 'deadline',
            category: 'deadline',
            question: 'Target timeline or deadline?',
            placeholder: 'e.g., 3 weeks, 2 months, by placement season...',
            quickOptions: ['3-4 Weeks (Sprint)', '2 Months (Balanced)', '3-4 Months (Mastery)', 'No strict deadline'],
            optional: true,
          },
          {
            id: 'language',
            category: 'language',
            question: 'Preferred language or tech stack?',
            placeholder: 'Java, Python, C++, JavaScript...',
            quickOptions: ['Java', 'Python', 'C++', 'JavaScript'],
            optional: true,
          },
        ],
      };
    }

    return {
      needsClarification: false,
      friendlyMessage: "Okay Veer, apparently we're doing this. Generating your tailored battle plan...",
      questions: [],
    };
  }

  // 2. GENERATE ROADMAP (STRUCTURED JSON)
  public async generateRoadmap(input: GenerateRoadmapInput): Promise<{ plan: RoadmapPlan; isAiGenerated: boolean; error?: string }> {
    const prompt = `
Generate a structured learning roadmap for this goal:
Goal: "${input.goal}"
Why / Motivation: "${input.why || 'Interview prep & mastery'}"
Current Level: "${input.level || 'Knows basics'}"
Daily Time Commitment: "${input.timeCommitment || '1-2 hours daily'}"
Target Deadline: "${input.deadline || '2 months'}"
Preferred Language: "${input.language || 'Java'}"
Known Topics: "${input.knownTopics || 'Basic syntax'}"

CRITICAL RULES:
1. Return ONLY pure valid JSON matching this schema exactly.
2. Provide 3 to 4 sequential phases: START -> PHASE 1 -> PHASE 2 -> (optional PHASE 3) -> FINAL MISSION.
3. Each topic must have 2-3 specific actionable tasks, and 1-2 practice tasks.
4. Difficulty must be one of: "MILD_CHAOS", "ACTUALLY_THINK", "DON_T_CRY", "SPEEDRUN", "BEAST_MODE".
5. Keep tone playful, collegiate, and encouraging like a best friend.

JSON SCHEMA:
{
  "goal": string,
  "summary": string,
  "estimatedDuration": string,
  "difficulty": string,
  "dailyCommitment": string,
  "phases": [
    {
      "id": string,
      "title": string,
      "description": string,
      "estimatedDuration": string,
      "topics": [
        {
          "id": string,
          "title": string,
          "description": string,
          "tasks": string[],
          "practiceTasks": string[],
          "dependencies": string[]
        }
      ]
    }
  ]
}
`;

    // 1. Try Ollama (Gemma)
    try {
      const ollamaRes = await fetch(`${this.ollamaHost}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.gemmaModel,
          prompt,
          format: 'json',
          stream: false,
          options: { temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const parsed = this.parseJsonSafely(data.response);
        if (parsed && parsed.phases && parsed.phases.length > 0) {
          const finalPlan = this.normalizePlan(parsed, input);
          return { plan: finalPlan, isAiGenerated: true };
        }
      }
    } catch {
      // Ollama unavailable or timeout
    }

    // 2. Try Gemini API if key is present
    if (this.apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
            }),
            signal: AbortSignal.timeout(6000),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = this.parseJsonSafely(text);
          if (parsed && parsed.phases && parsed.phases.length > 0) {
            const finalPlan = this.normalizePlan(parsed, input);
            return { plan: finalPlan, isAiGenerated: true };
          }
        }
      } catch {
        // Fall through
      }
    }

    // 3. Fallback: Curated structured roadmap tailored to input
    const fallback = this.generateTailoredFallback(input);
    return { plan: fallback, isAiGenerated: false, error: 'AI took a chai break' };
  }

  // 3. ADAPTIVE ROADMAP SUGGESTION
  public async adaptRoadmap(
    plan: RoadmapPlan,
    progress: RoadmapProgressData,
    recentStruggleCount = 0
  ): Promise<RoadmapAdaptationSuggestion> {
    const completedRatio =
      progress.completedTopics.length / Math.max(1, plan.phases.reduce((acc, p) => acc + p.topics.length, 0));

    // If user struggled multiple times with hints
    if (recentStruggleCount >= 2) {
      return {
        action: 'ADD_PRACTICE',
        title: 'Reinforcement Anchor: Extra Sliding Window & Pointer Practice',
        reason: "You're not ready to move on yet. The algorithm department noticed some hint exhaustion on recent problems.",
        description: 'Before jumping into Hard interval trees or heavy DP, let us solidify two warm-up sliding window invariants.',
        suggestedTasks: [
          'Solve LeetCode 3 (Longest Substring Without Repeating Characters) without hints',
          'Hand-trace left and right pointer invariants on a whiteboard/scratchpad',
        ],
      };
    }

    // If user is crushing it quickly
    if (completedRatio > 0.4 && recentStruggleCount === 0) {
      return {
        action: 'FAST_TRACK',
        title: 'Speedrun Unlock: Skip Syntax Drills & Tackle Real Interview Problems',
        reason: "Okay, you're making this look suspiciously easy. Let's move you forward.",
        description: 'You breezed through foundational array patterns with minimal hints. We can fast-track the boilerplate topics.',
        suggestedTasks: [
          'Jump directly into LeetCode 209 (Actually Think)',
          'Attempt 1 timed mock problem (20 min cap)',
        ],
      };
    }

    // Default friendly adaptive nudge
    return {
      action: 'PACE_ADJUST',
      title: 'Steady Rhythm Adjustment',
      reason: 'Keeping your daily cadence sustainable and treat-eligible.',
      description: 'Your current pace is solid. Keep completing 1-2 focused topics per session to stay ahead of your deadline.',
      suggestedTasks: ['Maintain 1 problem solve before requesting a treat voucher'],
    };
  }

  private parseJsonSafely(str: string): any {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      // Try extracting json block
      const match = str.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  private normalizePlan(raw: any, input: GenerateRoadmapInput): RoadmapPlan {
    const planId = `roadmap-${Date.now()}`;
    const phases: RoadmapPhase[] = (raw.phases || []).map((p: any, pIdx: number) => ({
      id: p.id || `phase-${pIdx + 1}`,
      title: p.title || `Phase ${pIdx + 1}`,
      description: p.description || '',
      estimatedDuration: p.estimatedDuration || '2 weeks',
      topics: (p.topics || []).map((t: any, tIdx: number) => ({
        id: t.id || `topic-${pIdx + 1}-${tIdx + 1}`,
        title: t.title || `Topic ${tIdx + 1}`,
        description: t.description || '',
        tasks: Array.isArray(t.tasks) ? t.tasks : ['Review core invariant', 'Implement basic example'],
        practiceTasks: Array.isArray(t.practiceTasks) ? t.practiceTasks : ['Solve 1 practice problem'],
        dependencies: Array.isArray(t.dependencies) ? t.dependencies : [],
      })),
    }));

    return {
      id: planId,
      userId: 'veer-01',
      goal: raw.goal || input.goal,
      summary: raw.summary || `Tailored battle plan for ${input.goal}. One step at a time, genius. 😭`,
      estimatedDuration: raw.estimatedDuration || input.deadline || '6-8 Weeks',
      difficulty: raw.difficulty || 'ACTUALLY_THINK',
      dailyCommitment: raw.dailyCommitment || input.timeCommitment || '1-2 hrs / day',
      phases,
      generatedAt: new Date().toISOString(),
      originalInputs: input,
      currentPhaseId: phases[0]?.id,
      currentTopicId: phases[0]?.topics[0]?.id,
      status: 'active',
    };
  }

  private generateTailoredFallback(input: GenerateRoadmapInput): RoadmapPlan {
    const lang = input.language || 'Java';
    const isDSA = /dsa|algo|leetcode|structure|interview/i.test(input.goal);
    const planId = `roadmap-${Date.now()}`;

    if (isDSA) {
      return {
        id: planId,
        userId: 'veer-01',
        goal: input.goal,
        summary: `Strategic battle plan for mastering DSA in ${lang}. Built for interview pressure, not rote memorization.`,
        estimatedDuration: input.deadline || '8 Weeks',
        difficulty: 'ACTUALLY_THINK',
        dailyCommitment: input.timeCommitment || '1.5 Hours / Day',
        generatedAt: new Date().toISOString(),
        originalInputs: input,
        status: 'active',
        phases: [
          {
            id: 'phase-1',
            title: 'Phase 1: Foundations & Pointer Fluency',
            description: 'Master in-place manipulation, two pointers, and sliding window patterns without panicking.',
            estimatedDuration: '2 Weeks',
            topics: [
              {
                id: 'topic-1-1',
                title: 'Two Pointers & Array Partitioning',
                description: 'Opposite-end and fast-slow pointers to eliminate nested O(N^2) loops.',
                tasks: [
                  'Understand left/right pointer termination condition',
                  'Solve Two Sum II (Sorted array)',
                  'Implement 3Sum with duplicate avoidance',
                ],
                practiceTasks: ['LeetCode 11: Container With Most Water', 'LeetCode 26: Remove Duplicates'],
                dependencies: [],
              },
              {
                id: 'topic-1-2',
                title: 'Sliding Window (Fixed & Dynamic)',
                description: 'Expanding and shrinking window frames to track running subarray metrics in O(N).',
                tasks: [
                  'Understand window expansion (right++) vs shrinking (left++)',
                  'Solve LeetCode 209: Minimum Size Subarray Sum',
                  'Solve LeetCode 3: Longest Substring Without Repeating Characters',
                ],
                practiceTasks: ['LeetCode 424: Longest Repeating Character Replacement', 'LeetCode 76: Minimum Window Substring'],
                dependencies: ['topic-1-1'],
              },
            ],
          },
          {
            id: 'phase-2',
            title: 'Phase 2: HashMaps, Heaps & Monotonic Structures',
            description: 'Trade minimal space for instant O(1) lookups and O(log K) extremes.',
            estimatedDuration: '3 Weeks',
            topics: [
              {
                id: 'topic-2-1',
                title: 'HashMap Frequency & Prefix Sums',
                description: 'Combine running sum prefix with HashMap lookups for continuous subarray queries.',
                tasks: [
                  'Master prefixSum[i] - prefixSum[j] == target formula',
                  'Solve LeetCode 560: Subarray Sum Equals K',
                  'Solve Group Anagrams using frequency signatures',
                ],
                practiceTasks: ['LeetCode 525: Contiguous Array', 'LeetCode 238: Product of Array Except Self'],
                dependencies: ['topic-1-1'],
              },
              {
                id: 'topic-2-2',
                title: 'Monotonic Stack & Queue',
                description: 'Maintain sorted order inside a stack to find Next Greater Element in single pass.',
                tasks: [
                  'Understand why monotonic stacks achieve amortized O(N)',
                  'Solve Daily Temperatures (LeetCode 739)',
                  'Solve Next Greater Element I & II',
                ],
                practiceTasks: ['LeetCode 84: Largest Rectangle in Histogram'],
                dependencies: ['topic-2-1'],
              },
            ],
          },
          {
            id: 'phase-3',
            title: 'Phase 3: Trees, BFS/DFS & Recursion Invariants',
            description: 'Demystify tree traversals and backtrack state restoration without brain fog.',
            estimatedDuration: '2 Weeks',
            topics: [
              {
                id: 'topic-3-1',
                title: 'Binary Tree In-Order / Post-Order & Depth',
                description: 'Formulate base cases clearly: null node return vs leaf node processing.',
                tasks: [
                  'Implement recursive vs iterative level-order traversal (Queue)',
                  'Solve Lowest Common Ancestor (LCA) in BST and Binary Tree',
                  'Solve Binary Tree Maximum Path Sum',
                ],
                practiceTasks: ['LeetCode 102: Level Order Traversal', 'LeetCode 104: Maximum Depth'],
                dependencies: ['topic-2-1'],
              },
            ],
          },
          {
            id: 'phase-4',
            title: 'Final Mission: Timed Mocks & Boss Battles',
            description: 'Simulate interview pressure: 45-minute timed problems with zero hints and clean commentary.',
            estimatedDuration: '1 Week',
            topics: [
              {
                id: 'topic-4-1',
                title: 'Interview Simulator & Behavioral Wrap-Up',
                description: 'Walk through problem statements out loud, declare time/space complexities first, then code.',
                tasks: [
                  'Complete 3 blind 45-minute problem runs',
                  'Verify edge cases: null, empty array, single element, negative numbers',
                  'Claim ultimate celebration treat from SK!',
                ],
                practiceTasks: ['Mock Interview Roulette on Nudge Veer Play Mode'],
                dependencies: ['topic-3-1'],
              },
            ],
          },
        ],
      };
    }

    // Generic project / stack roadmap fallback
    return {
      id: planId,
      userId: 'veer-01',
      goal: input.goal,
      summary: `Action plan to conquer "${input.goal}" step-by-step.`,
      estimatedDuration: input.deadline || '6 Weeks',
      difficulty: 'ACTUALLY_THINK',
      dailyCommitment: input.timeCommitment || '1-2 Hours / Day',
      generatedAt: new Date().toISOString(),
      originalInputs: input,
      status: 'active',
      phases: [
        {
          id: 'phase-1',
          title: 'Phase 1: Architecture & Mental Model',
          description: 'Establish core patterns, syntax idioms, and development workflow.',
          estimatedDuration: '2 Weeks',
          topics: [
            {
              id: 'topic-1-1',
              title: 'Core Fundamentals & Sandbox Setup',
              description: 'Setting up the environment and writing the first end-to-end prototype.',
              tasks: ['Initialize clean project template', 'Implement hello-world pipeline', 'Explore core language constructs'],
              practiceTasks: ['Build a tiny 1-file CLI or minimal interactive screen'],
              dependencies: [],
            },
          ],
        },
        {
          id: 'phase-2',
          title: 'Phase 2: Core Feature Implementation',
          description: 'Build the primary mechanics, data flow, and error boundaries.',
          estimatedDuration: '3 Weeks',
          topics: [
            {
              id: 'topic-2-1',
              title: 'Data Flow, State & Async Handlers',
              description: 'Connecting inputs to structured state with robust validation.',
              tasks: ['Design state store or schema', 'Implement asynchronous data fetching', 'Add defensive error handling'],
              practiceTasks: ['Write unit test covering edge-case inputs'],
              dependencies: ['topic-1-1'],
            },
          ],
        },
        {
          id: 'phase-3',
          title: 'Final Mission: Polish, Packaging & Ship',
          description: 'Optimization, responsive polish, and deployment.',
          estimatedDuration: '1 Week',
          topics: [
            {
              id: 'topic-3-1',
              title: 'Deployment & Bragging Rights',
              description: 'Ship to production and share with friends.',
              tasks: ['Run production build checks', 'Deploy live demo', 'Claim celebratory treat voucher!'],
              practiceTasks: ['Document architecture in README'],
              dependencies: ['topic-2-1'],
            },
          ],
        },
      ],
    };
  }
}

export const roadmapService = new RoadmapService();
