import React from 'react';
import { X, Check, MapPin, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';
import { CityCode, WaitlistRegion } from '../types';

export const CitySelectorModal: React.FC = () => {
  const {
    isCityModalOpen,
    setIsCityModalOpen,
    activeCityCode,
    setActiveCityCode,
    waitlistCities,
    setSelectedWaitlistCity,
  } = useFellow();

  if (!isCityModalOpen) return null;

  const handleSelectLiveCity = (code: CityCode) => {
    setActiveCityCode(code);
    setIsCityModalOpen(false);
  };

  const handleSelectWaitlistCity = (city: WaitlistRegion) => {
    setSelectedWaitlistCity(city);
    setIsCityModalOpen(false);
  };

  return (
    <div id="city-selector-modal-overlay" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-900 text-left relative animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Select City Hub</h3>
            <p className="text-xs text-slate-500 mt-0.5">Launch pilot hubs & expansion waitlists</p>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4">
          {/* Active Live Hubs (PRD 1.1: Strictly Tokyo & Lisbon) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                Live Pilot Hubs (Active)
              </span>
              <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                ● 2 Live Cities
              </span>
            </div>

            <div className="space-y-2">
              {Object.values(CITY_HUBS).map((hub) => {
                const isActive = hub.code === activeCityCode;
                return (
                  <button
                    key={hub.code}
                    onClick={() => handleSelectLiveCity(hub.code)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-2 border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{hub.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{hub.name}</span>
                          <span className="text-xs text-slate-500 font-medium">{hub.country}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{hub.tagline}</p>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unlaunched Hubs (Routes to Waitlist Screen 7) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                Upcoming Hubs (Waitlist)
              </span>
              <span className="text-[11px] text-slate-400">Unlocks at 200 members</span>
            </div>

            <div className="space-y-2">
              {waitlistCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectWaitlistCity(city)}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{city.flag}</span>
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {city.city_name}, {city.country}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {city.registered_count} / {city.threshold} travelers registered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-indigo-600 font-bold">
                    <span className="text-[11px]">Join Waitlist</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
