import React from 'react';
import { FellowProvider, useFellow } from './context/FellowContext';
import { Navigation } from './components/Navigation';
import { LandingView } from './components/LandingView';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { MyPlansView } from './components/MyPlansView';
import { ProfileView } from './components/ProfileView';
import { PlanDetailModal } from './components/PlanDetailModal';
import { HostPlanModal } from './components/HostPlanModal';
import { VerificationModal } from './components/VerificationModal';
import { ExpiringChatModal } from './components/ExpiringChatModal';
import { CitySelectorModal } from './components/CitySelectorModal';
import { CityWaitlistModal } from './components/CityWaitlistModal';
import { CodeOfConductModal } from './components/CodeOfConductModal';
import { SafetyReportModal } from './components/SafetyReportModal';
import { AuthModal } from './components/AuthModal';

const MainApp: React.FC = () => {
  const {
    activeTab,
    selectedPlanId,
    setSelectedPlanId,
    activeChatPlanId,
    setActiveChatPlanId,
    selectedWaitlistCity,
    setSelectedWaitlistCity,
  } = useFellow();

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1918] flex flex-col font-sans selection:bg-[#E64A2A] selection:text-white antialiased">
      {/* Navigation Bars (Top App Bar & Fixed Bottom Tab Bar) */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto pb-20 px-3 sm:px-4">
        {activeTab === 'landing' && <LandingView />}
        {(activeTab === 'discover' || (activeTab as string) === 'explore') && <DiscoveryFeed />}
        {activeTab === 'my_plans' && <MyPlansView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Modals & Dialogs */}
      {selectedPlanId && (
        <PlanDetailModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
        />
      )}

      <HostPlanModal />
      <VerificationModal />
      <AuthModal />

      {activeChatPlanId && (
        <ExpiringChatModal
          planId={activeChatPlanId}
          onClose={() => setActiveChatPlanId(null)}
        />
      )}

      <CitySelectorModal />

      {selectedWaitlistCity && (
        <CityWaitlistModal
          city={selectedWaitlistCity}
          onClose={() => setSelectedWaitlistCity(null)}
        />
      )}

      <CodeOfConductModal />
      <SafetyReportModal />
    </div>
  );
};

export default function App() {
  return (
    <FellowProvider>
      <MainApp />
    </FellowProvider>
  );
}
