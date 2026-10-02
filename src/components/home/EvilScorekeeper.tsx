import React, { useState, useEffect } from 'react';
import { useNudge } from '../../context/NudgeContext';

interface ScorekeeperMessage {
  text: string;
  condition: 'default' | 'rich' | 'broke' | 'milestone' | 'hinted';
}

const MESSAGES: ScorekeeperMessage[] = [
  { text: 'Points are not charity.', condition: 'default' },
  { text: 'I saw you open the solution. Disappointing.', condition: 'default' },
  { text: 'That hint wasn\'t free.', condition: 'hinted' },
  { text: 'Solve first. Then come talk to me.', condition: 'broke' },
  { text: 'I\'m watching.', condition: 'default' },
  { text: 'You actually earned those. Fine.', condition: 'rich' },
  { text: 'Absolutely not. Zero points for that.', condition: 'default' },
  { text: 'You\'re getting dangerously close to 1000.', condition: 'milestone' },
  { text: 'Cute number. Keep working.', condition: 'broke' },
  { text: 'That was not bad. Don\'t get cocky.', condition: 'rich' },
];

export const EvilScorekeeper: React.FC = () => {
  const { totalPoints, hintsUsed } = useNudge();
  const [blinking, setBlinking] = useState(false);

  // Pick contextual message
  const getContextualMessage = () => {
    if (totalPoints >= 900) return MESSAGES.find(m => m.condition === 'milestone')!;
    if (totalPoints >= 200) return MESSAGES[Math.floor(Math.random() * MESSAGES.filter(m => m.condition === 'rich' || m.condition === 'default').length)];
    if (hintsUsed > 3) return MESSAGES.find(m => m.condition === 'hinted')!;
    if (totalPoints < 50) return MESSAGES.find(m => m.condition === 'broke')!;
    return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  };

  const [currentMessage, setCurrentMessage] = useState(() => getContextualMessage());

  // Blink the emoji every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Rotate message periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(getContextualMessage());
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPoints, hintsUsed]);

  // Progress to next milestone treat
  const MILESTONES = [50, 100, 200, 350, 500, 750, 1000];
  const nextMilestone = MILESTONES.find(m => m > totalPoints) || 1000;
  const coinsNeeded = nextMilestone - totalPoints;

  return (
    <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-slate-900/80 to-rose-950/10 backdrop-blur-xl p-5 shadow-xl relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/6 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`text-3xl transition-all duration-75 ${blinking ? 'opacity-0' : 'opacity-100'}`}>
          😈
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-rose-400">Evil Scorekeeper</h3>
          <p className="text-[11px] text-slate-500 font-medium">the one who keeps score</p>
        </div>
      </div>

      {/* Coin balance */}
      <div className="relative z-10 flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-black text-amber-300 font-mono tabular-nums">
          {totalPoints.toLocaleString()}
        </span>
        <span className="text-2xl">🪙</span>
      </div>

      {/* Message */}
      <div className="relative z-10">
        <p className="text-sm text-rose-200/80 font-medium italic leading-snug">
          "{currentMessage.text}"
        </p>
      </div>

      {/* Next milestone */}
      {coinsNeeded > 0 && (
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500">Next milestone</span>
            <span className="text-amber-400 font-bold font-mono">{nextMilestone} 🪙</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalPoints / nextMilestone) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 mt-1 text-right">{coinsNeeded} more coins needed</p>
        </div>
      )}
    </div>
  );
};
