import React from 'react';
import {
  Compass,
  CalendarCheck,
  Plus,
  User,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Clock,
  UserCheck,
  Sparkles,
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
  } = useFellow();

  const cityInfo = CITY_HUBS[activeCityCode] || CITY_HUBS.TYO_JP;

  // Calculate pending RSVPs for plans hosted by current user
  const hostedPlanIds = plans.filter((p) => p.host_user_id === currentUser.id).map((p) => p.id);
  const pendingRequestsCount = participants.filter(
    (p) => hostedPlanIds.includes(p.plan_id) && p.rsvp_status === 'pending_approval'
  ).length;

  return (
    <>
      {/* Top Application Header */}
      <header id="fellow-app-header" className="sticky top-0 z-30 bg-indigo-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="bg-white text-indigo-600 p-2 rounded-xl shadow-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 leading-none">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">FELLOW</h1>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/70 text-indigo-100 border border-indigo-300/30">
                    MVP v5.0
                  </span>
                </div>
                <p className="text-xs text-indigo-200 hidden sm:block mt-1 font-medium">Verified solo micro-meetups</p>
              </div>
            </div>

            {/* Center: City Selector Button */}
            <button
              id="btn-select-city-hub"
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/40 transition-all text-xs sm:text-sm font-bold text-white shadow-sm active:scale-95"
              title="Switch Hub or View Waitlist"
            >
              <span className="text-base">{cityInfo.flag}</span>
              <span className="font-bold tracking-wide">{cityInfo.name.toUpperCase()} HUB</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>

            {/* Right: Persona Fast Switcher */}
            <div className="flex items-center gap-1.5">
              <div className="relative group">
                <select
                  id="persona-switcher-select"
                  value={currentUser.id}
                  onChange={(e) => setCurrentUserById(e.target.value)}
                  className="text-xs bg-indigo-700/70 hover:bg-indigo-700 text-white rounded-xl pl-2.5 pr-7 py-1.5 border border-indigo-400/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none font-bold"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id} className="text-slate-900 bg-white font-medium">
                      {u.display_name} ({u.gender === 'female' ? '♀' : '♂'}{u.is_verified ? ' · Verified' : ' · Unverified'})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/80">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Temporal Decay Trip Status Bar */}
          <div id="trip-temporal-status-bar" className="mt-3 pt-3 border-t border-indigo-500/40 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest mb-0.5">Current Trip</p>
              {currentTrip ? (
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                    Visiting {cityInfo.name} ({currentTrip.arrival_date} – {currentTrip.departure_date})
                  </h2>
                  <p className="text-indigo-200 text-xs mt-0.5 flex items-center gap-2">
                    <span className="font-medium">
                      {isTripActive ? `${tripDaysRemaining} days remaining` : 'Trip expired (Profile Inactive)'}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 inline" /> Verified Solo Status
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-indigo-200 text-xs">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  <span>No active trip declared for {cityInfo.name}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="self-start sm:self-auto text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-lg backdrop-blur-sm transition-all active:scale-95 shrink-0"
            >
              {currentTrip ? 'Edit Trip' : '+ Log Dates'}
            </button>
          </div>
        </div>
      </header>

      {/* Global Bottom Navigation Bar */}
      <nav id="fellow-bottom-nav" className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-20 flex items-center justify-around px-4 sm:px-20 text-slate-400 shadow-lg">
        <div className="max-w-md mx-auto w-full flex items-center justify-around h-full">
          {/* 1. DISCOVER */}
          <button
            id="nav-tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              activeTab === 'discover' ? 'text-indigo-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Discover</span>
          </button>

          {/* 2. MY PLANS */}
          <button
            id="nav-tab-my-plans"
            onClick={() => setActiveTab('my_plans')}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              activeTab === 'my_plans' ? 'text-indigo-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <CalendarCheck className="w-6 h-6 mb-1" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {pendingRequestsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">My Plans</span>
          </button>

          {/* 3. HOST + (Floating Action Button) */}
          <button
            id="nav-tab-host-plan"
            onClick={() => setIsHostModalOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 group"
          >
            <div className="bg-indigo-600 hover:bg-indigo-700 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-300 -mt-10 border-4 border-white transition-all group-active:scale-95">
              <Plus className="w-8 h-8 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-600 mt-1">
              Host +
            </span>
          </button>

          {/* 4. PROFILE */}
          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              activeTab === 'profile' ? 'text-indigo-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative mb-1">
              <img
                src={currentUser.profile_photo_url}
                alt={currentUser.display_name}
                className="w-6 h-6 rounded-full object-cover border-2 border-indigo-500"
              />
              {currentUser.is_verified && (
                <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white">
                  <ShieldCheck className="w-2 h-2" />
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
