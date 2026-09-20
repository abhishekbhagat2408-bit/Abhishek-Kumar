import React from "react";
import {
  X,
  FileCheck,
  Building2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { JobApplication } from "../types";
import { formatRelativeTime } from "../utils/distance";

interface ApplicationsTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  language: "en" | "hi";
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  isOpen,
  onClose,
  applications,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === "hi";

  const getStatusBadge = (status: JobApplication["status"]) => {
    switch (status) {
      case "applied":
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-semibold">
            {isHi ? "आवेदन भेजा गया" : "Application Sent"}
          </span>
        );
      case "reviewing":
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            {isHi ? "नियोक्ता द्वारा समीक्षाधीन" : "Under Review"}
          </span>
        );
      case "interview_scheduled":
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            {isHi ? "बातचीत / इंटरव्यू तय" : "Interview Scheduled"}
          </span>
        );
      case "hired":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHi ? "चयनित (Hired)" : "Hired / Selected"}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isHi ? "मेरे रोजगार आवेदन" : "My Job Applications"}
              </h3>
              <p className="text-xs text-slate-400">
                {applications.length} {isHi ? "सक्रिय आवेदन ट्रैक किए जा रहे हैं" : "applications tracked in real-time"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-white mb-1">
                {isHi ? "अभी कोई आवेदन नहीं किया है" : "No Applications Submitted Yet"}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                {isHi
                  ? "किसी भी नजदीकी नौकरी पर '1-क्लिक त्वरित आवेदन' बटन दबाकर आवेदन करें।"
                  : "Tap 'Quick Apply' on any nearby job to send your profile directly to the local employer."}
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div>
                    <h4 className="font-bold text-sm text-white">{app.jobTitle}</h4>
                    <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                      <span className="text-slate-300 font-medium">{app.company}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                <div className="flex items-center justify-between text-slate-400 py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-800/80 my-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isHi ? "आवेदन का समय:" : "Applied:"} {formatRelativeTime(app.appliedAt, language)}</span>
                  </div>
                  <span className="font-bold text-amber-400">{app.salary}</span>
                </div>

                {app.customNote && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded border border-slate-800 mb-2">
                    "{app.customNote}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400/90 font-medium">
                    ✓ {isHi ? "प्रोफाइल नियोक्ता तक पहुंची" : "Delivered to hiring manager"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          `नमस्ते / Hello, following up on my application for "${app.jobTitle}" at ${app.company}. Are you reviewing candidates?`
                        );
                        window.open(`https://wa.me/?text=${text}`, "_blank");
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>{isHi ? "फॉलो-अप" : "Follow-up"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            {isHi ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
