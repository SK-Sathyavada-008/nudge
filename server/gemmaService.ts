import type { GemmaDecision, ChallengeDifficulty, GemmaAction, CodingProblemState, CodingLanguage } from '../src/types';

interface GemmaDecisionRequest {
  problem: string;
  userState?: CodingProblemState;
  actionRequested?: string;
  hintLevel?: number;
  hintsUsed?: number;
  mood?: string;
  language?: CodingLanguage;
  codeSnippet?: string;
}

const SYSTEM_PROMPT = `
You are the AI brain for "NUDGE VEER" - a playful college-style coding companion for Veer.
Your persona:
- College dashboard + arcade + coding companion + best-friend inside jokes.
- NOT corporate, NOT LMS, NOT boring, NOT a generic cheerleader.
- Tone: Playful, sarcastic study-buddy who genuinely cares.
  Examples:
  "Okay genius, show me something."
  "Don't disappoint the evil algorithm department."
  "😈 Hmm. That was suspiciously easy."
  "Nice. Unfortunately, you haven't earned the treat yet."
  "One problem does not buy you canteen food. Keep going."
  "Bro, the array is not going to solve itself."
- Core philosophy: "NUDGE, DON'T REPLACE."
- NEVER write out the full solution code unless specifically at Level 6.
- NEVER invent quotes from Krishna. If the user needs grounding, output action "PERSONAL_MESSAGE" with messageId "krishna_approved_01", "krishna_approved_02", "krishna_approved_03", or "krishna_approved_04".
- Challenges must be classified into:
  "WARM_UP", "BRAIN_STARTER", "ACTUALLY_THINK", "DON'T_CRY", "WHY_DID_I_DO_THIS".
- Points structure:
  WARM_UP: 15, BRAIN_STARTER: 25, ACTUALLY_THINK: 35, DON'T_CRY: 50, WHY_DID_I_DO_THIS: 75.
  Using hints reduces points. Level 6 full solution awards 0 points and completed = false.
- OUTPUT FORMAT: You must return ONLY raw JSON (no markdown fences, no extra text) matching this schema:
{
  "action": "CHALLENGE" | "HINT" | "QUESTION" | "SYNTAX_HELP" | "VISUALIZATION" | "JOKE" | "RESET" | "MINI_GAME" | "CELEBRATION" | "PERSONAL_MESSAGE",
  "difficulty": "WARM_UP" | "BRAIN_STARTER" | "ACTUALLY_THINK" | "DON'T_CRY" | "WHY_DID_I_DO_THIS",
  "message": "Playful string message",
  "points": number,
  "hintLevel": number,
  "nextQuestion": "optional Socratic question",
  "game": "binary_duel" | "frog_therapy" | "trivia_roulette" | "canteen_run",
  "messageId": "optional curated ID",
  "completed": boolean
}
`;

export class GemmaService {
  private ollamaHost: string;
  private gemmaModel: string;
  private apiKey?: string;

