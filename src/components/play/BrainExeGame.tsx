import React, { useState, useEffect } from 'react';
import { Terminal, Zap, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  prompt: string;
  options: string[];
  correctIndex: number;
  roast: string;
}

export const BrainExeGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; roast: string } | null>(null);

  const questions: Question[] = [
    {
      prompt: 'Quick! What is the average time complexity of HashMap lookup?',
      options: ['O(1)', 'O(N)', 'O(Kanha\'s blessings)'],
      correctIndex: 0,
      roast: 'O(1) unless your hash function is writing poetry.',
    },
    {
      prompt: 'DO NOT click the NullPointerException!',
      options: ['NullPointerException 💥', 'Clean Code ✨', 'Accepted 200 OK 🟢'],
      correctIndex: 1,
      roast: 'Phew. The heap memory is safe.',
    },
    {
      prompt: 'Two Sum: nums=[2, 7], target=9. What is 9 - 7?',
      options: ['4', '2', 'Syntax Error'],
      correctIndex: 1,
      roast: 'Simple math survived! Congratulations.',
    },
    {
      prompt: 'Your brain starts contemplating unbounded DP at 3 AM. Protocol:',
      options: ['Sleep immediately 😴', 'Write 400 lines of recursion', 'Complain to SK'],
      correctIndex: 0,
      roast: 'Sleep is the only O(1) cure for contest fatigue.',
    },
    {
      prompt: 'Which data structure behaves as LIFO (Last In First Out)?',
      options: ['Stack', 'Queue', 'My patience during contests'],
      correctIndex: 0,
      roast: 'Stack popped cleanly!',
    },
  ];

  useEffect(() => {
    if (!isPlaying || gameOver || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, feedback, currentIdx]);

  const handleTimeout = () => {
    setFeedback({ isCorrect: false, roast: '⏰ Out of time! BRAIN.EXE suffered a mental timeout.' });
    setTimeout(() => advanceNext(false), 1200);
  };

  const handleAnswer = (choiceIdx: number) => {
    const q = questions[currentIdx];
    const isCorrect = choiceIdx === q.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ isCorrect: true, roast: q.roast });
    } else {
      setFeedback({ isCorrect: false, roast: `Wrong! ${q.roast}` });
    }

    setTimeout(() => advanceNext(isCorrect), 1100);
  };

  const advanceNext = (_wasCorrect: boolean) => {
    setFeedback(null);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(4);
    } else {
      setGameOver(true);
      setIsPlaying(false);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleStart = () => {
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(4);
    setGameOver(false);
    setFeedback(null);
    setIsPlaying(true);
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white font-mono">BRAIN.EXE</h3>
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
              Reaction Reflex
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            4-second rapid fire questions to test your reflexes and make you laugh.
          </p>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-3 font-mono">
            <div className="bg-slate-950 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Round</span>
              <span className="text-base font-black text-indigo-300">
                {currentIdx + 1} / {questions.length}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Timer</span>
              <span className={`text-base font-black ${timeLeft <= 2 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Arena */}
      <div className="min-h-[260px] flex flex-col justify-center items-center rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-center">
        {!isPlaying && !gameOver && (
          <div className="space-y-4 max-w-sm">
            <div className="flex justify-center text-5xl animate-pulse">⚡</div>
            <h4 className="text-lg font-black text-white font-mono">
              Initialize BRAIN.EXE
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fast, funny, zero pressure. You have 4 seconds per question. Think fast, click faster.
            </p>
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-black text-white shadow-[0_4px_0_theme(colors.indigo.800)] active:shadow-none active:translate-y-1 transition-all mx-auto"
            >
              <Zap className="h-4 w-4 fill-white" />
              <span>LAUNCH BRAIN.EXE</span>
            </button>
          </div>
        )}

        {isPlaying && currentQ && (
          <div className="w-full max-w-md space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Reflex Challenge
              </span>
              <h4 className="text-base font-black text-white">{currentQ.prompt}</h4>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={Boolean(feedback)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-indigo-950/40 hover:border-indigo-500/50 p-3 text-xs font-bold text-white transition-all active:scale-95 text-left flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <span className="text-[10px] text-slate-400 font-mono">[{idx + 1}]</span>
                </button>
              ))}
            </div>

            {/* Temporary Round Feedback */}
            {feedback && (
              <div
                className={`rounded-xl border p-2.5 text-xs font-mono font-semibold flex items-center justify-center gap-2 animate-in zoom-in duration-150 ${
                  feedback.isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                    : 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span>{feedback.roast}</span>
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="space-y-4 max-w-sm animate-in fade-in duration-200">
            <div className="text-5xl">🧠✨</div>
            <h4 className="text-xl font-black text-white font-mono">
              BRAIN.EXE PATCH COMPLETE
            </h4>
            <p className="text-sm font-semibold text-emerald-300">
              Score: {score} / {questions.length} Clean Reflexes!
            </p>
            <p className="text-xs text-slate-400 italic">
              &ldquo;Mental RAM cleared. Contest anxiety successfully invalidated.&rdquo;
            </p>
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg active:scale-95 transition-all mx-auto"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Run Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
