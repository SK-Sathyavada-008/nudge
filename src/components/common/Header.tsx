import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import type { PillarType } from '../../types';
import { Menu, X, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPillar, setPillar, totalPoints, getTreats, problem } = useNudge();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const treats = getTreats();
  const nextTreat = treats.find((t) => !t.unlocked) || treats[treats.length - 1];
  const progressPct = Math.min(100, Math.round((totalPoints / (nextTreat?.requiredPoints || 50)) * 100));

  // Visual text progress bar: ██████░░░░ (10 blocks)
  const filledBlocks = Math.min(10, Math.max(0, Math.round((progressPct / 100) * 10)));
  const progressBlocks = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

  const navItems: { id: PillarType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'gameplan', label: 'GAME PLAN', icon: '🗺️' },
    { id: 'think', label: 'THINK', icon: '🧠' },
    { id: 'play', label: 'PLAY', icon: '🎮' },
    { id: 'badges', label: 'BADGES', icon: '🏅' },
    { id: 'treats', label: 'TREATS', icon: '🎁' },
    { id: 'reset', label: 'RESET', icon: '🍃' },
  ];

  const handleNavClick = (pillar: PillarType) => {
    setPillar(pillar);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}                         
            className="group flex items-center gap-2.5 text-left transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all text-xl">
              
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-lg text-white group-hover:text-indigo-300 transition-colors">
                  Nudge Veer 
                </span>
                <span className="hidden sm:inline-block rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                  #Best Buddy Ever
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                &ldquo;Your brain isn&apos;t broken. It just needs a nudge.&rdquo;
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = currentPillar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'think' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side: Score & Treat Progress (Visible, but non-dominating) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Non-dominating score pill */}
          <button
            onClick={() => handleNavClick('treats')}
            title="Click to view Treat Wall"
            className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-slate-950/80 hover:border-amber-500/50 px-3.5 py-1.5 transition-all text-left shadow-inner group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 text-sm">
              😈
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300 font-mono">
                  {totalPoints} POINTS
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Treat progress
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 tracking-tighter leading-none mt-0.5">
                {progressBlocks} <span className="text-slate-400 font-sans ml-1 text-[9px]">{progressPct}%</span>
              </div>
            </div>
          </button>

          {/* Quick Problem Tag if active */}
          {problem && (
            <button
              onClick={() => handleNavClick('think')}
              title="Current problem in THINK mode"
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors max-w-[170px] truncate"
            >
              <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
              <span className="truncate">{problem.split(':')[0]}</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('treats')}
            className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-slate-950 px-2.5 py-1 text-xs font-mono font-bold text-amber-300"
          >
            <span>😈</span>
            <span>{totalPoints} pts</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0e1320] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentPillar === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 rounded-xl p-3 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Treat Progress: {progressPct}%</span>
            <span>{progressBlocks}</span>
          </div>
        </div>
      )}
    </header>
  );
};
