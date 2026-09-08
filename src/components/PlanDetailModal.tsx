import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  ExternalLink,
  Lock,
  MessageSquare,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { LightweightProfileModal } from './LightweightProfileModal';

interface PlanDetailModalProps {
  planId: string;
  onClose: () => void;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ planId, onClose }) => {
  const {
    plans,
    participants,
    allUsers,
    currentUser,
    requestToJoinPlan,
    startVerificationFlow,
    setActiveChatPlanId,
    setActiveTab,
    setReportingTarget,
  } = useFellow();

  const [inspectUserId, setInspectUserId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const plan = plans.find((p) => p.id === planId);
  if (!plan) return null;

  const host = allUsers.find((u) => u.id === plan.host_user_id);
  const planParticipants = participants.filter((p) => p.plan_id === plan.id);
  const confirmedParticipants = planParticipants.filter((p) => p.rsvp_status === 'confirmed');

  const isHost = plan.host_user_id === currentUser.id;
  const userParticipant = planParticipants.find((p) => p.user_id === currentUser.id);
  const isConfirmed = userParticipant?.rsvp_status === 'confirmed';
  const isPending = userParticipant?.rsvp_status === 'pending_approval';

  const isFull = confirmedParticipants.length >= plan.max_participants;

  const handleJoinClick = () => {
    setRequestError(null);
    if (!currentUser.is_verified || !currentUser.has_paid_pass) {
      startVerificationFlow();
      return;
    }

    setIsRequesting(true);
    const result = requestToJoinPlan(plan.id);
    setIsRequesting(false);

    if (!result.success) {
      setRequestError(result.error || 'Failed to request plan.');
    }
  };

  const handleOpenChat = () => {
    setActiveChatPlanId(plan.id);
    onClose();
  };

  const handleManagePlan = () => {
    setActiveTab('my_plans');
    onClose();
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    plan.venue_name + ' ' + plan.venue_address
  )}`;

  const formatTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const dateFormatted = start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const startTimeFormatted = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const endTimeFormatted = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return { dateFormatted, timeRange: `${startTimeFormatted} - ${endTimeFormatted}` };
  };

  const { dateFormatted, timeRange } = formatTimeRange(plan.start_time, plan.end_time);

  return (
    <>
      <div id="plan-detail-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div
          id={`plan-detail-dialog-${plan.id}`}
          className="bg-white border border-slate-100 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-900 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Micro-Plan (2–4h)
              </span>
              {plan.female_only && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  ♀ Female Only
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setReportingTarget({ userId: plan.host_user_id, name: host?.display_name || 'Host', planId: plan.id })}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-xl"
                title="Report Safety Issue"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 space-y-4">
            {/* Title & Host Mini Card */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2.5">{plan.title}</h2>
              <div
                onClick={() => host && setInspectUserId(host.id)}
                className="inline-flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 cursor-pointer transition-colors"
              >
                <img
                  src={host?.profile_photo_url}
                  alt={host?.display_name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500"
                />
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Hosted by {host?.display_name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{host?.origin_flag}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Tap to inspect verified profile</span>
                </div>
              </div>
            </div>

            {/* Simulated Map / Venue Pin Section */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-50">
              {/* Map Canvas Mockup with pinpoint */}
              <div className="h-36 bg-gradient-to-br from-indigo-50/70 via-slate-100 to-indigo-50/50 relative flex items-center justify-center border-b border-slate-200">
                {/* Visual Grid Lines to evoke Map */}
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Center Pin Drop */}
                <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-full shadow-lg shadow-indigo-300 ring-4 ring-white">
                    <MapPin className="w-5 h-5 fill-white" />
                  </div>
                  <div className="w-2 h-1 bg-slate-400 rounded-full mt-1 blur-[1px]" />
                </div>

                <span className="absolute bottom-2.5 left-3 text-[10px] bg-white/90 backdrop-blur font-bold text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                  Public Commercial Establishment · Google Places
                </span>
              </div>

              {/* Venue Meta */}
              <div className="p-4 space-y-1.5 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{plan.venue_name}</h4>
                    <p className="text-xs text-slate-500">{plan.venue_address}</p>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-600 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Time Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3.5 text-xs">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{dateFormatted}</p>
                <p className="text-slate-500 font-medium">{timeRange}</p>
              </div>
            </div>

            {/* Plan Description & Safety Guarantee Box */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meetup Details</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {plan.description}
              </p>

              {/* Mandatory Non-Dating Safety Rule Banner */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 text-xs text-indigo-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-bold text-indigo-950">Public venue meetup · Max 4 people.</strong>{' '}
                  Non-dating social rule strictly enforced. All members verified via government ID and 3D selfie check.
                </p>
              </div>
            </div>

            {/* Confirmed Attendees Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Confirmed Travelers ({confirmedParticipants.length}/{plan.max_participants})
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Tap avatar for profile</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {confirmedParticipants.map((part) => {
                  const user = allUsers.find((u) => u.id === part.user_id);
                  if (!user) return null;
                  return (
                    <button
                      key={part.id}
                      onClick={() => setInspectUserId(user.id)}
                      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                    >
                      <div className="relative">
                        <img
                          src={user.profile_photo_url}
                          alt={user.display_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 group-hover:scale-105 transition-all"
                        />
                        {user.is_verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                            <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600 truncate max-w-[64px]">
                        {user.display_name}
                      </span>
                    </button>
                  );
                })}

                {/* Empty open spots */}
                {Array.from({ length: Math.max(0, plan.max_participants - confirmedParticipants.length) }).map(
                  (_, idx) => (
                    <div
                      key={`empty_spot_${idx}`}
                      className="flex flex-col items-center gap-1.5 shrink-0 opacity-70"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">Open spot</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {requestError && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 font-medium">
                {requestError}
              </div>
            )}
          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="p-5 border-t border-slate-100 bg-white mt-auto">
            {isHost ? (
              <button
                id="btn-manage-my-hosted-plan"
                onClick={handleManagePlan}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-[0.99]"
              >
                <QrCode className="w-4 h-4" />
                <span>Manage Plan & Open Check-In QR</span>
              </button>
            ) : isConfirmed ? (
              <div className="space-y-2">
                <button
                  id="btn-open-group-chat"
                  onClick={handleOpenChat}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Ephemeral Group Chat</span>
                </button>
                <p className="text-[11px] text-center text-indigo-700 font-bold">
                  ✓ Confirmed Attendee · $10 refundable hold active
                </p>
              </div>
            ) : isPending ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Host Approval</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Your $10 temporary authorization is held and will only convert or release when confirmed.
                </p>
              </div>
            ) : !currentUser.is_verified || !currentUser.has_paid_pass ? (
              <div className="space-y-2">
                <button
                  id="btn-verify-identity-to-join"
                  onClick={startVerificationFlow}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Verify Identity to Join ($9.99 Pass)</span>
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  One-time pass covers government KYC & liveness check for all hubs forever.
                </p>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200"
              >
                Plan Filled to Capacity (4/4)
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  id="btn-request-to-join-plan"
                  onClick={handleJoinClick}
                  disabled={isRequesting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request to Join ($10 Deposit)</span>
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  $10 pre-authorization hold · Released instantly when you scan the host QR at venue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightweight Profile Modal (PRD Screen 2) */}
      {inspectUserId && (
        <LightweightProfileModal
          userId={inspectUserId}
          onClose={() => setInspectUserId(null)}
        />
      )}
    </>
  );
};
