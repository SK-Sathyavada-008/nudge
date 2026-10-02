import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import type { CodingProblemState, CodingLanguage, ChallengeDifficulty } from '../../types';
import { getProblemData } from '../../data/codingProblems';
import { companionService } from '../../services/aiCompanionService';
import { ArrayVisualizer } from './ArrayVisualizer';
import { SyntaxRescue } from './SyntaxRescue';
import { TestRunnerWorkspace } from './TestRunnerWorkspace';
import {
  Brain,
  HelpCircle,
  Eye,
  Code,
  Coffee,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Coins,
} from 'lucide-react';

interface MessageLog {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  level?: number;
  type?: 'support' | 'question' | 'nudge' | 'pattern' | 'pseudocode' | 'implementation' | 'solution' | 'celebration';
}

export const CodingFlow: React.FC = () => {
  const {
    problem,
    codingState,
    hintLevel,
    hintsUsed,
    language,
    setProblem,
    setCodingState,
    setHintLevel,
    setHintsUsed,
    setLanguage,
    setPillar,
    addActivity,
    isChallengeCompleted,
  } = useNudge();

  const [problemInput, setProblemInput] = useState(problem || '209');
  const [selectedState, setSelectedState] = useState<CodingProblemState>(
    codingState || "I'm completely lost"
  );
  // Default to false so the user can enter their question number and choose their state first
  const [sessionActive, setSessionActive] = useState(false);

  // Toggles for optional panels
  const [showTestRunner, setShowTestRunner] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showSyntaxRescue, setShowSyntaxRescue] = useState(false);
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingGemma, setLoadingGemma] = useState(false);

  // Active problem data
  const problemData = getProblemData(problem || problemInput);

  // Initial conversation builder
  const [messages, setMessages] = useState<MessageLog[]>(() => {
    return [
      {
        id: 'msg-0',
        sender: 'buddy',
        level: 0,
        type: 'support',
        text: problemData.levels.level0,
      },
      {
        id: 'msg-1',
        sender: 'buddy',
        level: 1,
        type: 'question',
        text: problemData.levels.level1,
      },
    ];
  });

  const stateOptions: CodingProblemState[] = [
    'I know the problem',
    'I have an idea',
    'I understand the logic',
    "I can't code it",
    "I'm completely lost",
  ];

  // Calculate live points based on difficulty and hints used:
  // 0 hints: 100%, 1: 90%, 2: 75%, 3: 60%, 4+: 40%, Solution: 0 pts
  const calculateCurrentPoints = () => {
    if (solutionRevealed || hintLevel >= 6) return 0;
    const base = problemData.basePoints;
    if (hintsUsed === 0) return base;
    if (hintsUsed === 1) return Math.max(1, Math.round(base * 0.9));
    if (hintsUsed === 2) return Math.max(1, Math.round(base * 0.75));
    if (hintsUsed === 3) return Math.max(1, Math.round(base * 0.6));
    return Math.max(1, Math.round(base * 0.4));
  };

  const currentRewardPoints = calculateCurrentPoints();

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalProblem = problemInput.trim() || 'LeetCode 209';
    setProblem(finalProblem);
    setCodingState(selectedState);
    setSessionActive(true);
    setHintLevel(1);
    setHintsUsed(0);
    setSolutionRevealed(false);
    setIsCompleted(false);

    const activeData = getProblemData(finalProblem);

    // Call Gemma brain for the initial challenge classification
    setLoadingGemma(true);
    let gemmaIntro = "Okay genius, show me something. Don't disappoint the evil algorithm department.";
    try {
      const gemmaDecision = await companionService.decide({
        problem: finalProblem,
        userState: selectedState,
        actionRequested: 'CHALLENGE',
        hintLevel: 1,
        hintsUsed: 1,
        language,
      });
      if (gemmaDecision?.message) {
        gemmaIntro = gemmaDecision.message;
      }
    } catch {
      // Graceful local fallback
    } finally {
      setLoadingGemma(false);
    }

    setMessages([
      {
        id: 'init-0',
        sender: 'buddy',
        level: 0,
        type: 'support',
        text: gemmaIntro,
      },
      {
        id: 'init-1',
        sender: 'buddy',
        level: 1,
        type: 'question',
        text: activeData.levels.level1,
      },
    ]);

    addActivity({
      type: 'think',
      title: `Challenged: ${finalProblem}`,
      detail: `Difficulty: ${activeData.challengeDifficulty} (+${activeData.basePoints} potential tokens)`,
    });
  };

  const handleGiveSmallerHint = async () => {
    const nextLevel = Math.min(hintLevel + 1, 5);
    const newHintsCount = hintsUsed + 1;
    setHintLevel(nextLevel);
    setHintsUsed(newHintsCount);

    setLoadingGemma(true);
    let gemmaComment = 'Okay okay. Tiny nudge.';
    try {
      const decision = await companionService.decide({
        problem: problemData.title,
        hintLevel: nextLevel,
        hintsUsed: newHintsCount,
        actionRequested: 'HINT',
        userState: codingState,
        language,
      });
      if (decision?.message) {
        gemmaComment = decision.message;
      }
    } catch {
      // fallback
    } finally {
      setLoadingGemma(false);
    }

    let content = '';
    let msgType: MessageLog['type'] = 'nudge';

    if (nextLevel === 2) {
      content = `${gemmaComment}\n\n${problemData.levels.level2}`;
      msgType = 'nudge';
    } else if (nextLevel === 3) {
      content = `${gemmaComment}\n\n${problemData.levels.level3}`;
      msgType = 'pattern';
    } else if (nextLevel === 4) {
      content = `${gemmaComment}\n\n${problemData.levels.level4}`;
      msgType = 'pseudocode';
    } else {
      content = `${gemmaComment}\n\n${problemData.levels.level5}`;
      msgType = 'implementation';
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'buddy',
        level: nextLevel,
        type: msgType,
        text: content,
      },
    ]);

    addActivity({
      type: 'think',
      title: `Unlocked Nudge Level ${nextLevel}`,
      detail: `${problemData.title} (Reward adjusted: ${calculateCurrentPoints()} pts)`,
    });
  };

  const handleAskQuestion = async () => {
    setLoadingGemma(true);
    let questionText = `Socratic Check: If you advance the pointer through ${problemData.title}, what condition guarantees you haven't skipped an optimal answer?`;
    try {
      const decision = await companionService.getQuestion(problemData.title, codingState);
      if (decision.nextQuestion) {
        questionText = `${decision.message}\n\n${decision.nextQuestion}`;
      } else if (decision.message) {
        questionText = decision.message;
      }
    } catch {
      // fallback
    } finally {
      setLoadingGemma(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-q-${Date.now()}`,
        sender: 'buddy',
        level: hintLevel,
        type: 'question',
        text: questionText,
      },
    ]);
  };

  const handleShowVisual = () => {
    setShowVisualizer(!showVisualizer);
    if (!showVisualizer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-v-${Date.now()}`,
          sender: 'buddy',
          level: hintLevel,
          type: 'nudge',
          text: "Here is the interactive pointer diagram below. Watch how the window expands and contracts!",
        },
      ]);
    }
  };

  const handleHelpMeCode = async () => {
    setShowSyntaxRescue(true);
    if (hintLevel < 4) {
      setHintLevel(4);
    }
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-c-${Date.now()}`,
        sender: 'buddy',
        level: 4,
        type: 'pseudocode',
        text: `Opening Syntax Rescue for ${language}. "You know the logic. ${language} is just having a personal vendetta against you."\n\n${problemData.levels.level4}`,
      },
    ]);
  };

  const handleNeedBreak = () => {
    // Zero guilt exit
    addActivity({
      type: 'reset',
      title: 'Stepped away from code (Zero Guilt)',
      detail: 'Paced out to Reset mode',
    });
    setPillar('reset');
  };

  const handleRevealSolution = () => {
    setSolutionRevealed(true);
    setShowSolutionConfirm(false);
    setHintLevel(6);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-sol-${Date.now()}`,
        sender: 'buddy',
        level: 6,
        type: 'solution',
        text: `Full solution unlocked upon explicit request:\n\n${problemData.levels.level6}\n\n[Note: 0 Canteen Tokens awarded for this run. Zero shame—study the invariants and conquer it next time!]`,
      },
    ]);
    addActivity({
      type: 'think',
      title: `Explicitly Requested Full Solution (Level 6)`,
      detail: `${problemData.title} • 0 arcade points awarded`,
    });
  };

  const handleCodeSuccess = async (pts: number) => {
    setIsCompleted(true);
    setLoadingGemma(true);
    let celeb = `SEE??? I TOLD YOU! All test cases passed cleanly. 😌 🦚 Krishna Approved! Earned +${pts} Points toward your SK Treat Fund!`;
    try {
      const decision = await companionService.getCelebration(problemData.title, hintsUsed);
      if (decision.message) {
        celeb = decision.message;
      }
    } catch {
      // fallback
    } finally {
      setLoadingGemma(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-celeb-${Date.now()}`,
        sender: 'buddy',
        level: hintLevel,
        type: 'celebration',
        text: celeb,
      },
    ]);
  };

  const getDifficultyBadge = (diff: ChallengeDifficulty) => {
    switch (diff) {
      case 'WARM_UP':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
      case 'BRAIN_STARTER':
        return 'border-sky-500/40 bg-sky-500/10 text-sky-400';
      case 'ACTUALLY_THINK':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
      case "DON'T_CRY":
        return 'border-orange-500/40 bg-orange-500/10 text-orange-400';
      case 'WHY_DID_I_DO_THIS':
        return 'border-rose-500/40 bg-rose-500/10 text-rose-400';
    }
  };

  // Dots for Level indicator ● ● ● ○ ○ ○
  const totalLevels = 6;
  const dots = Array.from({ length: totalLevels }, (_, i) => i + 1 <= hintLevel);

  const getWarmthMessage = (lvl: number) => {
    if (lvl === 0) return 'Support active • Warming up';
    if (lvl === 1) return 'Deep in thought • Looking for invariants';
    if (lvl === 2) return "You're getting warmer.";
    if (lvl === 3) return 'Pattern identified • Connecting dots!';
    if (lvl === 4) return 'Structure locked in • Pseudocode ready';
    if (lvl === 5) return 'Ready to implement • Watch the edge cases!';
    return 'Full reference unlocked (0 pts)';
  };

  return (
    <div className="space-y-6">
      {/* Step 1 & 2: "What are we fighting today?" (Setup card) */}
      {!sessionActive ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Brain className="h-3.5 w-3.5" />
                <span>Gemma Brain Active • Nudge, Don&apos;t Replace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                What are we fighting today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Enter a LeetCode question number or problem name. Then tell me where your head is at.
              </p>
            </div>

            <form onSubmit={handleStartSession} className="space-y-6">
              {/* Problem Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  LeetCode Question Number or Name:
                </label>
                <input
                  type="text"
                  value={problemInput}
                  onChange={(e) => setProblemInput(e.target.value)}
                  placeholder="e.g. 209, 3, 1, 15, 42, 102, 322, 560..."
                  className="w-full rounded-2xl border-2 border-indigo-500/40 bg-slate-950 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
                  autoFocus
                />

                {/* Quick Question Number presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Quick Select Question Number:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { num: '209', title: '209: Min Size Subarray' },
                      { num: '3', title: '3: Longest Substring' },
                      { num: '1', title: '1: Two Sum' },
                      { num: '15', title: '15: 3Sum' },
                      { num: '42', title: '42: Trapping Rain' },
                      { num: '102', title: '102: Level Order' },
                      { num: '322', title: '322: Coin Change' },
                      { num: '560', title: '560: Subarray Sum' },
                    ].map((p) => (
                      <button
                        key={p.num}
                        type="button"
                        onClick={() => setProblemInput(p.num)}
                        className={`text-xs rounded-xl border px-3 py-1 font-bold transition-all cursor-pointer ${
                          problemInput === p.num || problemInput === p.title
                            ? 'border-indigo-400 bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        #{p.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: User's Current State Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Where is your head at right now? (Choose your state):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {stateOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedState(st)}
                      className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                        selectedState === st
                          ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-600/10'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language selection & Submit */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Coding in:</span>
                  <div className="flex gap-1">
                    {(['Java', 'Python', 'C++', 'JavaScript'] as CodingLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          language === lang
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingGemma}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <span>{loadingGemma ? 'Consulting Gemma...' : 'Start Nudge Flow'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Active Coding UI Flow */
        <div className="space-y-6">
          {/* Top Panel: Problem Info, Challenge Tier & Reward Tokens */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              {/* Problem info & Difficulty */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyBadge(problemData.challengeDifficulty)}`}>
                    {problemData.challengeDifficulty}
                  </span>
                  <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                    {problemData.difficulty}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Language: <strong className="text-amber-300">{language}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {problemData.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSessionActive(false)}
                    className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    🔄 Switch Question #
                  </button>
                </div>
              </div>

              {/* Reward Tokens & Nudge Level Progress */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Token reward pool */}
                <div className="bg-slate-950/80 border border-amber-500/30 p-2.5 px-3.5 rounded-xl flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Clear Bounty</div>
                    <div className="text-sm font-black text-amber-300 font-mono">
                      {currentRewardPoints} pts
                      {solutionRevealed && <span className="text-[10px] text-rose-400 ml-1">(Solution revealed)</span>}
                    </div>
                  </div>
                </div>

                {/* Level indicator */}
                <div className="flex flex-col items-start lg:items-end gap-1 bg-slate-950/70 p-2.5 px-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      NUDGE LEVEL
                    </span>
                    <div className="flex items-center gap-1 text-indigo-400 text-xs">
                      {dots.map((filled, idx) => (
                        <span
                          key={idx}
                          className={
                            filled
                              ? 'text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] font-bold'
                              : 'text-slate-700'
                          }
                        >
                          {filled ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-white ml-1">
                      {hintLevel}/6
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-300 font-medium italic">
                    &ldquo;{getWarmthMessage(hintLevel)}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Current State Pill & Problem Snippet */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current mindset:</span>
                <span className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-200 font-semibold">
                  {codingState}
                </span>
                <button
                  onClick={() => setSessionActive(false)}
                  className="text-indigo-400 hover:text-indigo-300 underline ml-2"
                >
                  Change problem
                </button>
              </div>

              <div className="text-slate-400">
                Example: <code className="bg-slate-950 px-2 py-0.5 rounded text-slate-300">{problemData.example}</code>
              </div>
            </div>
          </div>

          {/* Conversation Panel: Guided Nudge Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Gemma Companion Stream
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {loadingGemma && (
                  <span className="text-[11px] text-indigo-400 animate-pulse flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-spin" />
                    <span>Gemma thinking...</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  #Best Buddy Ever
                </span>
              </div>
            </div>

            {/* Stream Messages */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs sm:text-sm leading-relaxed p-4 rounded-xl border transition-all ${
                    msg.type === 'celebration'
                      ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200 shadow-md shadow-emerald-500/10'
                      : msg.type === 'solution'
                      ? 'border-rose-500/40 bg-slate-950 font-mono text-slate-300'
                      : msg.type === 'pseudocode'
                      ? 'border-amber-500/30 bg-slate-950 font-mono text-amber-200'
                      : msg.type === 'question'
                      ? 'border-indigo-500/30 bg-indigo-950/20 text-indigo-100'
                      : 'border-slate-800/80 bg-slate-950/50 text-slate-200'
                  }`}
                >
                  <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs select-none">
                    {msg.type === 'celebration'
                      ? '🏆'
                      : msg.type === 'solution'
                      ? '💡'
                      : msg.type === 'question'
                      ? '❓'
                      : 'PM'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Nudge Veer (Gemma)</span>
                      {msg.level !== undefined && (
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-indigo-300">
                          Level {msg.level}
                        </span>
                      )}
                      {msg.type && (
                        <span className="capitalize text-slate-500">• {msg.type}</span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Required Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleGiveSmallerHint}
                disabled={hintLevel >= 5 || loadingGemma}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Give me a smaller hint</span>
              </button>

              <button
                onClick={handleAskQuestion}
                disabled={loadingGemma}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
              >
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                <span>Ask me a question</span>
              </button>

              <button
                onClick={handleShowVisual}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  showVisualizer
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-sky-400" />
                <span>{showVisualizer ? 'Hide Visual' : 'Show me visually'}</span>
              </button>

              <button
                onClick={handleHelpMeCode}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
              >
                <Code className="h-3.5 w-3.5 text-amber-400" />
                <span>I know the logic, help me code</span>
              </button>

              {/* Solved Completion Code Runner Toggle */}
              <button
                onClick={() => setShowTestRunner(!showTestRunner)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isCompleted || isChallengeCompleted(problemData.id)
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-emerald-600/20'
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>
                  {isChallengeCompleted(problemData.id)
                    ? 'Verified Solution ✅ (Toggle Runner)'
                    : `Run Tests & Submit (+${currentRewardPoints} pts)`}
                </span>
              </button>

              {/* Zero Guilt Break Button */}
              <button
                onClick={handleNeedBreak}
                className="ml-auto flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-300 transition-all active:scale-95"
              >
                <Coffee className="h-3.5 w-3.5 text-rose-400" />
                <span>I need a break</span>
              </button>
            </div>

            {/* Level 6: Solution request safeguard */}
            {!solutionRevealed && hintLevel >= 4 && (
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/40">
                <span>Completely stuck after trying the pseudocode?</span>
                {!showSolutionConfirm ? (
                  <button
                    onClick={() => setShowSolutionConfirm(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Request Level 6: Full Solution Code (0 arcade pts)
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-amber-300">
                      Requesting full code will set challenge completed = false. Still learning!
                    </span>
                    <button
                      onClick={handleRevealSolution}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
                    >
                      Yes, reveal full code
                    </button>
                    <button
                      onClick={() => setShowSolutionConfirm(false)}
                      className="text-[11px] text-slate-400 hover:text-white ml-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Verification & Test Runner Workspace */}
          {showTestRunner && (
            <TestRunnerWorkspace
              problemData={problemData}
              hintsUsed={hintsUsed}
              solutionRevealed={solutionRevealed}
              onSuccess={handleCodeSuccess}
            />
          )}

          {/* Optional Interactive Visualizer Area */}
          {showVisualizer && (
            <ArrayVisualizer
              array={problemData.visualization?.array}
              target={problemData.visualization?.target}
            />
          )}

          {/* Syntax Rescue Area */}
          {showSyntaxRescue && (
            <SyntaxRescue
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          )}
        </div>
      )}
    </div>
  );
};
