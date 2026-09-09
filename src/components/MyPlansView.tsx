import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Plus,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { MicroPlan, PlanParticipant } from '../types';
import { QRCheckInModal } from './QRCheckInModal';

export const MyPlansView: React.FC = () => {
  const {
    plans,
    participants,
    allUsers,
    currentUser,
    respondToRsvp,
    cancelAttendance,
    cancelPlan,
    setActiveChatPlanId,
    setIsHostModalOpen,
    setSelectedPlanId,
  } = useFellow();

  const [activeSubTab, setActiveSubTab] = useState<'attending' | 'hosting'>('attending');
  const [activeQrModal, setActiveQrModal] = useState<{ plan: MicroPlan; mode: 'host_present' | 'guest_scan' } | null>(null);
  const [cancelModalPlanId, setCancelModalPlanId] = useState<string | null>(null);

  // Plans where current user is host
  const hostedPlans = plans.filter((p) => p.host_user_id === currentUser.id && p.status !== 'cancelled');

  // Plans where current user is a guest (pending or confirmed)
  const guestParticipations = participants.filter(
    (part) => part.user_id === currentUser.id && part.role === 'guest' && part.rsvp_status !== 'cancelled_by_user'
  );
  const attendingPlanIds = guestParticipations.map((p) => p.plan_id);
  const attendingPlans = plans.filter((p) => attendingPlanIds.includes(p.id) && p.status !== 'cancelled');

  const handleCancelAttendanceClick = (planId: string) => {
    cancelAttendance(planId);
    setCancelModalPlanId(null);
  };

  const calculateHoursToStart = (startTimeStr: string) => {
    const start = new Date(startTimeStr).getTime();
    const now = Date.now();
    return (start - now) / (1000 * 60 * 60);
  };

  return (
    <div id="my-plans-view-container" className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6 text-left">
      {/* Sub-Tabs: Attending vs Hosting */}
      <div className="flex rounded-full bg-white p-1 border border-[#EAE7E2] text-xs font-semibold shadow-2xs">
        <button
          id="tab-sub-attending"
          onClick={() => setActiveSubTab('attending')}
          className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'attending'
              ? 'bg-[#1A1918] text-white shadow-sm'
              : 'text-[#6B6966] hover:text-[#1A1918]'
          }`}
        >
          <span>Attending & Requested</span>
          {attendingPlans.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSubTab === 'attending' ? 'bg-[#33312E] text-white' : 'bg-[#F9F8F6] text-[#1A1918]'
              }`}
            >
              {attendingPlans.length}
            </span>
          )}
        </button>
        <button
          id="tab-sub-hosting"
          onClick={() => setActiveSubTab('hosting')}
          className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'hosting'
              ? 'bg-[#1A1918] text-white shadow-sm'
              : 'text-[#6B6966] hover:text-[#1A1918]'
          }`}
        >
          <span>Hosting Plans</span>
          {hostedPlans.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSubTab === 'hosting' ? 'bg-[#33312E] text-white' : 'bg-[#F9F8F6] text-[#1A1918]'
              }`}
            >
              {hostedPlans.length}
            </span>
          )}
        </button>
      </div>

      {/* Attending SubTab */}
      {activeSubTab === 'attending' && (
        <div className="space-y-4">
          {attendingPlans.length > 0 ? (
            attendingPlans.map((plan) => {
              const host = allUsers.find((u) => u.id === plan.host_user_id);
              const part = guestParticipations.find((p) => p.plan_id === plan.id);
              const isConfirmed = part?.rsvp_status === 'confirmed';
              const isPending = part?.rsvp_status === 'pending_approval';
              const isCheckedIn = !!part?.checked_in_at;
              const hoursToStart = calculateHoursToStart(plan.start_time);

              return (
                <div
                  key={plan.id}
                  id={`my-plan-card-${plan.id}`}
                  className="bg-white border border-[#EAE7E2] rounded-3xl p-6 text-left space-y-4 shadow-bento hover:border-[#D1CDC7] transition-all"
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={host?.profile_photo_url}
                        alt={host?.display_name}
                        className="w-7 h-7 rounded-full object-cover border border-[#EAE7E2]"
                      />
                      <span className="text-[#1A1918] font-semibold">
                        Hosted by {host?.display_name} {host?.origin_flag}
                      </span>
                    </div>

                    {isCheckedIn ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Checked In · Deposit Voided</span>
                      </span>
                    ) : isConfirmed ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F9F8F6] text-[#1A1918] border border-[#EAE7E2] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Confirmed · $10 Hold Active</span>
                      </span>
                    ) : isPending ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Venue */}
                  <div>
                    <h3
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="font-editorial text-xl font-semibold text-[#1A1918] hover:text-[#E64A2A] cursor-pointer transition-colors"
                    >
                      {plan.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#6B6966] mt-2 bg-[#F9F8F6] rounded-xl p-3 border border-[#EAE7E2]">
                      <span className="flex items-center gap-1 text-[#1A1918] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#1A1918]" />
                        {new Date(plan.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="text-[#D1CDC7]">•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E64A2A]" />
                        {plan.venue_name}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#EAE7E2] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {isConfirmed && !isCheckedIn && (
                        <button
                          id={`btn-guest-scan-qr-${plan.id}`}
                          onClick={() => setActiveQrModal({ plan, mode: 'guest_scan' })}
                          className="px-4 py-2 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Scan Host QR to Check In</span>
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          id={`btn-chat-plan-${plan.id}`}
                          onClick={() => setActiveChatPlanId(plan.id)}
                          className="px-4 py-2 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] border border-[#EAE7E2] text-[#1A1918] font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#E64A2A]" />
                          <span>Plan Chat</span>
                        </button>
                      )}
                    </div>

                    {/* Cancellation Trigger */}
                    <button
                      onClick={() => setCancelModalPlanId(plan.id)}
                      className="text-[#9C9892] hover:text-[#DC2626] transition-colors text-xs font-semibold ml-auto"
                    >
                      Cancel Attendance
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-[#EAE7E2] rounded-3xl p-10 text-center space-y-3 shadow-bento">
              <div className="w-12 h-12 rounded-full bg-[#F9F8F6] text-[#9C9892] flex items-center justify-center mx-auto border border-[#EAE7E2]">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg font-semibold text-[#1A1918]">No active meetups joined</h4>
              <p className="text-xs text-[#6B6966] max-w-sm mx-auto leading-relaxed">
                Browse open 2–4 hour plans in Tokyo or Lisbon. Joining requires verified status and a refundable $10 hold.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hosting SubTab */}
      {activeSubTab === 'hosting' && (
        <div className="space-y-4">
          {hostedPlans.length > 0 ? (
            hostedPlans.map((plan) => {
              const planParticipants = participants.filter((p) => p.plan_id === plan.id);
              const pendingGuests = planParticipants.filter((p) => p.rsvp_status === 'pending_approval');
              const confirmedGuests = planParticipants.filter((p) => p.rsvp_status === 'confirmed');

              return (
                <div
                  key={plan.id}
                  id={`hosted-plan-card-${plan.id}`}
                  className="bg-white border border-[#EAE7E2] rounded-3xl p-6 text-left space-y-4 shadow-bento hover:border-[#D1CDC7] transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-md bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918]">
                      Host Listing
                    </span>
                    <span className="text-xs text-[#6B6966] font-medium">
                      {confirmedGuests.length}/{plan.max_participants} Spots Filled
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="font-editorial text-xl font-semibold text-[#1A1918] hover:text-[#E64A2A] cursor-pointer transition-colors"
                    >
                      {plan.title}
                    </h3>
                    <p className="text-xs text-[#6B6966] mt-1">{plan.venue_name} · {plan.venue_address}</p>
                  </div>

                  {/* Pending Requests List */}
                  {pendingGuests.length > 0 && (
                    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
                        <AlertCircle className="w-4 h-4" />
                        <span>Pending Join Requests ({pendingGuests.length})</span>
                      </div>

                      <div className="space-y-2">
                        {pendingGuests.map((part) => {
                          const applicant = allUsers.find((u) => u.id === part.user_id);
                          return (
                            <div
                              key={part.id}
                              className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#FDE68A] shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={applicant?.profile_photo_url}
                                  alt={applicant?.display_name}
                                  className="w-9 h-9 rounded-full object-cover border border-[#EAE7E2]"
                                />
                                <div>
                                  <div className="flex items-center gap-1 text-xs font-semibold text-[#1A1918]">
                                    <span>{applicant?.display_name}</span>
                                    {applicant?.is_verified && (
                                      <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                                    )}
                                    <span>{applicant?.origin_flag}</span>
                                  </div>
                                  <span className="text-[11px] text-[#6B6966]">
                                    {applicant?.reliability_score}% reliability · $10 authorized
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  id={`btn-accept-rsvp-${part.id}`}
                                  onClick={() => respondToRsvp(part.id, 'accept')}
                                  className="px-3 py-1.5 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs transition-colors shadow-2xs"
                                >
                                  Accept
                                </button>
                                <button
                                  id={`btn-decline-rsvp-${part.id}`}
                                  onClick={() => respondToRsvp(part.id, 'decline')}
                                  className="px-3 py-1.5 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] border border-[#EAE7E2] text-[#6B6966] font-semibold text-xs transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Confirmed Attendees List */}
                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
                      Confirmed Attendees ({confirmedGuests.length})
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {confirmedGuests.map((part) => {
                        const user = allUsers.find((u) => u.id === part.user_id);
                        const isCheckedIn = !!part.checked_in_at;
                        return (
                          <div
                            key={part.id}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] shrink-0"
                          >
                            <img
                              src={user?.profile_photo_url}
                              alt={user?.display_name}
                              className="w-7 h-7 rounded-full object-cover border border-[#EAE7E2]"
                            />
                            <div>
                              <p className="font-semibold text-[#1A1918] text-xs">{user?.display_name}</p>
                              <span className={`text-[10px] font-medium ${isCheckedIn ? 'text-[#059669]' : 'text-[#9C9892]'}`}>
                                {isCheckedIn ? '✓ Checked in' : 'Awaiting check-in'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Host Active Controls: Open Check-In QR & Group Chat */}
                  <div className="pt-3 border-t border-[#EAE7E2] flex items-center gap-2.5">
                    <button
                      id={`btn-host-open-qr-${plan.id}`}
                      onClick={() => setActiveQrModal({ plan, mode: 'host_present' })}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Open Attendance HUD & QR</span>
                    </button>

                    <button
                      id={`btn-host-chat-${plan.id}`}
                      onClick={() => setActiveChatPlanId(plan.id)}
                      className="py-2.5 px-4 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] border border-[#EAE7E2] text-[#1A1918] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#E64A2A]" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => cancelPlan(plan.id)}
                      className="py-2 px-3 text-[#9C9892] hover:text-[#DC2626] text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-[#EAE7E2] rounded-3xl p-10 text-center space-y-4 shadow-bento">
              <div className="w-12 h-12 rounded-full bg-[#F9F8F6] text-[#1A1918] flex items-center justify-center mx-auto border border-[#EAE7E2]">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-editorial text-lg font-semibold text-[#1A1918]">You are not hosting any plans</h4>
              <p className="text-xs text-[#6B6966] max-w-sm mx-auto leading-relaxed">
                Host a dinner, cafe coworking session, or cultural walk. Max 4 people, public venues only.
              </p>
              <button
                onClick={() => setIsHostModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Host a Micro-Plan</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dynamic QR Check-in Modal */}
      {activeQrModal && (
        <QRCheckInModal
          plan={activeQrModal.plan}
          mode={activeQrModal.mode}
          onClose={() => setActiveQrModal(null)}
        />
      )}

      {/* Attendee Cancellation Notice & Rule Modal */}
      {cancelModalPlanId && (
        <div className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE7E2] rounded-3xl p-6 max-w-sm w-full space-y-4 text-[#1A1918] text-left shadow-2xl">
            <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Cancel Attendance?</h3>

            {(() => {
              const targetPlan = plans.find((p) => p.id === cancelModalPlanId);
              if (!targetPlan) return null;
              const hours = calculateHoursToStart(targetPlan.start_time);
              const isLate = hours < 12;

              return (
                <div className="space-y-3 text-xs">
                  {isLate ? (
                    <div className="bg-[#FDF2F2] border border-[#F87171] rounded-2xl p-4 text-[#DC2626] space-y-1">
                      <p className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Late Cancellation Notice ({hours.toFixed(1)} hrs left)</span>
                      </p>
                      <p className="leading-relaxed text-[11px] text-[#B91C1C]">
                        Cancellations with less than 12 hours notice forfeit the $10 deposit ($5 to host credit, $5 platform) and decrement your reliability score by 25 points.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 text-[#065F46] space-y-1">
                      <p className="font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#059669]" />
                        <span>Timely Notice ({hours.toFixed(1)} hrs left)</span>
                      </p>
                      <p className="leading-relaxed text-[11px]">
                        Notice is greater than 12 hours. Your $10 deposit authorization will be cancelled and released immediately ($0 cost).
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setCancelModalPlanId(null)}
                      className="flex-1 py-2.5 rounded-full bg-[#F9F8F6] hover:bg-[#EAE7E2] border border-[#EAE7E2] text-[#1A1918] font-semibold text-xs"
                    >
                      Keep Spot
                    </button>
                    <button
                      onClick={() => handleCancelAttendanceClick(cancelModalPlanId)}
                      className="flex-1 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs shadow-sm"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
