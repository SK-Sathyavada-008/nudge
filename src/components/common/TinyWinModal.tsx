import React, { useState } from 'react';
import { TINY_WINS } from '../../data/devHumor';
import { getMessagesByCategory } from '../../data/personalMessages';
import { useNudge } from '../../context/NudgeContext';
import { Trophy, CheckCircle, RefreshCw, X, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TinyWinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TinyWinModal: React.FC<TinyWinModalProps> = ({ isOpen, onClose }) => {
  const { incrementTinyWin, addActivity } = useNudge();
  const [winIndex, setWinIndex] = useState(0);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const currentWin = TINY_WINS[winIndex % TINY_WINS.length];
  const solvedMessages = getMessagesByCategory('solved');
  const activeSolvedMessage = solvedMessages[winIndex % solvedMessages.length];

  const handleShuffle = () => {
    setClaimed(false);
    setWinIndex((prev) => (prev + 1) % TINY_WINS.length);
  };

  const handleClaim = () => {
    if (!claimed) {
      setClaimed(true);
      incrementTinyWin();
      addActivity({
        type: 'tiny-win',
        title: `Completed Tiny Win: ${currentWin.title}`,
        detail: currentWin.reward,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#f59e0b', '#38bdf8'],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-2xl" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-200">60-Second Micro Win</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-5 text-center space-y-3">
          <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
            {currentWin.reward}
          </span>
          <h3 className="text-xl font-bold text-white">{currentWin.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {currentWin.task}
          </p>

          {/* Solved celebration note from best buddy */}
          {activeSolvedMessage && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                <Heart className="h-3 w-3" />
                <span>Message For You (When You Solve Something 🏆)</span>
              </div>
              <p className="text-xs italic text-amber-100 font-medium">
                &ldquo;{activeSolvedMessage.quote}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleShuffle}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Different Win</span>
          </button>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-lg ${
              claimed
                ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {claimed ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Win Claimed! 🦚 Approved</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>I Did This! Claim Win</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
