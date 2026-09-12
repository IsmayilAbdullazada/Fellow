import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  AlertCircle,
  Award,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allUsers,
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

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 28;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div id="profile-view-container" className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6 text-left">
      {/* Component 4.2: The "Verified Passport" Status Card */}
      <div
        id="verified-passport-status-card"
        className="relative overflow-hidden bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-7 shadow-bento space-y-5"
      >
        {/* Subtle Watermark Pattern */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-[12px] border-[#EAE7E2]/40 pointer-events-none" />
        <div className="absolute top-3 right-5 text-[9px] font-mono-code uppercase tracking-[0.2em] text-[#9C9892]">
          FELLOW VERIFIED TRAVELER
        </div>

        {/* Passport Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Verified Photo Frame */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] overflow-hidden border-2 border-[#059669] shadow-sm bg-[#F9F8F6]">
                <img
                  src={currentUser.profile_photo_url}
                  alt={currentUser.display_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {currentUser.is_verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-[#059669] text-white rounded-full p-1 border-2 border-white shadow-xs"
                  title="Verified Solo Traveler"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1A1918]">
                  {currentUser.display_name}
                </h2>
                <span className="text-xl" title={currentUser.origin_country}>
                  {currentUser.origin_flag}
                </span>
              </div>
              <p className="text-xs text-[#6B6966] mt-0.5 font-medium">
                {calculateAge(currentUser.date_of_birth)} yrs · {currentUser.origin_country} · {currentUser.gender === 'female' ? 'Female Solo' : 'Solo Traveler'}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                {currentUser.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold tracking-wide">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    <span>VERIFIED ID</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-[11px] font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    <span>UNVERIFIED ACCOUNT</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Member Badge */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] uppercase font-mono-code text-[#9C9892]">Member ID</span>
            <span className="text-xs font-mono-code font-bold text-[#1A1918] bg-[#F9F8F6] px-2 py-1 rounded border border-[#EAE7E2] mt-0.5">
              TYO-{currentUser.id.slice(-4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Passport Verification Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Government ID</span>
            <p className="font-semibold text-[#1A1918] mt-0.5">
              {currentUser.is_verified ? 'Passport / ID Verified' : 'Pending Scan'}
            </p>
          </div>
          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Photo Check</span>
            <p className="font-semibold text-[#1A1918] mt-0.5">
              {currentUser.is_verified ? 'Confirmed Match' : 'Not Captured'}
            </p>
          </div>
          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Global Pass</span>
            <p className="font-semibold text-[#1A1918] mt-0.5">
              {currentUser.has_paid_pass ? '$9.99 Lifetime Active' : 'Unpaid'}
            </p>
          </div>
          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Reliability Score</span>
            <p className="font-semibold text-[#059669] mt-0.5">
              {currentUser.reliability_score}% ({currentUser.meetups_completed_count ?? 3} meetups)
            </p>
          </div>
        </div>

        {/* Verification Trigger if unverified */}
        {!currentUser.is_verified && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-[#D97706]">Verify Your Government ID</p>
              <p className="text-[11px] text-[#B45309]">
                ID verification is required to host or join meetups in Tokyo and Lisbon.
              </p>
            </div>
            <button
              onClick={startVerificationFlow}
              className="px-4 py-2 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
            >
              Verify Identity ($9.99)
            </button>
          </div>
        )}

        {/* Bio & Social Reference */}
        <div className="pt-2 border-t border-[#EAE7E2] space-y-2 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
            Traveler Bio & Context
          </span>
          <p className="text-[#6B6966] leading-relaxed italic">"{currentUser.bio}"</p>
          {currentUser.social_link && (
            <p className="text-[11px] text-[#9C9892] font-mono-code pt-0.5">
              Verified Handle: {currentUser.social_link}
            </p>
          )}
        </div>
      </div>

      {/* Temporal Decay Hub Trip Dates Card */}
      <div className="bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-7 shadow-bento space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E64A2A]" />
            <h3 className="font-semibold text-sm text-[#1A1918]">
              Active Hub Trip Dates ({city.name})
            </h3>
          </div>
          {isTripActive ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              Active Traveler
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F9F8F6] text-[#9C9892] border border-[#EAE7E2]">
              Decayed / Departed
            </span>
          )}
        </div>

        <p className="text-xs text-[#6B6966] leading-relaxed">
          <strong className="text-[#1A1918] font-semibold">Temporal Decay Rule:</strong> Profiles and listings are visible exclusively during your active trip dates. All presence automatically decays and disappears 24 hours after departure to eliminate ghost profiles.
        </p>

        <form onSubmit={handleSaveTrip} className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#6B6966]">Arrival Date</label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] font-medium focus:outline-none focus:border-[#E64A2A]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#6B6966]">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] font-medium focus:outline-none focus:border-[#E64A2A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs transition-all active:scale-95"
            >
              Update Trip Window
            </button>
            {tripSavedNotice && (
              <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Trip dates updated!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Dev Mode Only: Switch Persona Simulation Bar */}
      {typeof window !== 'undefined' && (window.location.search.includes('dev=true') || localStorage.getItem('fellow_dev_mode') === 'true') && (
        <div className="bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-7 shadow-bento space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#1A1918]">Developer Sandbox: Switch Persona</h3>
            <span className="text-[11px] text-[#9C9892]">Gated QA Mode</span>
          </div>
          <p className="text-xs text-[#6B6966]">
            Switch between personas to test verification requirements, host check-in QR codes, and female-only safety policies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {allUsers.map((u) => {
              const isSelected = currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchPersona(u.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#E64A2A] bg-[#E64A2A]/5 text-[#1A1918] font-semibold shadow-2xs'
                      : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:border-[#D1CDC7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#1A1918] flex items-center gap-1.5">
                      <span>{u.display_name}</span>
                      <span>{u.origin_flag}</span>
                    </p>
                    <span className="text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EAE7E2] text-[#6B6966]">
                      {u.gender === 'female' ? '♀ Female' : '♂ Male'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[11px] font-medium ${
                        u.is_verified ? 'text-[#059669]' : 'text-[#D97706]'
                      }`}
                    >
                      {u.is_verified ? '✓ ID Verified · Active' : '● Unverified Traveler'}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#E64A2A] text-white px-2 py-0.2 rounded-full font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety & Charter Review */}
      <div className="bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-7 shadow-bento space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#1A1918]">Safety & Trust Shield</h3>
          {mutedUserIds.length > 0 && (
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FDF2F2] text-[#DC2626] border border-[#F87171]">
              {mutedUserIds.length} Muted Users
            </span>
          )}
        </div>

        <p className="text-xs text-[#6B6966] leading-relaxed">
          Zero tolerance for dating behavior, unsolicited private messages, or commercial promotion.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setIsCodeOfConductOpen(true)}
            className="w-full py-3 px-4 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] border border-[#EAE7E2] text-xs font-semibold text-[#1A1918] transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Review Platonic Non-Dating Charter</span>
          </button>
        </div>
      </div>

      {/* Discrete QA Sandbox Toggle for Evaluation */}
      <div className="pt-2 pb-4 text-center">
        <button
          type="button"
          onClick={() => {
            const current = localStorage.getItem('fellow_dev_mode') === 'true';
            localStorage.setItem('fellow_dev_mode', current ? 'false' : 'true');
            window.location.reload();
          }}
          className="text-[10px] text-[#9C9892] hover:text-[#1A1918] transition-colors uppercase tracking-widest font-mono-code cursor-pointer"
        >
          {typeof window !== 'undefined' && (window.location.search.includes('dev=true') || localStorage.getItem('fellow_dev_mode') === 'true')
            ? '● QA Sandbox Active (Click to Disable)'
            : '○ QA Persona Sandbox (Click to Enable)'}
        </button>
      </div>
    </div>
  );
};
