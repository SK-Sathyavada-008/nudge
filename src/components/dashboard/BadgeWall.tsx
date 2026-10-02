import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const BadgeWall: React.FC = () => {
  const { getBadges } = useNudge();
  const badges = getBadges();
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Wall Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏅</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Veer&apos;s 3D Badge Wall
            </h2>
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-0.5 text-xs font-bold text-indigo-300">
              {unlockedCount} / {badges.length} Badges
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proof of genuine problem-solving character. Hover or tap any badge to inspect how it was earned.
          </p>
        </div>
      </div>

      {/* Badges 3D Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b) => {
          const isSelected = selectedBadge === b.id;

          return (
            <Card3D key={b.id} maxTilt={9}>
              <div
                onClick={() => setSelectedBadge(isSelected ? null : b.id)}
                className={`relative group rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[220px] select-none ${
                  b.unlocked
                    ? 'border-indigo-400/50 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 shadow-xl shadow-indigo-500/10 hover:border-indigo-400'
                    : 'border-slate-800/80 bg-slate-950/70 opacity-60 hover:opacity-85'
                }`}
              >
                {/* Status indicator top right */}
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                    {b.category}
                  </span>
                  {b.unlocked ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 animate-pulse">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                      <Lock className="h-3 w-3 text-slate-500" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {/* Central Icon */}
                <div className="flex flex-col items-center text-center my-auto">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 ${
                      b.unlocked
                        ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/20 border-2 border-indigo-400/50 shadow-lg shadow-indigo-500/25 animate-float-slow'
                        : 'bg-slate-900 border border-slate-800 text-slate-500 grayscale'
                    }`}
                  >
                    {b.unlocked ? b.icon : '🔒'}
                  </div>

                  <h3
                    className={`text-sm font-black tracking-wide ${
                      b.unlocked ? 'text-white group-hover:text-indigo-300' : 'text-slate-400'
                    }`}
                  >
                    {b.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                    {b.requirementDesc}
                  </p>
                </div>

                {/* Hover / Tap Revealed Details Tray */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                  {b.unlocked ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="h-3 w-3" />
                        <span>How It Was Earned</span>
                      </div>
                      <p className="text-slate-300">{b.description}</p>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <span className="font-bold text-slate-400">Unlock Condition: </span>
                      {b.description}
                    </div>
                  )}
                </div>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
};
