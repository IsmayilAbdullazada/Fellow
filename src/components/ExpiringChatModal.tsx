import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Clock,
  AlertTriangle,
  Lock,
  Info,
  MapPin,
} from 'lucide-react';
import { useFellow } from '../context/FellowContext';

interface ExpiringChatModalProps {
  planId: string;
  onClose: () => void;
}

export const ExpiringChatModal: React.FC<ExpiringChatModalProps> = ({ planId, onClose }) => {
  const {
    plans,
    chatRooms,
    chatMessages,
    sendChatMessage,
    currentUser,
    setReportingTarget,
    allUsers,
  } = useFellow();

  const [messageText, setMessageText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const plan = plans.find((p) => p.id === planId);
  const room = chatRooms.find((r) => r.plan_id === planId);

  // Filter messages for this chat room
  const messages = chatMessages.filter((m) => m.chat_room_id === room?.id);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!plan || !room) return null;

  // Calculate chat expiry & unlock countdown
  const startTime = new Date(plan.start_time).getTime();
  const expiresTime = new Date(room.expires_at).getTime();
  const now = Date.now();

  const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);
  const isLockedPreEvent = hoursUntilStart > 48; // unlocks 48h before start
  const isExpired = now > expiresTime; // read-only 24h after end

  const formatCountdown = () => {
    if (isExpired) return 'Chat Closed & Archived';
    if (isLockedPreEvent) return `Unlocks in ${Math.ceil(hoursUntilStart - 48)}h`;

    const remainingMs = Math.max(0, expiresTime - now);
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `Closes in ${hours}h ${mins}m`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!messageText.trim()) return;

    const result = sendChatMessage(plan.id, messageText.trim());
    if (result.success) {
      setMessageText('');
    } else {
      setErrorMessage(result.error || 'Failed to send message.');
    }
  };

  const hostUser = allUsers.find((u) => u.id === plan.host_user_id);

  return (
    <div
      id="expiring-chat-modal-overlay"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[88vh] text-[#1A1918] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7E2] bg-[#F9F8F6]">
          <div className="text-left truncate mr-3">
            <h3 className="font-editorial text-lg font-semibold text-[#1A1918] truncate">{plan.title}</h3>
            <div className="flex items-center gap-2 text-xs text-[#6B6966] mt-0.5">
              <span className="flex items-center gap-1 truncate font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E64A2A] shrink-0" />
                {plan.venue_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Countdown timer badge */}
            <span className="text-[11px] font-mono-code font-semibold px-2.5 py-1 rounded-full bg-white border border-[#EAE7E2] text-[#1A1918] flex items-center gap-1 shadow-2xs">
              <Clock className="w-3 h-3 text-[#E64A2A]" />
              <span>{formatCountdown()}</span>
            </span>

            {/* Emergency Bar: Report User */}
            <button
              onClick={() =>
                setReportingTarget({
                  userId: plan.host_user_id,
                  name: hostUser?.display_name || 'Participant',
                  planId: plan.id,
                })
              }
              className="p-1.5 text-[#9C9892] hover:text-[#DC2626] rounded-full transition-colors"
              title="Report Safety Issue"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System Banner at Top of Chat */}
        <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-5 py-2.5 text-left text-xs text-[#92400E] flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">
            Coordinate logistics at <strong className="font-semibold">{plan.venue_name}</strong>. Never share personal accommodation or contact info outside Fellow.
          </p>
        </div>

        {/* Chat Body (Chronological Message Feed) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-left bg-[#F9F8F6]">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isSelf = msg.sender_user_id === currentUser.id;
              const formattedTime = new Date(msg.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.sender_avatar}
                    alt={msg.sender_name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#EAE7E2]"
                  />
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1.5 text-[10px] text-[#9C9892] ${isSelf ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-[#6B6966]">{msg.sender_name}</span>
                      <span>·</span>
                      <span className="font-mono-code">{formattedTime}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed break-words font-medium ${
                        isSelf
                          ? 'bg-[#1A1918] text-white rounded-tr-xs shadow-2xs'
                          : 'bg-white text-[#1A1918] rounded-tl-xs border border-[#EAE7E2] shadow-2xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-[#9C9892] space-y-2">
              <Clock className="w-6 h-6 mx-auto text-[#D1CDC7]" />
              <p className="text-xs font-medium">No messages yet. Say hello and coordinate meetup point!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Controls */}
        {isExpired ? (
          <div className="p-4 border-t border-[#EAE7E2] bg-[#F9F8F6] text-center text-xs text-[#6B6966] flex items-center justify-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>This chat has concluded and is now archived (read-only).</span>
          </div>
        ) : isLockedPreEvent ? (
          <div className="p-4 border-t border-[#EAE7E2] bg-[#F9F8F6] text-center text-xs text-[#6B6966] flex items-center justify-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Chat unlocks 48 hours before meetup start time.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3 border-t border-[#EAE7E2] bg-white flex items-center gap-2">
            <input
              id="input-chat-message"
              type="text"
              maxLength={500}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Message group (logistics only)..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#F9F8F6] border border-[#EAE7E2] text-xs text-[#1A1918] placeholder:text-[#9C9892] focus:outline-none focus:border-[#1A1918] focus:bg-white"
            />
            <button
              id="btn-send-chat-message"
              type="submit"
              disabled={!messageText.trim()}
              className="p-2.5 rounded-full bg-[#E64A2A] hover:bg-[#D43F20] text-white font-semibold disabled:opacity-40 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
