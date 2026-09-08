import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Calendar,
  Globe,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    currentTrip,
    isTripActive,
    updateCurrentUserTripDates,
    startVerificationFlow,
    setIsCodeOfConductOpen,
    switchPersona,
    activeCityCode,
    mutedUserIds,
  } = useFellow();

  const city = CITY_HUBS[activeCityCode] || CITY_HUBS.TYO_JP;

  const [arrivalDate, setArrivalDate] = useState<string>(
    currentTrip?.arrival_date || new Date().toISOString().split('T')[0]
  );
  const [departureDate, setDepartureDate] = useState<string>(() => {
    if (currentTrip?.departure_date) return currentTrip.departure_date;
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [tripSavedNotice, setTripSavedNotice] = useState<boolean>(false);

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserTripDates(arrivalDate, departureDate);
    setTripSavedNotice(true);
    setTimeout(() => setTripSavedNotice(false), 2500);
  };

  return (
    <div id="profile-view-container" className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-5 text-left">
      {/* Profile Header Card */}
      <div className="bg-white border-2 border-slate-100 rounded-[32px] p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={currentUser.profile_photo_url}
              alt={currentUser.display_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
            />
            {currentUser.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 truncate">{currentUser.full_name}</h2>
              <span className="text-base shrink-0">{currentUser.origin_flag}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Display name: <strong className="text-slate-800">{currentUser.display_name}</strong> · {currentUser.origin_country}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Native language: {currentUser.native_language}
            </p>
          </div>
        </div>

        {/* Verification Status Banner */}
        {currentUser.is_verified && currentUser.has_paid_pass ? (
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                Verified Global Pass Active ($9.99 Paid)
              </span>
            </div>
            <span className="text-[10px] text-indigo-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-sm">Lifetime KYC</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900">Unverified Profile</p>
              <p className="text-[11px] text-amber-800/80">
                Complete Stripe Identity scan to unlock hosting & RSVPing.
              </p>
            </div>
            <button
              onClick={startVerificationFlow}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors shadow-md shadow-indigo-200"
            >
              Verify ($9.99)
            </button>
          </div>
        )}

        {/* Reliability Score Box (PRD Part 4.1) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-indigo-600 mb-0.5">
              <Award className="w-4 h-4" />
              <span className="font-extrabold text-lg">{currentUser.reliability_score}%</span>
            </div>
            <span className="text-xs font-bold text-slate-800 block">Reliability Score</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Begins at 100% · Guaranteed anti-ghosting
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-indigo-600 mb-0.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span className="font-extrabold text-lg">${currentUser.deposit_balance_cents / 100}</span>
            </div>
            <span className="text-xs font-bold text-slate-800 block">Pre-Auth Deposit</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              $10 hold per RSVP · Released on QR scan
            </span>
          </div>
        </div>
      </div>

      {/* Active Trip Window & Temporal Decay Manager (PRD Rule 1) */}
      <div className="bg-white border-2 border-slate-100 rounded-[32px] p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900">Active Hub Trip Dates ({city.name})</h3>
          </div>
          {isTripActive ? (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active Traveler
            </span>
          ) : (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              Decayed / Departed
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-800">Temporal Decay Rule:</strong> Profiles and listings are visible exclusively during your trip dates. All presence automatically decays and disappears 24 hours after departure to eliminate ghost profiles.
        </p>

        <form onSubmit={handleSaveTrip} className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Arrival Date</label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all active:scale-95"
            >
              Update Trip Window
            </button>
            {tripSavedNotice && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Trip dates updated!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Switch Persona Simulation Bar */}
      <div className="bg-white border-2 border-slate-100 rounded-[32px] p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Switch Test Persona</h3>
          <span className="text-[11px] font-bold text-slate-400">Fast-switch MVP roles</span>
        </div>
        <p className="text-xs text-slate-500">
          Switch between personas to test verification requirements, host check-in QR codes, and female-only safety policies:
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => switchPersona('usr_elena_nomad')}
            className={`p-3 rounded-2xl border-2 text-left transition-all ${
              currentUser.id === 'usr_elena_nomad'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
            }`}
          >
            <p className="font-bold text-slate-900">Elena Rostova 🇪🇪</p>
            <span className="text-[11px] text-slate-500 font-medium">Verified Nomad · Guest</span>
          </button>

          <button
            onClick={() => switchPersona('usr_sakura_host')}
            className={`p-3 rounded-2xl border-2 text-left transition-all ${
              currentUser.id === 'usr_sakura_host'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
            }`}
          >
            <p className="font-bold text-slate-900">Sakura Tanaka 🇯🇵</p>
            <span className="text-[11px] text-slate-500 font-medium">Female Host · Tokyo</span>
          </button>

          <button
            onClick={() => switchPersona('usr_mateo_lisbon')}
            className={`p-3 rounded-2xl border-2 text-left transition-all ${
              currentUser.id === 'usr_mateo_lisbon'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
            }`}
          >
            <p className="font-bold text-slate-900">Mateo Silva 🇵🇹</p>
            <span className="text-[11px] text-slate-500 font-medium">Verified Host · Lisbon</span>
          </button>

          <button
            onClick={() => switchPersona('usr_alex_backpacker')}
            className={`p-3 rounded-2xl border-2 text-left transition-all ${
              currentUser.id === 'usr_alex_backpacker'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
            }`}
          >
            <p className="font-bold text-slate-900">Alex Chen 🇺🇸</p>
            <span className="text-[11px] text-amber-600 font-bold">Unverified Backpacker</span>
          </button>
        </div>
      </div>

      {/* Safety & Charter Review */}
      <div className="bg-white border-2 border-slate-100 rounded-[32px] p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Safety & Trust Shield</h3>
          {mutedUserIds.length > 0 && (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {mutedUserIds.length} Muted Users
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Zero tolerance for dating behavior, unsolicited private messages, or commercial promotion.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setIsCodeOfConductOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Review Platonic Non-Dating Charter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
