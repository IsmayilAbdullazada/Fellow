import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Calendar,
  Share2,
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
    setIsRequesting(true);
    const result = requestToJoinPlan(plan.id);
    setIsRequesting(false);

    if (!result.success && result.error) {
      // If it's a hard error (e.g. plan full or overlap), show in card
      if (result.error.toLowerCase().includes('full') || result.error.toLowerCase().includes('already')) {
        setRequestError(result.error);
      }
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
    const diffHours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1).replace('.0', '');
    return { dateFormatted, timeRange: `${startTimeFormatted} - ${endTimeFormatted} (${diffHours} hrs)` };
  };

  const { dateFormatted, timeRange } = formatTimeRange(plan.start_time, plan.end_time);

  return (
    <>
      <div
        id="plan-detail-modal-overlay"
        className="fixed inset-0 z-50 bg-[#1A1918]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      >
        <div
          id={`plan-detail-dialog-${plan.id}`}
          className="bg-white border border-[#EAE7E2] rounded-t-[28px] sm:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#1A1918] animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Top Handle for mobile bottom sheet feel */}
          <div className="w-12 h-1 bg-[#EAE7E2] rounded-full mx-auto mt-2.5 sm:hidden" />

          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#EAE7E2]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-md bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918]">
                {plan.category.toUpperCase().replace('_', ' ')}
              </span>
              {plan.female_only && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-md bg-[#FDF2F4] border border-[#FBCFE8] text-[#9D174D]">
                  ♀ Female Only
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setReportingTarget({ userId: plan.host_user_id, name: host?.display_name || 'Host', planId: plan.id })}
                className="p-2 text-[#9C9892] hover:text-[#DC2626] transition-colors rounded-full"
                title="Report Safety Issue"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#9C9892] hover:text-[#1A1918] transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 space-y-4 text-left">
            {/* Title & Host Mini Card */}
            <div>
              <h2 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#1A1918] leading-tight mb-3">
                {plan.title}
              </h2>
              <div
                onClick={() => host && setInspectUserId(host.id)}
                className="inline-flex items-center gap-3 bg-[#F9F8F6] hover:bg-[#EAE7E2]/50 border border-[#EAE7E2] rounded-xl px-3.5 py-2 cursor-pointer transition-colors"
              >
                <div className="relative shrink-0">
                  <img
                    src={host?.profile_photo_url}
                    alt={host?.display_name}
                    className="w-8 h-8 rounded-full object-cover border border-[#EAE7E2]"
                  />
                  {host?.is_verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-[#059669] text-white rounded-full p-0.5 border border-white">
                      <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1A1918]">
                    <span>Hosted by {host?.display_name}</span>
                    <span>{host?.origin_flag}</span>
                  </div>
                  <span className="text-[11px] text-[#6B6966]">
                    Reliability Score: {host?.reliability_score}% · Tap for Verified Passport
                  </span>
                </div>
              </div>
            </div>

            {/* Venue & Timing Bento Box */}
            <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-[#1A1918]">
                    <Clock className="w-4 h-4 text-[#1A1918]" />
                    <span>{dateFormatted} · {timeRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B6966]">
                    <MapPin className="w-4 h-4 text-[#6B6966]" />
                    <span>{plan.venue_name} (4.6★ on Google)</span>
                  </div>
                  <p className="text-[11px] text-[#9C9892] pl-6">{plan.venue_address}</p>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] font-medium text-[11px] flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B6966]" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            {/* The Plan Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
                The Plan
              </h4>
              <p className="text-xs sm:text-sm text-[#6B6966] leading-relaxed bg-[#F9F8F6] p-4 rounded-xl border border-[#EAE7E2]">
                {plan.description}
              </p>
            </div>

            {/* Confirmed Travelers Bento Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9892]">
                  Confirmed Travelers ({confirmedParticipants.length} of {plan.max_participants} Filled)
                </h4>
                <span className="text-[11px] text-[#9C9892]">Tap avatar for profile</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {confirmedParticipants.map((part) => {
                  const user = allUsers.find((u) => u.id === part.user_id);
                  if (!user) return null;
                  const isHostUser = user.id === plan.host_user_id;

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
                          className="w-12 h-12 rounded-full object-cover border border-[#EAE7E2] group-hover:border-[#E64A2A] transition-colors"
                        />
                        {user.is_verified && (
                          <span className="absolute -bottom-0.5 -right-0.5 bg-[#059669] text-white rounded-full p-0.5 border border-white">
                            <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#1A1918] truncate max-w-[68px]">
                        {user.display_name} {isHostUser && '(Host)'}
                      </span>
                    </button>
                  );
                })}

                {/* Empty open spots */}
                {Array.from({ length: Math.max(0, plan.max_participants - confirmedParticipants.length) }).map(
                  (_, idx) => (
                    <div
                      key={`empty_spot_${idx}`}
                      className="flex flex-col items-center gap-1.5 shrink-0 opacity-60"
                    >
                      <div className="w-12 h-12 rounded-full border border-dashed border-[#D1CDC7] flex items-center justify-center text-[#9C9892] bg-[#F9F8F6]">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-[#9C9892] font-medium">Open Spot</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Trust & Safety Charter Banner */}
            <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-3.5 text-xs text-[#6B6966] flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">🛡️</span>
              <p className="leading-relaxed">
                <strong className="text-[#1A1918] font-semibold">Commercial Venue Only · $10 Anti-Flake Deposit Enforced · No-Dating.</strong>{' '}
                All attendees are verified via government ID. The $10 hold is voided immediately upon scanning the host's QR code at the table.
              </p>
            </div>

            {requestError && (
              <div className="bg-[#FDF2F2] border border-[#F87171] rounded-xl p-3.5 text-xs text-[#DC2626] font-medium">
                {requestError}
              </div>
            )}
          </div>

          {/* Bottom Sticky Action Bar in Sunset Terracotta */}
          <div className="p-4 sm:p-5 border-t border-[#EAE7E2] bg-white mt-auto">
            {isHost ? (
              <button
                id="btn-manage-my-hosted-plan"
                onClick={handleManagePlan}
                className="w-full py-3.5 px-4 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <QrCode className="w-4 h-4" />
                <span>Manage Plan & Open Check-In QR</span>
              </button>
            ) : isConfirmed ? (
              <div className="space-y-2">
                <button
                  id="btn-open-group-chat"
                  onClick={handleOpenChat}
                  className="w-full py-3.5 px-4 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Ephemeral Plan Chat</span>
                </button>
                <p className="text-[11px] text-center text-[#059669] font-medium">
                  ✓ Confirmed Attendee · $10 refundable hold active
                </p>
              </div>
            ) : isPending ? (
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#D97706]">
                  <Clock className="w-4 h-4" />
                  <span>Pending Host Approval</span>
                </div>
                <p className="text-[11px] text-[#B45309] leading-relaxed">
                  Your $10 temporary authorization is held and will only convert or release when confirmed.
                </p>
              </div>
            ) : !currentUser.is_verified || !currentUser.has_paid_pass ? (
              <div className="space-y-2">
                <button
                  id="btn-verify-identity-to-join"
                  onClick={startVerificationFlow}
                  className="w-full py-3.5 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md shadow-[#E64A2A]/20"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify Identity to Join ($9.99 Pass)</span>
                </button>
                <p className="text-[11px] text-center text-[#9C9892]">
                  One-time pass covers government KYC & liveness check for all hubs forever.
                </p>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-full bg-[#F9F8F6] text-[#9C9892] font-semibold text-sm cursor-not-allowed border border-[#EAE7E2]"
              >
                Plan Filled to Capacity ({plan.max_participants}/{plan.max_participants})
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  id="btn-request-to-join-plan"
                  onClick={handleJoinClick}
                  disabled={isRequesting}
                  className="w-full py-3.5 px-4 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md shadow-[#E64A2A]/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request to Join Plan — Holds $10 Deposit</span>
                </button>
                <p className="text-[11px] text-center text-[#6B6966]">
                  Your card is only authorized. The $10 hold is voided immediately when you scan the host's QR code at the table.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightweight Profile Modal */}
      {inspectUserId && (
        <LightweightProfileModal
          userId={inspectUserId}
          onClose={() => setInspectUserId(null)}
        />
      )}
    </>
  );
};
