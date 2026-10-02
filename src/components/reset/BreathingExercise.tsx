import React, { useState, useEffect } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const { addActivity, completeChallenge } = useNudge();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // 4-7-8 Breathing Technique
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase Transition
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          setCompletedCycles((c) => {
            const next = c + 1;
            if (next === 3) {
              completeChallenge(
                'frog_therapy',
                'Frog Therapy (4-7-8 Breathing Reset)',
                'WARM_UP',
                5,
                0,
                false
              );
              addActivity({
                type: 'reset',
                title: 'Completed 3 cycles of 4-7-8 Breathing (Frog Therapy)',
                detail: 'Nervous system regulated • FROG SURVIVOR badge unlocked!',
              });
            }
            return next;
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, addActivity]);

  const handleToggle = () => {
    if (!isActive && completedCycles === 0) {
      addActivity({
        type: 'reset',
        title: 'Started Breathing Pacer',
        detail: 'Taking a mindful pause',
      });
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(4);
    setCompletedCycles(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'Inhale':
        return 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40';
      case 'Hold':
        return 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/40';
      case 'Exhale':
        return 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/40';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'Inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'Hold') return 'scale-125 duration-[7000ms]';
    return 'scale-90 duration-[8000ms]';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md text-center">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-left">
        <div>
          <h3 className="text-base font-bold text-white">4-7-8 Nervous System Reset</h3>
          <p className="text-xs text-slate-400">Scientific vagus nerve stimulation for code fatigue</p>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          Cycles: {completedCycles}
        </span>
      </div>

      {/* Interactive Visual Circle */}
      <div className="my-10 flex items-center justify-center">
        <div
          className={`relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center rounded-full border-2 bg-gradient-to-br transition-all ease-in-out ${getPhaseColor()} ${getCircleScale()}`}
        >
          {/* Inner pulse */}
          <div className="absolute inset-4 rounded-full border border-white/10" />

          <div className="z-10 text-center select-none">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              {isActive ? phase : 'Ready'}
            </span>
            <div className="my-1 text-5xl sm:text-6xl font-extrabold text-white font-mono">
              {isActive ? countdown : '4'}
            </div>
            <span className="text-[11px] text-slate-400">
              {phase === 'Inhale' && 'Breathe In Deeply'}
              {phase === 'Hold' && 'Hold Gently'}
              {phase === 'Exhale' && 'Slow Smooth Exhale'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg active:scale-95 ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause Pacer</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>{completedCycles > 0 ? 'Resume Breathing' : 'Start 4-7-8 Breath'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {completedCycles >= 3 && (
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>3 cycles completed. Your pulse is settling down.</span>
        </div>
      )}
    </div>
  );
};
