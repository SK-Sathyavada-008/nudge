import React, { useState, useEffect } from 'react';
import type { ProblemCodingData, TestCase } from '../../types';
import { useNudge } from '../../context/NudgeContext';
import { Play, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestRunnerWorkspaceProps {
  problemData: ProblemCodingData;
  hintsUsed: number;
  solutionRevealed: boolean;
  onSuccess?: (points: number) => void;
}

interface TestResult {
  test: TestCase;
  passed: boolean;
  actual: any;
  error?: string;
}

export const TestRunnerWorkspace: React.FC<TestRunnerWorkspaceProps> = ({
  problemData,
  hintsUsed,
  solutionRevealed,
  onSuccess,
}) => {
  const { completeChallenge, isChallengeCompleted } = useNudge();
  const [code, setCode] = useState<string>(problemData.defaultCode || '');
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | null>(null);

  // Sync when problem changes
  useEffect(() => {
    setCode(problemData.defaultCode || '');
    setResults(null);
    setSubmissionFeedback(null);
    setFeedbackType(null);
  }, [problemData.id, problemData.defaultCode]);

  const testCases = problemData.testCases || [];
  const functionName = problemData.functionName || 'solution';
  const alreadyCompleted = isChallengeCompleted(problemData.id);

  // Exact Hint Penalty Formula:
  // 0 hints: 100%, 1: 90%, 2: 75%, 3: 60%, 4+: 40%, Solution: 0 pts
  const getProjectedPoints = () => {
    if (solutionRevealed) return 0;
    const base = problemData.basePoints;
    if (hintsUsed === 0) return base;
    if (hintsUsed === 1) return Math.max(1, Math.round(base * 0.9));
    if (hintsUsed === 2) return Math.max(1, Math.round(base * 0.75));
    if (hintsUsed === 3) return Math.max(1, Math.round(base * 0.6));
    return Math.max(1, Math.round(base * 0.4));
  };

  const projectedPoints = getProjectedPoints();

  const handleResetCode = () => {
    setCode(problemData.defaultCode || '');
    setResults(null);
    setSubmissionFeedback(null);
    setFeedbackType(null);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setSubmissionFeedback(null);
    setFeedbackType(null);

    setTimeout(() => {
      try {
        // Construct runner function that extracts user's function
        const wrappedCode = `
          ${code}
          if (typeof ${functionName} === 'function') {
            return ${functionName};
          }
          throw new Error("Function '${functionName}' is not defined. Please maintain the function signature.");
        `;
        const fnGetter = new Function(wrappedCode);
        const userFn = fnGetter();

        const testResults: TestResult[] = testCases.map((tc) => {
          try {
            // Deep clone input args to prevent mutations
            const clonedInputs = JSON.parse(JSON.stringify(tc.inputs));
            const actual = userFn(...clonedInputs);
            const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
            return { test: tc, passed, actual };
          } catch (err: any) {
            return {
              test: tc,
              passed: false,
              actual: null,
              error: err?.message || 'Execution Error',
            };
          }
        });

        setResults(testResults);
        const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

        if (allPassed) {
          // All test cases passed! Submit for genuine points
          const outcome = completeChallenge(
            problemData.id,
            problemData.title,
            problemData.challengeDifficulty,
            problemData.basePoints,
            hintsUsed,
            solutionRevealed
          );

          if (outcome.success) {
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#10b981', '#f59e0b', '#6366f1', '#ec4899'],
            });
            setFeedbackType('success');
            setSubmissionFeedback(
              `🎉 All ${testResults.length} test cases passed! Earned +${outcome.pointsEarned} Challenge Points for your SK Treat Fund! ${
                hintsUsed > 0 ? '😈 Nice try. The treat department has noticed the assistance.' : 'Flawless solve!'
              }`
            );
            if (onSuccess) onSuccess(outcome.pointsEarned);
          } else {
            setFeedbackType('warning');
            setSubmissionFeedback(outcome.message);
          }
        } else {
          setFeedbackType('error');
          setSubmissionFeedback(
            '😈 Nice attempt. Still no treat. One or more test cases failed! Check your loop invariants.'
          );
        }
      } catch (err: any) {
        setFeedbackType('error');
        setSubmissionFeedback(`😈 Syntax Error: ${err?.message || 'Code evaluation failed'}`);
        setResults(
          testCases.map((tc) => ({
            test: tc,
            passed: false,
            actual: null,
            error: err?.message || 'Syntax Error',
          }))
        );
      } finally {
        setIsRunning(false);
      }
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💻</span>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Code Verification & Test Runner
            </h3>
            {alreadyCompleted && (
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                Already Completed ✅
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Run real test cases to confirm success. Points are rewarded only for verified solutions.
          </p>
        </div>

        {/* Live Potential Points Badge */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {solutionRevealed
                ? '0 pts (Solution Opened)'
                : `+${projectedPoints} pts (${hintsUsed === 0 ? '100%' : hintsUsed === 1 ? '90%' : hintsUsed === 2 ? '75%' : hintsUsed === 3 ? '60%' : '40%'})`}
            </span>
          </div>

          <button
            onClick={handleResetCode}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            title="Reset code template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="relative rounded-xl border border-slate-800 bg-[#090d16] p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
          <span>JavaScript Runner • Function: <code className="text-indigo-300">{functionName}</code></span>
          <span className="text-[10px] text-slate-400 font-sans">Anti-Cheese Verification Active</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={11}
          spellCheck={false}
          className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-y leading-relaxed"
          placeholder="// Write your solution function here..."
        />
      </div>

      {/* Submission Feedback Alert */}
      {submissionFeedback && (
        <div
          className={`rounded-xl border p-3 text-xs leading-relaxed font-medium flex items-start gap-2.5 animate-in fade-in duration-200 ${
            feedbackType === 'success'
              ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
              : feedbackType === 'warning'
              ? 'border-amber-500/50 bg-amber-950/40 text-amber-200'
              : 'border-rose-500/50 bg-rose-950/40 text-rose-200'
          }`}
        >
          <span className="text-base shrink-0">
            {feedbackType === 'success' ? '🏆' : feedbackType === 'warning' ? '⚠️' : '😈'}
          </span>
          <div className="flex-1">{submissionFeedback}</div>
        </div>
      )}

      {/* Test Cases Results Panel */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Test Cases ({testCases.length})
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {testCases.map((tc, idx) => {
            const res = results ? results[idx] : null;
            return (
              <div
                key={tc.id}
                className={`rounded-xl border p-3 text-xs font-mono transition-all ${
                  res
                    ? res.passed
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800/60 font-sans">
                  <span className="font-semibold text-[11px] text-slate-300">{tc.name}</span>
                  {res && (
                    <span>
                      {res.passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 truncate">
                  Input: <span className="text-slate-300">{tc.inputDescription}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Expected: <span className="text-indigo-300 font-bold">{tc.expectedDescription}</span>
                </div>

                {res && !res.passed && (
                  <div className="text-[11px] text-rose-400 font-bold mt-1 pt-1 border-t border-rose-500/20">
                    Actual: {JSON.stringify(res.actual) || res.error || 'undefined'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Submit Button */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          😈 Treat department requires all test cases to pass.
        </span>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>{isRunning ? 'Verifying Code...' : 'Run Tests & Submit Solution'}</span>
        </button>
      </div>
    </div>
  );
};
