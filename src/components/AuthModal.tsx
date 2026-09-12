import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  Sparkles,
  User as UserIcon,
  Calendar,
  MapPin,
  Globe,
  Camera,
  Check,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { CityCode, UserGender } from '../types';
import { CITY_HUBS } from '../data/mockData';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
];

const ORIGIN_COUNTRIES = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Brazil', flag: '🇧🇷' },
];

const SAMPLE_AVATARS_FEMALE = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80',
];

const SAMPLE_AVATARS_MALE = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&h=300&q=80',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    registerUser,
    allUsers,
    pendingAction,
    setIsCodeOfConductOpen,
    setIsVerificationModalOpen,
    activeCityCode,
  } = useFellow();

  // Mode: Sign In vs Sign Up
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Sign In flow state
  const [signInMethod, setSignInMethod] = useState<'phone' | 'email'>('phone');
  const [signInStep, setSignInStep] = useState<'input' | 'otp'>('input');
  const [signInCountry, setSignInCountry] = useState<string>('+1');
  const [signInPhone, setSignInPhone] = useState<string>('555-019-4821');
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInOtp, setSignInOtp] = useState<string>('849201');
  const [resendCountdown, setResendCountdown] = useState<number>(30);

  // Sign Up Multi-Step State
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Verification credentials
  const [signUpPhoneCountry, setSignUpPhoneCountry] = useState<string>('+1');
  const [signUpPhone, setSignUpPhone] = useState<string>('555-014-9932');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpOtp, setSignUpOtp] = useState<string>('482910');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Step 2: Destination City & Dates
  const [selectedCity, setSelectedCity] = useState<CityCode>(activeCityCode || 'TYO_JP');
  const [arrivalDate, setArrivalDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  });

  // Step 3: Profile Details
  const [fullName, setFullName] = useState<string>('Maya Kowalski');
  const [displayName, setDisplayName] = useState<string>('Maya K.');
  const [gender, setGender] = useState<UserGender>('female');
  const [selectedOrigin, setSelectedOrigin] = useState<{ name: string; flag: string }>(ORIGIN_COUNTRIES[0]);
  const [nativeLanguage, setNativeLanguage] = useState<string>('English');
  const [bio, setBio] = useState<string>('Solo foodie & architecture lover looking for casual dinners and neighborhood walks.');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(SAMPLE_AVATARS_FEMALE[0]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // When gender changes, update default avatar
  useEffect(() => {
    if (gender === 'female') {
      setSelectedAvatar(SAMPLE_AVATARS_FEMALE[0]);
    } else {
      setSelectedAvatar(SAMPLE_AVATARS_MALE[0]);
    }
  }, [gender]);

  // When full name changes, auto-format display name
  const handleFullNameChange = (val: string) => {
    setFullName(val);
    const parts = val.trim().split(/\s+/);
    if (parts.length > 1) {
      setDisplayName(`${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`);
    } else if (parts.length === 1 && parts[0]) {
      setDisplayName(parts[0]);
    }
  };

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0 && ((authMode === 'signin' && signInStep === 'otp') || (authMode === 'signup' && isOtpSent && !isOtpVerified))) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode, signInStep, isOtpSent, isOtpVerified, resendCountdown]);

  if (!isAuthModalOpen) return null;

  // Sign In: Send OTP
  const handleSignInSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (signInMethod === 'phone' && !signInPhone.trim()) {
      setAuthError('Please enter a valid phone number.');
      return;
    }
    if (signInMethod === 'email' && (!signInEmail.trim() || !signInEmail.includes('@'))) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSignInStep('otp');
      setResendCountdown(30);
    }, 500);
  };

  // Sign In: Verify OTP
  const handleSignInVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (signInOtp.length < 4) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const existingUser = allUsers.find(
        (u) =>
          (signInPhone && u.phone_number.includes(signInPhone.slice(-4))) ||
          (signInEmail && u.email.toLowerCase() === signInEmail.toLowerCase())
      );
      const targetUserId = existingUser ? existingUser.id : 'user_elena_r';
      completeLogin(targetUserId);
    }, 600);
  };

  const completeLogin = (userId: string) => {
    login(userId);
    setIsAuthModalOpen(false);
    setSignInStep('input');

    const targetUser = allUsers.find((u) => u.id === userId);
    if (pendingAction && targetUser) {
      if (!targetUser.code_of_conduct_signed) {
        setIsCodeOfConductOpen(true);
      } else if (!targetUser.is_verified || !targetUser.has_paid_pass) {
        setIsVerificationModalOpen(true);
      }
    }
  };

  // Sign Up: Step 1 Verify OTP
  const handleSignUpSendOtp = () => {
    if (!signUpPhone.trim()) {
      setAuthError('Please enter a mobile phone number.');
      return;
    }
    setAuthError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpSent(true);
      setResendCountdown(30);
    }, 400);
  };

  const handleSignUpVerifyOtp = () => {
    if (signUpOtp.length < 4) {
      setAuthError('Please enter the 6-digit passcode.');
      return;
    }
    setAuthError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpVerified(true);
      setSignUpStep(2);
    }, 500);
  };

  // Sign Up: Step 2 Date validation
  const handleDatePreset = (days: number) => {
    const arr = new Date(arrivalDate || new Date().toISOString().split('T')[0]);
    const dep = new Date(arr);
    dep.setDate(dep.getDate() + days);
    setDepartureDate(dep.toISOString().split('T')[0]);
  };

  // Sign Up: Final Submit
  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setAuthError('Please provide your name.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      registerUser({
        fullName: fullName || displayName,
        displayName,
        gender,
        originCountry: selectedOrigin.name,
        originFlag: selectedOrigin.flag,
        nativeLanguage,
        bio,
        phoneNumber: `${signUpPhoneCountry} ${signUpPhone}`,
        email: signUpEmail || `${displayName.toLowerCase().replace(/[^a-z0-9]/g, '')}@fellowtraveler.io`,
        profilePhotoUrl: selectedAvatar,
        cityCode: selectedCity,
        arrivalDate,
        departureDate,
      });

      setIsAuthModalOpen(false);
    }, 700);
  };

  // Calculate stay days
  const stayDays = Math.max(
    1,
    Math.round(
      (new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-2 pb-4 border-b border-[#EAE7E2]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High-Trust Solo Travel Community</span>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-semibold text-[#1A1918] tracking-tight">
              {authMode === 'signup' ? 'Create Traveler Passport' : 'Sign In to Fellow'}
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#F9F8F6] p-1 rounded-xl border border-[#EAE7E2] mt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-[#1A1918] shadow-2xs'
                  : 'text-[#6B6966] hover:text-[#1A1918]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E64A2A]" />
              <span>New Traveler Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-[#1A1918] shadow-2xs'
                  : 'text-[#6B6966] hover:text-[#1A1918]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Existing Member Sign In</span>
            </button>
          </div>
        </div>

        {authError && (
          <div className="mt-3 bg-[#FDF2F2] border border-[#F87171] rounded-xl p-3 text-xs text-[#DC2626] font-medium">
            {authError}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIGN UP FLOW (3-STEP PROGRESSIVE WIZARD)                                 */}
        {/* ========================================================================= */}
        {authMode === 'signup' ? (
          <div className="overflow-y-auto py-4 space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center justify-between px-1 pb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    signUpStep === 1
                      ? 'bg-[#1A1918] text-white'
                      : 'bg-[#059669] text-white'
                  }`}
                >
                  {signUpStep > 1 ? '✓' : '1'}
                </span>
                <span className="text-xs font-semibold text-[#1A1918]">
                  {signUpStep === 1 ? 'Contact Phone' : signUpStep === 2 ? 'City & Travel Dates' : 'Passport Profile'}
                </span>
              </div>

              <span className="text-[11px] font-mono-code text-[#9C9892]">
                Step {signUpStep} of 3
              </span>
            </div>

            {/* STEP 1: Phone & SMS Verification */}
            {signUpStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-[#6B6966] leading-relaxed">
                  Real phone verification prevents bot spam and guarantees every solo traveler at the table is authentic.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1918]">Mobile Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={signUpPhoneCountry}
                      onChange={(e) => setSignUpPhoneCountry(e.target.value)}
                      className="px-2.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918] shrink-0 cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code + c.country} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="555-019-2831"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                    />
                  </div>
                </div>

                {!isOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSignUpSendOtp}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Sending Code...' : 'Send SMS Verification Code'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-[#EAE7E2]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-[#1A1918]">Enter 6-Digit Passcode</label>
                        <span className="text-[11px] text-[#059669] font-medium">Code sent via SMS</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={signUpOtp}
                        onChange={(e) => setSignUpOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-xl tracking-[0.3em] font-mono-code font-bold py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      />
                      <p className="text-[11px] text-[#9C9892]">Pre-filled with test code for immediate testing.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignUpVerifyOtp}
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isSubmitting ? 'Verifying...' : 'Confirm & Continue to Travel Dates'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Choose Destination Hub & Travel Window */}
            {signUpStep === 2 && (
              <div className="space-y-4">
                <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-3 text-xs text-[#6B6966] leading-relaxed">
                  <strong className="text-[#1A1918]">Temporal Travel Rule:</strong> Fellow micro-meetups only exist in real time. Choose where and when you are visiting so you only see meetups happening while you are physically in town.
                </div>

                {/* Destination Hub Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1A1918]">Select Destination City Hub</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(CITY_HUBS).map((hub) => {
                      const isSelected = selectedCity === hub.code;
                      return (
                        <button
                          key={hub.code}
                          type="button"
                          onClick={() => setSelectedCity(hub.code)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1A1918] bg-[#FDF5F2] ring-1 ring-[#1A1918]'
                              : 'border-[#EAE7E2] bg-white hover:bg-[#F9F8F6]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{hub.flag}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#E64A2A] stroke-[3]" />}
                          </div>
                          <p className="font-editorial text-sm font-bold text-[#1A1918] mt-1">{hub.name}</p>
                          <p className="text-[11px] text-[#6B6966]">{hub.country}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Window Dates */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1A1918]">Your Trip Window</label>
                    <span className="text-[11px] font-semibold text-[#E64A2A] bg-[#FDF5F2] px-2 py-0.5 rounded-full border border-[#FADCD5]">
                      {stayDays} Days in {CITY_HUBS[selectedCity]?.name || 'City'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-[#6B6966]">Arrival</span>
                      <input
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-[#6B6966]">Departure</span>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      />
                    </div>
                  </div>

                  {/* Stay Duration Quick Buttons */}
                  <div className="flex gap-1.5 pt-1">
                    {[3, 5, 7, 14].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDatePreset(d)}
                        className="px-2.5 py-1 rounded-lg bg-[#F9F8F6] border border-[#EAE7E2] hover:border-[#1A1918] text-[11px] font-semibold text-[#6B6966] hover:text-[#1A1918] transition-colors cursor-pointer"
                      >
                        +{d} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(1)}
                    className="py-3 px-4 rounded-full border border-[#EAE7E2] hover:bg-[#F9F8F6] text-xs font-semibold text-[#6B6966] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpStep(3)}
                    className="flex-1 py-3 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Passport Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Traveler Identity & Profile Setup */}
            {signUpStep === 3 && (
              <form onSubmit={handleCompleteSignUp} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      required
                    />
                    <span className="text-[10px] text-[#9C9892]">Matched to ID pass</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Public Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Elena R."
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      required
                    />
                    <span className="text-[10px] text-[#9C9892]">First name + Initial</span>
                  </div>
                </div>

                {/* Gender (Critical for women-only space safety) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1A1918]">Gender Identity</label>
                    <span className="text-[10px] text-[#9C9892]">Protects Women-Only Tables</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'female', label: 'Woman' },
                      { val: 'male', label: 'Man' },
                      { val: 'non_binary', label: 'Non-Binary' },
                    ].map((g) => (
                      <button
                        key={g.val}
                        type="button"
                        onClick={() => setGender(g.val as UserGender)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          gender === g.val
                            ? 'border-[#1A1918] bg-[#1A1918] text-white'
                            : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:text-[#1A1918]'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin Country & Language */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Home Country</label>
                    <select
                      value={selectedOrigin.name}
                      onChange={(e) => {
                        const found = ORIGIN_COUNTRIES.find((c) => c.name === e.target.value);
                        if (found) setSelectedOrigin(found);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918] cursor-pointer"
                    >
                      {ORIGIN_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1918]">Primary Language</label>
                    <input
                      type="text"
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      placeholder="English, Spanish"
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1918]">Choose Profile Portrait</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAvatar}
                      alt="Selected"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#1A1918] shrink-0 shadow-sm"
                    />

                    <div className="flex gap-2">
                      {(gender === 'female' ? SAMPLE_AVATARS_FEMALE : SAMPLE_AVATARS_MALE).map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatar(url)}
                          className={`relative rounded-full p-0.5 border-2 transition-all cursor-pointer ${
                            selectedAvatar === url ? 'border-[#E64A2A] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="Option" className="w-9 h-9 rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Bio / Intent */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1918]">Bio & Travel Interests</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    maxLength={180}
                    placeholder="Solo traveler excited about food markets, photography, and local coffee."
                    className="w-full px-3 py-2 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918] resize-none"
                  />
                  <div className="flex justify-between text-[10px] text-[#9C9892]">
                    <span>Conversational icebreaker for your table</span>
                    <span>{bio.length}/180</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#EAE7E2]">
                  <button
                    type="button"
                    onClick={() => setSignUpStep(2)}
                    className="py-3 px-4 rounded-full border border-[#EAE7E2] hover:bg-[#F9F8F6] text-xs font-semibold text-[#6B6966] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E64A2A]/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Creating Passport...' : 'Save & Join Fellow Community'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* SIGN IN FLOW (EXISTING USERS & DEMO PERSONAS)                            */
          /* ========================================================================= */
          <div className="overflow-y-auto py-4 space-y-4">
            {signInStep === 'input' ? (
              <div className="space-y-4">
                {/* Method Tabs */}
                <div className="flex bg-[#F9F8F6] p-1 rounded-xl border border-[#EAE7E2]">
                  <button
                    type="button"
                    onClick={() => setSignInMethod('phone')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      signInMethod === 'phone'
                        ? 'bg-white text-[#1A1918] shadow-2xs'
                        : 'text-[#6B6966] hover:text-[#1A1918]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignInMethod('email')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      signInMethod === 'email'
                        ? 'bg-white text-[#1A1918] shadow-2xs'
                        : 'text-[#6B6966] hover:text-[#1A1918]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </button>
                </div>

                <form onSubmit={handleSignInSendOtp} className="space-y-3.5">
                  {signInMethod === 'phone' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1A1918]">Phone Number</label>
                      <div className="flex gap-2">
                        <select
                          value={signInCountry}
                          onChange={(e) => setSignInCountry(e.target.value)}
                          className="px-2.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918] shrink-0"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code + c.country} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={signInPhone}
                          onChange={(e) => setSignInPhone(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1A1918]">Email Address</label>
                      <input
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="elena@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-medium text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Login Code'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Instant Traveler Personas for Quick Evaluation */}
                <div className="pt-3 border-t border-[#EAE7E2] space-y-2">
                  <span className="block text-[11px] font-semibold text-[#6B6966]">
                    Fast Sign In with Demo Traveler:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {allUsers.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => completeLogin(u.id)}
                        className="p-2 rounded-xl border border-[#EAE7E2] bg-[#F9F8F6] hover:bg-white hover:border-[#1A1918] text-left flex items-center gap-2 transition-all shadow-2xs group cursor-pointer"
                      >
                        <img
                          src={u.profile_photo_url}
                          alt={u.display_name}
                          className="w-7 h-7 rounded-full object-cover border border-[#EAE7E2]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1A1918] truncate group-hover:text-[#E64A2A]">
                            {u.display_name}
                          </p>
                          <p className="text-[10px] text-[#9C9892] truncate">
                            {u.is_verified ? '✓ Verified' : 'Unverified'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* OTP Step */
              <form onSubmit={handleSignInVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1A1918]">Enter 6-Digit Passcode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={signInOtp}
                    onChange={(e) => setSignInOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl tracking-[0.4em] font-mono-code font-bold py-3 px-4 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] focus:outline-none focus:border-[#1A1918]"
                    autoFocus
                  />
                  <p className="text-[11px] text-center text-[#6B6966]">
                    Demo test code pre-filled for instant verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Verifying...' : 'Authenticate & Enter'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setSignInStep('input')}
                    className="text-[#6B6966] hover:text-[#1A1918] underline font-medium cursor-pointer"
                  >
                    Change phone / email
                  </button>

                  <button
                    type="button"
                    disabled={resendCountdown > 0}
                    onClick={() => setResendCountdown(30)}
                    className="text-[#E64A2A] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{resendCountdown > 0 ? `Resend (${resendCountdown}s)` : 'Resend Code'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
