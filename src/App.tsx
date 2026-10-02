import React from 'react';
import { NudgeProvider, useNudge } from './context/NudgeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BackgroundDoodles } from './components/common/BackgroundDoodles';
import { HomeScreen } from './components/home/HomeScreen';
import { ThinkPillar } from './components/think/ThinkPillar';
import { ResetPillar } from './components/reset/ResetPillar';
import { PlayPillar } from './components/play/PlayPillar';
import { BadgeWall } from './components/dashboard/BadgeWall';
import { TreatWall } from './components/dashboard/TreatWall';
import { RoadmapScreen } from './components/roadmap/RoadmapScreen';
import { TreatUnlockModal } from './components/common/TreatUnlockModal';
import { BadgeUnlockModal } from './components/common/BadgeUnlockModal';

const MainView: React.FC = () => {
  const { currentPillar } = useNudge();

  return (
    <main className="relative z-10 flex-1 w-full pb-16">
      {(currentPillar === 'home' || currentPillar === 'dashboard') && <HomeScreen />}
      {currentPillar === 'gameplan' && <RoadmapScreen />}
      {currentPillar === 'think' && <ThinkPillar />}
      {currentPillar === 'reset' && <ResetPillar />}
      {currentPillar === 'play' && <PlayPillar />}
      {currentPillar === 'badges' && (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <BadgeWall />
        </div>
      )}
      {currentPillar === 'treats' && (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <TreatWall />
        </div>
      )}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <NudgeProvider>
      <div className="relative min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Floating Motu Patlu & Mr Bean Doodles in Background */}
        <BackgroundDoodles />

        {/* Foreground Content */}
        <Header />
        <MainView />
        <Footer />

        {/* Global Modals for Treats and Badges */}
        <TreatUnlockModal />
        <BadgeUnlockModal />
      </div>
    </NudgeProvider>
  );
};

export default App;
