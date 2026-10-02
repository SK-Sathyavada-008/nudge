import React, { useState, useEffect, useRef } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FrogPosition {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  emoji: string;
}

export const FrogTherapyGame: React.FC = () => {
  const { completeChallenge } = useNudge();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [frogs, setFrogs] = useState<FrogPosition[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const nextIdRef = useRef(1);

  const frogEmojis = ['🐸', '🐸', '🐸', '🐸', '👑🐸', '🐸✨'];

  // Spawn frogs while playing
  useEffect(() => {
    if (!isPlaying) return;

    // Initial spawn
    setFrogs([
      { id: nextIdRef.current++, x: 25, y: 30, size: 40, emoji: '🐸' },
      { id: nextIdRef.current++, x: 70, y: 60, size: 44, emoji: '🐸' },
      { id: nextIdRef.current++, x: 50, y: 40, size: 38, emoji: '🐸✨' },
    ]);

    const spawnInterval = setInterval(() => {
      setFrogs((prev) => {
        if (prev.length >= 6) return prev;
        const newFrog: FrogPosition = {
          id: nextIdRef.current++,
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 70) + 15,
          size: Math.floor(Math.random() * 15) + 36,
          emoji: frogEmojis[Math.floor(Math.random() * frogEmojis.length)],
        };
        return [...prev, newFrog];
      });
    }, 700);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [isPlaying]);

  // When game ends, evaluate Frog Survivor badge unlock
  useEffect(() => {
    if (gameOver) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
      // Complete non-code challenge condition for FROG SURVIVOR badge (5 pts)
      completeChallenge(
        'frog_therapy',
        'Frog Therapy Arcade Mini-Game',
        'WARM_UP',
        5,
        0,
        false
      );
    }
  }, [gameOver]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(20);
    setGameOver(false);
    setFrogs([]);
    setIsPlaying(true);
  };

  const handleCatchFrog = (id: number) => {
    if (!isPlaying) return;
    setScore((s) => s + 1);
    setFrogs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐸</span>
            <h3 className="text-lg font-black text-white">FROG THERAPY</h3>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Arcade Mini-Game
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click as many frogs as you can before the 20-second timer runs out. Zero DSA, 100% peace.
          </p>
        </div>

        {/* Stats counter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Caught</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{score}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Time Left</div>
            <div className={`text-lg font-black font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Game Pond Arena */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950 overflow-hidden select-none">
        {/* Decorative pond ripples */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-6xl animate-bounce">🐸</span>
            <div>
              <h4 className="text-xl font-black text-white">Ready for Frog Therapy?</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Tap the frogs as fast as you can. It has zero algorithmic utility, but your nervous system will thank you.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-[0_4px_0_theme(colors.emerald.800)] active:shadow-none active:translate-y-1 transition-all"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>START FROG THERAPY</span>
            </button>
          </div>
        )}

        {/* Active Frogs */}
        {isPlaying &&
          frogs.map((frog) => (
            <button
              key={frog.id}
              onClick={() => handleCatchFrog(frog.id)}
              style={{
                top: `${frog.y}%`,
                left: `${frog.x}%`,
                fontSize: `${frog.size}px`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 active:scale-90 cursor-pointer animate-in zoom-in duration-150 filter drop-shadow-lg"
              title="Catch frog!"
            >
              {frog.emoji}
            </button>
          ))}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="text-5xl">🐸🎉</div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-emerald-300">
                You caught {score} frogs.
              </h4>
              <p className="text-sm text-slate-200 font-semibold italic">
                &ldquo;This achievement has absolutely no algorithmic value.&rdquo;
              </p>
              <p className="text-xs text-emerald-400 font-bold">
                &ldquo;But hey, you&apos;re smiling now.&rdquo;
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>FROG SURVIVOR Badge Progress Credited!</span>
            </div>

            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
