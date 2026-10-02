import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Trophy, Award, Brain } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { tinyWinsCount, problem, mood, setPillar } = useNudge();

  const getMoodEmoji = (m: string) => {
    switch (m) {
      case 'locked-in': return '⚡';
      case 'brain-fog': return '😵‍💫';
      case 'frustrated': return '😤';
      case 'exhausted': return '😴';
      case 'confident': return '🚀';
      case 'curious': return '💡';
      default: return '🙂';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Problem in Focus */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-indigo-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Quest
          </span>
          <Brain className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="text-base sm:text-lg font-bold text-white truncate">
          {problem || 'No problem set yet'}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-indigo-300 font-medium">
            THINK mode ready
          </span>
          <button
            onClick={() => setPillar('think')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            Jump in →
          </button>
        </div>
      </div>

      {/* 2. Tiny Wins Bank */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tiny Wins Bank
          </span>
          <Trophy className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{tinyWinsCount}</span>
          <span className="text-xs font-medium text-slate-400">micro-victories</span>
        </div>
        <p className="mt-1.5 text-[11px] text-emerald-300/80 font-medium">
          Every small step counts
        </p>
      </div>

      {/* 3. Emotional State */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Vibe
          </span>
          <Award className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white capitalize">
          <span>{getMoodEmoji(mood)}</span>
          <span>{mood.replace('-', ' ')}</span>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          NUDGE, DON&apos;T REPLACE active
        </p>
      </div>
    </div>
  );
};
