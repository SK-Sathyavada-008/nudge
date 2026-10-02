import React, { useState } from 'react';
import { Flame, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClickParticle {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const ConfidenceClickerGame: React.FC = () => {
  const [clicks, setClicks] = useState(0);
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  const getEscalationMessage = (count: number) => {
    if (count === 0) return 'Press to begin artificial inflation.';
    if (count < 4) return 'Okay.';
    if (count < 10) return 'Good.';
    if (count < 18) return 'Actually good.';
    if (count < 28) return 'WAIT.';
    if (count < 42) return "YOU'RE COOKING. 🔥";
    if (count < 65) return 'THE ARRAY IS SCARED. 😱';
    if (count < 90) return 'NASA HAS BEEN NOTIFIED. 🚀🛰️';
    return 'KANHA PERSONALLY BLESSES YOUR TWO POINTERS 🦚✨';
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextCount = clicks + 1;
    setClicks(nextCount);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const phrases = ['+Confidence', '🔥', 'Cooked?', 'Nah, COOKING', '⚡', '🧠', 'O(1) Vibe'];
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    const newParticle: ClickParticle = {
      id: Date.now() + Math.random(),
      text,
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 40 - 20),
    };

    setParticles((prev) => [...prev.slice(-12), newParticle]);

    // Milestones confetti
    if (nextCount === 42 || nextCount === 65 || nextCount === 90) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleReset = () => {
    setClicks(0);
    setParticles([]);
  };

  const currentMsg = getEscalationMessage(clicks);

  return (
    <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">CONFIDENCE CLICKER</h3>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
              Intentionally Ridiculous
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click repeatedly to fabricate unearned algorithmic confidence when feeling stuck.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Clicks</span>
            <span className="text-lg font-black text-amber-300 font-mono">{clicks}</span>
          </div>
          {clicks > 0 && (
            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-slate-800 transition-all text-xs"
              title="Reset counter"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Escalation Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-center">
        <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1">
          Current Mental State
        </div>
        <div className="text-xl sm:text-2xl font-black text-white tracking-wide animate-in zoom-in-95 duration-100">
          {currentMsg}
        </div>
      </div>

      {/* Giant 3D Clicker Button */}
      <div className="relative flex justify-center py-6 select-none overflow-hidden">
        <button
          onClick={handleClick}
          className="relative group h-40 w-40 sm:h-44 sm:w-44 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white font-black text-center p-4 flex flex-col items-center justify-center shadow-[0_12px_0_theme(colors.orange.800)] hover:shadow-[0_8px_0_theme(colors.orange.800)] active:shadow-none active:translate-y-3 transition-all cursor-pointer"
        >
          <Sparkles className="h-7 w-7 text-amber-200 mb-1 group-hover:scale-125 transition-transform" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-100">
            SMASH FOR
          </span>
          <span className="text-base font-black tracking-tight text-white">
            CONFIDENCE
          </span>
          <span className="text-[10px] text-amber-200/80 mt-1 font-mono">
            {clicks} Clicks
          </span>
        </button>

        {/* Floating click particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              left: `calc(50% + ${p.x - 70}px)`,
              top: `${p.y + 10}px`,
            }}
            className="pointer-events-none absolute text-xs font-black text-amber-300 font-mono animate-float-slow transition-opacity duration-1000 opacity-90 drop-shadow-md"
          >
            {p.text}
          </span>
        ))}
      </div>

      <div className="text-center text-[11px] text-slate-500 font-mono">
        Disclaimer: This tool provides 0 algorithmic correctness, but 100% emotional momentum.
      </div>
    </div>
  );
};
