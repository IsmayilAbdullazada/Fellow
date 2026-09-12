import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Shield } from 'lucide-react';
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
    }, 2200);
  };

  const highSeverityIssues = [
    { id: 'unsafe_behavior', label: 'Unsafe conduct or danger at public venue', badge: 'Tier 1 Critical' },
    { id: 'harassment', label: 'Harassment, stalking, or hostile behavior', badge: 'Tier 1 Critical' },
    { id: 'unwanted_flirting', label: 'Unwanted flirting / romantic advance (Zero Tolerance)', badge: 'Charter Violation' },
  ];

  const conductIssues = [
    { id: 'fake_profile', label: 'Profile photo does not match physical attendee' },
    { id: 'no_show', label: 'Confirmed guest was an unannounced no-show' },
  ];

  return (
    <div
      id="safety-report-modal-overlay"
      className="fixed inset-0 z-70 bg-[#1A1918]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D1CDC7] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-7 text-[#1A1918] text-left relative animate-in zoom-in-95 duration-150">
        <button
          onClick={() => setReportingTarget(null)}
          className="absolute top-5 right-5 p-2 text-[#6B6966] hover:text-[#1A1918] hover:bg-[#F9F8F6] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border-2 border-[#DC2626] shadow-sm">
              <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-bold text-[#1A1918]">
                Instant Safety Trip Activated
              </h3>
              <p className="text-xs text-[#4A4744] max-w-sm mx-auto leading-relaxed">
                <span className="font-semibold text-[#1A1918]">{reportingTarget.name}</span> has been immediately muted and blocked. All listings, RSVPs, and chat messages have been severed from your account.
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-[11px] font-bold">
                Safety Incident Logged · Ephemeral Severance Active
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Urgent Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1918]">
                  Report Safety Concern
                </h3>
                <p className="text-xs text-[#4A4744] mt-0.5">
                  Protects your account and alerts community trust operations
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl text-xs text-[#991B1B] leading-relaxed">
              Reporting <span className="font-bold text-[#1A1918]">{reportingTarget.name}</span> triggers an immediate safety mute. They will never see your active hub dates, profile, or tables again.
            </div>

            {/* Grouped by Severity */}
            <div className="space-y-3">
              {/* Group 1: Immediate Safety & Charter Violations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Immediate Danger & Harassment (Zero Tolerance)</span>
                </span>
                <div className="space-y-1.5">
                  {highSeverityIssues.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        reportType === item.id
                          ? 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B] shadow-xs'
                          : 'border-[#EAE7E2] bg-[#FAF9F6] text-[#1A1918] hover:border-[#D1CDC7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="report_type"
                          checked={reportType === item.id}
                          onChange={() => setReportType(item.id as SafetyReportType)}
                          className="text-[#DC2626] focus:ring-[#DC2626]"
                        />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-[#DC2626] border border-[#FCA5A5] shrink-0">
                        {item.badge}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Group 2: Identity & Reliability Issues */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6966] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Trust & Identity Inaccuracies</span>
                </span>
                <div className="space-y-1.5">
                  {conductIssues.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        reportType === item.id
                          ? 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B] shadow-xs'
                          : 'border-[#EAE7E2] bg-[#FAF9F6] text-[#4A4744] hover:border-[#D1CDC7]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_type"
                        checked={reportType === item.id}
                        onChange={() => setReportType(item.id as SafetyReportType)}
                        className="text-[#DC2626] focus:ring-[#DC2626]"
                      />
                      <span className="text-xs font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-semibold text-[#1A1918]">Additional Context (Optional)</label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share any context for safety staff. All reports are confidential."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#D1CDC7] text-[#1A1918] text-xs focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] focus:bg-white resize-none placeholder:text-[#6B6966]"
              />
            </div>

            {/* Clear Distinct Disabled vs Active Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!reportType}
                className={`w-full py-3.5 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  reportType
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md active:scale-[0.99] cursor-pointer'
                    : 'bg-[#EAE7E2] text-[#9C9892] border border-transparent cursor-not-allowed opacity-60'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {reportType
                    ? 'Submit Safety Report & Sever All Contact'
                    : 'Select an Issue Category Above to Proceed'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
