import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Check, Copy, Sparkles, X, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TreatUnlockModal: React.FC = () => {
  const { activeTreatUnlock, closeTreatModal, claimTreat } = useNudge();
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (!activeTreatUnlock) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#38bdf8'],
    });
  };

  // Launch initial celebration
  React.useEffect(() => {
    triggerConfetti();
  }, [activeTreatUnlock.id]);

  const handleCopyVoucher = () => {
    const text = `🎟️ [NUDGE VEER OFFICIAL TREAT VOUCHER]
==============================================
Holder: Veer (#Best Buddy Ever)
Achievement: ${activeTreatUnlock.requiredPoints} Challenge Points Conquered!
Reward: ${activeTreatUnlock.title}
Giver: ${activeTreatUnlock.giver} (SK)
Verification: Verified by Nudge Veer Evil Scorekeeper 😈

Instruction: NOW GO ASK SK FOR A TREAT.
Scorekeeper Note: "Don't make me ask twice."
==============================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClaim = () => {
    claimTreat(activeTreatUnlock.id);
    setClaimed(true);
    triggerConfetti();
    setTimeout(() => {
      closeTreatModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/50 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center overflow-hidden">
        {/* Glowing Background Radial */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeTreatModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Celebration Icons */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl animate-bounce">🎉</span>
          <span className="text-3xl animate-bounce delay-100">🎉</span>
          <span className="text-3xl animate-bounce delay-200">🎉</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>REAL-WORLD REWARD UNLOCKED</span>
        </div>

        {/* 3D Interactive Reward Card */}
        <div className="group perspective-1000 my-4">
          <div className="relative rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/40 p-6 shadow-xl transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
            <div className="text-6xl mb-3 drop-shadow-md animate-pulse">
              {activeTreatUnlock.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {activeTreatUnlock.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
              Congratulations. You have successfully earned yourself food.
            </p>

            <div className="mt-4 inline-block rounded-lg bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              Funded exclusively by {activeTreatUnlock.giver} • {activeTreatUnlock.requiredPoints} Points Tier
            </div>
          </div>
        </div>

        {/* THE MANDATORY DIRECTIVE */}
        <div className="my-5 rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 p-4 shadow-lg shadow-emerald-500/20">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">
            Official Buddy Mandate
          </p>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 tracking-wide animate-pulse">
            NOW GO ASK SK FOR A TREAT.
          </div>
        </div>

        {/* Evil Scorekeeper Quote */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 mb-6 text-xs text-slate-400 flex items-center justify-center gap-2 font-mono">
          <span>😈</span>
          <span className="italic text-slate-300 font-sans">
            &ldquo;{activeTreatUnlock.evilScorekeeperQuote}&rdquo;
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleCopyVoucher}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-3 text-xs font-bold text-amber-300 transition-all active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Voucher Copied!' : 'Copy Treat Voucher'}</span>
          </button>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Gift className="h-4 w-4" />
            <span>{claimed ? 'Claimed in Real Life!' : 'Mark as Claimed from SK'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
