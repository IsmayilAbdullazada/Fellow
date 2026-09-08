import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Camera,
  FileText,
  CheckCircle,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight,
  ScanLine,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';

export const VerificationModal: React.FC = () => {
  const {
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    completeVerification,
    currentUser,
    updateCurrentUserProfile,
  } = useFellow();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [documentType, setDocumentType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [livenessHeadTurn, setLivenessHeadTurn] = useState<boolean>(false);
  const [legalNameInput, setLegalNameInput] = useState<string>(currentUser.full_name || 'Elena Rostova');

  if (!isVerificationModalOpen) return null;

  const handleStep1Complete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 1200);
  };

  const handleStep2Complete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 1400);
  };

  const handleStep3Pay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
      // Update legal name if edited
      if (legalNameInput) {
        const parts = legalNameInput.trim().split(' ');
        const display = parts[0] + (parts.length > 1 ? ` ${parts[parts.length - 1][0]}.` : '');
        updateCurrentUserProfile({
          full_name: legalNameInput,
          display_name: display,
        });
      }
      setTimeout(() => {
        completeVerification();
      }, 1500);
    }, 1800);
  };

  return (
    <div id="verification-modal-overlay" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base text-slate-900">Stripe Identity & Pass</span>
          </div>
          <button
            onClick={() => setIsVerificationModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 px-6 pt-4 pb-1">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 4 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Step 1: Government Document Scan */}
          {step === 1 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Step 1: ID Document Scan</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an official document. Legal names are encrypted and only first name + initial is shown publicly.
                </p>
              </div>

              {/* Value Explainer 3 Bullets */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong className="font-bold text-slate-900">100% ID Verified:</strong> Zero bots, zero romance scammers, no fake profiles.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong className="font-bold text-slate-900">One-time cost:</strong> $9.99 gives verified access for all cities forever.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong className="font-bold text-slate-900">Zero Creep Tolerance:</strong> Strict background check protects all solo travelers.</span>
                </div>
              </div>

              {/* Document Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Document Type</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['passport', 'drivers_license', 'national_id'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocumentType(type)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        documentType === type
                          ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      {type === 'passport' ? 'Passport' : type === 'drivers_license' ? "Driver's Lic." : 'National ID'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Camera Scanner Viewfinder */}
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 bg-slate-50 text-center relative overflow-hidden group transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Front photo page ready to capture
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Auto-aligned with machine readable zone (MRZ)
                  </span>
                </div>
              </div>

              <button
                id="btn-step1-scan-document"
                onClick={handleStep1Complete}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scanning document credentials...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>Scan Document & Continue</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: 3D Live Facial Movement Scan */}
          {step === 2 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Step 2: 3D Liveness Check</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verifies you are physically present and match the photo in your government identity document.
                </p>
              </div>

              {/* Live Face Scan Simulation Frame */}
              <div className="relative w-44 h-44 mx-auto rounded-full border-4 border-indigo-600 overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                <img
                  src={currentUser.profile_photo_url}
                  alt="Live Selfie check"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
                {/* Liveness Oval Overlay */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-pulse pointer-events-none" />
                <div className="absolute bottom-3 bg-white/95 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-200 shadow-md">
                  {livenessHeadTurn ? '✓ Angle Verified' : 'Slowly tilt head right'}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  Biometric Anti-Spoofing Active
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Detects micro-movements, depth, and pupil reflection to prevent static photo spoofing.
                </p>
              </div>

              <button
                id="btn-step2-complete-liveness"
                onClick={handleStep2Complete}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying 3D mesh & facial geometry...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Confirm Live 3D Selfie</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: $9.99 Lifetime Verified Pass Checkout */}
          {step === 3 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Step 3: Lifetime Verified Pass</h3>
                <p className="text-xs text-slate-500 mt-1">
                  One-time $9.99 fee covers third-party verification overhead and keeps the community 100% serious and safe.
                </p>
              </div>

              {/* Order Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Fellow Global Verified Pass</span>
                  <span className="font-bold text-slate-900">$9.99</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Stripe Identity & Liveness Check</span>
                  <span className="text-indigo-600 font-bold">Included</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Access to Lisbon & Tokyo Hubs</span>
                  <span className="text-indigo-600 font-bold">Lifetime</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Due Today</span>
                  <span className="text-indigo-600">$9.99 USD</span>
                </div>
              </div>

              {/* Payment Methods Simulation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">Apple Pay / Google Pay / Card · Stripe Secure</span>
                </div>
              </div>

              <button
                id="btn-step3-pay-pass"
                onClick={handleStep3Pay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing $9.99 charge...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay $9.99 & Activate Verified Status</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Status Feedback & Success Badge */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-300 animate-in zoom-in-50 duration-300">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Verification Approved!</h3>
                <p className="text-xs text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Your identity has been verified via Stripe. You can now post plans and RSVP to micro-meetups in Tokyo and Lisbon.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Verified Traveler ID Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
