import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Coffee,
  Landmark,
  Footprints,
  Wine,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Lock,
  Plus,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { PlanCategory, MicroPlan } from '../types';
import { CITY_HUBS } from '../data/mockData';

export const DiscoveryFeed: React.FC = () => {
  const {
    activeCityCode,
    plans,
    participants,
    allUsers,
    currentUser,
    setSelectedPlanId,
    setIsHostModalOpen,
    isTripActive,
    mutedUserIds,
    setActiveTab,
  } = useFellow();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'weekend'>('all');
  const [femaleOnlyFilter, setFemaleOnlyFilter] = useState<boolean>(false);

  const city = CITY_HUBS[activeCityCode] || CITY_HUBS.TYO_JP;

  // Filter plans based on city, safety/gender rules, category, date, and mute list
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // 1. Must match active city hub
      if (plan.city_code !== activeCityCode) return false;

      // 2. Hide cancelled plans from public discovery
      if (plan.status === 'cancelled') return false;

      // 3. Instant Safety Trip check: hide plans from muted/reported hosts
      if (mutedUserIds.includes(plan.host_user_id)) return false;

      // 4. Gender-Safe Visibility Rule
      if (plan.female_only && currentUser.gender !== 'female') {
        return false;
      }

      // If user toggled female-only filter on
      if (femaleOnlyFilter && !plan.female_only) {
        return false;
      }

      // 5. Category filter
      if (selectedCategory !== 'all' && plan.category !== selectedCategory) {
        return false;
      }

      // 6. Date filter
      if (selectedDateFilter !== 'all') {
        const planDate = new Date(plan.start_time);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isSameDay = (d1: Date, d2: Date) =>
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();

        if (selectedDateFilter === 'today') {
          if (!isSameDay(planDate, today)) return false;
        } else if (selectedDateFilter === 'tomorrow') {
          if (!isSameDay(planDate, tomorrow)) return false;
        } else if (selectedDateFilter === 'weekend') {
          const day = planDate.getDay();
          if (day !== 0 && day !== 6 && day !== 5) return false;
        }
      }

      return true;
    });
  }, [plans, activeCityCode, mutedUserIds, currentUser.gender, femaleOnlyFilter, selectedCategory, selectedDateFilter]);

  // Counts for category badges
  const cityPlans = plans.filter((p) => p.city_code === activeCityCode && p.status !== 'cancelled');
  const countAll = cityPlans.length;
  const countDining = cityPlans.filter((p) => p.category === 'dining').length;
  const countCafe = cityPlans.filter((p) => p.category === 'cafe_cowork').length;
  const countCulture = cityPlans.filter((p) => p.category === 'cultural_sight').length;
  const countNightlife = cityPlans.filter((p) => p.category === 'nightlife').length;

  const getCategoryLabel = (category: PlanCategory) => {
    switch (category) {
      case 'dining':
        return 'DINING';
      case 'cafe_cowork':
        return 'CAFE & CO-WORK';
      case 'cultural_sight':
        return 'CULTURE';
      case 'outdoor_walk':
        return 'WALK & HIKE';
      case 'nightlife':
        return 'NIGHTLIFE';
    }
  };

  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatPlanDateTime = (startTimeStr: string, endTimeStr: string) => {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    const diffHours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);

    const isToday = new Date().toDateString() === start.toDateString();
    const isTomorrow =
      new Date(Date.now() + 86400000).toDateString() === start.toDateString();

    let dayLabel = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (isToday) dayLabel = 'Tonight';
    else if (isTomorrow) dayLabel = 'Tomorrow';

    const timeLabel = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dayLabel} · ${timeLabel} (${diffHours.replace('.0', '')} hrs)`;
  };

  return (
    <div id="discovery-feed-container" className="max-w-5xl mx-auto px-4 py-5 pb-24 space-y-4">
      {/* Trip Inactive / Decay Notice banner if user has no trip logged */}
      {!isTripActive && (
        <div
          id="trip-decay-alert-banner"
          className="bg-white border border-[#EAE7E2] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-[#1A1918] shadow-2xs"
        >
          <div className="w-9 h-9 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-[#1A1918] text-sm">Active Trip Window Required</p>
            <p className="text-[#6B6966] text-xs mt-0.5 leading-relaxed">
              Fellow enforces anti-ghosting: your profile and meetup participation are only active while you have dates logged in {city.name}.
            </p>
            <button
              onClick={() => setActiveTab('profile')}
              className="mt-2.5 text-xs font-semibold bg-[#1A1918] hover:bg-[#2E2C29] text-white px-3.5 py-1.5 rounded-full transition-all active:scale-95"
            >
              Log Travel Dates for {city.name}
            </button>
          </div>
        </div>
      )}

      {/* Screen 1 Filter Surface: Category Carousel & Date Selector */}
      <div className="bg-white rounded-2xl border border-[#EAE7E2] p-3.5 sm:p-4 shadow-2xs space-y-3">
        {/* Date Filter Row + Persistent Female Only Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
            {(['all', 'today', 'tomorrow', 'weekend'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setSelectedDateFilter(filterKey)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 capitalize text-xs ${
                  selectedDateFilter === filterKey
                    ? 'bg-[#1A1918] text-white'
                    : 'bg-[#F9F8F6] hover:bg-[#EAE7E2] text-[#6B6966] border border-[#EAE7E2]'
                }`}
              >
                {filterKey === 'all' ? 'All Dates' : filterKey === 'weekend' ? 'Weekend' : filterKey}
              </button>
            ))}
          </div>

          {/* Rightmost Persistent Pill: 🛡️ Female Only */}
          <div className="shrink-0">
            {currentUser.gender === 'female' ? (
              <button
                id="filter-female-only-toggle"
                onClick={() => setFemaleOnlyFilter(!femaleOnlyFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-[11px] uppercase tracking-[0.06em] transition-all border ${
                  femaleOnlyFilter
                    ? 'bg-[#FDF2F4] border-[#FBCFE8] text-[#9D174D] shadow-2xs'
                    : 'bg-white border-[#EAE7E2] text-[#6B6966] hover:border-[#D1CDC7]'
                }`}
              >
                <span className="text-sm">🛡️</span>
                <span>Female Only</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] text-[#9C9892] text-[11px] font-medium shrink-0 cursor-not-allowed"
                title="Female-only plans are restricted to verified female solo travelers"
              >
                <Lock className="w-3 h-3" />
                <span>Female Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Carousel (Horizontal scrolling, hairline border chips) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar pt-2 border-t border-[#EAE7E2]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#E64A2A] text-white border-[#E64A2A]'
                : 'bg-white hover:bg-[#F9F8F6] text-[#6B6966] border-[#EAE7E2]'
            }`}
          >
            <span>All ({countAll})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('dining')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              selectedCategory === 'dining'
                ? 'bg-[#E64A2A] text-white border-[#E64A2A]'
                : 'bg-white hover:bg-[#F9F8F6] text-[#6B6966] border-[#EAE7E2]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dinner & Drinks ({countDining})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('cafe_cowork')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              selectedCategory === 'cafe_cowork'
                ? 'bg-[#E64A2A] text-white border-[#E64A2A]'
                : 'bg-white hover:bg-[#F9F8F6] text-[#6B6966] border-[#EAE7E2]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Cafe & Co-work ({countCafe})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('cultural_sight')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              selectedCategory === 'cultural_sight'
                ? 'bg-[#E64A2A] text-white border-[#E64A2A]'
                : 'bg-white hover:bg-[#F9F8F6] text-[#6B6966] border-[#EAE7E2]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Walking & Culture ({countCulture})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('nightlife')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              selectedCategory === 'nightlife'
                ? 'bg-[#E64A2A] text-white border-[#E64A2A]'
                : 'bg-white hover:bg-[#F9F8F6] text-[#6B6966] border-[#EAE7E2]'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Nightlife ({countNightlife})</span>
          </button>
        </div>
      </div>

      {/* Main Vertical Feed: Micro-Plan Bento Cards (Spec Section 4.1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const host = allUsers.find((u) => u.id === plan.host_user_id);
            const planParticipants = participants.filter((p) => p.plan_id === plan.id && p.rsvp_status === 'confirmed');
            const spotsFilled = planParticipants.length;
            const spotsRemaining = Math.max(0, plan.max_participants - spotsFilled);

            // Generate dot indicators: ● for filled, ○ for open
            const dots = [];
            for (let i = 0; i < plan.max_participants; i++) {
              dots.push(i < spotsFilled ? '●' : '○');
            }

            return (
              <div
                key={plan.id}
                id={`micro-plan-card-${plan.id}`}
                onClick={() => setSelectedPlanId(plan.id)}
                className="group relative bg-white border border-[#EAE7E2] rounded-2xl p-5 shadow-bento flex flex-col justify-between hover:border-[#D1CDC7] transition-all duration-200 cursor-pointer text-left active:scale-[0.985]"
              >
                <div>
                  {/* Top: Category Pill + Spots Left with Dots (●●○○) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-md bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918]">
                        {getCategoryLabel(plan.category)}
                      </span>
                      {plan.female_only && (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2 py-1 rounded-md bg-[#FDF2F4] border border-[#FBCFE8] text-[#9D174D]">
                          ♀ Female Only
                        </span>
                      )}
                    </div>

                    {/* Spots Left indicator with dots: [Spots Left: 2 of 4] ●●○○ */}
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6966] font-medium">
                      <span>Spots: {spotsRemaining} of {plan.max_participants}</span>
                      <span className="font-mono-code text-sm tracking-tight text-[#E64A2A] font-bold">
                        {dots.join('')}
                      </span>
                    </div>
                  </div>

                  {/* Title (Editorial Serif font, 20pt, bold, high contrast) */}
                  <h3 className="font-editorial text-[20px] leading-[26px] font-semibold text-[#1A1918] mb-3 group-hover:text-[#E64A2A] transition-colors">
                    {plan.title}
                  </h3>

                  {/* Bento Box: Venue & Timing Box */}
                  <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-3 space-y-1.5 text-xs text-[#6B6966]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1A1918] shrink-0" />
                      <span className="font-medium text-[#1A1918]">
                        {formatPlanDateTime(plan.start_time, plan.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#6B6966] shrink-0" />
                      <span className="truncate text-[#6B6966]">
                        {plan.venue_name} · {plan.venue_address}
                      </span>
                    </div>
                  </div>

                  {/* Plan excerpt */}
                  <p className="text-xs text-[#6B6966] leading-relaxed mt-3 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                {/* Hairline Divider + Host Avatar with Verified Shield */}
                <div className="mt-4 pt-3.5 hairline-divider flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={host?.profile_photo_url}
                        alt={host?.display_name || 'Host'}
                        className="w-9 h-9 rounded-full object-cover border border-[#EAE7E2]"
                      />
                      {host?.is_verified && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 bg-[#059669] text-white rounded-full p-0.5 border border-white"
                          title="Verified Passport ID"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#1A1918] truncate">
                        Hosted by {host?.display_name} ({host?.date_of_birth ? calculateAge(host.date_of_birth) : 28} · {host?.origin_flag})
                      </p>
                      <p className="text-[11px] text-[#6B6966] truncate mt-0.5">
                        Reliability Score: {host?.reliability_score}% · {spotsFilled} joined
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                    }}
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-medium text-xs shadow-2xs active:scale-95 transition-all"
                  >
                    View Plan
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Screen 6.1: Zero-State with Architectural Tokyo/Lisbon Vector */
          <div
            id="discovery-empty-state"
            className="col-span-full bg-white border border-[#EAE7E2] rounded-2xl p-10 text-center space-y-4 shadow-bento"
          >
            {/* Atmospheric Architectural Silhouette (Tokyo Tower or Tram 28) */}
            <div className="w-20 h-20 mx-auto text-[#6B6966]/40 flex items-center justify-center">
              {activeCityCode === 'TYO_JP' ? (
                /* Tokyo Tower Architectural Vector */
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-[1.5]">
                  <path d="M50 10 L50 20 M45 20 L55 20 M50 20 L35 90 M50 20 L65 90 M40 45 L60 45 M36 65 L64 65 M30 90 L70 90 M42 90 L50 75 L58 90" />
                  <circle cx="50" cy="10" r="2" fill="currentColor" />
                </svg>
              ) : (
                /* Lisbon Tram 28 Vector */
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-[1.5]">
                  <rect x="20" y="30" width="60" height="45" rx="6" />
                  <line x1="20" y1="50" x2="80" y2="50" />
                  <line x1="32" y1="30" x2="32" y2="50" />
                  <line x1="48" y1="30" x2="48" y2="50" />
                  <line x1="64" y1="30" x2="64" y2="50" />
                  <circle cx="35" cy="78" r="5" />
                  <circle cx="65" cy="78" r="5" />
                  <line x1="15" y1="83" x2="85" y2="83" />
                  <path d="M50 30 L50 18 L60 18" />
                </svg>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="font-editorial text-xl font-semibold text-[#1A1918]">
                No plans scheduled for this window.
              </h4>
              <p className="text-xs text-[#6B6966] max-w-md mx-auto leading-relaxed">
                There are currently 28 verified travelers in {city.name} looking for things to do. Be the one to set the table.
              </p>
            </div>

            <div className="pt-2">
              <button
                id="btn-empty-state-create-plan"
                onClick={() => setIsHostModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-medium text-xs shadow-md shadow-[#E64A2A]/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Host a 2-Hour Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
