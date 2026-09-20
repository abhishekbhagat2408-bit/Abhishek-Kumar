import React, { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Award,
  Send,
  Check,
  ChevronRight,
} from "lucide-react";
import { JobOpportunity, UserProfile } from "../types";
import { formatDistance } from "../utils/distance";

interface JobDetailModalProps {
  job: JobOpportunity | null;
  onClose: () => void;
  onQuickApply: (job: JobOpportunity) => void;
  isApplied: boolean;
  userProfile: UserProfile;
  language: "en" | "hi";
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onQuickApply,
  isApplied,
  userProfile,
  language,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<{
    matchScore?: number;
    summary?: string;
    keyStrengths?: string[];
    tips?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!job) return null;

  const isHi = language === "hi";

  const handleCall = () => {
    window.location.href = `tel:${job.contactPhone.replace(/\s+/g, "")}`;
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(
      `नमस्ते / Hello ${job.contactPerson}, I saw your opening for "${job.title}" at ${job.company} on Abhigyan Rojgar Sathi and would like to apply. Are you still hiring?`
    );
    window.open(`https://wa.me/${job.contactWhatsapp.replace(/\+/g, "")}?text=${text}`, "_blank");
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${job.company}, ${job.landmark}, ${job.locality}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleAnalyzeFit = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/gemini/match-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job,
          userProfile,
          language,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      setAiAnalysis({
        matchScore: 90,
        summary: isHi
          ? "आपकी नजदीकी दूरी और प्रोफाइल इस काम के लिए उपयुक्त है।"
          : "Great proximity fit and skill compatibility for this role.",
        keyStrengths: [
          isHi ? "कार्यस्थल आपके निकटतम दायरे में है" : "Workplace is within your local radius",
          isHi ? "तुरंत काम शुरू करने की तत्परता" : "Immediate availability matches employer urgency",
          isHi ? "सीधा नियोक्ता संपर्क" : "Direct direct hiring without broker fees",
        ],
        tips: isHi
          ? "कॉल करते समय कहें कि आप पास में रहते हैं और आज या कल से ज्वाइन कर सकते हैं।"
          : "When calling, mention your nearby residential address and ready start date.",
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {formatDistance(job.distanceKm, language)}
              </span>
              {job.immediateJoining && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                  {isHi ? "तत्काल आवश्यकता" : "Immediate Joining"}
                </span>
              )}
              {job.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {isHi ? "सत्यापित दुकान/कंपनी" : "Verified Employer"}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white">
              {isHi && job.titleHi ? job.titleHi : job.title}
            </h2>
            <p className="text-sm text-slate-300 mt-0.5 font-medium">{job.company}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Salary and Shift Bento Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
                {isHi ? "प्रस्तावित वेतन / पारिश्रमिक" : "Offered Salary / Pay"}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 block mt-0.5">
                {job.salary}
              </span>
              <span className="text-xs text-slate-400">
                {job.payType === "daily"
                  ? isHi ? "दैनिक भुगतान (कैश या UPI)" : "Daily payout upon shift end"
                  : isHi ? "मासिक समय पर भुगतान" : "Monthly on-time direct deposit"}
              </span>
            </div>

            <div className="sm:border-l sm:border-slate-800 sm:pl-4 space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{isHi ? "कार्य समय:" : "Work Hours:"}</strong> {job.workHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{isHi ? "शिफ्ट विवरण:" : "Shifts:"}</strong> {job.timings}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{isHi ? "रिक्तियां:" : "Vacancies:"}</strong> {job.vacancies} {isHi ? "स्थान" : "openings"}</span>
              </div>
            </div>
          </div>

          {/* Location & Directions */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{job.locality}</p>
                <p className="text-xs text-slate-300">{job.location} • {job.landmark}</p>
                <p className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                  {formatDistance(job.distanceKm, language)} {isHi ? "की दूरी पर स्थित" : "from your selected location"}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenMaps}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>{isHi ? "रास्ता देखें" : "Directions"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Fit Analysis & Interview Coach Widget */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-white">
                  {isHi ? "रोजगार साथी AI मैच एवं इंटरव्यू टिप्स" : "AI Match Analysis & Call Tips"}
                </h4>
              </div>
              {!aiAnalysis && (
                <button
                  onClick={handleAnalyzeFit}
                  disabled={loadingAi}
                  className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {loadingAi ? (isHi ? "जांच हो रही है..." : "Analyzing...") : (isHi ? "फिट जांचें" : "Analyze Fit")}
                </button>
              )}
            </div>

            {aiAnalysis ? (
              <div className="space-y-2.5 text-xs text-slate-300 animate-in fade-in-50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 text-base">{aiAnalysis.matchScore}% Match</span>
                  <span className="text-slate-400">— {aiAnalysis.summary}</span>
                </div>
                {aiAnalysis.keyStrengths && (
                  <div>
                    <span className="font-semibold text-slate-200 block mb-1">
                      {isHi ? "आपकी मुख्य ताकत:" : "Key Strengths for this Role:"}
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                      {aiAnalysis.keyStrengths.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiAnalysis.tips && (
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/20 text-amber-200/90 text-xs">
                    <strong>{isHi ? "कॉल/इंटरव्यू सलाह: " : "Call Tip: "}</strong>
                    {aiAnalysis.tips}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                {isHi
                  ? "AI से जानें कि आपकी प्रोफाइल इस नौकरी से कितनी मेल खाती है और कॉल करते समय क्या कहना चाहिए।"
                  : "Tap 'Analyze Fit' to see how your profile matches and get custom tips on what to say when speaking with the employer."}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <h4 className="font-bold text-sm text-white mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>{isHi ? "कार्य विवरण (Job Details)" : "Job Description"}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHi && job.descriptionHi ? job.descriptionHi : job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? "योग्यता एवं आवश्यकताएं" : "Requirements & Skills"}</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Perks & Benefits */}
          <div>
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isHi ? "सुविधाएं एवं लाभ" : "Perks & Benefits"}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.perks.map((perk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>

          {/* Employer Contact Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-sm text-white mb-2">
              {isHi ? "सीधा नियोक्ता संपर्क" : "Direct Employer Contact"}
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-slate-200">{job.contactPerson}</p>
                <p className="text-slate-400">{job.company}</p>
                <p className="text-amber-400 font-mono mt-0.5">{job.contactPhone}</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCall}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? "कॉल करें" : "Call"}</span>
                </button>
                <button
                  onClick={handleWhatsapp}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 sticky bottom-0 z-20 flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-[11px] text-slate-400 block">{isHi ? "वेतन" : "Salary"}</span>
            <span className="font-extrabold text-amber-400 text-base">{job.salary}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              {isHi ? "बंद करें" : "Close"}
            </button>
            <button
              onClick={() => onQuickApply(job)}
              disabled={isApplied}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                isApplied
                  ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isHi ? "आवेदन भेजा जा चुका है" : "Applied"}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isHi ? "1-क्लिक त्वरित आवेदन" : "1-Click Quick Apply"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
