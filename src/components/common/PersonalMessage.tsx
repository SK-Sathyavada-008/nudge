import React, { useState } from 'react';
import { PERSONAL_MESSAGES } from '../../data/personalMessages';
import type { PersonalMessageCategory, PersonalMessageItem } from '../../types';
import { Sparkles, RefreshCw, Heart, Quote, Compass } from 'lucide-react';

interface PersonalMessageProps {
  initialCategory?: PersonalMessageCategory;
  compact?: boolean;
  className?: string;
  defaultMessageId?: string;
}

export const PersonalMessage: React.FC<PersonalMessageProps> = ({
  initialCategory,
  compact = false,
  className = '',
  defaultMessageId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PersonalMessageCategory | 'all'>(
    initialCategory || 'all'
  );

  const filteredMessages = PERSONAL_MESSAGES.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (defaultMessageId) {
      const idx = filteredMessages.findIndex((m) => m.id === defaultMessageId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const activeMessage: PersonalMessageItem =
    filteredMessages[currentIndex % Math.max(1, filteredMessages.length)] || PERSONAL_MESSAGES[0];

  const handleNextMessage = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredMessages.length));
  };

  const getCategoryTheme = (category: PersonalMessageCategory) => {
    switch (category) {
      case 'leetcode-mode':
        return {
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          gradient: 'from-indigo-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-indigo-400',
        };
      case 'cooked':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          gradient: 'from-emerald-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-emerald-400',
        };
      case 'solved':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          gradient: 'from-amber-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-amber-400',
        };
      case 'failed':
        return {
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          gradient: 'from-rose-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-rose-400',
        };
      case 'motivation':
        return {
          badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          gradient: 'from-sky-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-sky-400',
        };
      case 'random':
      default:
        return {
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          gradient: 'from-purple-500/10 via-slate-900/60 to-slate-900/90',
          iconColor: 'text-purple-400',
        };
    }
  };

  const currentTheme = getCategoryTheme(activeMessage.category);

  if (compact) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md transition-all hover:border-slate-700 ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${currentTheme.badge}`}>
              <Heart className="h-3 w-3" />
              {activeMessage.authorTag}
            </span>
            {activeMessage.contextNote && (
              <span className="text-slate-500">• {activeMessage.contextNote}</span>
            )}
          </div>
          <button
            onClick={handleNextMessage}
            title="Read another note"
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-sm italic text-slate-200 leading-relaxed">
          &ldquo;{activeMessage.quote}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br ${currentTheme.gradient} p-6 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/80 ${className}`}
    >
      {/* Background Decorative Quote Mark */}
      <div className="pointer-events-none absolute right-4 -bottom-6 text-slate-800/40">
        <Quote className="h-32 w-32 rotate-12 opacity-30" />
      </div>

      {/* Header controls & Categories */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${currentTheme.iconColor}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            From Your Study Buddy
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${currentTheme.badge}`}>
            {activeMessage.categoryLabel}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentIndex(0);
            }}
            className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setSelectedCategory('leetcode-mode');
              setCurrentIndex(0);
            }}
            className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedCategory === 'leetcode-mode'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LeetCode
          </button>
          <button
            onClick={() => {
              setSelectedCategory('cooked');
              setCurrentIndex(0);
            }}
            className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedCategory === 'cooked'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cooked
          </button>
          <button
            onClick={() => {
              setSelectedCategory('motivation');
              setCurrentIndex(0);
            }}
            className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedCategory === 'motivation'
                ? 'bg-sky-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Motivation
          </button>
          <button
            onClick={() => {
              setSelectedCategory('random');
              setCurrentIndex(0);
            }}
            className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedCategory === 'random'
                ? 'bg-purple-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Banter
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative z-10 py-5">
        <p className="text-base md:text-lg font-normal leading-relaxed text-slate-100">
          &ldquo;{activeMessage.quote}&rdquo;
        </p>
      </div>

      {/* Footer / Signoff */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Compass className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold text-slate-200">{activeMessage.authorTag}</span>
          {activeMessage.contextNote && (
            <span className="text-slate-500">| {activeMessage.contextNote}</span>
          )}
        </div>

        <button
          onClick={handleNextMessage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition-all hover:bg-slate-700 hover:text-white hover:border-slate-600 active:scale-95"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Another Nudge</span>
        </button>
      </div>
    </div>
  );
};
