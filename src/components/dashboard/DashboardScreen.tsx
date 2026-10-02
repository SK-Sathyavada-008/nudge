import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { ArcadeLocker } from './ArcadeLocker';
import { TodayChallengeCard3D } from './TodayChallengeCard3D';
import { StatsOverview } from './StatsOverview';
import { MoodSelector } from './MoodSelector';
import { ActivityFeed } from './ActivityFeed';
import { PersonalMessage } from '../common/PersonalMessage';
import { TinyWinModal } from '../common/TinyWinModal';
import { Card3D } from '../common/Card3D';
import { Code, Flame, Trophy, ArrowRight, Sparkles, MessageSquareHeart, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardScreen: React.FC = () => {
  const { setPillar, addActivity, incrementTinyWin, problem, activeRoadmap } = useNudge();
  const [tinyWinOpen, setTinyWinOpen] = useState(false);

  const handleContinueCoding = () => {
    addActivity({
      type: 'think',
      title: 'Resumed Coding from Dashboard',
      detail: 'Entering THINK pillar',
    });
    setPillar('think');
  };

  const handleNeedReset = () => {
    addActivity({
      type: 'reset',
      title: 'Requested Mental Reset from Dashboard',
      detail: 'Entering RESET pillar',
    });
    setPillar('reset');
  };

  const handleTinyWin = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#38bdf8'],
    });
    incrementTinyWin();
    addActivity({
      type: 'tiny-win',
      title: 'Triggered Tiny Win from Quick Actions',
    });
    setTinyWinOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Veer&apos;s Mission Control
            </h1>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              #Best Buddy Ever
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Daily pulse, proactive nudges, and interview momentum.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setPillar('gameplan')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>🗺️ Game Plan</span>
          </button>

          <button
            onClick={handleContinueCoding}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <Code className="h-4 w-4" />
            <span>Continue Coding</span>
          </button>

          <button
            onClick={handleNeedReset}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2.5 text-xs font-bold text-emerald-300 transition-all active:scale-95 cursor-pointer"
          >
            <Flame className="h-4 w-4 text-emerald-400" />
            <span>I Need A Reset</span>
          </button>

          <button
            onClick={handleTinyWin}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2.5 text-xs font-bold text-amber-300 transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Give Me A Tiny Win</span>
          </button>
        </div>
      </div>

      {/* Stats Counters Overview */}
      <StatsOverview />

      {/* 🗺️ GAME PLAN Banner */}
      <Card3D depth="md" className="rounded-3xl border-2 border-sky-500/40 bg-gradient-to-r from-slate-900 via-sky-950/20 to-slate-900 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300 text-2xl shadow-inner border border-sky-500/30">
              🗺️
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  {activeRoadmap ? 'ACTIVE GAME PLAN' : '🗺️ GAME PLAN'}
                </span>
                <span className="rounded bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                  NUDGE, DON&apos;T REPLACE
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-white">
                {activeRoadmap ? activeRoadmap.goal : 'SO... WHAT ARE WE TRYING TO DO?'}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                {activeRoadmap
                  ? `Structured in ${activeRoadmap.phases.length} phases with step-by-step tasks, practice challenges, and direct Think mode links.`
                  : 'Give me any goal you want to accomplish. We’ll figure out the path with structured phases, checkpoints, and inside jokes.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPillar('gameplan')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-sky-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>{activeRoadmap ? 'OPEN GAME PLAN' : 'BUILD MY GAME PLAN'}</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>
        </div>
      </Card3D>

      {/* Prominent 3D Challenge Card */}
      <TodayChallengeCard3D />

      {/* Mood Selector */}
      <MoodSelector />

      {/* College Arcade & Canteen Locker */}
      <ArcadeLocker />

      {/* Dedicated Section for Motivation Messages */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sky-400">
            <MessageSquareHeart className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Messages I Wrote For You (When You Need Motivation)
            </span>
          </div>
          <span className="text-xs text-slate-400">
            #Best Buddy Ever
          </span>
        </div>
        <PersonalMessage initialCategory="motivation" />
      </div>

      {/* Activity Logs & Quick Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Today's Recommended Action Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/90 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Current Target</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {problem || 'LeetCode 209: Minimum Size Subarray Sum'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Remember: Nudge Veer is designed never to replace your thinking. Use the progressive hint ladder (Level 0 through 6) to discover the intuition yourself.
            </p>
          </div>

          <button
            onClick={() => setPillar('think')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 p-3 text-xs font-bold text-white transition-all border border-slate-700 shadow-sm"
          >
            <span>Open Coding Flow</span>
            <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Tiny Win Modal */}
      <TinyWinModal
        isOpen={tinyWinOpen}
        onClose={() => setTinyWinOpen(false)}
      />
    </div>
  );
};
