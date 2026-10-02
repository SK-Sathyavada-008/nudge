import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Card3D } from '../common/Card3D';
import { Brain, Flame, Laugh, Gamepad2, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionCardsProps {
  onOpenTinyWinModal: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ onOpenTinyWinModal }) => {
  const { setPillar, addActivity, incrementTinyWin } = useNudge();

  const handleCardClick = (
    type: 'think' | 'reset' | 'play' | 'game' | 'tiny-win'
  ) => {
    if (type === 'think') {
      addActivity({ type: 'think', title: "Veer requested: 'I'm stuck' nudge", detail: 'Navigated to THINK pillar' });
      setPillar('think');
    } else if (type === 'reset') {
      addActivity({ type: 'reset', title: "Veer requested: 'I'm cooked' reset", detail: 'Triggered de-stress protocol' });
      setPillar('reset');
    } else if (type === 'play') {
      addActivity({ type: 'play', title: "Veer requested: 'Make me laugh'", detail: 'Navigated to dev jokes' });
      setPillar('play');
    } else if (type === 'game') {
      addActivity({ type: 'play', title: "Veer requested: 'I want a game'", detail: 'Loaded binary search mini-game' });
      setPillar('play');
    } else if (type === 'tiny-win') {
      // Trigger tiny win modal with confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8'],
      });
      incrementTinyWin();
      addActivity({ type: 'tiny-win', title: 'Claimed a Tiny Win from Home', detail: 'Instant mental boost' });
      onOpenTinyWinModal();
    }
  };

  const cards = [
    {
      id: 'stuck',
      title: "I'm stuck",
      emoji: '🧠',
      subtitle: 'Break down the problem without giving away the answer.',
      tag: 'THINK PILLAR',
      tagColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      gradient: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 group-hover:from-indigo-950/30',
      action: () => handleCardClick('think'),
      buttonText: 'Get a Progressive Nudge',
      icon: Brain,
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      id: 'cooked',
      title: "I'm cooked",
      emoji: '😭',
      subtitle: 'Brain fried or demotivated? Emergency 3-minute mental defrag.',
      tag: 'RESET PILLAR',
      tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      gradient: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10 group-hover:from-emerald-950/30',
      action: () => handleCardClick('reset'),
      buttonText: 'Emergency Reset & Breath',
      icon: Flame,
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      id: 'laugh',
      title: 'Make me laugh',
      emoji: '😂',
      subtitle: 'Relatable DSA roasts, recursion jokes, and study-buddy banter.',
      tag: 'PLAY PILLAR',
      tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      gradient: 'hover:border-amber-500/50 hover:shadow-amber-500/10 group-hover:from-amber-950/30',
      action: () => handleCardClick('play'),
      buttonText: 'Laugh It Off',
      icon: Laugh,
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      id: 'game',
      title: 'I want a game',
      emoji: '🎮',
      subtitle: 'Fast 60-second binary search game or complexity speed-trivia.',
      tag: 'PALETTE CLEANSER',
      tagColor: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      gradient: 'hover:border-purple-500/50 hover:shadow-purple-500/10 group-hover:from-purple-950/30',
      action: () => handleCardClick('game'),
      buttonText: 'Play Quick Mini-Game',
      icon: Gamepad2,
      colSpan: 'md:col-span-1 lg:col-span-1 sm:col-span-1',
    },
    {
      id: 'tiny-win',
      title: 'Give me a tiny win',
      emoji: '🏆',
      subtitle: 'Complete one small 60-second micro challenge to regain momentum.',
      tag: 'MOMENTUM BUILDER',
      tagColor: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
      gradient: 'hover:border-sky-500/50 hover:shadow-sky-500/10 group-hover:from-sky-950/30',
      action: () => handleCardClick('tiny-win'),
      buttonText: 'Claim A Quick Win',
      icon: Trophy,
      colSpan: 'md:col-span-2 lg:col-span-1 sm:col-span-2',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>Choose Your Need</span>
          <span className="text-xs font-normal text-slate-400 hidden sm:inline">
            (No judgment — coding is hard)
          </span>
        </h2>
        <span className="text-xs font-medium text-indigo-400">
          Click any card to start
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((card) => {
          return (
            <Card3D key={card.id} maxTilt={6} className={card.colSpan}>
              <button
                onClick={card.action}
                className={`w-full h-full group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left transition-all duration-300 shadow-xl hover:bg-slate-900/90 active:scale-[0.98] ${card.gradient}`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm select-none animate-float-slow">
                      {card.emoji}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-indigo-200 transition-colors">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Footer / Call to action */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  <span>{card.buttonText}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white shadow-[0_3px_0_theme(colors.slate.700)] active:shadow-none active:translate-y-1 transition-all">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
};
