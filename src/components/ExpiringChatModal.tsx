import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  ShieldCheck,
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
  const endTime = new Date(plan.end_time).getTime();
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
    return `Chat closes in ${hours}h ${mins}m`;
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
    <div id="expiring-chat-modal-overlay" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[90vh] text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="text-left truncate mr-3">
            <h3 className="font-extrabold text-base text-slate-900 truncate">{plan.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 truncate font-medium">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {plan.venue_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Countdown timer badge */}
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center gap-1 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
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
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
              title="Report Safety Issue"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System Banner at Top of Chat */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-5 py-3 text-left text-xs text-indigo-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">
            <strong className="font-bold text-indigo-900">Welcome!</strong> This chat was created strictly to coordinate logistics at <strong className="font-bold text-indigo-900">{plan.venue_name}</strong>. To protect everyone, do not share private accommodation addresses. Be on time.
          </p>
        </div>

        {/* Chat Body (Chronological Message Feed) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-left bg-slate-50/50">
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
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                  />
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1.5 text-[10px] text-slate-500 ${isSelf ? 'justify-end' : ''}`}>
                      <span className="font-bold text-slate-700">{msg.sender_name}</span>
                      <span>·</span>
                      <span>{formattedTime}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed break-words font-medium ${
                        isSelf
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-100'
                          : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No messages yet. Say hello and confirm your arrival!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Controls */}
        {isExpired ? (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>This chat has concluded and is now archived (read-only).</span>
          </div>
        ) : isLockedPreEvent ? (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-600 flex items-center justify-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Chat unlocks 48 hours before meetup start time.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              id="input-chat-message"
              type="text"
              maxLength={500}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Send a logistics message (text & emojis only)..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              id="btn-send-chat-message"
              type="submit"
              disabled={!messageText.trim()}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
