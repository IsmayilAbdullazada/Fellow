import React, { useState } from 'react';
import { X, Bell, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { WaitlistRegion, CityCode } from '../types';

interface CityWaitlistModalProps {
  city: WaitlistRegion;
  onClose: () => void;
}

export const CityWaitlistModal: React.FC<CityWaitlistModalProps> = ({ city, onClose }) => {
  const { registerWaitlist, currentUser, setActiveCityCode, setActiveTab } = useFellow();

  const [arrivalDate, setArrivalDate] = useState<string>('2026-10-15');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-25');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const isUnlocked = city.registered_count >= city.threshold;
  const percentage = Math.min(100, Math.round((city.registered_count / city.threshold) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    registerWaitlist(city.id, arrivalDate, departureDate, email);
    setSubmitted(true);
  };

  const handleSwitchToLiveHub = (hubCode: CityCode) => {
    setActiveCityCode(hubCode);
    setActiveTab('discover');
    onClose();
  };

  const handleSimulateUnlock = () => {
    // Push count directly to threshold
    registerWaitlist(city.id, arrivalDate, departureDate, 'launch_cohort_200@fellow.travel');
  };

  return (
    <div
      id="city-waitlist-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isUnlocked ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
              <Sparkles className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-semibold mb-2">
                <span>{city.flag}</span>
                <span>Cohort Unlocked (200 / 200 Met)</span>
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">
                {city.city_name} is Now Live!
              </h3>
              <p className="text-xs text-[#6B6966] mt-1.5 leading-relaxed max-w-xs mx-auto">
                200 verified solo travelers have confirmed trips for {city.city_name}. The pilot hub is actively unlocked for small tables and sunset meetups.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleSwitchToLiveHub('TYO_JP')}
                className="w-full py-3 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Browse Live Meetups in Tokyo Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSwitchToLiveHub('LIS_PT')}
                className="w-full py-3 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Browse Live Meetups in Lisbon Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] text-[#1A1918] text-xs font-semibold transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">You're on the list!</h3>
              <p className="text-xs text-[#6B6966] mt-1.5 leading-relaxed max-w-xs mx-auto">
                We will email <span className="font-semibold text-[#1A1918]">{email}</span> as soon as {city.city_name} reaches 200 verified travelers for your dates ({arrivalDate} – {departureDate}).
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-3 w-full py-3 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs transition-all shadow-2xs cursor-pointer"
            >
              Return to Active Hubs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs font-semibold mb-2">
                <span>{city.flag}</span>
                <span>{city.country}</span>
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#1A1918] tracking-tight">
                Fellow isn't live in {city.city_name} yet
              </h3>
              <p className="text-xs text-[#6B6966] mt-1.5 leading-relaxed">
                We unlock new hubs strictly when 200 verified travelers are in town to guarantee active, high-trust meetups without ghosting.
              </p>
            </div>

            {/* Traveler Threshold Counter */}
            <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1A1918]">
                  {city.registered_count} / {city.threshold} travelers registered
                </span>
                <span className="text-[#E64A2A] font-bold font-mono-code text-xs">{percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#EAE7E2] overflow-hidden">
                <div
                  className="h-full bg-[#E64A2A] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#9C9892]">
                <span>Targeting unlock for {city.target_month} cohort.</span>
                <button
                  type="button"
                  onClick={handleSimulateUnlock}
                  className="text-[#E64A2A] hover:underline font-semibold"
                >
                  + Add 1 Member (Simulate)
                </button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">
                  When are you visiting {city.city_name}?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#9C9892] font-semibold block mb-0.5">Arrival</span>
                    <input
                      type="date"
                      required
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9C9892] font-semibold block mb-0.5">Departure</span>
                    <input
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1918]">Email for Hub Unlock Notice</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@nomad.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#1A1918] focus:bg-white placeholder:text-[#9C9892]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Notify Me When Unlocked</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
