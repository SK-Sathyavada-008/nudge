import React, { useState } from 'react';
import { FrogTherapyGame } from './FrogTherapyGame';
import { BrainExeGame } from './BrainExeGame';
import { ConfidenceClickerGame } from './ConfidenceClickerGame';
import { DevJokes } from './DevJokes';
import { BinarySearchGame } from './BinarySearchGame';
import { PersonalMessage } from '../common/PersonalMessage';
import { Gamepad2, Zap, Flame, HeartHandshake, Laugh } from 'lucide-react';

export const PlayPillar: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'frog' | 'brain' | 'clicker' | 'roasts' | 'binary'>('frog');

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  College Arcade & Play
                </h1>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                  Zero Guilt
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                Actual playable games created purely because sometimes you just need to laugh and have fun.
              </p>
            </div>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-sm">
          <button
            onClick={() => setActiveGame('frog')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeGame === 'frog'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🐸</span>
            <span>Frog Therapy</span>
          </button>

          <button
            onClick={() => setActiveGame('brain')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeGame === 'brain'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-indigo-300" />
            <span>BRAIN.EXE</span>
          </button>

          <button
            onClick={() => setActiveGame('clicker')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeGame === 'clicker'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-300" />
            <span>Confidence Clicker</span>
          </button>

          <button
            onClick={() => setActiveGame('roasts')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeGame === 'roasts'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Laugh className="h-3.5 w-3.5 text-rose-300" />
            <span>Dev Roasts</span>
          </button>

          <button
            onClick={() => setActiveGame('binary')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeGame === 'binary'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5 text-purple-300" />
            <span>Binary Duel</span>
          </button>
        </div>
      </div>

      {/* Active Game Display */}
      <div>
        {activeGame === 'frog' && <FrogTherapyGame />}
        {activeGame === 'brain' && <BrainExeGame />}
        {activeGame === 'clicker' && <ConfidenceClickerGame />}
        {activeGame === 'roasts' && <DevJokes />}
        {activeGame === 'binary' && <BinarySearchGame />}
      </div>

      {/* Random Banter Notes From Friend */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-purple-400">
            <HeartHandshake className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Messages I Wrote For You (Random Banter & Reminders)
            </span>
          </div>
          <span className="text-xs text-slate-500">
            #Best Buddy Ever
          </span>
        </div>
        <PersonalMessage initialCategory="random" />
      </div>
    </div>
  );
};
