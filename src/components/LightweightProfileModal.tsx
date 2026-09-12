import React from 'react';
import { X, ShieldCheck, Award, Globe, AlertTriangle } from 'lucide-react';
import { useFellow } from '../context/FellowContext';

interface LightweightProfileModalProps {
  userId: string;
  onClose: () => void;
}

export const LightweightProfileModal: React.FC<LightweightProfileModalProps> = ({ userId, onClose }) => {
  const { allUsers, currentUser, setReportingTarget } = useFellow();
  const user = allUsers.find((u) => u.id === userId);

  if (!user) return null;

  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const isSelf = user.id === currentUser.id;

  return (
    <div
      id="lightweight-profile-modal"
      className="fixed inset-0 z-60 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-[#1A1918] animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-[22px] overflow-hidden border-2 border-[#059669] shadow-sm bg-[#F9F8F6]">
              <img
                src={user.profile_photo_url}
                alt={user.display_name}
                className="w-full h-full object-cover"
              />
            </div>
            {user.is_verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-[#059669] text-white rounded-full p-1 border-2 border-white shadow-xs"
                title="Verified Government ID"
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">{user.display_name}</h3>
              {user.date_of_birth && (
                <span className="text-[#9C9892] font-semibold text-sm">({calculateAge(user.date_of_birth)})</span>
              )}
              <span className="text-base">{user.origin_flag}</span>
            </div>
            <p className="text-xs text-[#6B6966] font-medium mt-0.5">{user.origin_country}</p>
          </div>

          {/* Verification Badge */}
          {user.is_verified ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GOVERNMENT ID VERIFIED</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-[11px] font-semibold">
              <span>UNVERIFIED ACCOUNT</span>
            </div>
          )}
        </div>

        {/* Reliability Score & Language Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-center">
          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-[#059669] mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span className="font-bold text-base">{user.reliability_score}%</span>
            </div>
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Reliability Score</span>
          </div>

          <div className="bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-[#1A1918] mb-0.5">
              <Globe className="w-3.5 h-3.5 text-[#9C9892]" />
              <span className="font-semibold text-xs truncate max-w-[90px] text-[#1A1918]">{user.native_language}</span>
            </div>
            <span className="text-[10px] text-[#9C9892] uppercase font-semibold">Language</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-3 bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-3 text-xs text-[#6B6966] leading-relaxed text-left">
          <p className="font-semibold text-[#9C9892] text-[10px] uppercase tracking-wider mb-1">Traveler Context</p>
          <p className="italic">"{user.bio || 'Solo traveler looking forward to verified micro-meetups.'}"</p>
          {user.social_link && (
            <p className="text-[10px] text-[#9C9892] font-mono-code pt-1">
              Verified Handle: {user.social_link}
            </p>
          )}
        </div>

        {/* Action footer */}
        <div className="mt-4 pt-3 border-t border-[#EAE7E2] flex items-center justify-between text-xs">
          {!isSelf && (
            <button
              onClick={() => {
                onClose();
                setReportingTarget({ userId: user.id, name: user.display_name });
              }}
              className="text-[#9C9892] hover:text-[#DC2626] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report User</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-full bg-[#1A1918] hover:bg-[#2E2C29] text-white font-semibold text-xs shadow-2xs transition-all ${
              isSelf ? 'w-full' : 'ml-auto'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
