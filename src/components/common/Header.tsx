import React, { useState } from 'react';
import { useNudge } from '../../context/NudgeContext';
import type { PillarType } from '../../types';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPillar, setPillar, totalPoints } = useNudge();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Brand / Logo: Just "Nudge Veer" */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 text-left transition-transform active:scale-95 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all text-lg font-bold">
              💡
            </div>
            <span className="font-black tracking-tight text-xl text-white group-hover:text-indigo-300 transition-colors">
              Nudge Veer
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-1 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = currentPillar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold tracking-wide transition-all cursor-pointer ${
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

        {/* Right side: Clean, un-congested Coin Bank Pill */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleNavClick('treats')}
            title="Click to view Treat Wall"
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-slate-950/80 hover:border-amber-500/60 px-3 py-1.5 transition-all shadow-inner group cursor-pointer"
          >
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-amber-300 font-mono tabular-nums">
              {totalPoints}
            </span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('treats')}
            className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-slate-950 px-2 py-1 text-xs font-mono font-bold text-amber-300"
          >
            <span>🪙</span>
            <span>{totalPoints}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/98 px-4 py-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentPillar === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
