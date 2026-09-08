import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, AlertCircle, HeartCrack, Lock } from 'lucide-react';
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
    <div id="code-of-conduct-modal-overlay" className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-900 text-center relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-sm">
          <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
            Mandatory Community Charter
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platonic Non-Dating Policy
          </h2>
        </div>

        {/* Unskippable Statement Quote */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-xs text-slate-700 leading-relaxed text-left space-y-2">
          <p className="font-serif italic text-slate-800 text-[13px] leading-normal">
            &ldquo;Fellow is a platonic community for shared activities. Flirting, romantic advances, unsolicited DMs, or making other travelers uncomfortable results in an immediate, permanent ban with zero refund of your Verification Pass.&rdquo;
          </p>
          <div className="pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 space-y-1 font-medium">
            <p>• Verified real identities and liveness checks on all accounts.</p>
            <p>• Small 2–4 person public commercial venues only.</p>
            <p>• Zero tolerance: 100% of reported accounts frozen instantly.</p>
          </div>
        </div>

        {/* 3-Second Hold Button to Sign */}
        <div className="pt-2 space-y-2">
          <button
            id="btn-hold-to-sign-code-of-conduct"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative w-full py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden font-bold text-sm text-white select-none transition-all active:scale-[0.98] shadow-lg shadow-slate-300"
          >
            {/* Progress Fill Bar */}
            <div
              className="absolute inset-0 bg-indigo-600 transition-all"
              style={{ width: `${holdProgress}%` }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>
                {isHolding
                  ? `Holding... ${(3 - (holdProgress / 100) * 3).toFixed(1)}s`
                  : 'Press & Hold for 3 Seconds to Sign'}
              </span>
            </span>
          </button>
          <p className="text-[11px] text-slate-400 font-medium">
            Hold continuously for 3 seconds to legally bind your agreement.
          </p>
        </div>
      </div>
    </div>
  );
};
