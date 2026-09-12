import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, X, CheckCircle2 } from 'lucide-react';
import { useFellow } from '../context/FellowContext';

export const CodeOfConductModal: React.FC = () => {
  const { isCodeOfConductOpen, setIsCodeOfConductOpen, signCodeOfConduct } = useFellow();

  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION_MS = 3000; // 3 seconds friction per PRD

  const startHold = () => {
    setIsHolding(true);
    holdStartTimeRef.current = Date.now();

    const checkProgress = () => {
      if (!holdStartTimeRef.current) return;
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (elapsed >= HOLD_DURATION_MS) {
        signCodeOfConduct();
        setIsHolding(false);
        holdStartTimeRef.current = null;
        setHoldProgress(0);
      } else {
        animationFrameRef.current = requestAnimationFrame(checkProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(checkProgress);
  };

  const endHold = () => {
    setIsHolding(false);
    holdStartTimeRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (!isCodeOfConductOpen) return null;

  const secondsRemaining = (3 - (holdProgress / 100) * 3).toFixed(1);

  return (
    <div
      id="code-of-conduct-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D1CDC7] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsCodeOfConductOpen(false)}
          className="absolute top-5 right-5 p-2 text-[#6B6966] hover:text-[#1A1918] hover:bg-[#F9F8F6] rounded-full transition-colors cursor-pointer"
          title="Decline and close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with High-Authority Community Seal */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1918] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E64A2A]">
                Mandatory Member Pledge
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E64A2A]" />
              <span className="text-[11px] font-mono-code font-semibold text-[#6B6966]">
                Article I
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1918] tracking-tight mt-0.5">
              Platonic Non-Dating Charter
            </h2>
          </div>
        </div>

        {/* The Dominant Charter Text: High Contrast, Authoritative Serif */}
        <div className="bg-[#FAF9F6] border-2 border-[#1A1918] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <p className="font-editorial text-lg sm:text-xl font-semibold text-[#1A1918] leading-relaxed">
            &ldquo;Fellow is exclusively a platonic community for shared tables and micro-meetups. Any romantic advances, flirting, predatory behavior, or unwanted private contact results in an immediate, irrevocable ban with zero refund.&rdquo;
          </p>

          <div className="pt-3 border-t border-[#D1CDC7] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#1A1918] font-medium">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#EAE7E2]">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span className="leading-snug">Strictly 2–4 person public venues</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#EAE7E2]">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span className="leading-snug">Zero tolerance: instant account freeze</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#EAE7E2]">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span className="leading-snug">Real verified traveler identity</span>
            </div>
          </div>
        </div>

        {/* Friction Hold Sign Action */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1A1918] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#1A1918]" />
              <span>Community Agreement</span>
            </span>
            <span className="font-mono-code font-bold text-xs text-[#E64A2A]">
              {isHolding ? `${secondsRemaining}s remaining` : 'Hold 3.0 seconds'}
            </span>
          </div>

          {/* Large Visible Track & Hold Button */}
          <div className="relative">
            <button
              id="btn-hold-to-sign-code-of-conduct"
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className={`relative w-full h-14 rounded-2xl overflow-hidden font-bold text-sm select-none transition-all shadow-md active:scale-[0.99] cursor-pointer border-2 ${
                isHolding
                  ? 'border-[#E64A2A] ring-4 ring-[#E64A2A]/20'
                  : 'border-[#1A1918] bg-[#1A1918] text-white hover:bg-[#2E2C29]'
              }`}
            >
              {/* Background Progress Fill Bar */}
              <div
                className="absolute inset-y-0 left-0 bg-[#E64A2A] transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              />

              {/* Button Content */}
              <span className="relative z-10 w-full h-full flex items-center justify-center gap-2.5 px-6 text-white">
                <Lock className={`w-4 h-4 transition-transform ${isHolding ? 'scale-110' : ''}`} />
                <span className="font-bold tracking-wide">
                  {isHolding
                    ? `Signing Pledge... (${secondsRemaining}s)`
                    : 'Press & Hold 3 Seconds to Sign Pledge'}
                </span>
              </span>
            </button>
          </div>

          {/* Explicit Guidance */}
          <p className="text-xs text-[#4A4744] text-center leading-relaxed">
            Hold down the button to confirm your commitment to keeping Fellow platonic, welcoming, and safe.
          </p>

          {/* Equal Respect Decline Action */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setIsCodeOfConductOpen(false)}
              className="px-6 py-2.5 rounded-full border border-[#D1CDC7] text-xs font-semibold text-[#4A4744] hover:text-[#1A1918] hover:bg-[#F9F8F6] hover:border-[#1A1918] transition-all cursor-pointer"
            >
              Decline Charter & Return to Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
