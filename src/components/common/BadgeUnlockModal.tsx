import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BadgeUnlockModal: React.FC = () => {
  const { newlyUnlockedBadge, closeBadgeModal } = useNudge();

  if (!newlyUnlockedBadge) return null;

  React.useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
    });
  }, [newlyUnlockedBadge.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl text-center">
        <button
          onClick={closeBadgeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NEW BADGE UNLOCKED</span>
        </div>

        <div className="my-4 flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-2 border-indigo-400/50 flex items-center justify-center text-4xl shadow-inner shadow-indigo-500/20 animate-pulse">
            {newlyUnlockedBadge.icon}
          </div>
        </div>

        <h3 className="text-xl font-black text-white">{newlyUnlockedBadge.title}</h3>
        <p className="mt-1 text-xs font-semibold text-indigo-300">
          {newlyUnlockedBadge.requirementDesc}
        </p>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed px-4">
          {newlyUnlockedBadge.description}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={closeBadgeModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Award className="h-4 w-4" />
            <span>Equip Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
