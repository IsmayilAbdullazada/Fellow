import React, { useState } from 'react';
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
  ArrowRight,
  UserCheck,
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
    setActiveChatPlanId,
  } = useFellow();

  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [manualConfirmNotice, setManualConfirmNotice] = useState<string | null>(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState<boolean>(false);

  const planParticipants = participants.filter((p) => p.plan_id === plan.id);
  const confirmedAttendees = planParticipants.filter((p) => p.rsvp_status === 'confirmed');
  const checkedInCount = confirmedAttendees.filter((p) => !!p.checked_in_at).length;
  const guestAttendees = confirmedAttendees.filter((p) => p.role === 'guest');
  const guestCheckedInCount = guestAttendees.filter((p) => !!p.checked_in_at).length;

  // Check if current user guest is already checked in
  const guestRecord = planParticipants.find((p) => p.user_id === currentUser.id);
  const isAlreadyCheckedIn = !!guestRecord?.checked_in_at;

  const handleSimulatedScan = () => {
    const token = plan.qr_checkin_token;
    const result = checkInAttendeeWithQr(plan.id, token);
    setScanResult(result);
  };

  const handleManualHostCheckIn = (attendeeUserId: string) => {
    const res = checkInAttendeeWithQr(plan.id, plan.qr_checkin_token);
    const targetUser = allUsers.find((u) => u.id === attendeeUserId);
    setManualConfirmNotice(`Manually verified ${targetUser?.display_name || 'traveler'}. Deposit released.`);
    setTimeout(() => setManualConfirmNotice(null), 3000);
  };

  const handleGoToChat = () => {
    setActiveChatPlanId(plan.id);
    onClose();
  };

  return (
    <div
      id="qr-checkin-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id={`qr-modal-${plan.id}`}
        className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-[#1A1918] animate-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7E2]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#E64A2A]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918]">
              {mode === 'host_present' ? 'Host Attendance HUD' : 'In-Person Attendance Check-In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          {mode === 'host_present' ? (
            /* Host Mode: Dynamic QR Code that refreshes every 15s */
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-xl font-semibold text-[#1A1918]">{plan.title}</h4>
                <p className="text-xs text-[#6B6966] mt-0.5">{plan.venue_name}</p>
                <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] text-xs font-semibold text-[#1A1918]">
                  <span>{guestCheckedInCount} of {guestAttendees.length} Guests Checked In</span>
                </div>
              </div>

              {/* Rotating Dynamic High-Contrast QR Mockup */}
              <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-2xl shadow-bento flex flex-col items-center justify-center border border-[#EAE7E2]">
                {/* SVG High-Contrast Dynamic QR Matrix */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#1A1918] fill-current">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="25" height="25" fill="#1A1918" rx="3" />
                  <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="13" width="9" height="9" fill="#1A1918" rx="1" />

                  {/* Top-right position marker */}
                  <rect x="70" y="5" width="25" height="25" fill="#1A1918" rx="3" />
                  <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="78" y="13" width="9" height="9" fill="#1A1918" rx="1" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="70" width="25" height="25" fill="#1A1918" rx="3" />
                  <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="78" width="9" height="9" fill="#1A1918" rx="1" />

                  {/* Center Fellow Brand marker */}
                  <rect x="42" y="42" width="16" height="16" fill="#1A1918" rx="3" />
                  <rect x="44" y="44" width="12" height="12" fill="#E64A2A" rx="2" />

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
                <div className="absolute -bottom-3.5 bg-white text-[#1A1918] text-[11px] font-mono-code font-semibold px-3 py-1 rounded-full border border-[#EAE7E2] flex items-center gap-1.5 shadow-sm">
                  <RotateCcw className="w-3 h-3 text-[#E64A2A] animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Refreshes in {qrSecondsRemaining}s</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#6B6966] space-y-1">
                <p className="font-semibold text-[#1A1918]">Display this screen to your attendees</p>
                <p className="text-[11px] leading-relaxed">
                  Rotating cryptographic token prevents remote screenshot fraud. Once scanned, guest $10 deposits are automatically voided.
                </p>
              </div>

              {manualConfirmNotice && (
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-2.5 text-xs text-[#059669] font-medium">
                  {manualConfirmNotice}
                </div>
              )}

              {/* Attendee Check-In Status Roster */}
              <div className="pt-2 border-t border-[#EAE7E2] text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
                    Attendee Roster
                  </span>
                  <span className="text-[10px] text-[#9C9892]">Tap row if camera fails</span>
                </div>

                <div className="space-y-1.5">
                  {confirmedAttendees.map((part) => {
                    const user = allUsers.find((u) => u.id === part.user_id);
                    const isCheckedIn = !!part.checked_in_at;
                    const isHost = part.role === 'host';

                    return (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user?.profile_photo_url}
                            alt={user?.display_name}
                            className="w-7 h-7 rounded-full object-cover border border-[#EAE7E2]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-[#1A1918]">
                              <span>{user?.display_name}</span>
                              {isHost && <span className="text-[10px] text-[#E64A2A]">(Host)</span>}
                            </div>
                            <span className="text-[10px] text-[#9C9892] font-mono-code">
                              {user?.origin_country} · Score {user?.reliability_score}%
                            </span>
                          </div>
                        </div>

                        {isHost ? (
                          <span className="text-[#059669] text-[11px] font-semibold">
                            Host Present
                          </span>
                        ) : isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[10px] font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            <span>CHECKED IN · $0 VOIDED</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => user && handleManualHostCheckIn(user.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] text-[10px] font-semibold transition-colors"
                            title="Manual backup confirmation"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Manual Confirm</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Guest Mode: Optical Viewfinder & QR Scanner */
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-xl font-semibold text-[#1A1918]">Scan Host QR Code</h4>
                <p className="text-xs text-[#6B6966] mt-0.5">
                  Point camera at the host's screen at {plan.venue_name}
                </p>
              </div>

              {isAlreadyCheckedIn || scanResult?.success ? (
                /* Screen 4 Success Sheet (Tactile high-trust confirmation) */
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-6 text-center space-y-3.5 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-2xl font-semibold text-[#1A1918]">
                      Checked In.
                    </h4>
                    <p className="text-xs text-[#065F46] mt-1.5 leading-relaxed font-medium">
                      Your $10 deposit authorization has been cancelled. Total cost: $0. Reliability score maintained at 100%.
                    </p>
                  </div>

                  <div className="bg-white/90 border border-[#A7F3D0] rounded-2xl p-3.5 text-xs text-[#065F46] space-y-2 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-[#A7F3D0]/60">
                      <span className="font-medium text-[#1A1918]">Attendance Status</span>
                      <span className="font-semibold text-[#059669] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#059669] inline-block" />
                        Verified In Person
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1A1918]">$10 Anti-Flake Deposit</span>
                      <span className="font-semibold text-[#059669]">Voided ($0 charged)</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowReceiptDetails(!showReceiptDetails)}
                      className="text-[11px] text-[#065F46]/80 hover:text-[#065F46] underline font-medium"
                    >
                      {showReceiptDetails ? 'Hide cryptographic receipt' : 'Show verification details'}
                    </button>
                    {showReceiptDetails && (
                      <div className="mt-2 bg-white/70 border border-[#A7F3D0] rounded-xl p-2.5 text-[11px] font-mono-code text-[#065F46] text-left space-y-0.5">
                        <p>REF: FLW-AUTH-{plan.id.slice(-4).toUpperCase()}</p>
                        <p>HASH: SHA256-IN-PERSON-VERIFIED</p>
                        <p>TIME: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={handleGoToChat}
                      className="w-full py-3 px-4 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      Open Ephemeral Plan Chat
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 rounded-full bg-white text-[#1A1918] border border-[#EAE7E2] font-semibold text-xs transition-all"
                    >
                      Close HUD
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Optical Viewfinder Mockup */}
                  <div className="relative w-56 h-56 mx-auto rounded-2xl border-2 border-[#EAE7E2] bg-[#1A1918] overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Viewfinder corner brackets */}
                    <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-white/80" />
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-white/80" />
                    <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-white/80" />
                    <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-white/80" />

                    {/* Animated laser line */}
                    <div className="absolute left-6 right-6 h-0.5 bg-[#E64A2A] shadow-[0_0_8px_#E64A2A] animate-bounce duration-1000" />

                    <div className="text-center p-4">
                      <Camera className="w-8 h-8 text-[#9C9892] mx-auto mb-2" />
                      <p className="text-[11px] text-[#D1CDC7] font-medium">Align with Host QR</p>
                    </div>
                  </div>

                  {/* One-Tap Simulation Button */}
                  <button
                    id="btn-scan-host-qr-simulate"
                    onClick={handleSimulatedScan}
                    className="w-full py-3.5 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E64A2A]/20 active:scale-[0.99] transition-all"
                  >
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>Scan Host QR Code to Check In</span>
                  </button>
                  <p className="text-[11px] text-[#9C9892]">
                    Hold phone up to host's screen at the venue table
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
