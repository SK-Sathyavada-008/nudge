import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 text-center md:pt-14 md:pb-16">
      {/* Background ambient glowing orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-28 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl" />

      {/* Signature & Companion Tag */}
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm backdrop-blur-md mb-6">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
        <span>Personal AI Companion for DSA & Interview Prep</span>
        <span className="text-indigo-400 font-bold">•</span>
        <span className="text-white">#Best Buddy Ever</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
        Nudge Veer 
      </h1>

      {/* Main Tagline */}
      <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 max-w-2xl mx-auto">
        &ldquo;Your brain isn&apos;t broken. <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-bold">
          It just needs a nudge.
        </span>&rdquo;
      </p>

      {/* Product Philosophy Pill */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-slate-300">
          <span className="text-indigo-400 font-bold">PHILOSOPHY:</span> NUDGE, DON&apos;T REPLACE.
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-slate-400">
          Three Pillars: <span className="text-indigo-300 font-medium">THINK</span>, <span className="text-emerald-300 font-medium">RESET</span>, <span className="text-amber-300 font-medium">PLAY</span>
        </span>
      </div>

      {/* Warm Introduction */}
      <div className="mt-8 max-w-xl mx-auto">
        <div className="inline-block rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md shadow-lg">
          <p className="text-base sm:text-lg font-medium text-slate-200">
            Hey. What&apos;s going on?
          </p>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Whether you&apos;re staring down a tricky Two-Pointer edge case, feeling fried by LeetCode, or just need a 2-minute reset — pick what your brain needs right now:
          </p>
        </div>
      </div>
    </section>
  );
};
