import React, { useState } from 'react';
import { DEV_JOKES } from '../../data/devHumor';
import { useNudge } from '../../context/NudgeContext';
import { Laugh, RefreshCw, Eye } from 'lucide-react';

export const DevJokes: React.FC = () => {
  const { addActivity } = useNudge();
  const [jokeIndex, setJokeIndex] = useState(0);
  const [showPunchline, setShowPunchline] = useState(false);
  const [laughCount, setLaughCount] = useState(14);

  const currentJoke = DEV_JOKES[jokeIndex % DEV_JOKES.length];

  const handleNextJoke = () => {
    setShowPunchline(false);
    setJokeIndex((prev) => prev + 1);
  };

  const handleReveal = () => {
    setShowPunchline(true);
    addActivity({
      type: 'play',
      title: `Read Dev Roast: ${currentJoke.tag}`,
      detail: 'Laughter therapy',
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Laugh className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            DSA & LeetCode Comedy Club
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLaughCount((c) => c + 1)}
            className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
          >
            <span>😂</span>
            <span>{laughCount}</span>
          </button>
        </div>
      </div>

      <div className="py-6 space-y-4">
        <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
          {currentJoke.tag}
        </span>

        <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {currentJoke.setup}
        </h4>

        {showPunchline ? (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 text-amber-200 text-sm sm:text-base leading-relaxed animate-in fade-in">
            {currentJoke.punchline}
          </div>
        ) : (
          <button
            onClick={handleReveal}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-amber-300 border border-slate-700 transition-all active:scale-95"
          >
            <Eye className="h-4 w-4" />
            <span>Show Punchline</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-500">
          Humor is the ultimate anti-burnout tool
        </span>

        <button
          onClick={handleNextJoke}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Next Dev Roast</span>
        </button>
      </div>
    </div>
  );
};
