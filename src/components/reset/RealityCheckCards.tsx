import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface RealityCheckItem {
  id: string;
  title: string;
  takeaway: string;
  tag: string;
}

const CHECKS: RealityCheckItem[] = [
  {
    id: 'rc-1',
    title: 'You are not your LeetCode profile',
    takeaway: 'Solving 400 questions is a game of pattern recognition under time pressure, not a verdict on your intellect or worth as an engineer.',
    tag: 'Identity Check',
  },
  {
    id: 'rc-2',
    title: 'Interviews are sample variance',
    takeaway: 'Even FAANG staff engineers fail interviews when asked an obscure graph algorithm they haven’t touched in 4 years. One bad round does not define your trajectory.',
    tag: 'Interview Reality',
  },
  {
    id: 'rc-3',
    title: 'Sleep is your compiler optimizer',
    takeaway: 'Staring at a DP solution from 1 AM to 3 AM will only cement confusion. Sleep is when your brain’s hippocampus organizes synaptic connections for recall.',
    tag: 'Biology Fact',
  },
  {
    id: 'rc-4',
    title: 'The goal is intuition, not memorization',
    takeaway: 'If you forget the exact 5-line syntax of Dijkstra tomorrow, that is normal. If you remember that Dijkstra is greedy BFS with a priority queue, you have won.',
    tag: 'Learning Philosophy',
  },
];

export const RealityCheckCards: React.FC = () => {
  const [index, setIndex] = useState(0);

  const current = CHECKS[index];

  const handleNext = () => setIndex((i) => (i + 1) % CHECKS.length);
  const handlePrev = () => setIndex((i) => (i - 1 + CHECKS.length) % CHECKS.length);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Emergency Reality Checks
          </h3>
        </div>
        <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-slate-300 font-mono">
          {index + 1} of {CHECKS.length}
        </span>
      </div>

      <div className="py-6">
        <div className="inline-block rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 mb-2">
          {current.tag}
        </div>
        <h4 className="text-xl font-bold text-white mb-2">{current.title}</h4>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          {current.takeaway}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous Truth</span>
        </button>

        <div className="flex gap-1.5">
          {CHECKS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>Next Truth</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
