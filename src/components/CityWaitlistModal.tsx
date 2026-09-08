import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Users,
  Bell,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { WaitlistRegion } from '../types';

interface CityWaitlistModalProps {
  city: WaitlistRegion;
  onClose: () => void;
}

export const CityWaitlistModal: React.FC<CityWaitlistModalProps> = ({ city, onClose }) => {
  const { registerWaitlist, currentUser } = useFellow();

  const [arrivalDate, setArrivalDate] = useState<string>('2026-10-15');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-25');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const percentage = Math.min(100, Math.round((city.registered_count / city.threshold) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    registerWaitlist(city.id, arrivalDate, departureDate, email);
    setSubmitted(true);
  };

  return (
    <div id="city-waitlist-modal-overlay" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-900 text-left relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-300 animate-in zoom-in-50 duration-300">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">You're on the list!</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                We will email <span className="font-bold text-slate-900">{email}</span> as soon as {city.city_name} hits 200 verified traveler signups for your dates ({arrivalDate} – {departureDate}).
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-3 w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-200 active:scale-[0.99]"
            >
              Return to Active Hubs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2.5">
                <span>{city.flag}</span>
                <span>{city.country}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Fellow isn't live in {city.city_name} yet
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                We unlock new hubs strictly when 200 verified travelers are in town to guarantee active, populated meetups without ghosting.
              </p>
            </div>

            {/* Traveler Threshold Counter */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {city.registered_count} / {city.threshold} travelers registered
                </span>
                <span className="text-indigo-600 font-extrabold text-xs">{percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                Targeting unlock for {city.target_month} travel cohort.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  When are you visiting {city.city_name}?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Arrival</span>
                    <input
                      type="date"
                      required
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Departure</span>
                    <input
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email for Hub Unlock Notice</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@nomad.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
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
