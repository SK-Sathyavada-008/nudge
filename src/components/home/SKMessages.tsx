import React, { useState, useEffect, useRef } from 'react';
import { PERSONAL_MESSAGES } from '../../data/personalMessages';
import type { PersonalMessageItem } from '../../types';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';

// Pick only the "buddy" messages (not krishna philosophy) for the home page section
const HOME_MESSAGES: PersonalMessageItem[] = PERSONAL_MESSAGES.filter(
  m => m.category !== 'krishna'
);

export const SKMessages: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentMsg = HOME_MESSAGES[index];

  const goTo = (newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(((newIndex % HOME_MESSAGES.length) + HOME_MESSAGES.length) % HOME_MESSAGES.length);
      setIsTransitioning(false);
    }, 180);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Auto-advance every 7 seconds
  useEffect(() => {
    autoTimer.current = setTimeout(next, 7000);
    return () => clearTimeout(autoTimer.current);
  }, [index]);

  const toggleLike = () => {
    setLiked(prev => {
      const n = new Set(prev);
      if (n.has(currentMsg.id)) n.delete(currentMsg.id);
      else n.add(currentMsg.id);
      return n;
    });
  };

  const categoryColors: Record<string, string> = {
    'leetcode-mode': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    'cooked': 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    'solved': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    'failed': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    'motivation': 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    'random': 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  };

  const colorClass = categoryColors[currentMsg.category] || 'text-slate-400 border-slate-500/30 bg-slate-500/10';

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💌</span>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Messages From SK</h3>
            <p className="text-[11px] text-slate-500 font-medium">#Best Buddy Ever • personal notes for Veer</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prev}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] text-slate-500 font-mono px-1">{index + 1}/{HOME_MESSAGES.length}</span>
          <button
            onClick={next}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message card */}
      <div
        className={`relative z-10 transition-all duration-180 ${isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
      >
        {/* Category pill */}
        <div className="mb-3">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${colorClass}`}>
            {currentMsg.categoryLabel}
          </span>
        </div>

        {/* Quote */}
        <div className="relative">
          {/* Big decorative quote mark */}
          <span className="absolute -top-2 -left-1 text-5xl font-serif text-indigo-600/20 select-none leading-none">"</span>
          <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed pl-5 pr-2">
            {currentMsg.quote}
          </p>
          {currentMsg.contextNote && (
            <p className="mt-2 pl-5 text-xs text-slate-500 italic">{currentMsg.contextNote}</p>
          )}
        </div>

        {/* Footer: author + like */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400">{currentMsg.authorTag}</span>
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 text-xs transition-all cursor-pointer ${liked.has(currentMsg.id) ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked.has(currentMsg.id) ? 'fill-rose-400' : ''}`} />
            <span>{liked.has(currentMsg.id) ? 'noted 💕' : 'this one hits'}</span>
          </button>
        </div>
      </div>

      {/* Dot nav */}
      <div className="flex items-center justify-center gap-1.5 mt-4 relative z-10">
        {HOME_MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all cursor-pointer ${i === index ? 'bg-indigo-500 w-4 h-1.5' : 'bg-slate-700 hover:bg-slate-600 w-1.5 h-1.5'}`}
          />
        ))}
      </div>
    </div>
  );
};
