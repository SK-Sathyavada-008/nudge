import React, { Suspense } from 'react';
import { useNudge } from '../../context/NudgeContext';
import { SKMessages } from './SKMessages';
import { EvilScorekeeper } from './EvilScorekeeper';
import { TreatRedemption } from './TreatRedemption';
import { Brain, Compass, Gamepad2, RefreshCw } from 'lucide-react';


import { Logo3DScene } from './Logo3DScene';


// Fallback while 3D loads
const LogoFallback: React.FC = () => (
  <div className="w-full flex flex-col items-center justify-center" style={{ height: 420 }}>
    <div className="text-center space-y-4 animate-pulse">
      <p className="text-5xl sm:text-7xl font-black tracking-tight text-white">
        NUDGE VEER
      </p>
      <p className="text-base text-slate-400">#From Developer to the Best PM</p>
      <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Loading 3D experience...</span>
      </div>
    </div>
  </div>
);

// Quick-access nav pills
const QuickNav: React.FC = () => {
  const { setPillar } = useNudge();

  const items = [
    { pillar: 'think' as const, icon: <Brain className="h-3.5 w-3.5" />, label: '🧠 THINK', color: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25' },
    { pillar: 'gameplan' as const, icon: <Compass className="h-3.5 w-3.5" />, label: '🗺️ GAME PLAN', color: 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/25' },
    { pillar: 'play' as const, icon: <Gamepad2 className="h-3.5 w-3.5" />, label: '🎮 PLAY', color: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/25' },
    { pillar: 'reset' as const, icon: <RefreshCw className="h-3.5 w-3.5" />, label: '🍃 RESET', color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {items.map(item => (
        <button
          key={item.pillar}
          onClick={() => setPillar(item.pillar)}
          className={`flex items-center gap-2 rounded-2xl ${item.color} px-4 py-2 text-xs font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export const HomeScreen: React.FC = () => {
  const { setPillar } = useNudge();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ── Ambient background atmosphere ── */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        {/* Top-center glow (behind logo) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
        {/* Bottom right accent */}
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-violet-600/6 rounded-full blur-[80px]" />
        {/* Bottom left accent */}
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-sky-600/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* ── HERO: 3D Logo + Character ── */}
        <div className="pt-6 pb-2">
          <Suspense fallback={<LogoFallback />}>
            <Logo3DScene onLogoClick={() => setPillar('think')} />
          </Suspense>
        </div>

        {/* ── Quick Navigation ── */}
        <div className="mb-10 mt-2">
          <QuickNav />
        </div>

        {/* ── Secondary Content Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column: Messages + Scorekeeper */}
          <div className="space-y-5">
            <SKMessages />
            <EvilScorekeeper />
          </div>

          {/* Right column: Treats */}
          <div>
            <TreatRedemption />
          </div>
        </div>

        {/* ── Footer signature ── */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Made with 💜 for Veer •{' '}
            <span className="text-indigo-400 font-bold">#Best Buddy Ever</span>
          </p>
        </div>
      </div>
    </div>
  );
};
