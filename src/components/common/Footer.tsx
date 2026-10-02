import React from 'react';
import { useNudge } from '../../context/NudgeContext';

export const Footer: React.FC = () => {
  const { setPillar } = useNudge();

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/70 text-slate-400 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-slate-100 text-base">Nudge Veer</span>
              <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                #Best Buddy Ever
              </span>
            </div>
            <p className="text-xs text-slate-400">
              &ldquo;Your brain isn't broken. It just needs a nudge.&rdquo;
            </p>
          </div>

          {/* Pillars fast links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setPillar('think')}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>🧠</span> THINK
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setPillar('reset')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>🍃</span> RESET
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setPillar('play')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>🎮</span> PLAY
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setPillar('home')}
              className="hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <span>🏠</span> Home
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Built for PM</span>
            <span># Best buddy ever</span>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <p>Product Philosophy: &ldquo;Nudge, Don&apos;t Replace.&rdquo; (Gemma AI hooks prepared)</p>
          <p>Local client state preserved in your browser.</p>
        </div>
      </div>
    </footer>
  );
};
