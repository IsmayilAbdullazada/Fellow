import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { SafetyReportType } from '../types';

export const SafetyReportModal: React.FC = () => {
  const { reportingTarget, setReportingTarget, submitSafetyReport } = useFellow();

  const [reportType, setReportType] = useState<SafetyReportType | null>(null);
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!reportingTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) return;
    submitSafetyReport({
      reported_user_id: reportingTarget.userId,
      plan_id: reportingTarget.planId,
      report_type: reportType,
      details: details.trim() || 'Reported via safety shield.',
    });
    setSubmitted(true);
    setTimeout(() => {
      setReportingTarget(null);
    }, 2000);
  };

  return (
    <div
      id="safety-report-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#EAE7E2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150">
        <button
          onClick={() => setReportingTarget(null)}
          className="absolute top-5 right-5 p-1.5 text-[#9C9892] hover:text-[#1A1918] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FDF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#F87171] shadow-2xs">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-semibold text-[#1A1918]">Instant Safety Trip Activated</h3>
              <p className="text-xs text-[#DC2626] mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                {reportingTarget.name} has been immediately muted. All their listings, RSVPs, and chat messages are now severed from your account.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-[#DC2626]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-editorial text-xl font-semibold text-[#1A1918]">Report Safety Concern</h3>
            </div>

            <p className="text-xs text-[#6B6966] leading-relaxed">
              Reporting <span className="text-[#1A1918] font-semibold">{reportingTarget.name}</span> triggers an instant safety mute, blocking all future interactions across Fellow.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1918]">Select Issue Category <span className="text-[#DC2626]">*</span></label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'unwanted_flirting', label: 'Unwanted flirting / dating advance (Zero Tolerance)' },
                  { id: 'harassment', label: 'Harassment, pressure, or hostile behavior' },
                  { id: 'fake_profile', label: 'Profile does not match physical person' },
                  { id: 'no_show', label: 'Confirmed guest was an unannounced no-show' },
                  { id: 'unsafe_behavior', label: 'Unsafe conduct at public venue' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      reportType === item.id
                        ? 'border-[#DC2626] bg-[#FDF2F2] text-[#DC2626] font-semibold shadow-2xs'
                        : 'border-[#EAE7E2] bg-[#F9F8F6] text-[#6B6966] hover:bg-[#EAE7E2]/50 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_type"
                      checked={reportType === item.id}
                      onChange={() => setReportType(item.id as SafetyReportType)}
                      className="text-[#DC2626] focus:ring-[#DC2626]"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1918]">Details (Optional)</label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred. Fellow safety reviews all flagged incidents."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE7E2] text-[#1A1918] text-xs focus:outline-none focus:border-[#DC2626] focus:bg-white resize-none placeholder:text-[#9C9892]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!reportType}
                className={`w-full py-3 px-4 rounded-full font-semibold text-xs shadow-sm transition-all ${
                  reportType
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer active:scale-[0.99]'
                    : 'bg-[#F9F8F6] text-[#9C9892] border border-[#EAE7E2] cursor-not-allowed'
                }`}
              >
                {reportType ? 'Submit Safety Report & Sever Connection' : 'Select a Category Above'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
