import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Eye } from 'lucide-react';

interface ArrayVisualizerProps {
  array?: number[];
  target?: number;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array = [2, 3, 1, 2, 4, 3],
  target = 7,
}) => {
  // Steps of Sliding window on [2, 3, 1, 2, 4, 3] with target = 7
  const steps = [
    { left: 0, right: 0, sum: 2, action: 'Expand right: add nums[0]=2 (sum=2 < 7)' },
    { left: 0, right: 1, sum: 5, action: 'Expand right: add nums[1]=3 (sum=5 < 7)' },
    { left: 0, right: 2, sum: 6, action: 'Expand right: add nums[2]=1 (sum=6 < 7)' },
    { left: 0, right: 3, sum: 8, action: 'Expand right: add nums[3]=2 (sum=8 >= 7). Valid window! len=4' },
    { left: 1, right: 3, sum: 6, action: 'Shrink left: subtract nums[0]=2 (sum=6 < 7). Need to expand again' },
    { left: 1, right: 4, sum: 10, action: 'Expand right: add nums[4]=4 (sum=10 >= 7). Valid window! len=4' },
    { left: 2, right: 4, sum: 7, action: 'Shrink left: subtract nums[1]=3 (sum=7 >= 7). Valid window! len=3' },
    { left: 3, right: 4, sum: 6, action: 'Shrink left: subtract nums[2]=1 (sum=6 < 7)' },
    { left: 3, right: 5, sum: 9, action: 'Expand right: add nums[5]=3 (sum=9 >= 7). Valid window! len=3' },
    { left: 4, right: 5, sum: 7, action: 'Shrink left: subtract nums[3]=2 (sum=7 >= 7). New minimal window [4, 3]! len=2 🏆' },
  ];

  const [stepIndex, setStepIndex] = useState(0);

  const current = steps[stepIndex];

  const handleNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/70 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Interactive Sliding Window Visualizer
          </h4>
        </div>
        <span className="text-xs font-mono text-indigo-300">
          Target Sum: ≥ {target}
        </span>
      </div>

      {/* Visual Array Cells */}
      <div className="py-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 min-w-[320px]">
          {array.map((val, idx) => {
            const isInside = idx >= current.left && idx <= current.right;
            const isLeft = idx === current.left;
            const isRight = idx === current.right;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer tags */}
                <div className="h-5 text-[10px] font-mono font-bold">
                  {isLeft && isRight && <span className="text-purple-400">L, R</span>}
                  {isLeft && !isRight && <span className="text-emerald-400">L</span>}
                  {!isLeft && isRight && <span className="text-sky-400">R</span>}
                </div>

                {/* Array cell */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold font-mono transition-all duration-300 ${
                    isInside
                      ? 'border-2 border-indigo-500 bg-indigo-600/30 text-white shadow-lg shadow-indigo-500/20 scale-105'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  {val}
                </div>

                {/* Index */}
                <span className="mt-1 text-[10px] font-mono text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Diagnostics */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">
              Window Sum: <strong className={current.sum >= target ? 'text-emerald-400' : 'text-slate-200'}>{current.sum}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-medium">
              Window Length: <strong className="text-indigo-300">{current.right - current.left + 1}</strong>
            </span>
          </div>
          <p className="mt-1 text-slate-300 font-medium">
            {current.action}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleReset}
            disabled={stepIndex === 0}
            className="rounded-lg p-2 border border-slate-700 bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNext}
            disabled={stepIndex === steps.length - 1}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 font-bold text-white shadow-md disabled:opacity-40 transition-all active:scale-95"
          >
            <span>Next Step</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
