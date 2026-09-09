import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, X } from 'lucide-react';
import { useFellow } from '../context/FellowContext';

export const CodeOfConductModal: React.FC = () => {
  const { isCodeOfConductOpen, setIsCodeOfConductOpen, signCodeOfConduct } = useFellow();

  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION_MS = 3000; // 3 seconds per PRD Part 5.2

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

  return (
    <div
      id="code-of-conduct-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-[#1A1918] text-center relative animate-in zoom-in-95 duration-150 space-y-4">
        {/* Close / Bail Button */}
        <button
          onClick={() => setIsCodeOfConductOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
          title="Decline and close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto border border-[#A7F3D0] shadow-2xs">
          <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
            Community Trust Charter
          </span>
          <h2 className="font-editorial text-2xl font-semibold text-[#1A1918] mt-1">
            Platonic Non-Dating Policy
          </h2>
        </div>

        {/* Unskippable Statement Quote */}
        <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-2xl p-4 text-xs text-[#6B6966] leading-relaxed text-left space-y-2">
          <p className="font-editorial italic text-[#1A1918] text-sm leading-normal">
            &ldquo;Fellow is a platonic community for shared micro-meetups. Romantic advances, flirting, or making other travelers uncomfortable results in an immediate, permanent ban with zero refund of your Verification Pass.&rdquo;
          </p>
          <div className="pt-2 border-t border-[#EAE7E2] text-[11px] text-[#6B6966] space-y-1 font-medium">
            <p>• Verified real identities and liveness checks on all members.</p>
            <p>• Small 2–4 person public commercial venues only.</p>
            <p>• Zero tolerance: 100% of reported accounts frozen instantly.</p>
          </div>
        </div>

        {/* 3-Second Hold Button to Sign */}
        <div className="pt-2 space-y-2.5">
          <button
            id="btn-hold-to-sign-code-of-conduct"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative w-full py-3.5 px-6 rounded-full bg-[#1A1918] border border-[#1A1918] overflow-hidden font-semibold text-xs text-white select-none transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            {/* Progress Fill Bar */}
            <div
              className="absolute inset-0 bg-[#E64A2A] transition-all"
              style={{ width: `${holdProgress}%` }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isHolding
                  ? `Holding... ${(3 - (holdProgress / 100) * 3).toFixed(1)}s`
                  : 'Press & Hold 3 Seconds to Sign'}
              </span>
            </span>
          </button>
          
          <p className="text-[11px] text-[#9C9892]">
            Hold continuously for 3 seconds to legally bind your agreement.
          </p>

          <button
            type="button"
            onClick={() => setIsCodeOfConductOpen(false)}
            className="w-full py-2 text-xs font-semibold text-[#6B6966] hover:text-[#1A1918] transition-colors"
          >
            Decline & Return to Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
