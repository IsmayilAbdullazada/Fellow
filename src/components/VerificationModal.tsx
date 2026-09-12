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
    <div
      id="verification-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-[#1A1918] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7E2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-[#A7F3D0]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-editorial text-lg font-semibold text-[#1A1918]">Identity Verification</span>
          </div>
          <button
            onClick={() => setIsVerificationModalOpen(false)}
            className="p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 px-6 pt-4 pb-1">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-[#1A1918]' : 'w-2 bg-[#EAE7E2]'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-[#1A1918]' : 'w-2 bg-[#EAE7E2]'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'w-8 bg-[#1A1918]' : 'w-2 bg-[#EAE7E2]'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 4 ? 'w-8 bg-[#059669]' : 'w-2 bg-[#EAE7E2]'}`} />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Step 1: Government Document Scan */}
          {step === 1 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Step 1: Government ID</h3>
                <p className="text-xs text-[#6B6966] mt-1">
                  Upload an official passport or ID. Your legal details remain private—only your first name and initial appear to other travelers.
                </p>
              </div>

              {/* Value Explainer 3 Bullets */}
              <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-[#6B6966]">
                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <span><strong className="font-semibold text-[#1A1918]">100% Real Travelers:</strong> Zero bots, zero spam, and no fake accounts.</span>
                </div>
                <div className="flex items-start gap-2 text-[#6B6966]">
                  <CreditCard className="w-4 h-4 text-[#E64A2A] shrink-0 mt-0.5" />
                  <span><strong className="font-semibold text-[#1A1918]">One-time $9.99 fee:</strong> Verified access across all city hubs with no subscriptions.</span>
                </div>
                <div className="flex items-start gap-2 text-[#6B6966]">
                  <Lock className="w-4 h-4 text-[#1A1918] shrink-0 mt-0.5" />
                  <span><strong className="font-semibold text-[#1A1918]">Safe & Private:</strong> Built so solo travelers can meet with confidence and peace of mind.</span>
                </div>
              </div>

              {/* Document Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1918]">Select Document Type</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['passport', 'drivers_license', 'national_id'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocumentType(type)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        documentType === type
                          ? 'border-[#1A1918] bg-[#1A1918] text-white font-semibold shadow-2xs'
                          : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:bg-[#EAE7E2]/50 font-medium'
                      }`}
                    >
                      {type === 'passport' ? 'Passport' : type === 'drivers_license' ? "Driver's Lic." : 'National ID'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Capture Area */}
              <div className="border border-dashed border-[#D1CDC7] hover:border-[#1A1918] rounded-2xl p-6 bg-[#F9F8F6] text-center relative overflow-hidden group transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white shadow-2xs text-[#9C9892] group-hover:text-[#1A1918] flex items-center justify-center transition-colors border border-[#EAE7E2]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-[#1A1918]">
                    Photo page ready to capture
                  </p>
                  <span className="text-[11px] text-[#9C9892]">
                    Make sure all 4 corners and photo are clearly visible
                  </span>
                </div>
              </div>

              <button
                id="btn-step1-scan-document"
                onClick={handleStep1Complete}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reviewing document...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>Continue to Selfie Match</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Selfie Check */}
          {step === 2 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Step 2: Quick Photo Check</h3>
                <p className="text-xs text-[#6B6966] mt-1">
                  Take a quick selfie to confirm you match your government identity photo.
                </p>
              </div>

              {/* Live Face Scan Simulation Frame */}
              <div className="relative w-44 h-44 mx-auto rounded-full border-4 border-[#059669] overflow-hidden bg-[#1A1918] flex items-center justify-center shadow-inner">
                <img
                  src={currentUser.profile_photo_url}
                  alt="Live Selfie check"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
                <div className="absolute inset-0 rounded-full border-2 border-[#059669] animate-pulse pointer-events-none" />
                <div className="absolute bottom-3 bg-white/95 text-[#059669] text-[10px] font-semibold px-3 py-1 rounded-full border border-[#A7F3D0] shadow-sm">
                  {livenessHeadTurn ? '✓ Angle Verified' : 'Center face in circle'}
                </div>
              </div>

              <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-3.5 text-center space-y-1">
                <p className="text-xs font-semibold text-[#1A1918]">
                  One-Time Safety Match
                </p>
                <p className="text-[11px] text-[#6B6966] leading-relaxed">
                  Confirms you are the genuine person holding the ID before you meet anyone in person.
                </p>
              </div>

              <button
                id="btn-step2-complete-liveness"
                onClick={handleStep2Complete}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming photo match...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Confirm Photo Match</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: $9.99 Lifetime Verified Pass Checkout */}
          {step === 3 && (
            <div className="space-y-4 text-left">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Step 3: Lifetime Verified Pass</h3>
                <p className="text-xs text-[#6B6966] mt-1">
                  A one-time $9.99 fee covers secure identity verification and keeps our community genuine and flake-free.
                </p>
              </div>

              {/* Order Breakdown */}
              <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#6B6966]">
                  <span>Fellow Global Verified Pass</span>
                  <span className="font-semibold text-[#1A1918]">$9.99</span>
                </div>
                <div className="flex items-center justify-between text-[#9C9892] text-[11px]">
                  <span>Identity Verification</span>
                  <span className="text-[#059669] font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between text-[#9C9892] text-[11px]">
                  <span>All Current & Future City Hubs</span>
                  <span className="text-[#059669] font-semibold">Lifetime Access</span>
                </div>
                <div className="pt-2 border-t border-[#EAE7E2] flex items-center justify-between text-sm font-semibold text-[#1A1918]">
                  <span>Total Due Today</span>
                  <span className="text-[#E64A2A]">$9.99 USD</span>
                </div>
              </div>

              {/* Payment Methods Simulation */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs">
                <CreditCard className="w-4 h-4 text-[#9C9892]" />
                <span className="text-[#6B6966] font-medium">Apple Pay / Google Pay / Card · Encrypted Checkout</span>
              </div>

              <button
                id="btn-step3-pay-pass"
                onClick={handleStep3Pay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md shadow-[#E64A2A]/20 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating membership...</span>
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
              <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">Verification Approved!</h3>
                <p className="text-xs text-[#6B6966] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Your identity has been verified. You can now host tables and join meetups across Tokyo and Lisbon.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Traveler ID Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
