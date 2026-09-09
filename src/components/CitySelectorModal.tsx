import React from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
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
    <div
      id="city-selector-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE7E2]">
          <div>
            <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Select Travel Hub</h3>
            <p className="text-xs text-[#6B6966] mt-0.5">Pilot launch hubs & expansion waitlists</p>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4">
          {/* Active Live Hubs (Strictly Tokyo & Lisbon) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#9C9892] uppercase tracking-[0.06em] text-[11px]">
                Live Pilot Hubs (Active)
              </span>
              <span className="text-[10px] text-[#059669] font-semibold bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
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
                        ? 'border-[#1A1918] bg-[#F9F8F6] shadow-2xs'
                        : 'border-[#EAE7E2] bg-white hover:bg-[#F9F8F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{hub.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-editorial text-base font-semibold text-[#1A1918]">{hub.name}</span>
                          <span className="text-xs text-[#6B6966]">{hub.country}</span>
                        </div>
                        <p className="text-[11px] text-[#6B6966] line-clamp-1 mt-0.5">{hub.tagline}</p>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-[#1A1918] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unlaunched Hubs (Routes to Waitlist Screen 7) */}
          <div className="space-y-2 pt-3 border-t border-[#EAE7E2]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#9C9892] uppercase tracking-[0.06em] text-[11px]">
                Upcoming Hubs (Waitlist)
              </span>
              <span className="text-[11px] text-[#9C9892]">Unlocks at 200 members</span>
            </div>

            <div className="space-y-2">
              {waitlistCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectWaitlistCity(city)}
                  className="w-full p-3 rounded-2xl border border-[#EAE7E2] bg-[#F9F8F6] hover:bg-white text-left flex items-center justify-between transition-colors group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{city.flag}</span>
                    <div>
                      <p className="font-semibold text-xs text-[#1A1918] group-hover:text-[#E64A2A] transition-colors">
                        {city.city_name}, {city.country}
                      </p>
                      <span className="text-[11px] text-[#9C9892] font-mono-code">
                        {city.registered_count} / {city.threshold} registered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#9C9892] group-hover:text-[#E64A2A] font-semibold">
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
