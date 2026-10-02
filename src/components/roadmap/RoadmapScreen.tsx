import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import type {
  RoadmapPhase,
  RoadmapTopic,
  ClarificationQuestion,
  RoadmapAdaptationSuggestion,
} from '../../types';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  Brain,
  Gamepad2,
  RefreshCw,
  Flame,
  Clock,
  Target,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
  PlusCircle,
  FileText,
} from 'lucide-react';

const PERSONAL_NOTES = [
  'Alright. You bring the chaos. I’ll bring the roadmap.',
  'One step at a time, genius. 😭',
  'Okay Veer, apparently we’re doing this.',
  '😈 You asked for a plan. Don’t blame me when I make you follow it.',
  'Yoo PM, let’s show LeetCode we are talented enough to break the code.',
];

export const RoadmapScreen: React.FC = () => {
  const {
    activeRoadmap,
    roadmapProgress,
    setActiveRoadmap,
    toggleRoadmapTask,
    startTopicInThink,
    setPillar,
  } = useNudge();

  // Mode: 'create' | 'questions' | 'view'
  const [viewMode, setViewMode] = useState<'create' | 'questions' | 'view'>(() => {
    return activeRoadmap ? 'view' : 'create';
  });

  // Empty entry inputs
  const [topicInput, setTopicInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');

  // Clarification questions
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 4 or 5 targeted questions including time commitment
  const [questions] = useState<ClarificationQuestion[]>([
    {
      id: 'why',
      category: 'why',
      question: '1. What is the main finish line for this topic?',
      placeholder: 'e.g. Product company interviews, campus placements, college exam, personal project...',
      quickOptions: ['Job / Campus Placement', 'Product Company Interviews', 'Building Cool Projects', 'Exams & Bragging Rights'],
    },
    {
      id: 'level',
      category: 'level',
      question: '2. What is your current comfort level with this topic?',
      placeholder: 'Never touched it, know basic syntax, or solved a few problems?',
      quickOptions: ['Absolute Beginner', 'Know Basics / Syntax', 'Intermediate (done some problems)'],
    },
    {
      id: 'time',
      category: 'time',
      question: '3. How much time can you realistically commit per day?',
      placeholder: 'Be honest Veer, no 12-hour fantasy schedules.',
      quickOptions: ['45 mins - 1 hr/day', '1.5 - 2 hrs/day', '3+ hrs intense', 'Weekends only'],
    },
    {
      id: 'deadline',
      category: 'deadline',
      question: '4. What is your target timeline or deadline?',
      placeholder: 'e.g. 3 weeks sprint, 2 months, 4 months...',
      quickOptions: ['3-4 Weeks (Sprint)', '2 Months (Standard)', '3-4 Months (Mastery)', 'No rush'],
      optional: true,
    },
    {
      id: 'language',
      category: 'language',
      question: '5. Preferred programming language or tech stack?',
      placeholder: 'Java, Python, C++, JavaScript...',
      quickOptions: ['Java', 'Python', 'C++', 'JavaScript'],
      optional: true,
    },
  ]);

  const [answers, setAnswers] = useState<Record<string, string>>({
    why: '',
    level: '',
    time: '1.5 - 2 hrs/day',
    deadline: '2 Months',
    language: 'Java',
  });

  // UI state
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [adaptationSuggestion, setAdaptationSuggestion] = useState<RoadmapAdaptationSuggestion | null>(null);
  const [randomNote] = useState(
    () => PERSONAL_NOTES[Math.floor(Math.random() * PERSONAL_NOTES.length)]
  );

  // Step 1: User enters topic + details -> proceed to questions
  const handleProceedToQuestions = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;
    setErrorMsg(null);
    setViewMode('questions');
  };

  // Step 2: Generate roadmap using Gemma
  const handleBuildRoadmap = async (skipQuestions = false) => {
    setErrorMsg(null);
    setIsGenerating(true);

    const combinedGoal = detailsInput.trim()
      ? `${topicInput.trim()} - ${detailsInput.trim()}`
      : topicInput.trim();

    const payload = {
      goal: combinedGoal,
      why: skipQuestions ? 'Mastery and interview preparation' : answers.why || 'Interviews and problem solving',
      level: skipQuestions ? 'Know basics' : answers.level || 'Know basics',
      timeCommitment: skipQuestions ? '1-2 hrs / day' : answers.time || '1.5 hrs / day',
      deadline: skipQuestions ? '2 Months' : answers.deadline || '2 Months',
      language: answers.language || 'Java',
      knownTopics: detailsInput || 'Core syntax',
    };

    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();
      if (data.plan) {
        setActiveRoadmap(data.plan);
        setViewMode('view');
      } else {
        setErrorMsg('Okay... the AI has temporarily gone to get chai. ☕ Try again in a moment.');
      }
    } catch {
      setErrorMsg('Okay... the AI has temporarily gone to get chai. ☕ Try again in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartFresh = () => {
    setTopicInput('');
    setDetailsInput('');
    setActiveRoadmap(null);
    setViewMode('create');
  };

  // Adaptive roadmap trigger
  const handleAdaptRoadmap = async () => {
    if (!activeRoadmap) return;
    setIsAdapting(true);
    setAdaptationSuggestion(null);

    try {
      const res = await fetch('/api/roadmap/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: activeRoadmap,
          progress: roadmapProgress,
          recentStruggleCount: 0,
        }),
      });

      if (res.ok) {
        const suggestion = await res.json();
        setAdaptationSuggestion(suggestion);
      }
    } catch {
      // ignore
    } finally {
      setIsAdapting(false);
    }
  };

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const completedTasksList = roadmapProgress?.completedTasks || [];
  const completedTopicsList = roadmapProgress?.completedTopics || [];

  const totalTasksCount =
    activeRoadmap?.phases.reduce(
      (acc, p) => acc + p.topics.reduce((tAcc, t) => tAcc + t.tasks.length, 0),
      0
    ) || 0;
  const completedTasksCount = completedTasksList.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 shadow-sm backdrop-blur-md mb-3">
          <Compass className="h-3.5 w-3.5 text-sky-400 animate-spin-slow" />
          <span>Long-Term Planning Brain</span>
          <span className="text-sky-400">•</span>
          <span>NUDGE, DON&apos;T REPLACE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
          <span>🗺️ GAME PLAN</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          &ldquo;Give me the goal. We&apos;ll figure out the path.&rdquo;
        </p>

        {/* Best Friend Personal Note */}
        <div className="mt-2 inline-block rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-1 text-xs font-medium text-amber-300">
          💬 {randomNote}
        </div>
      </div>

      {/* TOP NAVIGATION / TOGGLE BAR */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'create' || viewMode === 'questions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Game Plan</span>
          </button>

          {activeRoadmap && (
            <button
              onClick={() => setViewMode('view')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'view'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Current Plan ({activeRoadmap.phases.length} Phases)</span>
            </button>
          )}
        </div>

        {activeRoadmap && (
          <button
            onClick={handleStartFresh}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear / Start Fresh
          </button>
        )}
      </div>

      {/* STEP 1: EMPTY TEXTBOX TO ENTER TOPIC & DETAILS */}
      {viewMode === 'create' && (
        <Card3D depth="lg" className="rounded-3xl border-2 border-indigo-500/30 bg-slate-900/85 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                Step 1 of 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Enter Topic & Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Type what you want to learn or build. Gemma will ask 4 or 5 targeted questions (including your daily time) and construct your structured roadmap.
              </p>
            </div>

            <form onSubmit={handleProceedToQuestions} className="space-y-5">
              {/* Topic Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Topic or Goal:
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Sliding Window, Dynamic Programming, Java OOPs, Full-Stack React, System Design..."
                  className="w-full rounded-2xl border-2 border-indigo-500/40 bg-slate-950/80 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
                  autoFocus
                />
              </div>

              {/* Details Textbox */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  A Few Details About It:
                </label>
                <textarea
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Add any specific context: e.g. 'I know basic syntax but I struggle with window shrinking and test cases' or 'Preparing for Google interview in 2 months'..."
                  rows={4}
                  className="w-full rounded-2xl border-2 border-slate-700 bg-slate-950/80 p-4 text-sm text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>

              {/* Quick suggestions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Quick Ideas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Sliding Window & Two Pointers',
                    'Dynamic Programming from Scratch',
                    'Java Backend & Spring Boot',
                    'Binary Trees & Graphs for Placements',
                    'React & Next.js Full Stack Project',
                  ].map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => {
                        setTopicInput(idea);
                        setDetailsInput('Want a comprehensive structured roadmap from foundations to interview mastery.');
                      }}
                      className="rounded-xl border border-slate-800 bg-slate-800/50 px-3 py-1 text-xs text-slate-300 hover:text-white hover:border-indigo-400 transition-all"
                    >
                      + {idea}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={!topicInput.trim()}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 py-3.5 px-6 text-sm font-black text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>CONTINUE TO 4 QUESTIONS</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuildRoadmap(true)}
                  disabled={!topicInput.trim() || isGenerating}
                  className="w-full sm:w-auto rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 px-5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Skip & Build Immediately
                </button>
              </div>
            </form>
          </div>
        </Card3D>
      )}

      {/* STEP 2: 4-5 QUESTIONS (INCLUDING TIME COMMITMENT) */}
      {viewMode === 'questions' && (
        <Card3D depth="lg" className="rounded-3xl border-2 border-sky-500/40 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                  Step 2 of 2: Gemma Coordinates
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Setting Up: &ldquo;{topicInput}&rdquo;
                </h2>
              </div>

              <button
                onClick={() => setViewMode('create')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>

            <p className="text-xs sm:text-sm text-sky-200 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-3">
              Gemma needs a few quick details—especially your <strong>available time per day</strong>—so we build a realistic plan instead of a fantasy schedule. You can also skip if you prefer defaults!
            </p>

            {/* Questions list */}
            <div className="space-y-5">
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white">
                      {q.question}
                    </label>
                    {q.optional && <span className="text-[10px] text-slate-500">Optional</span>}
                  </div>

                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    placeholder={q.placeholder}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />

                  {q.quickOptions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.quickOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                            answers[q.id] === opt
                              ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30'
                              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Final Generation Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => handleBuildRoadmap(false)}
                disabled={isGenerating}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 py-3.5 px-6 text-sm font-black text-slate-950 shadow-lg shadow-sky-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Gemma Brain Is Structuring Your Roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>✨ BUILD MY ROADMAP USING GEMMA</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleBuildRoadmap(true)}
                disabled={isGenerating}
                className="w-full sm:w-auto rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 px-5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                Skip & Generate
              </button>
            </div>
          </div>
        </Card3D>
      )}

      {/* STEP 3: RENDER THE STRUCTURED ROADMAP */}
      {viewMode === 'view' && activeRoadmap && (
        <div className="space-y-8">
          {/* Top Banner with Stats & Meta */}
          <Card3D depth="md" className="rounded-3xl border-2 border-indigo-500/30 bg-slate-900/85 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-2 py-0.5 text-xs font-black text-indigo-300">
                    DIFFICULTY: {activeRoadmap.difficulty}
                  </span>
                  <span className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-xs font-bold text-sky-300 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeRoadmap.estimatedDuration}
                  </span>
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <Target className="h-3 w-3" /> {activeRoadmap.dailyCommitment}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {activeRoadmap.goal}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {activeRoadmap.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAdaptRoadmap}
                    disabled={isAdapting}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3.5 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-600/30 hover:text-white active:scale-95 transition-all cursor-pointer"
                  >
                    <Sliders className={`h-3.5 w-3.5 ${isAdapting ? 'animate-spin' : ''}`} />
                    <span>{isAdapting ? 'Analyzing...' : '🤖 Adapt Roadmap'}</span>
                  </button>

                  <button
                    onClick={handleStartFresh}
                    className="rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    New Goal
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar (Tasks completed, NO streaks, NO confidence) */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>
                  Roadmap Progress:{' '}
                  <strong className="text-white font-mono">{completedTasksCount}</strong> of{' '}
                  <strong className="text-white font-mono">{totalTasksCount}</strong> tasks checked off ({progressPercent}%)
                </span>
                <span>
                  Phases Completed:{' '}
                  <strong className="text-indigo-300 font-mono">
                    {roadmapProgress?.completedPhases.length || 0} / {activeRoadmap.phases.length}
                  </strong>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </Card3D>

          {/* Adaptive Suggestion Banner (if triggered) */}
          {adaptationSuggestion && (
            <Card3D depth="sm" className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 backdrop-blur-md shadow-lg animate-in fade-in duration-300">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-xl font-bold">
                  🤖
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/30 px-2 py-0.5 text-[11px] font-black uppercase text-amber-200">
                      Gemma Adaptive Analysis: {adaptationSuggestion.action}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">
                    {adaptationSuggestion.title}
                  </h4>
                  <p className="text-xs text-amber-100/90 font-medium">
                    &ldquo;{adaptationSuggestion.reason}&rdquo;
                  </p>
                  <p className="text-xs text-slate-300">
                    {adaptationSuggestion.description}
                  </p>
                  {adaptationSuggestion.suggestedTasks && (
                    <ul className="mt-2 space-y-1 text-xs text-amber-200">
                      {adaptationSuggestion.suggestedTasks.map((st, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-400 font-bold">•</span> {st}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setAdaptationSuggestion(null)}
                      className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
                    >
                      Accept Adjustment
                    </button>
                    <button
                      onClick={() => setAdaptationSuggestion(null)}
                      className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-bold text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
                    >
                      Keep Current Plan
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          )}

          {/* VISUAL PROGRESSION TIMELINE */}
          <div className="relative space-y-8">
            {/* Timeline center line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-indigo-500 via-sky-500 to-emerald-500 hidden sm:block opacity-30" />

            {/* START Marker */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-500/30 z-10">
                START
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">
                Kickoff: Foundation Invariants
              </span>
            </div>

            {/* PHASES */}
            {activeRoadmap.phases.map((phase: RoadmapPhase, phaseIdx: number) => {
              const isPhaseCompleted = (roadmapProgress?.completedPhases || []).includes(phase.id);
              const isLastPhase = phaseIdx === activeRoadmap.phases.length - 1;

              return (
                <div key={phase.id} className="relative sm:pl-16">
                  {/* Step Connector Icon */}
                  <div className="hidden sm:flex absolute left-3.5 top-6 h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-indigo-400 bg-slate-950 text-indigo-400 z-10 text-xs font-bold">
                    {isPhaseCompleted ? '✓' : phaseIdx + 1}
                  </div>

                  <Card3D depth="md" className={`rounded-3xl border-2 p-6 transition-all ${
                    isPhaseCompleted
                      ? 'border-emerald-500/40 bg-slate-900/70 shadow-emerald-500/10'
                      : isLastPhase
                      ? 'border-amber-500/40 bg-gradient-to-br from-slate-900/90 to-amber-950/20 shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-900/70'
                  }`}>
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            isLastPhase
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {isLastPhase ? '👑 FINAL MISSION' : `PHASE ${phaseIdx + 1}`}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {phase.estimatedDuration}
                          </span>
                          {isPhaseCompleted && (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                          {phase.title}
                        </h3>
                        {phase.description && (
                          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                            {phase.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Topics inside Phase */}
                    <div className="mt-5 space-y-4">
                      {phase.topics.map((topic: RoadmapTopic) => {
                        const isExpanded = expandedTopics[topic.id] ?? true;
                        const isTopicDone = completedTopicsList.includes(topic.id);

                        return (
                          <div
                            key={topic.id}
                            className={`rounded-2xl border p-4 transition-all ${
                              isTopicDone
                                ? 'border-emerald-500/30 bg-emerald-950/15'
                                : 'border-slate-800 bg-slate-950/60'
                            }`}
                          >
                            {/* Topic Top Row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-base sm:text-lg font-black text-white">
                                    {topic.title}
                                  </h4>
                                  {isTopicDone && (
                                    <span className="rounded bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                                      DONE
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400">
                                  {topic.description}
                                </p>
                              </div>

                              <button
                                onClick={() => toggleTopicExpand(topic.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>

                            {/* Expandable Topic Body */}
                            {isExpanded && (
                              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                                {/* Tasks Checklist */}
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                    Actionable Tasks (Click to check off):
                                  </span>
                                  <div className="space-y-1.5">
                                    {topic.tasks.map((taskText, tIdx) => {
                                      const taskKey = `${topic.id}:${tIdx}`;
                                      const isChecked = completedTasksList.includes(taskKey);

                                      return (
                                        <button
                                          key={tIdx}
                                          onClick={() => toggleRoadmapTask(topic.id, tIdx)}
                                          className={`w-full flex items-start gap-2.5 rounded-xl p-2 text-left text-xs transition-all cursor-pointer ${
                                            isChecked
                                              ? 'bg-emerald-500/10 text-emerald-200 line-through'
                                              : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/80'
                                          }`}
                                        >
                                          {isChecked ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                                          ) : (
                                            <Circle className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                                          )}
                                          <span className="flex-1 leading-snug">{taskText}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Practice Tasks */}
                                {topic.practiceTasks && topic.practiceTasks.length > 0 && (
                                  <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block mb-1">
                                      ⚔️ Practice Challenges:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {topic.practiceTasks.map((pt, pIdx) => (
                                        <span
                                          key={pIdx}
                                          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
                                        >
                                          {pt}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Dependencies Note */}
                                {topic.dependencies && topic.dependencies.length > 0 && (
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Prerequisite: {topic.dependencies.join(', ')}</span>
                                  </div>
                                )}

                                {/* Direct Connection to Existing App Pillars */}
                                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() => startTopicInThink(topic.title, phase.title)}
                                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <Brain className="h-3.5 w-3.5" />
                                    <span>🧠 START IN THINK</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      startTopicInThink(topic.title, phase.title);
                                      setPillar('think');
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <Flame className="h-3.5 w-3.5" />
                                    <span>😈 CHALLENGE</span>
                                  </button>

                                  <button
                                    onClick={() => setPillar('play')}
                                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <Gamepad2 className="h-3.5 w-3.5" />
                                    <span>🎮 PLAY MINI-GAME</span>
                                  </button>

                                  <button
                                    onClick={() => setPillar('reset')}
                                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    <span>🍃 RESET</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card3D>
                </div>
              );
            })}

            {/* FINAL MISSION Boss Icon */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white font-black text-xl shadow-lg shadow-amber-500/30 z-10">
                👑
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 block">
                  GOAL ACCOMPLISHED & TREAT CLAIM
                </span>
                <span className="text-xs text-slate-400">
                  Celebrate, collect your treat voucher from SK, and enjoy bragging rights!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
