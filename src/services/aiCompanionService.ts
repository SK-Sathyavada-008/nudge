import type { GemmaDecision, CodingLanguage, CodingProblemState } from '../types';

export interface DecisionContext {
  problem: string;
  userState?: CodingProblemState;
  actionRequested?: string;
  hintLevel?: number;
  hintsUsed?: number;
  mood?: string;
  language?: CodingLanguage;
}

export interface AICompanionService {
  decide(context: DecisionContext): Promise<GemmaDecision>;
  getNudge(problem: string, level: number, state: string, hintsUsed: number): Promise<GemmaDecision>;
  getQuestion(problem: string, contextText: string): Promise<GemmaDecision>;
  getHint(problem: string, level: number, hintsUsed: number): Promise<GemmaDecision>;
  getSyntaxHelp(language: CodingLanguage, problem: string): Promise<GemmaDecision>;
  getReset(problem: string): Promise<GemmaDecision>;
  getCelebration(problem: string, hintsUsed: number): Promise<GemmaDecision>;
}

export class GemmaCompanionClient implements AICompanionService {
  private apiUrl = '/api/gemma/decide';

  public async decide(ctx: DecisionContext): Promise<GemmaDecision> {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      });

      if (res.ok) {
        const decision = (await res.json()) as GemmaDecision;
        return decision;
      }
    } catch {
      // Fallback handled below
    }

    // Graceful offline fallback conforming to exact Gemma structured schema
    return this.localFallback(ctx);
  }

  public async getNudge(
    problem: string,
    level: number,
    state: string,
    hintsUsed: number
  ): Promise<GemmaDecision> {
    return this.decide({
      problem,
      hintLevel: level,
      userState: state as CodingProblemState,
      hintsUsed,
      actionRequested: 'HINT',
    });
  }

  public async getQuestion(problem: string, contextText: string): Promise<GemmaDecision> {
    return this.decide({
      problem,
      actionRequested: 'QUESTION',
      mood: contextText,
    });
  }

  public async getHint(problem: string, level: number, hintsUsed: number): Promise<GemmaDecision> {
    return this.decide({
      problem,
      hintLevel: level,
      hintsUsed,
      actionRequested: 'HINT',
    });
  }

  public async getSyntaxHelp(language: CodingLanguage, problem: string): Promise<GemmaDecision> {
    return this.decide({
      problem,
      language,
      actionRequested: 'SYNTAX_HELP',
    });
  }

  public async getReset(problem: string): Promise<GemmaDecision> {
    return this.decide({
      problem,
      actionRequested: 'RESET',
    });
  }

  public async getCelebration(problem: string, hintsUsed: number): Promise<GemmaDecision> {
    return this.decide({
      problem,
      hintsUsed,
      actionRequested: 'CELEBRATION',
    });
  }

  private localFallback(ctx: DecisionContext): GemmaDecision {
    const level = ctx.hintLevel || 1;
    const hintsCount = ctx.hintsUsed || 1;

    let points = 35;
    if (hintsCount >= 5) points = 10;
    else if (hintsCount >= 3) points = 20;

    if (ctx.actionRequested === 'RESET') {
      return {
        action: 'RESET',
        difficulty: 'ACTUALLY_THINK',
        message: 'Your brain has officially filed for leave. Go drink water. I will complain to Kanha.',
        game: 'frog_therapy',
        hintLevel: level,
        points: 0,
        completed: false,
      };
    }

    if (ctx.actionRequested === 'QUESTION') {
      return {
        action: 'QUESTION',
        difficulty: 'ACTUALLY_THINK',
        message: "Okay genius. Let's see what you've got.",
        nextQuestion: `What information could you maintain while moving through ${ctx.problem || 'the array'}?`,
        hintLevel: level,
        points,
      };
    }

    if (ctx.actionRequested === 'SYNTAX_HELP') {
      return {
        action: 'SYNTAX_HELP',
        difficulty: 'ACTUALLY_THINK',
        message: `You know the logic. Your ${ctx.language || 'Java'} syntax is just having a personal vendetta against you.`,
        syntaxLanguage: ctx.language || 'Java',
        hintLevel: Math.max(level, 4),
        points,
      };
    }

    if (ctx.actionRequested === 'CELEBRATION') {
      return {
        action: 'CELEBRATION',
        difficulty: 'ACTUALLY_THINK',
        message: `SEE??? I TOLD YOU. Actually, I didn't tell you anything. You figured it out yourself. 😌 🦚 Krishna Approved! (+${points} Arcade Tokens)`,
        points,
        hintLevel: level,
        completed: true,
      };
    }

    return {
      action: 'HINT',
      difficulty: 'ACTUALLY_THINK',
      message: 'Alright genius. Let’s break the code before the code breaks us. What happens when your window condition violates?',
      hintLevel: Math.min(level + 1, 5),
      points,
    };
  }
}

export const companionService = new GemmaCompanionClient();
