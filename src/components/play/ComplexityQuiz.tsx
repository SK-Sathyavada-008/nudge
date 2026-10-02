import React, { useState } from 'react';
import { TRIVIA_QUESTIONS } from '../../data/triviaQuestions';
import { useNudge } from '../../context/NudgeContext';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ComplexityQuiz: React.FC = () => {
  const { addActivity, incrementTinyWin } = useNudge();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = TRIVIA_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
        setCurrentIdx((c) => c + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
        if (score + (isCorrect ? 1 : 0) >= 3) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
          incrementTinyWin();
        }
        addActivity({
          type: 'play',
          title: `Finished Complexity Speed Quiz`,
          detail: `Score: ${score + (isCorrect ? 1 : 0)} / ${TRIVIA_QUESTIONS.length}`,
        });
      }
    }, 1800);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Big-O Speed Roulette
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {!isFinished ? `Q${currentIdx + 1} / ${TRIVIA_QUESTIONS.length}` : 'Quiz Complete'}
        </span>
      </div>

      {!isFinished ? (
        <div className="py-4 space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-white">
            {question.question}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctIndex;
              let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                } else {
                  btnStyle = 'opacity-40 border-slate-900 bg-slate-950/30 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedAnswer !== null}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                  {selectedAnswer === idx && !isCorrect && (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in">
              <strong className="text-sky-400">Insight:</strong> {question.explanation}
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 mb-2">
            <Award className="h-6 w-6" />
          </div>
          <h4 className="text-xl font-bold text-white">
            Score: {score} / {TRIVIA_QUESTIONS.length}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {score >= 4
              ? 'Outstanding! Your Big-O intuition is razor sharp.'
              : 'Good practice! Pattern recognition grows through repetition.'}
          </p>
          <button
            onClick={handleRestart}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
