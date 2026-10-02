import React, { useState } from 'react';
import { HINTS_BANK } from '../../data/hintsBank';
import type { HintItem } from '../../types';
import { useNudge } from '../../context/NudgeContext';
import { Lock, Eye, AlertCircle } from 'lucide-react';

export const NudgeLadder: React.FC = () => {
  const { addActivity } = useNudge();
  const [selectedHintId, setSelectedHintId] = useState<string>(HINTS_BANK[0].id);
  const [unlockedLevels, setUnlockedLevels] = useState<{ [key: string]: number }>({
    [HINTS_BANK[0].id]: 1,
  });

  const activeHint = HINTS_BANK.find((h) => h.id === selectedHintId) || HINTS_BANK[0];
  const currentUnlocked = unlockedLevels[activeHint.id] || 1;

  const handleUnlockLevel = (level: number) => {
    setUnlockedLevels((prev) => ({
      ...prev,
      [activeHint.id]: Math.max(prev[activeHint.id] || 1, level),
    }));
    addActivity({
      type: 'think',
      title: `Unlocked Level ${level} Nudge`,
      detail: activeHint.title,
    });
  };

  const getDifficultyBadge = (diff: HintItem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pattern Selector Carousel / Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select Problem Pattern or Practice Topic:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {HINTS_BANK.map((hint) => {
            const isSelected = hint.id === activeHint.id;
            return (
              <button
                key={hint.id}
                onClick={() => setSelectedHintId(hint.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{hint.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getDifficultyBadge(hint.difficulty)}`}>
                  {hint.difficulty}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Problem Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Pattern: {activeHint.pattern}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getDifficultyBadge(activeHint.difficulty)}`}>
                {activeHint.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{activeHint.title}</h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tiered Nudge Engine Active</span>
          </div>
        </div>

        {/* 3 Tier Nudge Ladder */}
        <div className="mt-6 space-y-4">
          {/* Level 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[11px]">
                  1
                </span>
                <span>Level 1: The Intuition Spark (Gentle Nudge)</span>
              </div>
              <span className="text-[11px] text-slate-500">Zero Spoilers</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-7">
              {activeHint.levels.level1}
            </p>
          </div>

          {/* Level 2 */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              currentUnlocked >= 2
                ? 'border-indigo-500/40 bg-slate-950/60'
                : 'border-slate-800/60 bg-slate-950/20 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-[11px]">
                  2
                </span>
                <span>Level 2: The Structural Clue (Data Structures & Invariants)</span>
              </div>
              {currentUnlocked < 2 && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400">
                  <Lock className="h-3 w-3" />
                  Locked
                </span>
              )}
            </div>

            {currentUnlocked >= 2 ? (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-7">
                {activeHint.levels.level2}
              </p>
            ) : (
              <div className="pl-7 pt-2">
                <p className="text-xs text-slate-400 italic mb-3">
                  Try to formulate the solution with Level 1 first. If still stuck, reveal this pattern nudge.
                </p>
                <button
                  onClick={() => handleUnlockLevel(2)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all active:scale-95"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Reveal Level 2 Clue</span>
                </button>
              </div>
            )}
          </div>

          {/* Level 3 */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              currentUnlocked >= 3
                ? 'border-amber-500/40 bg-slate-950/60'
                : 'border-slate-800/60 bg-slate-950/20 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px]">
                  3
                </span>
                <span>Level 3: Edge Cases & Pseudocode Spark (Almost There)</span>
              </div>
              {currentUnlocked < 3 && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400">
                  <Lock className="h-3 w-3" />
                  Locked
                </span>
              )}
            </div>

            {currentUnlocked >= 3 ? (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-7 font-mono text-[12px] bg-slate-900 p-3 rounded-lg border border-slate-800">
                {activeHint.levels.level3}
              </p>
            ) : (
              <div className="pl-7 pt-2">
                <p className="text-xs text-slate-400 italic mb-3">
                  Only unlock this if you have thought for at least 5 minutes about Level 2.
                </p>
                <button
                  onClick={() => handleUnlockLevel(3)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Reveal Level 3 Edge Cases</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nudge Philosophy Footnote */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            Remember: We never show full solution code here. Your brain synthesizes the syntax; we just provide the compass.
          </span>
        </div>
      </div>
    </div>
  );
};
