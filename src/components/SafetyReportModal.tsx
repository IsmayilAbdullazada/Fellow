import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { useFellow } from '../context/FellowContext';
import { SafetyReportType } from '../types';

export const SafetyReportModal: React.FC = () => {
  const { reportingTarget, setReportingTarget, submitSafetyReport } = useFellow();

  const [reportType, setReportType] = useState<SafetyReportType>('unwanted_flirting');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!reportingTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div id="safety-report-modal-overlay" className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-900 text-left relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setReportingTarget(null)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Instant Safety Trip Activated</h3>
              <p className="text-xs text-rose-700 mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                {reportingTarget.name} has been immediately muted. All their listings, RSVPs, and chat messages are now severed from your account.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">Report Safety Concern</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Reporting <span className="text-slate-900 font-bold">{reportingTarget.name}</span> triggers an instant safety mute, blocking all future interactions across Fellow.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Issue Category</label>
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
                        ? 'border-2 border-rose-600 bg-rose-50 text-rose-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_type"
                      checked={reportType === item.id}
                      onChange={() => setReportType(item.id as SafetyReportType)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Details (Optional)</label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred. Fellow safety reviews all flagged incidents."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white resize-none placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2">
              <button
                id="btn-submit-safety-report"
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all active:scale-[0.99]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Trigger Safety Trip & Sever Visibility</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
