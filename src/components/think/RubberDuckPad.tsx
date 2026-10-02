import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { CheckCircle2 } from 'lucide-react';

export const RubberDuckPad: React.FC = () => {
  const { addActivity } = useNudge();

  const [problemName, setProblemName] = useState('');
  const [bruteForce, setBruteForce] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [edgeCases, setEdgeCases] = useState('');
  const [duckNotesSaved, setDuckNotesSaved] = useState(false);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName.trim()) return;

    setDuckNotesSaved(true);
    addActivity({
      type: 'think',
      title: `Rubber-ducked: ${problemName}`,
      detail: 'Synthesized brute-force & bottleneck',
    });
    setTimeout(() => setDuckNotesSaved(false), 3000);
  };

  const handleClear = () => {
    setProblemName('');
    setBruteForce('');
    setBottleneck('');
    setEdgeCases('');
    setDuckNotesSaved(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xl select-none">
            🦆
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Veer&apos;s Socratic Rubber Duck
            </h3>
            <p className="text-xs text-slate-400">
              Explain it before you code it. 80% of bugs evaporate here.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
          Socratic Method
        </span>
      </div>

      <form onSubmit={handleSaveNotes} className="mt-5 space-y-4">
        {/* Problem Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            What problem are you working through right now?
          </label>
          <input
            type="text"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            placeholder="e.g. 3Sum, Valid Palindrome II, Course Schedule..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Step 1: Brute Force */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>1. What is the naive brute-force?</span>
              <span className="text-[11px] text-slate-500">O(N²) or O(2ᴺ)</span>
            </label>
            <textarea
              rows={3}
              value={bruteForce}
              onChange={(e) => setBruteForce(e.target.value)}
              placeholder="e.g. Check all pairs with two nested loops, generate all subsets..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>2. Where is the computational bottleneck?</span>
              <span className="text-[11px] text-slate-500">Repeated work</span>
            </label>
            <textarea
              rows={3}
              value={bottleneck}
              onChange={(e) => setBottleneck(e.target.value)}
              placeholder="e.g. I am scanning the entire sub-array repeatedly just to find the max..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Step 3: Edge Cases */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            3. What edge cases could break your logic?
          </label>
          <input
            type="text"
            value={edgeCases}
            onChange={(e) => setEdgeCases(e.target.value)}
            placeholder="e.g. Empty array [], all negatives, duplicates [2, 2], target not found..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear Scratchpad
          </button>

          <div className="flex items-center gap-3">
            {duckNotesSaved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Notes logged to session!
              </span>
            )}
            <button
              type="submit"
              disabled={!problemName.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              Synthesize & Lock In Thought
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
