import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import { Gift, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TreatWall: React.FC = () => {
  const { totalPoints, getTreats } = useNudge();
  const treats = getTreats();

  const handleOpenTreatCelebration = (treat: any) => {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });
    const voucherText = `🎟️ [NUDGE VEER OFFICIAL TREAT VOUCHER]
==============================================
Holder: Veer (#Best Buddy Ever)
Achievement: ${treat.requiredPoints} Challenge Points Conquered!
Reward: ${treat.title}
Giver: ${treat.giver} (SK)
Verification: Verified by Nudge Veer Evil Scorekeeper 😈

Instruction: NOW GO ASK SK FOR A TREAT.
Scorekeeper Note: "${treat.evilScorekeeperQuote}"
==============================================`;
    navigator.clipboard.writeText(voucherText);
    alert(`🎉 TREAT UNLOCKED!\n\n${treat.title}\n\nNOW GO ASK SK FOR A TREAT.\n\n(Official voucher copied to clipboard!)`);
  };

  return (
    <div className="space-y-6">
      {/* Wall Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎁</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Real-World Treat Wall from SK
            </h2>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
              100% Real Food & Offline Perks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Not digital points. Real food and offline perks that SK personally provides when you conquer tough DSA problems.
          </p>
        </div>

        {/* Current Score Bank */}
        <div className="flex items-center gap-3 bg-slate-950 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-inner shrink-0">
          <span className="text-xl">😈</span>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Treat Bank
            </div>
            <div className="text-lg font-black text-amber-300 font-mono">
              {totalPoints} <span className="text-xs text-amber-400/80 font-normal">🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Treats 3D Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {treats.map((treat) => {
          const needed = Math.max(0, treat.requiredPoints - totalPoints);
          const isLegendary = treat.requiredPoints >= 1000;

          return (
            <Card3D key={treat.id} maxTilt={8}>
              <div
                className={`relative rounded-3xl p-5 border-2 flex flex-col justify-between min-h-[340px] transition-all select-none ${
                  treat.unlocked
                    ? 'border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/40 shadow-2xl shadow-amber-500/15'
                    : isLegendary
                    ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-900/90'
                    : 'border-slate-800/80 bg-slate-950/80 opacity-90'
                }`}
              >
                {isLegendary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md shadow-amber-500/30 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> LEGENDARY
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className="text-4xl">{treat.icon}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-black font-mono ${
                        treat.unlocked
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                          : isLegendary
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {treat.requiredPoints} 🪙
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white tracking-wide mb-1.5">
                    {treat.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                    {treat.tagline}
                  </p>
                </div>

                {/* Bottom Unlocked / Locked State */}
                <div>
                  {treat.unlocked ? (
                    <div className="space-y-2.5">
                      <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/40 p-2.5 text-center">
                        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          🎉 TREAT UNLOCKED
                        </div>
                        <div className="text-xs font-black text-emerald-300 animate-pulse mt-0.5">
                          NOW GO ASK SK FOR A TREAT.
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenTreatCelebration(treat)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 p-2.5 text-xs font-black text-slate-950 shadow-[0_4px_0_theme(colors.amber.700)] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                      >
                        <Gift className="h-3.5 w-3.5" />
                        <span>CLAIM TREAT VOUCHER</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                      <div className="text-sm font-black text-amber-400 font-mono">
                        {treat.requiredPoints}🪙
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
                        <Lock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{needed} more</span>
                      </div>
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
