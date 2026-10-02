import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import type { ChallengeDifficulty, RealWorldTreat } from '../../types';
import { Sparkles, Check, Gift, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArcadeLocker: React.FC = () => {
  const {
    totalPoints,
    getBadges,
    getTreats,
    claimTreat,
    setPillar,
    setProblem,
  } = useNudge();

  const [copiedTreatId, setCopiedTreatId] = useState<string | null>(null);

  const badges = getBadges();
  const treats = getTreats();

  const nextTreat = treats.find((t) => !t.unlocked) || treats[treats.length - 1];
  const progressPct = Math.min(100, Math.round((totalPoints / (nextTreat?.requiredPoints || 50)) * 100));

  const handleCopyVoucher = (treat: RealWorldTreat) => {
    const text = `🎟️ [NUDGE VEER OFFICIAL TREAT VOUCHER]
==============================================
Holder: Veer (#Best Buddy Ever)
Achievement: ${treat.requiredPoints} Challenge Points Conquered!
Reward: ${treat.title}
Giver: ${treat.giver} (SK)
Verification: Verified by Nudge Veer Evil Scorekeeper 😈

Instruction: NOW GO ASK SK FOR A TREAT.
Scorekeeper Note: "${treat.evilScorekeeperQuote}"
==============================================`;

    navigator.clipboard.writeText(text);
    setCopiedTreatId(treat.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopiedTreatId(null), 3000);
  };

  const difficultyTiers: {
    id: ChallengeDifficulty;
    label: string;
    points: number;
    badge: string;
    desc: string;
    sampleProb: string;
  }[] = [
    {
      id: 'WARM_UP',
      label: 'WARM_UP',
      points: 5,
      badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      desc: 'Quick algorithmic stretching. No crying, just warmup.',
      sampleProb: 'LeetCode 1: Two Sum',
    },
    {
      id: 'BRAIN_STARTER',
      label: 'BRAIN_STARTER',
      points: 10,
      badge: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
      desc: 'Wakes up working memory: BFS traversal & clean node maneuvers.',
      sampleProb: 'LeetCode 102: Binary Tree Level Order Traversal',
    },
    {
      id: 'ACTUALLY_THINK',
      label: 'ACTUALLY_THINK',
      points: 20,
      badge: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      desc: 'No autopilot allowed. Invariants, sliding windows, and monotonicity.',
      sampleProb: 'LeetCode 209: Minimum Size Subarray Sum',
    },
    {
      id: "DON'T_CRY",
      label: "DON'T_CRY",
      points: 35,
      badge: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
      desc: 'Looks intimidating. Character development in action.',
      sampleProb: 'LeetCode 42: Trapping Rain Water',
    },
    {
      id: 'WHY_DID_I_DO_THIS',
      label: 'WHY_DID_I_DO_THIS',
      points: 50,
      badge: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      desc: 'Hard unbounded DP & complex states. Earns legendary status and SK feasts.',
      sampleProb: 'LeetCode 322: Coin Change (Unbounded DP)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 😈 The Nudge Veer Evil Scorekeeper Banner */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-purple-950/40 p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 text-2xl border border-rose-500/30 shrink-0">
            😈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-300">
                The Nudge Veer Scorekeeper
              </h4>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                No Charity
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              &ldquo;Points are not charity. You want the treat? Write the code, pass the test cases, and earn it.&rdquo;
            </p>
          </div>
        </div>

        {/* Real-World Treat Point Bank */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-inner shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-lg">
            🪙
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Treat Bank
            </div>
            <div className="text-xl font-black text-amber-300 font-mono">
              {totalPoints} <span className="text-xs text-amber-400/80 font-normal">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Treat Tracker & SK Showcase */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900/90 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Real-World Treats from SK
              </h3>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                100% Real Food & Perks
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete coding challenges to earn points. Reach milestones to unlock real treats funded by SK!
            </p>
          </div>

          {/* Progress toward next treat */}
          <div className="sm:w-64">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Next: {nextTreat.title}</span>
              <span className="text-amber-400 font-bold font-mono">{totalPoints} / {nextTreat.requiredPoints} pts</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Treat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {treats.map((treat) => (
            <div
              key={treat.id}
              className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between ${
                treat.unlocked
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/50 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{treat.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold font-mono ${
                      treat.unlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {treat.requiredPoints} pts
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{treat.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{treat.tagline}</p>

                {treat.unlocked && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 mb-3 text-center">
                    <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 animate-pulse">
                      NOW GO ASK SK FOR A TREAT.
                    </div>
                    <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                      {treat.evilScorekeeperQuote}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {treat.unlocked ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyVoucher(treat)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 p-2 text-xs font-bold text-amber-300 transition-all active:scale-95"
                    >
                      {copiedTreatId === treat.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Voucher</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => claimTreat(treat.id)}
                      disabled={treat.claimed}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl p-2 text-xs font-bold transition-all ${
                        treat.claimed
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{treat.claimed ? 'Collected' : 'Claimed'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-slate-500 font-mono bg-slate-950/40 rounded-xl border border-slate-800">
                    Need {treat.requiredPoints - totalPoints} more points
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Trophy Shelf */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏅</span>
            <h3 className="text-base font-extrabold text-white">Veer&apos;s Trophy Shelf</h3>
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs font-bold text-indigo-300">
              {badges.filter((b) => b.unlocked).length} / {badges.length} Badges
            </span>
          </div>
          <span className="text-xs text-slate-400">#Best Buddy Ever</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-3 flex flex-col items-center text-center transition-all ${
                b.unlocked
                  ? 'border-indigo-500/40 bg-indigo-950/20 text-white shadow-md'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-2xl mb-2 ${
                  b.unlocked ? 'bg-indigo-500/20 border border-indigo-400/40 shadow-inner' : 'bg-slate-800/40'
                }`}
              >
                {b.icon}
              </div>
              <div className="text-xs font-bold tracking-wide truncate w-full">{b.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{b.requirementDesc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Difficulty Tiers Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <h3 className="text-base font-extrabold text-white">Challenge Difficulty Tiers</h3>
          </div>
          <span className="text-xs text-slate-400">Solve genuinely to earn points</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {difficultyTiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${tier.badge}`}>
                    {tier.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{tier.points} pts
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{tier.desc}</p>
              </div>

              <button
                onClick={() => {
                  setProblem(tier.sampleProb);
                  setPillar('think');
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 p-2 text-xs font-bold text-white transition-all active:scale-95 border border-slate-700/80"
              >
                <span>Fight Problem</span>
                <span className="text-indigo-400">→</span>
              </button>
            </div>
          ))}

          {/* Hint Penalty Rules Card */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Hint Penalty Mechanics</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
                <li>• 0 hints: <span className="text-emerald-400 font-bold">100% points</span></li>
                <li>• 1 hint: <span className="text-sky-400">90% points</span></li>
                <li>• 2 hints: <span className="text-amber-400">75% points</span></li>
                <li>• 3 hints: <span className="text-orange-400">60% points</span></li>
                <li>• 4+ hints: <span className="text-rose-400">40% points</span></li>
                <li>• Full Code: <span className="text-rose-400 font-bold">0 pts</span> (learn without shame!)</li>
              </ul>
            </div>
            <div className="text-[10px] text-indigo-300 italic mt-2 font-mono">
              &ldquo;😈 Nice try. The treat department has noticed the assistance.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
