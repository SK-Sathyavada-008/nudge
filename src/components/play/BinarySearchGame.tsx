import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Gamepad2, ArrowUp, ArrowDown, Check, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BinarySearchGame: React.FC = () => {
  const { addActivity, incrementTinyWin } = useNudge();

  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(100);
  const [attempts, setAttempts] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const currentMid = Math.floor((low + high) / 2);

  const handleBotHigher = () => {
    if (currentMid + 1 > high) return;
    setLow(currentMid + 1);
    setAttempts((a) => a + 1);
  };

  const handleBotLower = () => {
    if (currentMid - 1 < low) return;
    setHigh(currentMid - 1);
    setAttempts((a) => a + 1);
  };

  const handleBotCorrect = () => {
    setGameOver(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    incrementTinyWin();
    addActivity({
      type: 'play',
      title: `Binary Search Guessed in ${attempts} steps!`,
      detail: 'O(log N) in action: ≤ 7 steps verified',
    });
  };

  const handleRestart = () => {
    setLow(1);
    setHigh(100);
    setAttempts(1);
    setGameOver(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <Gamepad2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">The Binary Search Duel</h3>
            <p className="text-xs text-slate-400">Guaranteed in ≤ 7 steps via O(log₂ 100)</p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
          Step {attempts} of 7
        </span>
      </div>

      {!gameOver ? (
        <div className="py-6 text-center space-y-4">
          <p className="text-xs sm:text-sm text-slate-300">
            Think of any secret integer between <strong className="text-white">1 and 100</strong>.
          </p>

          <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 max-w-sm mx-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Is your number:
            </span>
            <div className="text-5xl font-extrabold text-white my-2 font-mono text-purple-400">
              {currentMid}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Search bounds: [{low} ... {high}]
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleBotLower}
              disabled={currentMid <= low}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4 text-sky-400" />
              <span>My number is Lower</span>
            </button>

            <button
              onClick={handleBotCorrect}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Check className="h-4 w-4" />
              <span>Correct! That's It</span>
            </button>

            <button
              onClick={handleBotHigher}
              disabled={currentMid >= high}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4 text-amber-400" />
              <span>My number is Higher</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-3 animate-in fade-in">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="text-xl font-bold text-white">
            Boom! Found it in {attempts} steps!
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Because $log_2(100) \approx 6.64$, Binary Search will never take more than 7 steps to find ANY integer in 100 elements. Mathematics never lies.
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