  constructor() {
    this.ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.gemmaModel = process.env.GEMMA_MODEL || 'gemma2:latest';
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  public async decide(req: GemmaDecisionRequest): Promise<GemmaDecision> {
    const prompt = `User Context:
Problem: ${req.problem || 'LeetCode 209'}
User state: ${req.userState || "I'm completely lost"}
Action requested: ${req.actionRequested || 'HINT'}
Current hintLevel: ${req.hintLevel ?? 1}
Hints used so far: ${req.hintsUsed ?? 1}
Mood: ${req.mood || 'locked-in'}
Language: ${req.language || 'Java'}

Decide the appropriate action, response message, and points.`;

    // 1. Try local Ollama if running
    try {
      const ollamaDecision = await this.callOllama(prompt);
      if (ollamaDecision) return ollamaDecision;
    } catch {
      // Ollama not reachable or error, continue to fallback / API
    }

    // 2. Try Gemini API for Gemma if API key is present
    if (this.apiKey) {
      try {
        const apiDecision = await this.callGoogleGemma(prompt);
        if (apiDecision) return apiDecision;
      } catch {
        // Fallback to intelligent deterministic rule engine
      }
    }

    // 3. Resilient Deterministic College-Buddy Brain (Guaranteed valid JSON)
    return this.fallbackDecision(req);
  }

  private async callOllama(userPrompt: string): Promise<GemmaDecision | null> {
    const response = await fetch(`${this.ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.gemmaModel,
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        stream: false,
        format: 'json',
      }),
      signal: AbortSignal.timeout(6000), // 6 second timeout
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { response?: string };
    if (!data.response) return null;

    return this.cleanAndParseJSON(data.response);
  }

  private async callGoogleGemma(userPrompt: string): Promise<GemmaDecision | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b-it:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    return this.cleanAndParseJSON(candidateText);
  }

  private cleanAndParseJSON(raw: string): GemmaDecision | null {
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as GemmaDecision;
      if (parsed.action && parsed.message) {
        return parsed;
      }
    } catch {
      // Json parsing failed
    }
    return null;
  }

  private fallbackDecision(req: GemmaDecisionRequest): GemmaDecision {
    const actionReq = (req.actionRequested || 'HINT').toUpperCase();
    const currentLevel = req.hintLevel ?? 1;
    const hintsCount = req.hintsUsed ?? 1;

    let difficulty: ChallengeDifficulty = 'ACTUALLY_THINK';
    let basePts = 20;

    const probLower = (req.problem || '').toLowerCase();
    if (probLower.includes('209') || probLower.includes('subarray')) {
      difficulty = 'ACTUALLY_THINK';
      basePts = 20;
    } else if (probLower.includes('3') || probLower.includes('longest')) {
      difficulty = 'ACTUALLY_THINK';
      basePts = 20;
    } else if (probLower.includes('1') && probLower.includes('two sum')) {
      difficulty = 'WARM_UP';
      basePts = 5;
    } else if (probLower.includes('102') || probLower.includes('level order')) {
      difficulty = 'BRAIN_STARTER';
      basePts = 10;
    } else if (probLower.includes('42') || probLower.includes('rain')) {
      difficulty = "DON'T_CRY";
      basePts = 35;
    } else if (probLower.includes('322') || probLower.includes('coin') || probLower.includes('why_did_i_do_this')) {
      difficulty = 'WHY_DID_I_DO_THIS';
      basePts = 50;
    }

    // Exact hint penalty formula:
    // 0 hints: 100%, 1 hint: 90%, 2 hints: 75%, 3 hints: 60%, 4+ hints: 40%
    let points = basePts;
    if (hintsCount >= 4) points = Math.max(1, Math.round(basePts * 0.4));
    else if (hintsCount === 3) points = Math.max(1, Math.round(basePts * 0.6));
    else if (hintsCount === 2) points = Math.max(1, Math.round(basePts * 0.75));
    else if (hintsCount === 1) points = Math.max(1, Math.round(basePts * 0.9));

    if (actionReq === 'RESET' || req.userState === "I'm completely lost" && currentLevel >= 4) {
      return {
        action: 'RESET',
        difficulty,
        message: 'Your brain has officially filed for leave. Go drink water, PM. I will complain to Kanha.',
        game: 'frog_therapy',
        hintLevel: currentLevel,
        points: 0,
        completed: false,
      };
    }

    if (actionReq === 'QUESTION') {
      return {
        action: 'QUESTION',
        difficulty,
        message: "Okay genius. Let's see what you've got.",
        nextQuestion: `Before reaching for any pattern: What information do you actually need to maintain while traversing "${req.problem}"?`,
        hintLevel: currentLevel,
        points,
      };
    }

    if (actionReq === 'SYNTAX_HELP') {
      return {
        action: 'SYNTAX_HELP',
        difficulty,
        message: `You know the logic. Your ${req.language || 'Java'} syntax is just having a personal vendetta against you.`,
        syntaxLanguage: req.language || 'Java',
        hintLevel: Math.max(currentLevel, 4),
        points,
      };
    }

    if (actionReq === 'VISUALIZATION') {
      return {
        action: 'VISUALIZATION',
        difficulty,
        message: 'Visual aid deployed! Watch the pointers expand and contract instead of guessing in your head.',
        hintLevel: currentLevel,
        points,
      };
    }

    if (actionReq === 'JOKE') {
      return {
        action: 'JOKE',
        difficulty,
        message: 'Why do programmers love dark mode? Because light attracts bugs... and dark mode hides the contest fatigue.',
        hintLevel: currentLevel,
        points: 5,
      };
    }

    if (actionReq === 'MINI_GAME') {
      return {
        action: 'MINI_GAME',
        difficulty,
        message: 'Mini-game unlocked! Let O(log N) clear your mental cache.',
        game: 'binary_duel',
        hintLevel: currentLevel,
        points: 10,
      };
    }

    if (actionReq === 'SOLUTION_REQUEST' || currentLevel >= 6) {
      return {
        action: 'HINT',
        difficulty,
        message: '😈 I saw you open the solution. Full code unlocked, but 0 challenge points for this run. Study the invariants, write it yourself tomorrow! (No shame).',
        hintLevel: 6,
        points: 0,
        completed: false,
      };
    }

    if (actionReq === 'PERSONAL_MESSAGE') {
      const krishnaIds = ['krishna_approved_01', 'krishna_approved_02', 'krishna_approved_03', 'krishna_approved_04'];
      const chosenId = krishnaIds[Math.floor(Math.random() * krishnaIds.length)];
      return {
        action: 'PERSONAL_MESSAGE',
        difficulty,
        message: 'Here is a message specifically curated for you from your best buddy.',
        messageId: chosenId,
        hintLevel: currentLevel,
        points: 0,
      };
    }

    if (actionReq === 'CHALLENGE') {
      return {
        action: 'CHALLENGE',
        difficulty,
        message: "Alright genius. Let's see what you've got. Don't disappoint the evil algorithm department.",
        points: basePts,
        hintLevel: 0,
      };
    }

    if (actionReq === 'CELEBRATION' || req.actionRequested === 'COMPLETE') {
      return {
        action: 'CELEBRATION',
        difficulty,
        message: `SEE??? I TOLD YOU! You figured it out yourself. 🦚 Krishna Approved! Earned +${points} Canteen Tokens!`,
        points,
        hintLevel: currentLevel,
        completed: true,
      };
    }

    // Default Progressive Nudge
    const nextLvl = Math.min(currentLevel + 1, 5);
    const msgs = [
      "Alright genius. Let's see what you've got.",
      "Okay okay. Tiny nudge. What information could you maintain while moving through the array?",
      "Notice: Adding elements grows the window, removing from left shrinks it. Can you avoid re-scanning?",
      "Pattern clue: Sliding Window (Two Pointers). Expand right until condition holds, shrink left to minimize!",
      "Pseudocode guidance: Initialize left=0, right pointer in for-loop, while loop to contract left.",
      "Implementation checkpoint: Watch empty array edge cases and Integer.MAX_VALUE initialization.",
    ];

    return {
      action: 'HINT',
      difficulty,
      message: msgs[nextLvl] || msgs[1],
      hintLevel: nextLvl,
      points,
      nextQuestion: nextLvl === 1 ? 'What happens when right exceeds the array boundary?' : undefined,
    };
  }
}

export const gemmaService = new GemmaService();
