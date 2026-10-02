import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const TodayChallengeCard3D: React.FC = () => {
  const { problem, setPillar, setProblem, isChallengeCompleted } = useNudge();

  const currentProb = problem || 'LeetCode 209: Minimum Size Subarray Sum';
  const solved = isChallengeCompleted('leetcode-209');

  const handleAccept = () => {
    setProblem('LeetCode 209: Minimum Size Subarray Sum');
    setPillar('think');
  };

  return (
    <Card3D maxTilt={6} className="w-full">
      <div className="relative rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/50 p-6 sm:p-7 shadow-2xl shadow-indigo-500/15 overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Header pill */}
            <div className="flex items-center gap-2.5">
              <span className="text-xl">😈</span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-300">
                TODAY&apos;S PROBLEM
              </span>
              {solved ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>SOLVED</span>
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                  Active Challenge
                </span>
              )}
            </div>

            {/* Problem Title & Category */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Sliding Window
              </h2>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                {currentProb}
              </p>
            </div>

            {/* Difficulty & Points Bounty */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                <span>Difficulty:</span>
                <span className="font-black uppercase tracking-wider">ACTUALLY THINK</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>+20 points</span>
              </div>
            </div>

            {/* Buddy Quote */}
            <p className="text-xs sm:text-sm text-slate-300 italic font-mono pt-1">
              &ldquo;Think before you peek.&rdquo;
            </p>
          </div>

          {/* Action 3D Button */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
            <button
              onClick={handleAccept}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-4 text-sm font-black text-white shadow-[0_6px_0_theme(colors.indigo.800)] hover:shadow-[0_4px_0_theme(colors.indigo.800)] active:shadow-none active:translate-y-1.5 transition-all"
            >
              <span>{solved ? 'REVIEW CODE & TESTS' : 'ACCEPT CHALLENGE'}</span>
              <ArrowRight className="h-4 w-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right font-mono">
              Nudge Veer Companion Flow
            </span>
          </div>
        </div>
      </div>
    </Card3D>
  );
};
