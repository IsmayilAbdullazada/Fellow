import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Play,
  X,
  CreditCard,
  ChevronRight,
  Plane,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CITY_HUBS } from '../data/mockData';

export const LandingView: React.FC = () => {
  const {
    setActiveTab,
    setIsAuthModalOpen,
    setSelectedPlanId,
    activeCityCode,
    setActiveCityCode,
    plans,
    allUsers,
    participants,
    isAuthenticated,
  } = useFellow();

  const [activeHubTab, setActiveHubTab] = useState<'TYO_JP' | 'LIS_PT'>('TYO_JP');
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(1);
  const [femaleFilterPreview, setFemaleFilterPreview] = useState<boolean>(true);

  // Filter plans for the showcase
  const activeHubPlans = plans.filter(
    (p) => p.city_code === activeHubTab && p.status !== 'cancelled'
  );

  const getParticipantsForPlan = (planId: string) => {
    const planParts = participants.filter(
      (p) => p.plan_id === planId && p.rsvp_status === 'confirmed'
    );
    return planParts.map((p) => {
      const user = allUsers.find((u) => u.id === p.user_id);
      return {
        ...p,
        user,
      };
    });
  };

  return (
    <div className="relative pb-24 pt-1 animate-in fade-in duration-300 selection:bg-[#E64A2A] selection:text-white">
      {/* Specular Ambient Backlight Gradients (Warm Sunset + Soft Emerald) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(230,74,42,0.08)_0%,transparent_70%)] pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-96 left-0 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.05)_0%,transparent_70%)] pointer-events-none -z-10 blur-3xl" />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION (Split 55/45 Layout)                           */}
      {/* ========================================================================= */}
      <section className="bg-white border border-[#EAE7E2] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden text-left mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (55%): Warm Editorial Typography & CTA */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Cohort Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF5F2] border border-[#FADCD5] text-xs font-semibold text-[#1A1918]">
              <span className="w-2 h-2 rounded-full bg-[#E64A2A] animate-pulse" />
              <span>Autumn Cohorts Open: Tokyo & Lisbon</span>
            </div>

            {/* Headline in Editorial Serif */}
            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[52px] font-semibold text-[#1A1918] leading-[1.12] tracking-tight">
              The best tables in Tokyo and Lisbon are better shared.
            </h1>

            {/* Subheadline in Geometric Sans */}
            <p className="text-sm sm:text-base text-[#6B6966] leading-relaxed max-w-xl font-normal">
              Curated 4-person dinners, cafe co-working sessions, and golden hour walks with verified solo travelers.
              No dating dynamics, no endless group chats, and zero flakes.
            </p>

            {/* CTA Cluster */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="hero-btn-explore-tables"
                onClick={() => {
                  setActiveCityCode(activeHubTab);
                  setActiveTab('discover');
                }}
                className="h-[52px] px-7 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-[#E64A2A]/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Browse Tonight&apos;s Tables</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-walkthrough"
                onClick={() => setIsWalkthroughOpen(true)}
                className="h-[52px] px-6 rounded-full bg-white hover:bg-[#F9F8F6] text-[#1A1918] border border-[#EAE7E2] font-semibold text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#E64A2A] fill-[#E64A2A]" />
                <span>See How It Works (1 min)</span>
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-4 border-t border-[#F0EDE8] flex flex-wrap items-center gap-3 text-xs text-[#6B6966]">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Elena (Spain)"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Kenji (Canada)"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Chloe (Australia)"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Marcus (UK)"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1 text-[#EAB308]">
                {'★'.repeat(5)}
              </div>

              <span className="font-medium text-[#1A1918]">
                Rated 4.9/5 by 300+ solo travelers in Tokyo & Lisbon · 100% Identity-Verified
              </span>
            </div>
          </div>

          {/* Right Column (45%): 3-Layered Floating Tactile Hero Bento */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#EAE7E2] shadow-xl group">
              {/* Layer 1: Warm 35mm Candid Photograph of travelers laughing at izakaya */}
              <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=85"
                  alt="Travelers dining together at Tokyo Izakaya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Film grain / dark gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/85 via-[#1A1918]/25 to-transparent pointer-events-none" />
              </div>

              {/* Layer 2 (Top Floating Chip): Angled -4 deg Identity Badge */}
              <div className="absolute top-4 right-4 rotate-[-3deg] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-lg text-[11px] font-semibold text-[#1A1918] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />
                <span>Stripe Verified · All 3 Guests ID-Checked</span>
              </div>

              {/* Layer 3 (Mid Floating UI Card): Real Live Plan Card in Frosted Glass */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-white/70 rounded-2xl p-4 shadow-xl text-left space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full bg-[#FDF5F2] text-[#E64A2A] border border-[#FADCD5]">
                    Tonight · 7:30 PM (2 hrs)
                  </span>
                  <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                    3/4 Seats Claimed
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-base font-semibold text-[#1A1918]">
                    🍣 Standing Sushi & Natural Wine · Ginza
                  </h3>
                  <p className="text-[11px] text-[#6B6966] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#E64A2A]" />
                    <span>Uogashi Nihon-Ichi · Ginza, Tokyo</span>
                  </p>
                </div>

                {/* Confirmed Attendees + "You?" Placeholder */}
                <div className="pt-2 border-t border-[#EAE7E2]/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                          alt="Elena"
                          className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        />
                        <span className="absolute -bottom-1 -right-1 text-[10px]">🇪🇸</span>
                      </div>
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                          alt="Kenji"
                          className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        />
                        <span className="absolute -bottom-1 -right-1 text-[10px]">🇨🇦</span>
                      </div>
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                          alt="Sarah"
                          className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        />
                        <span className="absolute -bottom-1 -right-1 text-[10px]">🇺🇸</span>
                      </div>
                    </div>

                    {/* Empty Spot: You? */}
                    <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#E64A2A] bg-[#FFF5F2] flex items-center justify-center text-[10px] font-bold text-[#E64A2A] animate-pulse">
                      ?
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCityCode('TYO_JP');
                      setSelectedPlanId('plan_tokyo_ginza_sushi');
                    }}
                    className="py-1.5 px-3 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Claim Last Seat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE ASYMMETRICAL "HIGH-TRUST" BENTO GRID                              */}
      {/* ========================================================================= */}
      <section className="space-y-6 text-left mb-14">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E64A2A]">
            Engineered for Genuine Human Connection
          </span>
          <h2 className="font-editorial text-2xl sm:text-4xl font-semibold text-[#1A1918] mt-1">
            Re-architected for comfort, trust, and zero awkwardness.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6966] max-w-xl mt-1.5">
            Every feature on Fellow is built to eliminate the anxiety, ghosting, and predatory dynamics of traditional social apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CARD 1: THE DIGITAL PASSPORT (Span 2 Columns) */}
          <div className="md:col-span-2 bg-[#1A1918] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#2E2C29] shadow-md flex flex-col justify-between group">
            {/* Holographic foil glow overlay */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#E64A2A]/20 via-[#3B82F6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#A3A09A]">
                  FELLOW VERIFIED PASSPORT™
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#059669]/20 border border-[#059669]/40 text-[#34D399] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Stripe Biometric Verified</span>
                </div>
              </div>

              {/* Obsidian Holographic Card Mockup */}
              <div className="bg-gradient-to-r from-[#242321] to-[#1C1B1A] border border-[#3D3A37] rounded-2xl p-5 shadow-xl max-w-md space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Elena Rostova"
                    className="w-12 h-12 rounded-xl object-cover border border-[#4F4B47]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-editorial text-base font-semibold text-white">Elena R.</p>
                      <span className="text-sm">🇪🇸</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                    </div>
                    <p className="text-[11px] font-mono-code text-[#9C9892]">
                      COHORT ID: TYO-2026-9812 · PASSPORT
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#33302D] flex items-center justify-between text-[11px] text-[#A3A09A]">
                  <span>RELIABILITY SCORE: <strong className="text-white font-mono-code">100%</strong></span>
                  <span>ATTENDANCE: <strong className="text-white font-mono-code">8/8 MEETS</strong></span>
                  <span className="text-[#34D399]">NO RECENT STRIKES</span>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-white">
                  Zero anonymous strangers. Ever.
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A09A] leading-relaxed mt-1 max-w-lg">
                  Bank-grade verification filters out bots, trolls, and bad actors before they enter. Every member completes 3D biometric liveness and government ID validation.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#2E2C29] flex items-center justify-between text-xs text-[#A3A09A]">
              <span>Platonic Community Charter signed prior to entry</span>
              <span className="text-[#E64A2A] font-semibold">Strictly Non-Dating Policy →</span>
            </div>
          </div>

          {/* CARD 2: ANTI-FLAKE ENGINE (Span 1 Column) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE7E2] shadow-sm flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#E64A2A]">
                  Pre-Auth Hold Engine
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  96% Show-Up Rate
                </span>
              </div>

              {/* Interactive Apple Pay / Transaction Receipt Mockup */}
              <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-4 space-y-2 text-xs font-mono-code">
                <div className="flex items-center justify-between text-[#6B6966]">
                  <span>Authorized Hold:</span>
                  <span className="text-[#1A1918] font-bold">$10.00 USD</span>
                </div>
                <div className="flex items-center justify-between text-[#6B6966]">
                  <span>Host Table QR:</span>
                  <span className="text-[#059669] font-semibold">Scanned 7:32 PM</span>
                </div>
                <div className="pt-1.5 border-t border-[#EAE7E2] flex items-center justify-between text-xs font-bold text-[#059669]">
                  <span>Final Billed Charge:</span>
                  <span className="bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                    $0.00 (VOIDED)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">
                  The $0 Anti-Flake Guarantee
                </h3>
                <p className="text-xs text-[#6B6966] leading-relaxed mt-1">
                  People show up because their word is backed by a temporary deposit. Arrive at the table, scan the host’s QR code, and your $10 authorization is instantly voided.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE7E2] text-[11px] text-[#9C9892]">
              Protected by Stripe Pre-Authorization Escrow
            </div>
          </div>

          {/* CARD 3: GENDER-SAFE ARCHITECTURE (Span 1 Column) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE7E2] shadow-sm flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9D174D]">
                  Safety By Design
                </span>
                <span className="text-xs">🛡️</span>
              </div>

              {/* Toggle switch graphic */}
              <div className="bg-[#FDF2F4] border border-[#FBCFE8] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#9D174D]">
                    Female-Only Feed Filter
                  </span>
                  <button
                    onClick={() => setFemaleFilterPreview(!femaleFilterPreview)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      femaleFilterPreview ? 'bg-[#9D174D]' : 'bg-[#D1CDC7]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        femaleFilterPreview ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-[#9D174D]/80 leading-snug">
                  {femaleFilterPreview
                    ? '✓ Showing 2 verified female tables (Sunset Miradouro & Ginza Sushi)'
                    : 'Showing all mixed verified tables'}
                </p>
              </div>

              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">
                  Women’s Safety as an Architecture
                </h3>
                <p className="text-xs text-[#6B6966] leading-relaxed mt-1">
                  Verified female solo travelers can create or join plans visible exclusively to other verified women with a single toggle. Zero male visibility when enabled.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE7E2] text-[11px] text-[#9C9892]">
              Enforced at the database and UI query level
            </div>
          </div>

          {/* CARD 4: 24-HR GHOST PURGE (Span 2 Columns) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EC] rounded-3xl p-6 sm:p-8 border border-[#EAE7E2] shadow-sm flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6B6966]">
                  Ephemeral Traveler Lifecycle
                </span>
                <span className="text-xs font-mono-code font-bold text-[#E64A2A] bg-white px-2.5 py-0.5 rounded-full border border-[#EAE7E2]">
                  AUTO-EXPIRING ARCHITECTURE
                </span>
              </div>

              {/* Expiring Boarding Pass Mockup */}
              <div className="bg-white border border-[#EAE7E2] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-dashed border-[#EAE7E2] pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#E64A2A]" />
                    <span className="font-mono-code font-bold text-xs text-[#1A1918]">LIS → LHR</span>
                  </div>
                  <div className="px-2.5 py-0.5 rounded bg-[#F9F8F6] border border-[#EAE7E2] text-[11px] font-mono-code text-[#6B6966]">
                    FLIGHT DEPARTED: 24H AGO
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-[#9C9892] uppercase font-mono-code">PROFILE STATUS</p>
                    <p className="font-semibold text-[#1A1918] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E64A2A]" />
                      <span>Purged & Archived</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#9C9892] uppercase font-mono-code">MICRO-CHAT STATUS</p>
                    <p className="font-semibold text-[#1A1918]">Dissolved into 0 bytes</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#9C9892] uppercase font-mono-code">LOCATION RESIDUAL</p>
                    <p className="font-semibold text-[#059669]">Zero Lat/Lng Cached</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1A1918]">
                  Fresh Cities, Zero Zombie Profiles
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed mt-1">
                  Fellow reflects who is in town right now. No inactive accounts from six months ago, and no permanent chat history. 24 hours after your trip window closes, your profile and group chats archive automatically.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE7E2] flex items-center justify-between text-xs text-[#6B6966]">
              <span>Trip-window locking keeps feeds 100% current</span>
              <span className="font-semibold text-[#1A1918]">High Signal · Zero Stale Noise</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "LIVE TABLES" SHOWCASE (Replacing the "1 Plans Live" Low-Count State)  */}
      {/* ========================================================================= */}
      <section className="space-y-6 text-left mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E64A2A]">
              Explore Current Cohorts
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-semibold text-[#1A1918] mt-1">
              Curated tables happening this week.
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6966] mt-1">
              Every meetup is limited to 2–4 people at verified, vibrant local venues.
            </p>
          </div>

          {/* City Hub Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EAE7E2] rounded-full shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setActiveHubTab('TYO_JP')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHubTab === 'TYO_JP'
                  ? 'bg-[#1A1918] text-white shadow-xs'
                  : 'text-[#6B6966] hover:text-[#1A1918]'
              }`}
            >
              <span>🇯🇵</span>
              <span>Tokyo Hub</span>
            </button>
            <button
              onClick={() => setActiveHubTab('LIS_PT')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHubTab === 'LIS_PT'
                  ? 'bg-[#1A1918] text-white shadow-xs'
                  : 'text-[#6B6966] hover:text-[#1A1918]'
              }`}
            >
              <span>🇵🇹</span>
              <span>Lisbon Hub</span>
            </button>
          </div>
        </div>

        {/* Live Table Cards Grid with Rich Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeHubPlans.map((plan) => {
            const host = allUsers.find((u) => u.id === plan.host_user_id);
            const planParts = getParticipantsForPlan(plan.id);
            const spotsRemaining = plan.max_participants - planParts.length;

            return (
              <div
                key={plan.id}
                onClick={() => {
                  setActiveCityCode(plan.city_code);
                  setSelectedPlanId(plan.id);
                }}
                className="group cursor-pointer bg-white border border-[#EAE7E2] hover:border-[#1A1918] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#EAE7E2]">
                    <img
                      src={plan.photo_url || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'}
                      alt={plan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[#1A1918] shadow-2xs">
                        {plan.category.replace('_', ' ')}
                      </span>
                      {plan.female_only && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-[#FDF2F4]/95 backdrop-blur-sm border border-[#FBCFE8] text-[#9D174D] shadow-2xs">
                          ♀ Female Only
                        </span>
                      )}
                    </div>

                    {/* Spots Remaining Indicator */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                      <span className="flex items-center gap-1 drop-shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Tonight · 2 hrs</span>
                      </span>
                      <span className="bg-[#E64A2A] text-white px-2 py-0.5 rounded-full font-bold text-[11px] shadow-sm">
                        {spotsRemaining > 0 ? `${spotsRemaining} Spot${spotsRemaining > 1 ? 's' : ''} Left` : 'Table Full'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="font-editorial text-lg font-semibold text-[#1A1918] group-hover:text-[#E64A2A] transition-colors line-clamp-1">
                      {plan.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#6B6966]">
                      <MapPin className="w-3.5 h-3.5 text-[#E64A2A] shrink-0" />
                      <span className="truncate">{plan.venue_name}</span>
                    </div>

                    <p className="text-xs text-[#6B6966] line-clamp-2 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Attendees Row with Nationality Flags */}
                    <div className="pt-3 border-t border-[#EAE7E2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {planParts.map((part) => (
                            <div key={part.id} className="relative" title={part.user?.display_name}>
                              <img
                                src={part.user?.profile_photo_url}
                                alt={part.user?.display_name}
                                className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-2xs"
                              />
                              <span className="absolute -bottom-1 -right-1 text-[8px]">
                                {part.user?.origin_flag}
                              </span>
                            </div>
                          ))}
                          {spotsRemaining > 0 && (
                            <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#D1CDC7] bg-[#F9F8F6] flex items-center justify-center text-[9px] text-[#9C9892]">
                              +
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-[#9C9892]">
                          Hosted by {host?.display_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Bar */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCityCode(plan.city_code);
                      setSelectedPlanId(plan.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Request Seat ($10 Hold)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXCLUSIVE CLUB FOOTER CTA                                             */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#1A1918] to-[#242220] rounded-3xl p-8 sm:p-12 text-white text-left relative overflow-hidden border border-[#33302D] shadow-xl">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#EAE7E2]">
            <span>🌿 Guest Browsing Active</span>
            <span>·</span>
            <span>No Payment Required to Explore</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-semibold leading-tight">
            Ready to experience solo travel without loneliness?
          </h2>

          <p className="text-xs sm:text-sm text-[#A3A09A] leading-relaxed max-w-xl">
            Browse active tables freely as a guest. When you are ready to claim a seat or host your own dinner in Tokyo or Lisbon, join the verified circle in under two minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                setActiveCityCode('TYO_JP');
                setActiveTab('discover');
              }}
              className="py-3.5 px-7 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E64A2A]/25 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Active Tables Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Get Verified ($9.99 Pass)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View My Verified Passport</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#E64A2A]/10 blur-3xl pointer-events-none" />
      </section>

      {/* ========================================================================= */}
      {/* 5. 60-SECOND WALKTHROUGH MODAL                                           */}
      {/* ========================================================================= */}
      {isWalkthroughOpen && (
        <div
          id="walkthrough-modal-overlay"
          className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsWalkthroughOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E64A2A]">
                <Sparkles className="w-4 h-4" />
                <span>How Fellow Works (Step {walkthroughStep} of 3)</span>
              </div>

              {walkthroughStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="h-44 rounded-2xl overflow-hidden border border-[#EAE7E2] relative">
                    <img
                      src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"
                      alt="Curated 4-Person Table"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <p className="text-white text-xs font-medium">
                        Rule #1: Exactly 2 to 4 travelers per table.
                      </p>
                    </div>
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">
                    Curated 4-Person Micro-Meetups
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed">
                    No overwhelming 30-person pub crawls. Fellow caps every table strictly at 4 participants so real conversation happens naturally without cliquey dynamics.
                  </p>
                </div>
              )}

              {walkthroughStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="h-44 rounded-2xl bg-[#F9F8F6] border border-[#EAE7E2] p-5 flex flex-col justify-center space-y-2 font-mono-code text-xs">
                    <div className="flex items-center justify-between text-[#6B6966]">
                      <span>Stripe Authorization:</span>
                      <span className="font-bold text-[#1A1918]">$10.00 (Escrow Hold)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#059669]">
                      <span>Host Table QR Check-In:</span>
                      <span className="font-bold">Scanned at 7:32 PM</span>
                    </div>
                    <div className="pt-2 border-t border-[#EAE7E2] flex items-center justify-between font-bold text-sm text-[#059669]">
                      <span>Billed Amount:</span>
                      <span className="bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">$0.00</span>
                    </div>
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">
                    Zero Flakes with Temporary Holds
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed">
                    Seats are held with a temporary $10 pre-authorization. When you meet the host and scan their table QR code, your hold is released to $0 immediately.
                  </p>
                </div>
              )}

              {walkthroughStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="h-44 rounded-2xl bg-[#1A1918] text-white p-5 flex flex-col justify-between border border-[#2E2C29]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A3A09A]">COMMUNITY CHARTER</span>
                      <span className="text-[#34D399] font-bold">100% PLATONIC</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-editorial text-lg text-white">Zero Dating Dynamics</p>
                      <p className="text-xs text-[#A3A09A]">
                        Fellow is strictly for platonic friendship and city discovery. Inappropriate behavior results in an immediate permanent ban.
                      </p>
                    </div>
                    <div className="text-[11px] text-[#A3A09A]">
                      Chats dissolve 24 hours after each meetup.
                    </div>
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">
                    Strictly Platonic & Ephemeral
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed">
                    Zero creep behavior, zero dating ambiguity. All chats dissolve 24 hours after the table concludes, protecting your privacy everywhere you travel.
                  </p>
                </div>
              )}

              {/* Modal Step Controls */}
              <div className="pt-4 border-t border-[#EAE7E2] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <span
                      key={s}
                      className={`h-1.5 rounded-full transition-all ${
                        walkthroughStep === s ? 'w-6 bg-[#E64A2A]' : 'w-2 bg-[#EAE7E2]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {walkthroughStep > 1 && (
                    <button
                      onClick={() => setWalkthroughStep(walkthroughStep - 1)}
                      className="px-4 py-2 rounded-full border border-[#EAE7E2] text-xs font-semibold hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                  )}
                  {walkthroughStep < 3 ? (
                    <button
                      onClick={() => setWalkthroughStep(walkthroughStep + 1)}
                      className="px-5 py-2 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsWalkthroughOpen(false);
                        setActiveTab('discover');
                      }}
                      className="px-5 py-2 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Start Exploring
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
