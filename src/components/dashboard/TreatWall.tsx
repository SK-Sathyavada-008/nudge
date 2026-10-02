import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import { Gift, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TreatWall: React.FC = () => {
  const { totalPoints, getTreats } = useNudge();
  const treats = getTreats();

  const handleOpenTreatCelebration = (treat: any) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });
    // Triggers active treat modal directly in state or voucher copy
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
              {totalPoints} <span className="text-xs text-amber-400/80 font-normal">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Treats 3D Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {treats.map((treat) => {
          const needed = treat.requiredPoints - totalPoints;

          return (
            <Card3D key={treat.id} maxTilt={8}>
              <div
                className={`relative rounded-3xl p-6 border-2 flex flex-col justify-between min-h-[300px] transition-all select-none ${
                  treat.unlocked
                    ? 'border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/40 shadow-2xl shadow-amber-500/15'
                    : 'border-slate-800/80 bg-slate-950/80 opacity-70'
                }`}
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{treat.icon}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black font-mono ${
                        treat.unlocked
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {treat.requiredPoints} Points Tier
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-wide mb-1">
                    {treat.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {treat.tagline}
                  </p>
                </div>

                {/* Bottom Unlocked / Locked State */}
                <div>
                  {treat.unlocked ? (
                    <div className="space-y-3">
                      <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/40 p-3 text-center">
                        <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          🎉 TREAT UNLOCKED
                        </div>
                        <div className="text-xs font-black text-emerald-300 animate-pulse mt-0.5">
                          NOW GO ASK SK FOR A TREAT.
                        </div>
                        <div className="text-[10px] text-emerald-400/80 italic mt-0.5">
                          &ldquo;{treat.evilScorekeeperQuote}&rdquo;
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenTreatCelebration(treat)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 p-3 text-xs font-black text-slate-950 shadow-[0_4px_0_theme(colors.amber.700)] active:shadow-none active:translate-y-1 transition-all"
                      >
                        <Gift className="h-4 w-4" />
                        <span>CLAIM TREAT VOUCHER</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 mb-1">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <span>Earn {treat.requiredPoints} points to unlock</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Need {needed} more points from completed challenges
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
