import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Camera,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { MicroPlan } from '../types';

interface QRCheckInModalProps {
  plan: MicroPlan;
  mode: 'host_present' | 'guest_scan';
  onClose: () => void;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({ plan, mode, onClose }) => {
  const {
    currentQrToken,
    qrSecondsRemaining,
    checkInAttendeeWithQr,
    currentUser,
    participants,
    allUsers,
  } = useFellow();

  const [scanInputToken, setScanInputToken] = useState<string>('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);

  const planParticipants = participants.filter((p) => p.plan_id === plan.id);
  const confirmedAttendees = planParticipants.filter((p) => p.rsvp_status === 'confirmed');

  // Check if current user guest is already checked in
  const guestRecord = planParticipants.find((p) => p.user_id === currentUser.id);
  const isAlreadyCheckedIn = !!guestRecord?.checked_in_at;

  const handleSimulatedScan = (tokenToScan?: string) => {
    const token = tokenToScan || plan.qr_checkin_token;
    const result = checkInAttendeeWithQr(plan.id, token);
    setScanResult(result);
  };

  return (
    <div id="qr-checkin-modal-overlay" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              {mode === 'host_present' ? 'Host Check-In QR' : 'In-Person QR Check-In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          {mode === 'host_present' ? (
            /* Host Mode: Dynamic QR Code that refreshes every 15s */
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">{plan.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{plan.venue_name}</p>
              </div>

              {/* Rotating Dynamic High-Contrast QR Mockup */}
              <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 border-indigo-600">
                {/* SVG High-Contrast Dynamic QR Matrix */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="25" height="25" fill="black" rx="3" />
                  <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="13" width="9" height="9" fill="black" rx="1" />

                  {/* Top-right position marker */}
                  <rect x="70" y="5" width="25" height="25" fill="black" rx="3" />
                  <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="78" y="13" width="9" height="9" fill="black" rx="1" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="70" width="25" height="25" fill="black" rx="3" />
                  <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="78" width="9" height="9" fill="black" rx="1" />

                  {/* Center Fellow Shield logo watermark */}
                  <rect x="42" y="42" width="16" height="16" fill="black" rx="3" />
                  <rect x="44" y="44" width="12" height="12" fill="#4f46e5" rx="2" />

                  {/* Dynamic matrix data dots */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="48" y="12" width="6" height="6" />
                  <rect x="58" y="6" width="6" height="6" />
                  <rect x="10" y="40" width="6" height="6" />
                  <rect x="22" y="48" width="6" height="6" />
                  <rect x="70" y="38" width="6" height="6" />
                  <rect x="84" y="46" width="6" height="6" />
                  <rect x="38" y="68" width="6" height="6" />
                  <rect x="50" y="74" width="6" height="6" />
                  <rect x="72" y="72" width="6" height="6" />
                  <rect x="82" y="82" width="6" height="6" />
                  <rect x="4" y="58" width="6" height="6" />
                  <rect x="58" y="54" width="6" height="6" />
                </svg>

                {/* 15-second Refresh Ring Indicator */}
                <div className="absolute -bottom-3.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold px-3.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5 shadow-sm">
                  <RotateCcw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Refreshes in {qrSecondsRemaining}s</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">Hold up your phone for attendees</p>
                <p className="text-[11px] leading-relaxed">
                  Rotating cryptographic token prevents remote screenshot fraud. As soon as guests scan, their $10 deposits are released automatically.
                </p>
              </div>

              {/* Attendee Check-In Status Roster */}
              <div className="pt-2 border-t border-slate-100 text-left space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Check-In Roster ({confirmedAttendees.filter((p) => !!p.checked_in_at).length}/{confirmedAttendees.length})
                </p>
                <div className="space-y-1">
                  {confirmedAttendees.map((part) => {
                    const user = allUsers.find((u) => u.id === part.user_id);
                    const isCheckedIn = !!part.checked_in_at;
                    return (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={user?.profile_photo_url}
                            alt={user?.display_name}
                            className="w-6 h-6 rounded-full object-cover border border-indigo-500"
                          />
                          <span className="font-bold text-slate-800">{user?.display_name}</span>
                          {part.role === 'host' && (
                            <span className="text-[10px] text-indigo-600 font-bold">(Host)</span>
                          )}
                        </div>
                        {isCheckedIn ? (
                          <span className="text-indigo-600 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Checked In ($0 hold released)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Awaiting QR scan</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Guest Mode: Interactive Camera Viewfinder & QR Scanner */
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Scan Host QR Code</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Point camera at the host's screen at {plan.venue_name}
                </p>
              </div>

              {isAlreadyCheckedIn ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
                    <CheckCircle className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">You're Checked In!</h4>
                    <p className="text-xs text-indigo-800 font-medium mt-1">
                      Your $10 deposit authorization was cancelled and released immediately. Total cost: $0.
                    </p>
                  </div>
                </div>
              ) : scanResult?.success ? (
                /* Instant Success Modal Feedback */
                <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-90">
                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-300">
                    <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900">Checked in!</h4>
                    <p className="text-xs text-indigo-800 mt-1.5 leading-relaxed font-bold">
                      Your $10 deposit authorization has been cancelled. Reliability score maintained at 100%.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Simulated Camera Viewfinder with scanning laser */}
                  <div className="relative w-56 h-56 mx-auto rounded-3xl border-2 border-indigo-500/60 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Viewfinder corner brackets */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-400" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-400" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-400" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-400" />

                    {/* Animated laser line */}
                    <div className="absolute left-4 right-4 h-0.5 bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-bounce duration-1000" />

                    <div className="text-center p-4">
                      <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-[11px] text-slate-400 font-medium">Align with Host QR code</p>
                    </div>
                  </div>

                  {/* One-Tap Simulation Button */}
                  <button
                    id="btn-scan-host-qr-simulate"
                    onClick={() => handleSimulatedScan()}
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.99] transition-all"
                  >
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>Scan Host QR Code to Check In</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
