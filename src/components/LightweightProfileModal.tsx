import React from 'react';
import { X, ShieldCheck, Award, Globe, AlertTriangle, User, CheckCircle } from 'lucide-react';
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
    <div id="lightweight-profile-modal" className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <img
              src={user.profile_photo_url}
              alt={user.display_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
            />
            {user.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-white shadow-sm" title="Government ID Verified">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">{user.display_name}</h3>
              {user.date_of_birth && (
                <span className="text-slate-400 font-bold text-sm">({calculateAge(user.date_of_birth)})</span>
              )}
              <span className="text-base">{user.origin_flag}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user.origin_country}</p>
          </div>

          {/* Verification Badge */}
          {user.is_verified ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Government ID & Liveness Verified</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <span>Unverified Account</span>
            </div>
          )}
        </div>

        {/* Reliability Score & Language Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 text-center">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span className="font-extrabold text-base">{user.reliability_score}%</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Reliability Score</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-0.5">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-bold text-xs truncate max-w-[90px] text-slate-800">{user.native_language}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Languages</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">About</p>
          <p>{user.bio || 'Solo traveler looking forward to verified micro-meetups.'}</p>
        </div>

        {/* Action button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          {!isSelf && (
            <button
              onClick={() => {
                onClose();
                setReportingTarget({ userId: user.id, name: user.display_name });
              }}
              className="text-slate-400 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report User</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all ${
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
