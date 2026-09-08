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
    const result = cancelAttendance(planId);
    setCancelModalPlanId(null);
  };

  const calculateHoursToStart = (startTimeStr: string) => {
    const start = new Date(startTimeStr).getTime();
    const now = Date.now();
    return (start - now) / (1000 * 60 * 60);
  };

  return (
    <div id="my-plans-view-container" className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-5">
      {/* Sub-Tabs: Attending vs Hosting */}
      <div className="flex rounded-2xl bg-white p-1.5 border-2 border-slate-100 text-xs font-bold shadow-sm">
        <button
          id="tab-sub-attending"
          onClick={() => setActiveSubTab('attending')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'attending'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Attending & Requested</span>
          {attendingPlans.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeSubTab === 'attending' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {attendingPlans.length}
            </span>
          )}
        </button>
        <button
          id="tab-sub-hosting"
          onClick={() => setActiveSubTab('hosting')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'hosting'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Hosting Plans</span>
          {hostedPlans.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeSubTab === 'hosting' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
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
                  className="bg-white border-2 border-slate-100 rounded-[32px] p-6 text-left space-y-4 shadow-sm hover:border-indigo-200 transition-all"
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={host?.profile_photo_url}
                        alt={host?.display_name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500"
                      />
                      <span className="text-slate-900 font-bold">
                        Host: {host?.display_name} {host?.origin_flag}
                      </span>
                    </div>

                    {isCheckedIn ? (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Checked In (Deposit Released)</span>
                      </span>
                    ) : isConfirmed ? (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirmed · $10 Hold Active</span>
                      </span>
                    ) : isPending ? (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Venue */}
                  <div>
                    <h3
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="text-xl font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {plan.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-2 bg-slate-50 rounded-2xl p-3 border border-slate-100 font-medium">
                      <span className="flex items-center gap-1 text-slate-900 font-bold">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {new Date(plan.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {plan.venue_name}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {isConfirmed && !isCheckedIn && (
                        <button
                          id={`btn-guest-scan-qr-${plan.id}`}
                          onClick={() => setActiveQrModal({ plan, mode: 'guest_scan' })}
                          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-200"
                        >
                          <QrCode className="w-4 h-4 stroke-[2.5]" />
                          <span>Scan Host QR to Check In</span>
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          id={`btn-chat-plan-${plan.id}`}
                          onClick={() => setActiveChatPlanId(plan.id)}
                          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          <span>Group Chat</span>
                        </button>
                      )}
                    </div>

                    {/* Cancellation Trigger */}
                    <button
                      onClick={() => setCancelModalPlanId(plan.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors text-xs font-bold ml-auto"
                    >
                      Cancel Attendance
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border-2 border-slate-100 rounded-[32px] p-10 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">No active meetups joined</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
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
                  className="bg-white border-2 border-slate-100 rounded-[32px] p-6 text-left space-y-4 shadow-sm hover:border-indigo-200 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      You are the Host
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {confirmedGuests.length}/{plan.max_participants} Spots Filled
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="text-xl font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {plan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{plan.venue_name} · {plan.venue_address}</p>
                  </div>

                  {/* Pending Requests List (PRD Part 3 Screen 5) */}
                  {pendingGuests.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Pending Join Requests ({pendingGuests.length})</span>
                      </div>

                      <div className="space-y-2">
                        {pendingGuests.map((part) => {
                          const applicant = allUsers.find((u) => u.id === part.user_id);
                          return (
                            <div
                              key={part.id}
                              className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100 shadow-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={applicant?.profile_photo_url}
                                  alt={applicant?.display_name}
                                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
                                />
                                <div>
                                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                    <span>{applicant?.display_name}</span>
                                    {applicant?.is_verified && (
                                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                    )}
                                    <span>{applicant?.origin_flag}</span>
                                  </div>
                                  <span className="text-[11px] text-slate-500">
                                    {applicant?.reliability_score}% reliability · $10 authorized
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  id={`btn-accept-rsvp-${part.id}`}
                                  onClick={() => respondToRsvp(part.id, 'accept')}
                                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  id={`btn-decline-rsvp-${part.id}`}
                                  onClick={() => respondToRsvp(part.id, 'decline')}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
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
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Confirmed Attendees ({confirmedGuests.length})
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {confirmedGuests.map((part) => {
                        const user = allUsers.find((u) => u.id === part.user_id);
                        const isCheckedIn = !!part.checked_in_at;
                        return (
                          <div
                            key={part.id}
                            className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shrink-0"
                          >
                            <img
                              src={user?.profile_photo_url}
                              alt={user?.display_name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{user?.display_name}</p>
                              <span className={`text-[10px] font-semibold ${isCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {isCheckedIn ? '✓ Checked in' : 'Awaiting check-in'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Host Active Controls: Open Check-In QR & Group Chat */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <button
                      id={`btn-host-open-qr-${plan.id}`}
                      onClick={() => setActiveQrModal({ plan, mode: 'host_present' })}
                      className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.99] transition-all"
                    >
                      <QrCode className="w-4 h-4 stroke-[2.5]" />
                      <span>Open Attendee Check-In QR</span>
                    </button>

                    <button
                      id={`btn-host-chat-${plan.id}`}
                      onClick={() => setActiveChatPlanId(plan.id)}
                      className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => cancelPlan(plan.id)}
                      className="py-3 px-3 text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border-2 border-slate-100 rounded-[32px] p-10 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">You are not hosting any plans</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Host a dinner, cafe coworking session, or cultural walk. Max 4 people, public venues only.
              </p>
              <button
                onClick={() => setIsHostModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
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

      {/* Attendee Cancellation Notice & Rule Modal (PRD Rule 3) */}
      {cancelModalPlanId && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 max-w-sm w-full space-y-4 text-slate-900 text-left shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900">Cancel Attendance?</h3>

            {(() => {
              const targetPlan = plans.find((p) => p.id === cancelModalPlanId);
              if (!targetPlan) return null;
              const hours = calculateHoursToStart(targetPlan.start_time);
              const isLate = hours < 12;

              return (
                <div className="space-y-3 text-xs">
                  {isLate ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Late Cancellation Notice ({hours.toFixed(1)} hrs left)</span>
                      </p>
                      <p className="leading-relaxed">
                        Cancellations with less than 12 hours notice forfeit the $10 deposit ($5 to host credit, $5 platform) and decrement your reliability score by 25 points.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Timely Notice ({hours.toFixed(1)} hrs left)</span>
                      </p>
                      <p className="leading-relaxed">
                        Notice is greater than 12 hours. Your $10 deposit authorization will be cancelled and released immediately ($0 cost).
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setCancelModalPlanId(null)}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      Keep Spot
                    </button>
                    <button
                      onClick={() => handleCancelAttendanceClick(cancelModalPlanId)}
                      className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200"
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
