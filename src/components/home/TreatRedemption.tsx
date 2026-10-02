import React, { useState, useRef } from 'react';
import { useNudge } from '../../context/NudgeContext';

interface Treat {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  isLegendary?: boolean;
}

const TREATS: Treat[] = [
  { id: 'ice-cream', name: 'Ice Cream', emoji: '🍦', cost: 100, description: 'A classic. Well earned.' },
  { id: 'veg-frankie', name: 'Veg Frankie', emoji: '🌯', cost: 75, description: "Rolls don't solve algorithms, but they help." },
  { id: 'pen', name: 'Pen', emoji: '🖊️', cost: 50, description: 'Write better code. Or doodle. No judgment.' },
  {
    id: 'big-treat',
    name: 'THE 1000-COIN MISTAKE',
    emoji: '💀',
    cost: 1000,
    description: '"You\'re going to make SK regret creating this system."',
    isLegendary: true,
  },
];

type RedemptionStatus = 'idle' | 'confirming' | 'loading' | 'success' | 'error' | 'insufficient';

interface ActiveRedemption {
  treatId: string;
  status: RedemptionStatus;
  message?: string;
}

export const TreatRedemption: React.FC = () => {
  const { totalPoints, claimArcadeReward, addActivity } = useNudge();
  const [active, setActive] = useState<ActiveRedemption | null>(null);
  const [successTreat, setSuccessTreat] = useState<Treat | null>(null);
  const isProcessing = useRef(false);

  const handleRedeemClick = (treat: Treat) => {
    if (isProcessing.current) return;
    if (totalPoints < treat.cost) {
      setActive({
        treatId: treat.id,
        status: 'insufficient',
        message: `Need ${treat.cost - totalPoints} more coins. 😈 Nice try.`,
      });
      setTimeout(() => setActive(null), 2800);
      return;
    }
    setActive({ treatId: treat.id, status: 'confirming' });
  };

  const handleConfirm = async (treat: Treat) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setActive({ treatId: treat.id, status: 'loading' });

    try {
      // Attempt server-side atomic redemption (fire-and-forget for persistence)
      void fetch('/api/treats/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'veer-01', treatId: treat.id, cost: treat.cost }),
      }).catch(() => null);

      // Always do local deduction as source of truth for frontend (server is bonus persistence)
      const claimed = claimArcadeReward(treat.id, treat.cost);
      if (claimed) {
        addActivity({
          type: 'treat',
          title: `Redeemed: ${treat.emoji} ${treat.name}`,
          detail: `Spent ${treat.cost} 🪙 — Now go ask SK!`,
        });
        setSuccessTreat(treat);
        setActive({ treatId: treat.id, status: 'success' });
        setTimeout(() => {
          setActive(null);
          setSuccessTreat(null);
        }, 4200);
      } else {
        setActive({ treatId: treat.id, status: 'insufficient', message: 'Insufficient balance.' });
        setTimeout(() => setActive(null), 2500);
      }
    } catch {
      setActive({ treatId: treat.id, status: 'error', message: 'Server went for chai. Try again.' });
      setTimeout(() => setActive(null), 2500);
    } finally {
      isProcessing.current = false;
    }
  };

  const handleCancel = () => setActive(null);

  const renderTreatActions = (treat: Treat) => {
    const isThis = active?.treatId === treat.id;
    const canAfford = totalPoints >= treat.cost;

    if (isThis && active?.status === 'confirming') {
      return (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleConfirm(treat)}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white active:scale-95 cursor-pointer transition-all"
          >
            Confirm ✓
          </button>
          <button
            onClick={handleCancel}
            className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            Cancel
          </button>
        </div>
      );
    }
    if (isThis && active?.status === 'loading') {
      return <span className="text-[11px] text-indigo-400 animate-pulse shrink-0">Processing...</span>;
    }
    if (isThis && active?.status === 'insufficient') {
      return <span className="text-[11px] text-rose-400 font-bold shrink-0 max-w-[130px] text-right">{active.message}</span>;
    }
    if (isThis && active?.status === 'success') {
      return <span className="text-[11px] text-emerald-400 font-bold shrink-0">Ask SK! 🎉</span>;
    }

    return (
      <button
        onClick={() => handleRedeemClick(treat)}
        disabled={!canAfford}
        className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
          treat.isLegendary
            ? canAfford
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 hover:opacity-90 shadow-md shadow-amber-500/25 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : canAfford
            ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30 active:scale-95'
            : 'bg-slate-800/60 border border-slate-700/40 text-slate-500 cursor-not-allowed'
        }`}
      >
        {canAfford
          ? treat.isLegendary ? '💀 REDEEM' : 'Redeem'
          : `${treat.cost - totalPoints} more`}
      </button>
    );
  };

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900/80 to-amber-950/10 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Bg glow */}
      <div className="absolute top-0 left-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <span className="text-xl">🎁</span>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-300">Real-World Treats</h3>
          <p className="text-[11px] text-slate-500 font-medium">Earn coins. Spend them in real life.</p>
        </div>
        <div className="ml-auto flex items-baseline gap-1">
          <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">{totalPoints}</span>
          <span className="text-lg">🪙</span>
        </div>
      </div>

      {/* Normal treats */}
      <div className="relative z-10 space-y-2 mb-3">
        {TREATS.filter(t => !t.isLegendary).map(treat => (
          <div
            key={treat.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-3.5 hover:border-slate-700/80 hover:bg-slate-900/50 transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl shrink-0">{treat.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{treat.name}</p>
                <p className="text-[11px] text-slate-500 italic truncate">{treat.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-black text-amber-400 font-mono">{treat.cost}🪙</span>
              {renderTreatActions(treat)}
            </div>
          </div>
        ))}
      </div>

      {/* Legendary treat */}
      {TREATS.filter(t => t.isLegendary).map(treat => {
        const canAfford = totalPoints >= treat.cost;
        return (
          <div
            key={treat.id}
            className={`relative rounded-2xl border-2 p-4 transition-all ${
              canAfford
                ? 'border-amber-400/60 bg-gradient-to-r from-amber-950/40 to-rose-950/30 shadow-lg shadow-amber-500/10'
                : 'border-slate-700/40 bg-slate-900/40 opacity-70'
            }`}
          >
            <div className="absolute -top-3 left-4">
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                LEGENDARY
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 mt-1">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{treat.emoji}</span>
                <div>
                  <p className="text-sm font-black text-amber-200">{treat.name}</p>
                  <p className="text-[11px] text-amber-400/70 italic mt-0.5">{treat.description}</p>
                  <p className="text-[11px] font-black text-amber-300 mt-1">{treat.cost} 🪙</p>
                </div>
              </div>
              <div className="shrink-0">
                {renderTreatActions(treat)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Success overlay */}
      {successTreat && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-950/92 backdrop-blur-sm rounded-3xl animate-in fade-in duration-200">
          <div className="text-center space-y-3 p-8">
            <div className="text-6xl animate-bounce">{successTreat.emoji}</div>
            <p className="text-xl font-black text-emerald-300">🎉 TREAT UNLOCKED!</p>
            <p className="text-lg font-bold text-white">{successTreat.name}</p>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 mt-2">
              <p className="text-sm font-bold text-amber-300">"Now go ask SK for your treat."</p>
            </div>
            <p className="text-xs text-slate-400">-{successTreat.cost} 🪙 deducted from balance</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="relative z-10 mt-4 text-[11px] text-slate-600 text-center italic">
        Real treats • Provided by SK in real life
      </p>
    </div>
  );
};
