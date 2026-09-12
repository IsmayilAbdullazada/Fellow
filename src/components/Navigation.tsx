import React, { useState } from 'react';
import {
  Compass,
  CalendarCheck,
  Plus,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Clock,
  ArrowRight,
  Info,
  LogOut,
  LogIn,
  User,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeCityCode,
    setIsCityModalOpen,
    currentTrip,
    tripDaysRemaining,
    isTripActive,
    currentUser,
    allUsers,
    setCurrentUserById,
    setIsHostModalOpen,
    participants,
    plans,
    isAuthenticated,
    setIsAuthModalOpen,
    logout,
    setPendingAction,
  } = useFellow();

  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const cityInfo = CITY_HUBS[activeCityCode] || CITY_HUBS.TYO_JP;

  // Calculate pending RSVPs for plans hosted by current user
  const hostedPlanIds = plans.filter((p) => p.host_user_id === currentUser.id).map((p) => p.id);
  const pendingRequestsCount = participants.filter(
    (p) => hostedPlanIds.includes(p.plan_id) && p.rsvp_status === 'pending_approval'
  ).length;

  const handleHostClick = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'host_plan' });
      setIsAuthModalOpen(true);
      return;
    }
    setIsHostModalOpen(true);
  };

  return (
    <>
      {/* Top Application Header - Editorial Minimalist Warm Chalk & Ink */}
      <header
        id="fellow-app-header"
        className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-[#EAE7E2] transition-colors"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Brand Name & City Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('landing')}
                className="font-editorial text-xl font-bold tracking-tight text-[#1A1918] hover:text-[#E64A2A] transition-colors hidden sm:block"
                title="Fellow Home"
              >
                FELLOW
              </button>
              <span className="hidden sm:inline-block text-[#EAE7E2]">|</span>

              <button
                id="btn-select-city-hub"
                onClick={() => setIsCityModalOpen(true)}
                className="group flex items-center gap-2 text-left transition-all active:scale-[0.98]"
                title="Switch Hub or View Waitlist"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1A1918] tracking-tight group-hover:text-[#E64A2A] transition-colors">
                    {cityInfo.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#6B6966] group-hover:text-[#E64A2A] transition-colors mt-1" />
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#EAE7E2] text-[#6B6966]">
                  {cityInfo.flag} Hub Active
                </span>
              </button>
            </div>

            {/* Right: Auth Controls / Profile / Persona Selector */}
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#6B6966] bg-white px-2.5 py-1 rounded-full border border-[#EAE7E2]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9C9892]" />
                    Guest Mode
                  </span>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="py-1.5 px-3.5 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Trip Days Badge */}
                  {currentTrip && isTripActive && (
                    <div
                      onClick={() => setActiveTab('profile')}
                      className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE7E2] text-xs text-[#1A1918] font-medium shadow-2xs hover:border-[#D1CDC7] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                      <span className="font-semibold">{tripDaysRemaining}d left</span>
                      <span className="text-[#9C9892]">in {cityInfo.name}</span>
                    </div>
                  )}

                  {/* Persona Fast Switcher (for test review) */}
                  <div className="relative group">
                    <select
                      id="persona-switcher-select"
                      value={currentUser.id}
                      onChange={(e) => setCurrentUserById(e.target.value)}
                      className="text-xs bg-white text-[#1A1918] rounded-full pl-3 pr-7 py-1.5 border border-[#EAE7E2] hover:border-[#D1CDC7] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E64A2A] appearance-none font-medium shadow-2xs"
                    >
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id} className="text-[#1A1918] bg-white font-medium">
                          {u.display_name} ({u.gender === 'female' ? '♀' : '♂'}{u.is_verified ? ' · KYC' : ' · Unverified'})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C9892]">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Verified Avatar / Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="relative p-0.5 rounded-full focus:outline-none group active:scale-95 transition-all flex items-center"
                      title="User Menu"
                    >
                      <img
                        src={currentUser.profile_photo_url}
                        alt={currentUser.display_name}
                        className="w-8 h-8 rounded-full object-cover border border-[#EAE7E2] group-hover:border-[#E64A2A] transition-colors"
                      />
                      {currentUser.is_verified && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-[#059669] text-white rounded-full p-0.5 border-2 border-white shadow-2xs">
                          <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>
                      )}
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EAE7E2] rounded-2xl shadow-lg p-1.5 z-50 text-xs space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F9F8F6] text-[#1A1918] font-medium flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-[#6B6966]" />
                          <span>View Passport</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FDF2F2] text-[#DC2626] font-medium flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active Hub Banner */}
          <div className="mt-2.5 flex items-center justify-between gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-[#EAE7E2] shadow-2xs text-xs text-[#6B6966]">
            {activeTab === 'landing' ? (
              <>
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse shrink-0" />
                  <span className="truncate">
                    <strong className="text-[#1A1918] font-semibold">Autumn Cohorts Active:</strong> Tokyo (Shibuya, Ginza) & Lisbon (Chiado, Alfama)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#E64A2A] hover:underline shrink-0 cursor-pointer"
                >
                  <span>Explore Tables</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm shrink-0">📍</span>
                  <span className="truncate">
                    Active Hub: <strong className="text-[#1A1918] font-semibold">{cityInfo.name}</strong> ({cityInfo.flag}) · Verified solo cohort in town
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#E64A2A] hover:underline shrink-0 cursor-pointer"
                >
                  <span>{isTripActive ? `${tripDaysRemaining}d remaining` : 'Declare trip dates'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Bottom Navigation Bar */}
      <nav
        id="fellow-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-[#EAE7E2] h-20 flex items-center justify-around px-4 sm:px-20 text-[#6B6966] shadow-[0_-4px_20px_-2px_rgba(26,25,24,0.04)]"
      >
        <div className="max-w-md mx-auto w-full flex items-center justify-around h-full">
          {/* 1. DISCOVER */}
          <button
            id="nav-tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'discover'
                ? 'text-[#E64A2A] font-semibold scale-105'
                : 'text-[#6B6966] hover:text-[#1A1918]'
            }`}
          >
            <Compass className="w-5 h-5 mb-1 stroke-[2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em]">Discover</span>
          </button>

          {/* 2. ABOUT / LANDING */}
          <button
            id="nav-tab-landing"
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'landing'
                ? 'text-[#E64A2A] font-semibold scale-105'
                : 'text-[#6B6966] hover:text-[#1A1918]'
            }`}
          >
            <Info className="w-5 h-5 mb-1 stroke-[2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em]">About</span>
          </button>

          {/* 3. HOST + (Floating Action Pill) */}
          <button
            id="nav-tab-host-plan"
            onClick={handleHostClick}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 group cursor-pointer"
          >
            <div className="bg-[#E64A2A] hover:bg-[#D43F20] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-[#E64A2A]/25 -mt-6 border-3 border-white transition-all group-active:scale-95">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#E64A2A] mt-1">
              Host +
            </span>
          </button>

          {/* 4. MY PLANS */}
          <button
            id="nav-tab-my-plans"
            onClick={() => {
              if (!isAuthenticated) {
                setIsAuthModalOpen(true);
                return;
              }
              setActiveTab('my_plans');
            }}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'my_plans'
                ? 'text-[#E64A2A] font-semibold scale-105'
                : 'text-[#6B6966] hover:text-[#1A1918]'
            }`}
          >
            <div className="relative">
              <CalendarCheck className="w-5 h-5 mb-1 stroke-[2]" />
              {pendingRequestsCount > 0 && isAuthenticated && (
                <span className="absolute -top-1 -right-2 bg-[#DC2626] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {pendingRequestsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em]">My Plans</span>
          </button>

          {/* 5. PROFILE / PASSPORT */}
          <button
            id="nav-tab-profile"
            onClick={() => {
              if (!isAuthenticated) {
                setIsAuthModalOpen(true);
                return;
              }
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'profile'
                ? 'text-[#E64A2A] font-semibold scale-105'
                : 'text-[#6B6966] hover:text-[#1A1918]'
            }`}
          >
            <div className="relative mb-1">
              {isAuthenticated ? (
                <img
                  src={currentUser.profile_photo_url}
                  alt={currentUser.display_name}
                  className="w-5 h-5 rounded-full object-cover border border-[#EAE7E2]"
                />
              ) : (
                <User className="w-5 h-5 text-[#6B6966]" />
              )}
              {isAuthenticated && currentUser.is_verified && (
                <span className="absolute -bottom-1 -right-1 bg-[#059669] text-white rounded-full p-0.5 border border-white">
                  <ShieldCheck className="w-2 h-2 stroke-[2.5]" />
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em]">
              {isAuthenticated ? 'Passport' : 'Sign In'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

