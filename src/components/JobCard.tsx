import React from "react";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Zap,
  Phone,
  MessageCircle,
  Sparkles,
  Users,
  Building2,
  Calendar,
  Send,
  Check,
} from "lucide-react";
import { JobOpportunity } from "../types";
import { formatDistance, formatRelativeTime } from "../utils/distance";

interface JobCardProps {
  job: JobOpportunity;
  isApplied: boolean;
  onSelect: (job: JobOpportunity) => void;
  onQuickApply: (job: JobOpportunity) => void;
  language: "en" | "hi";
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isApplied,
  onSelect,
  onQuickApply,
  language,
}) => {
  const isHi = language === "hi";

  // Calculated simulated AI match score based on attributes
  const matchScore = Math.min(98, Math.max(82, 95 - Math.round(job.distanceKm * 2.5)));

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${job.contactPhone.replace(/\s+/g, "")}`;
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `नमस्ते / Hello ${job.contactPerson}, I saw your opening for "${job.title}" at ${job.company} on Abhigyan Rojgar Sathi and am interested in applying. Are you still hiring?`
    );
    window.open(`https://wa.me/${job.contactWhatsapp.replace(/\+/g, "")}?text=${text}`, "_blank");
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      {/* Top Proximity & Tags Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          {/* Proximity Distance Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{formatDistance(job.distanceKm, language)}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-normal truncate max-w-[120px] sm:max-w-[160px]">
              {job.locality}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {job.immediateJoining && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                <Zap className="w-3 h-3 text-rose-400" />
                <span>{isHi ? "तत्काल ज्वाइनिंग" : "Immediate"}</span>
              </span>
            )}
            {/* AI Fit Match Badge */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{matchScore}% {isHi ? "मैच" : "Fit"}</span>
            </span>
          </div>
        </div>

        {/* Job Title & Company */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
              {isHi && job.titleHi ? job.titleHi : job.title}
            </h3>
            {job.isVerified && (
              <span title={isHi ? "सत्यापित स्थानीय नियोक्ता" : "Verified Local Employer"}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-300">{job.company}</span>
            <span className="text-slate-600">•</span>
            <span>{job.landmark}</span>
          </div>
        </div>

        {/* Salary & Payout Card */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              {isHi ? "वेतन / दैनिक दर" : "Salary / Pay Rate"}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-amber-400">
              {job.salary}
            </span>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <span className="block text-slate-300 font-medium">
              {job.payType === "daily" ? (isHi ? "दैनिक नकद/UPI" : "Daily Payout") : (isHi ? "मासिक" : "Monthly")}
            </span>
            <span>{job.workHours.split("(")[0]}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {isHi && job.descriptionHi ? job.descriptionHi : job.description}
        </p>

        {/* Requirements & Info Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            {job.minEducation}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            {job.minExperience}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            {job.vacancies} {isHi ? "स्थान खाली" : "vacancies"}
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Call Recruiter button */}
          <button
            onClick={handleCall}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title={isHi ? "नियोक्ता को कॉल करें" : "Call Employer"}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isHi ? "कॉल" : "Call"}</span>
          </button>

          {/* WhatsApp Recruiter button */}
          <button
            onClick={handleWhatsapp}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title={isHi ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>

        {/* Quick Apply Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickApply(job);
          }}
          disabled={isApplied}
          className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isApplied
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default"
              : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{isHi ? "आवेदन भेजा गया" : "Applied"}</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{isHi ? "त्वरित आवेदन" : "Quick Apply"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
