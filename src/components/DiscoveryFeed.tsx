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
  Users,
  Lock,
  Sparkles,
  AlertCircle,
  Plus,
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
    currentTrip,
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

      // 4. Gender-Safe Visibility Rule (PRD 5.1 & Part 1.4):
      // If female_only is true on the plan, only users where gender === 'female' can view/join
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
          // Friday evening (5), Saturday (6), Sunday (0)
          if (day !== 0 && day !== 6 && day !== 5) return false;
        }
      }

      return true;
    });
  }, [plans, activeCityCode, mutedUserIds, currentUser.gender, femaleOnlyFilter, selectedCategory, selectedDateFilter]);

  const getCategoryIcon = (category: PlanCategory) => {
    switch (category) {
      case 'dining':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'cafe_cowork':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'cultural_sight':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'outdoor_walk':
        return <Footprints className="w-3.5 h-3.5" />;
      case 'nightlife':
        return <Wine className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (category: PlanCategory) => {
    switch (category) {
      case 'dining':
        return 'Dining';
      case 'cafe_cowork':
        return 'Cafe & Cowork';
      case 'cultural_sight':
        return 'Culture';
      case 'outdoor_walk':
        return 'Walk / Hike';
      case 'nightlife':
        return 'Nightlife';
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
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const isToday = new Date().toDateString() === start.toDateString();
    const isTomorrow =
      new Date(Date.now() + 86400000).toDateString() === start.toDateString();

    let dayLabel = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (isToday) dayLabel = 'Tonight';
    else if (isTomorrow) dayLabel = 'Tomorrow';

    const timeLabel = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dayLabel} · ${timeLabel} (${diffHours} hrs)`;
  };

  return (
    <div id="discovery-feed-container" className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-5">
      {/* Trip Inactive / Decay Notice banner if user has no trip logged */}
      {!isTripActive && (
        <div id="trip-decay-alert-banner" className="bg-amber-50 border-2 border-amber-200 rounded-[28px] p-5 flex items-start gap-3.5 text-amber-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-900 text-sm">Active Trip Window Required</p>
            <p className="text-amber-800/90 text-xs mt-0.5 leading-relaxed">
              Fellow enforces anti-ghosting: your profile and listings are only visible while you have an active trip window logged in {city.name}.
            </p>
            <button
              onClick={() => setActiveTab('profile')}
              className="mt-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl shadow-sm transition-all"
            >
              Log Dates for {city.name}
            </button>
          </div>
        </div>
      )}

      {/* Sub-Header Filters & Categories matching Vibrant Palette */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 p-4 sm:p-5 shadow-sm space-y-3.5">
        {/* Date Filter Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {(['all', 'today', 'tomorrow', 'weekend'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setSelectedDateFilter(filterKey)}
                className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 capitalize ${
                  selectedDateFilter === filterKey
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {filterKey === 'all' ? 'All Dates' : filterKey === 'weekend' ? 'Weekend' : filterKey}
              </button>
            ))}
          </div>

          {/* Safety Toggle: Female-Only Pill */}
          <div className="shrink-0">
            {currentUser.gender === 'female' ? (
              <button
                id="filter-female-only-toggle"
                onClick={() => setFemaleOnlyFilter(!femaleOnlyFilter)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all border ${
                  femaleOnlyFilter
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                    : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <span className="text-sm">♀</span>
                <span>Female Only</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 text-xs shrink-0 cursor-not-allowed"
                title="Female-only plans are restricted to verified female solo travelers"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Female Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all shrink-0 border ${
              selectedCategory === 'all'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {selectedCategory === 'all' && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
            <span>All Plans</span>
          </button>

          {(['dining', 'cafe_cowork', 'cultural_sight', 'outdoor_walk', 'nightlife'] as PlanCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {selectedCategory === cat && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
              <span>{getCategoryIcon(cat)}</span>
              <span>{getCategoryLabel(cat)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Card Grid (Micro-Plan Cards) - 2 Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const host = allUsers.find((u) => u.id === plan.host_user_id);
            const planParticipants = participants.filter((p) => p.plan_id === plan.id && p.rsvp_status === 'confirmed');
            const spotsFilled = planParticipants.length;

            return (
              <div
                key={plan.id}
                id={`micro-plan-card-${plan.id}`}
                onClick={() => setSelectedPlanId(plan.id)}
                className="group relative bg-white border-2 border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer text-left active:scale-[0.99]"
              >
                <div>
                  {/* Top: Host Snapshot & Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={host?.profile_photo_url}
                          alt={host?.display_name || 'Host'}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                        />
                        {host?.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm" title="Verified Traveler ID">
                            <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {host?.display_name}{' '}
                          {host?.date_of_birth && (
                            <span className="text-slate-400 font-normal text-sm">{calculateAge(host.date_of_birth)}</span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {host?.origin_flag} {host?.origin_country} • ⭐️ {host?.reliability_score}
                        </p>
                      </div>
                    </div>

                    {/* Category pill */}
                    <div className="flex items-center gap-1.5">
                      {plan.female_only && (
                        <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-purple-200">
                          ♀ Only
                        </span>
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        plan.category === 'dining'
                          ? 'bg-indigo-50 text-indigo-700'
                          : plan.category === 'outdoor_walk'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {getCategoryLabel(plan.category)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {plan.title}
                  </h4>

                  {/* Description snippet */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {plan.description}
                  </p>

                  {/* Location & Time */}
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>📍</span>
                      <span className="truncate">{plan.venue_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-900 font-bold shrink-0 ml-auto">
                      <span>⏰</span>
                      <span>{formatPlanDateTime(plan.start_time, plan.end_time)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Capacity Counter & Confirmed Member Circles */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {planParticipants.slice(0, 3).map((p) => {
                        const user = allUsers.find((u) => u.id === p.user_id);
                        return (
                          <img
                            key={p.id}
                            src={user?.profile_photo_url}
                            alt={user?.display_name}
                            className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white object-cover"
                            title={user?.display_name}
                          />
                        );
                      })}
                      {spotsFilled > 3 && (
                        <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center text-slate-500 text-xs font-bold">
                          +{spotsFilled - 3}
                        </div>
                      )}
                      {spotsFilled === 0 && (
                        <div className="w-10 h-10 border-2 border-dashed border-slate-200 rounded-full text-slate-400 flex items-center justify-center text-[10px] font-bold">
                          EMPTY
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 ml-1">
                      <span className={spotsFilled === plan.max_participants ? 'text-amber-600 font-bold' : 'text-indigo-600 font-bold'}>
                        {spotsFilled}/{plan.max_participants}
                      </span>{' '}
                      spots
                    </span>
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95">
                    Join ($10 Dep)
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div id="discovery-empty-state" className="col-span-full bg-white border-2 border-slate-100 rounded-[32px] p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <Calendar className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">
              No plans scheduled for this window
            </h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Be the one who starts it. Post a 2–4 hour micro-plan at any public cafe, restaurant, or landmark in {city.name}.
            </p>
            <div className="pt-2">
              <button
                id="btn-empty-state-create-plan"
                onClick={() => setIsHostModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Create a Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
