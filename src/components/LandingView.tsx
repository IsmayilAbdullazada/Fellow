import React from 'react';
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  Users,
  MapPin,
  Clock,
  QrCode,
  Sparkles,
  Lock,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';

export const LandingView: React.FC = () => {
  const {
    setActiveTab,
    setIsAuthModalOpen,
    plans,
    activeCityCode,
    setActiveCityCode,
    setIsCityModalOpen,
    isAuthenticated,
  } = useFellow();

  const tokyoPlans = plans.filter((p) => p.city_code === 'TYO_JP' && p.status !== 'cancelled');
  const lisbonPlans = plans.filter((p) => p.city_code === 'LIS_PT' && p.status !== 'cancelled');

  return (
    <div className="space-y-12 pb-16 pt-2 animate-in fade-in duration-300">
      {/* Editorial Hero Section */}
      <section className="text-left bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] opacity-40 pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-5">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-semibold text-[#1A1918]">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span>Pilot Cohort Live in Tokyo & Lisbon</span>
            <span className="text-[#9C9892]">·</span>
            <span className="text-[#6B6966]">Strictly Platonic</span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#1A1918] leading-[1.15] tracking-tight">
            High-trust micro-meetups for solo travelers.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#6B6966] leading-relaxed max-w-xl">
            Meet 1 to 3 verified travelers for specialty coffee, izakaya dinners, or sunset lookouts.
            No dating algorithms, no ghosting, and zero dormant zombie profiles.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="hero-btn-explore-guest"
              onClick={() => setActiveTab('discover')}
              className="py-3.5 px-6 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E64A2A]/20 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Open Meetups (Guest)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isAuthenticated ? (
              <button
                id="hero-btn-sign-in"
                onClick={() => setIsAuthModalOpen(true)}
                className="py-3.5 px-6 rounded-full bg-white hover:bg-[#F9F8F6] text-[#1A1918] border border-[#EAE7E2] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Sign In / Join Cohort</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="py-3.5 px-6 rounded-full bg-white hover:bg-[#F9F8F6] text-[#1A1918] border border-[#EAE7E2] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>View My Verified Passport</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#9C9892] pt-1">
            Browse freely without committing. Government KYC and the $9.99 Lifetime Pass are only requested when you choose to join or host a table.
          </p>
        </div>
      </section>

      {/* The 4 Foundational Pillars (Anti-SaaS, Anti-Dating Charter) */}
      <section className="space-y-4 text-left">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
            Why Travelers Choose Fellow
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1A1918] mt-0.5">
            Designed to prevent the problems of traditional social apps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: Verified Identity */}
          <div className="bg-white border border-[#EAE7E2] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918]">
              100% Real Identities
            </h3>
            <p className="text-xs text-[#6B6966] leading-relaxed">
              Every traveler completes Stripe government ID verification and a 3D biometric selfie before booking. Zero anonymous accounts, bots, or catfishing.
            </p>
          </div>

          {/* Pillar 2: Platonic Non-Dating Policy */}
          <div className="bg-white border border-[#EAE7E2] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] flex items-center justify-center">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918]">
              Strictly Platonic Charter
            </h3>
            <p className="text-xs text-[#6B6966] leading-relaxed">
              Before taking any action, members sign a 3-second legally binding non-dating policy. Unwanted flirting results in an immediate lifetime ban without refund.
            </p>
          </div>

          {/* Pillar 3: Commercial Public Venues */}
          <div className="bg-white border border-[#EAE7E2] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918]">
              Public Commercial Venues Only
            </h3>
            <p className="text-xs text-[#6B6966] leading-relaxed">
              Meetups happen strictly at Google Places-verified establishments (cafes, standing sushi bars, viewpoints). Private residences and vague addresses are prohibited.
            </p>
          </div>

          {/* Pillar 4: $10 Anti-Flake Deposit */}
          <div className="bg-white border border-[#EAE7E2] rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918]">
              $10 Anti-Flake Commitment
            </h3>
            <p className="text-xs text-[#6B6966] leading-relaxed">
              Attendees place a temporary $10 authorization held by Stripe. The hold is voided to $0 immediately when you scan the host's QR code at the table.
            </p>
          </div>
        </div>
      </section>

      {/* Live Hubs & Open Meetups Snapshot */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
              Current Pilot Cohorts
            </span>
            <h2 className="font-editorial text-2xl font-semibold text-[#1A1918]">
              Explore Active Meetups Right Now
            </h2>
          </div>
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="text-xs font-semibold text-[#E64A2A] hover:underline flex items-center gap-1"
          >
            <span>Change City Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tokyo Card */}
          <div
            onClick={() => {
              setActiveCityCode('TYO_JP');
              setActiveTab('discover');
            }}
            className="group cursor-pointer bg-white border border-[#EAE7E2] hover:border-[#1A1918] rounded-2xl p-5 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E2]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇯🇵</span>
                  <div>
                    <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Tokyo</h3>
                    <p className="text-xs text-[#6B6966]">Shinjuku · Shibuya · Ginza</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  {tokyoPlans.length} Plans Live
                </span>
              </div>
              <p className="text-xs text-[#6B6966] mt-3 leading-relaxed">
                Yakitori crawls at Omoide Yokocho, morning cold brews at Meiji Shrine, and stand-and-eat Ginza sushi tables.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7E2] flex items-center justify-between text-xs text-[#1A1918] font-semibold group-hover:text-[#E64A2A]">
              <span>Enter Tokyo Hub</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Lisbon Card */}
          <div
            onClick={() => {
              setActiveCityCode('LIS_PT');
              setActiveTab('discover');
            }}
            className="group cursor-pointer bg-white border border-[#EAE7E2] hover:border-[#1A1918] rounded-2xl p-5 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E2]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇵🇹</span>
                  <div>
                    <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Lisbon</h3>
                    <p className="text-xs text-[#6B6966]">Chiado · Bairro Alto · Alfama</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  {lisbonPlans.length} Plans Live
                </span>
              </div>
              <p className="text-xs text-[#6B6966] mt-3 leading-relaxed">
                Golden hour viewpoints at Santa Catarina, coworking catchups at Time Out Market, and rooftop pastéis de nata.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7E2] flex items-center justify-between text-xs text-[#1A1918] font-semibold group-hover:text-[#E64A2A]">
              <span>Enter Lisbon Hub</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Temporal Decay Guarantee */}
      <section className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-3xl p-6 sm:p-8 text-left space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6966]">
          <Clock className="w-4 h-4 text-[#E64A2A]" />
          <span>Privacy by Architecture</span>
        </div>
        <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">
          24 hours after your flight departs, your presence disappears.
        </h3>
        <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed max-w-2xl">
          Fellow is designed for who is in town right now. We do not keep ghost profiles or endless chat archives. Chats dissolve 24 hours after meetups end, and travelers rotate cleanly with their trip dates.
        </p>

        <div className="pt-3">
          <button
            onClick={() => setActiveTab('discover')}
            className="py-3 px-5 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Start Browsing Tokyo & Lisbon</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
