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
  User,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';

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
  { code: '+62', country: 'Indonesia (Bali)', flag: '🇮🇩' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    allUsers,
    pendingAction,
    setIsCodeOfConductOpen,
    setIsVerificationModalOpen,
  } = useFellow();

  // Auth flow states
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  // Phone inputs
  const [selectedCountry, setSelectedCountry] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('555-019-4821');
  const [fullName, setFullName] = useState<string>('');

  // Email inputs
  const [emailAddress, setEmailAddress] = useState<string>('');

  // OTP inputs
  const [otpCode, setOtpCode] = useState<string>('849201');
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (method === 'phone') {
      if (!phoneNumber.trim()) {
        setAuthError('Please enter a valid mobile phone number.');
        return;
      }
    } else {
      if (!emailAddress.trim() || !emailAddress.includes('@')) {
        setAuthError('Please enter a valid email address.');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setResendCountdown(30);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (otpCode.length < 4) {
      setAuthError('Please enter the 6-digit code received via SMS/Email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Look up existing user with this phone/email or pick primary user
      const existingUser = allUsers.find(
        (u) =>
          (phoneNumber && u.phone_number.includes(phoneNumber.slice(-4))) ||
          (emailAddress && u.email.toLowerCase() === emailAddress.toLowerCase())
      );

      const targetUserId = existingUser ? existingUser.id : 'user_elena_r';
      completeLogin(targetUserId);
    }, 700);
  };

  const completeLogin = (userId: string) => {
    login(userId);
    setIsAuthModalOpen(false);
    setStep('input');

    // Handle chained gating: if pending action, check conduct charter then KYC
    const targetUser = allUsers.find((u) => u.id === userId);
    if (pendingAction && targetUser) {
      if (!targetUser.code_of_conduct_signed) {
        setIsCodeOfConductOpen(true);
      } else if (!targetUser.is_verified || !targetUser.has_paid_pass) {
        setIsVerificationModalOpen(true);
      }
    }
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    setAuthError(null);
  };

  const handleAppleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      completeLogin('user_elena_r');
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      completeLogin('user_sofia_a');
    }, 800);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pb-4 border-b border-[#EAE7E2]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High-Trust Travel Community</span>
          </div>
          <h3 className="font-editorial text-2xl font-semibold text-[#1A1918] tracking-tight">
            {step === 'input' ? 'Sign in to Fellow' : 'Enter 6-digit passcode'}
          </h3>
          <p className="text-xs text-[#6B6966] leading-relaxed">
            {step === 'input'
              ? 'Phone authentication guarantees unique, bot-free travelers across all active hubs.'
              : `We sent a temporary verification code to ${
                  method === 'phone' ? `${selectedCountry} ${phoneNumber}` : emailAddress
                }.`}
          </p>
        </div>

        {authError && (
          <div className="mt-3 bg-[#FDF2F2] border border-[#F87171] rounded-xl p-3 text-xs text-[#DC2626] font-medium">
            {authError}
          </div>
        )}

        {/* Step 1: Input Form */}
        {step === 'input' ? (
          <div className="space-y-4 pt-4">
            {/* Primary / Fallback Tabs */}
            <div className="flex bg-[#F9F8F6] p-1 rounded-xl border border-[#EAE7E2]">
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'phone'
                    ? 'bg-white text-[#1A1918] shadow-2xs'
                    : 'text-[#6B6966] hover:text-[#1A1918]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone + SMS (Primary)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  method === 'email'
                    ? 'bg-white text-[#1A1918] shadow-2xs'
                    : 'text-[#6B6966] hover:text-[#1A1918]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Fallback</span>
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3.5">
              {method === 'phone' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1918]">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
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
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 555-019-4821"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs text-[#1A1918] focus:outline-none focus:border-[#1A1918] focus:bg-white transition-all font-mono-code"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#9C9892]">
                    Carrier SMS rates apply. Used exclusively for security and meetup verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1918]">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="traveler@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs text-[#1A1918] focus:outline-none focus:border-[#1A1918] focus:bg-white transition-all"
                    required
                  />
                  <p className="text-[11px] text-[#9C9892]">
                    We'll send a one-time 6-digit login token to this inbox.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Native Third-Party Authentication (Apple Sign-In Required for iOS) */}
            <div className="pt-2 border-t border-[#EAE7E2] space-y-2">
              <span className="block text-center text-[10px] uppercase font-semibold text-[#9C9892] tracking-wider">
                Or continue with
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Sign in with Apple (Mandatory iOS Guideline Compliant) */}
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  className="py-2.5 px-3 rounded-xl bg-[#000000] hover:bg-[#1A1918] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.71-11.71-14-4.9-7.5-8.8-15.89-11.71-25.17-3.7-11.74-5.55-23.08-5.55-34.02 0-14.57 3.7-26.69 11.1-36.36 7.4-9.67 16.73-14.61 27.99-14.82 4.7 0 9.89 1.25 15.58 3.75 5.69 2.5 9.4 3.81 11.13 3.93 1.52-.12 5.37-1.48 11.56-4.08 6.19-2.6 11.45-3.74 15.79-3.43 12.19.64 21.96 4.79 29.31 12.45-10.66 6.42-15.88 15.22-15.67 26.4.21 8.81 3.59 16.14 10.14 22 6.55 5.86 14.19 9.07 22.92 9.63-2.39 7.18-5.11 14.03-8.14 20.57zM119.22 33.14c0-6.96 2.5-13.43 7.51-19.41 5.01-5.98 11.21-9.91 18.6-11.79.43 1.52.65 3.04.65 4.56 0 6.96-2.59 13.54-7.77 19.74-5.18 6.2-11.38 10.08-18.6 11.64-.11-1.52-.39-3.09-.39-4.74z" />
                  </svg>
                  <span>Apple Sign-In</span>
                </button>

                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="py-2.5 px-3 rounded-xl bg-[#F9F8F6] hover:bg-[#EAE7E2] text-[#1A1918] border border-[#EAE7E2] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </div>

            {/* Test Traveler Persona Quick Sign-in */}
            <div className="pt-2 border-t border-[#EAE7E2] space-y-2">
              <span className="block text-[11px] font-semibold text-[#6B6966]">
                Or jump straight in with a demo persona:
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
          /* Step 2: 6-Digit OTP Verification Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1918]">
                One-Time Passcode (OTP)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono-code font-bold py-3 px-4 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] focus:outline-none focus:border-[#1A1918] focus:bg-white transition-all"
                autoFocus
              />
              <p className="text-[11px] text-center text-[#6B6966]">
                Default demo test code pre-filled for instant testing.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Verifying...' : 'Confirm & Authenticate'}</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-[#6B6966] hover:text-[#1A1918] underline font-medium"
              >
                Change {method === 'phone' ? 'Phone Number' : 'Email'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0}
                className={`font-semibold flex items-center gap-1 ${
                  resendCountdown > 0
                    ? 'text-[#9C9892] cursor-not-allowed'
                    : 'text-[#E64A2A] hover:underline cursor-pointer'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>
                  {resendCountdown > 0 ? `Resend code in 0:${resendCountdown < 10 ? '0' : ''}${resendCountdown}` : 'Resend Code Now'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
