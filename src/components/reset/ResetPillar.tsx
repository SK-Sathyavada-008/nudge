import React, { useState, useEffect } from 'react';
import { BreathingExercise } from './BreathingExercise';
import { RealityCheckCards } from './RealityCheckCards';
import { PersonalMessage } from '../common/PersonalMessage';
import { useNudge } from '../../context/NudgeContext';
import { Wind, Coffee, ArrowLeft, HeartHandshake } from 'lucide-react';

export const ResetPillar: React.FC = () => {
  const { setPillar, addActivity } = useNudge();
  const [breakTimer, setBreakTimer] = useState<number | null>(null);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(300); // 5 min default

  useEffect(() => {
    if (breakTimer === null) return;

    const timer = setInterval(() => {
      setBreakSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBreakTimer(null);
          addActivity({
            type: 'reset',
            title: 'Completed 5-Minute Brain Cool-down Walk',
            detail: 'Returned refreshed',
          });
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breakTimer, addActivity]);

  const handleStartBreak = (minutes: number) => {
    setBreakSecondsLeft(minutes * 60);
    setBreakTimer(minutes);
    addActivity({
      type: 'reset',
      title: `Started ${minutes}-minute Brain Cool-down`,
      detail: 'Stepped away from screen',
    });
  };

  const handleCancelBreak = () => {
    setBreakTimer(null);
    setBreakSecondsLeft(300);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Wind className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                RESET Pillar
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                De-stress, nervous system regulation, and anti-burnout protocols
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPillar('home')}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Break countdown banner if active */}
      {breakTimer !== null && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Coffee className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Walk Away Protocol Active!
              </h4>
              <p className="text-xs text-emerald-200/80">
                Step away from the screen. Hydrate, stretch, look at something 20 feet away.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl font-extrabold text-white">
              {formatTimer(breakSecondsLeft)}
            </span>
            <button
              onClick={handleCancelBreak}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              End Break
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Breathing & Reality Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreathingExercise />
        <div className="space-y-6 flex flex-col justify-between">
          <RealityCheckCards />

          {/* Quick Cool Down Triggers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Walk Away Timers
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">Unclench your jaw</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStartBreak(2)}
                className="rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-2 text-center hover:border-slate-700 hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-sm text-white">2 Min</div>
                <div className="text-[10px] text-slate-400">Quick Water</div>
              </button>

              <button
                onClick={() => handleStartBreak(5)}
                className="rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-2 text-center hover:border-slate-700 hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-sm text-white">5 Min</div>
                <div className="text-[10px] text-slate-400">Walk & Stretch</div>
              </button>

              <button
                onClick={() => handleStartBreak(15)}
                className="rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-2 text-center hover:border-slate-700 hover:bg-slate-800 transition-all"
              >
                <div className="font-bold text-sm text-white">15 Min</div>
                <div className="text-[10px] text-slate-400">Chai Break</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User's Curated "When You're Cooked 😭" Messages Section */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <HeartHandshake className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Messages I Wrote For You (When You&apos;re Cooked 😭)
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Emergency stand-down
          </span>
        </div>
        <PersonalMessage initialCategory="cooked" />
      </div>
    </div>
  );
};
