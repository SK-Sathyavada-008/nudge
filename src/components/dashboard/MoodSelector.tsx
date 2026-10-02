import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import type { MoodType } from '../../types';
import { SmilePlus } from 'lucide-react';

export const MoodSelector: React.FC = () => {
  const { mood, setMood } = useNudge();

  const moods: { id: MoodType; emoji: string; label: string; desc: string; border: string }[] = [
    {
      id: 'locked-in',
      emoji: '⚡',
      label: 'Locked In',
      desc: 'Focused and ready to grind',
      border: 'hover:border-indigo-500/50',
    },
    {
      id: 'confident',
      emoji: '🚀',
      label: 'Confident',
      desc: 'Patterns are clicking today',
      border: 'hover:border-emerald-500/50',
    },
    {
      id: 'curious',
      emoji: '💡',
      label: 'Curious',
      desc: 'Exploring unfamiliar concepts',
      border: 'hover:border-sky-500/50',
    },
    {
      id: 'brain-fog',
      emoji: '😵‍💫',
      label: 'Brain Fog',
      desc: 'Stuck in recursion loops',
      border: 'hover:border-amber-500/50',
    },
    {
      id: 'frustrated',
      emoji: '😤',
      label: 'Frustrated',
      desc: 'Failed test case 42/50',
      border: 'hover:border-rose-500/50',
    },
    {
      id: 'exhausted',
      emoji: '😴',
      label: 'Exhausted',
      desc: 'Over-caffeinated & tired',
      border: 'hover:border-purple-500/50',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <SmilePlus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">How are we doing today?</h3>
            <p className="text-xs text-slate-400">Your state guides our recommendations</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Selected: <strong className="text-white capitalize">{mood.replace('-', ' ')}</strong>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {moods.map((m) => {
          const isSelected = mood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 ' + m.border
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl select-none">{m.emoji}</span>
                <span className="text-xs font-bold text-slate-100">{m.label}</span>
              </div>
              <span className="mt-1 text-[11px] text-slate-400 leading-tight">
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
