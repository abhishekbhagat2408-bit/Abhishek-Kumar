import React, { useState } from "react";
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Building2,
  Sparkles,
  User,
} from "lucide-react";
import { JobOpportunity, UserProfile } from "../types";
import { formatDistance } from "../utils/distance";

interface QuickApplyModalProps {
  job: JobOpportunity | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (job: JobOpportunity, customNote: string, phone: string) => void;
  language: "en" | "hi";
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  job,
  userProfile,
  isOpen,
  onClose,
  onSubmitApplication,
  language,
}) => {
  if (!isOpen || !job) return null;

  const isHi = language === "hi";
  const [phone, setPhone] = useState(userProfile.phone || "+91 98765 00000");
  const [customNote, setCustomNote] = useState(
    isHi
      ? `नमस्ते, मैं ${userProfile.name} हूँ। मैं पास ही में रहता हूँ और तुरंत काम शुरू करने के लिए उपलब्ध हूँ।`
      : `Hello, I am ${userProfile.name}. I live nearby and am ready to start immediately.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitApplication(job, customNote, phone);
    }, 600);
  };

  const handleWhatsappRecruiter = () => {
    const text = encodeURIComponent(
      `नमस्ते / Hello ${job.contactPerson}, I just applied for "${job.title}" at ${job.company} via Abhigyan Rojgar Sathi.\n\nCandidate: ${userProfile.name}\nPhone: ${phone}\nMessage: ${customNote}`
    );
    window.open(`https://wa.me/${job.contactWhatsapp.replace(/\+/g, "")}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isHi ? "1-क्लिक त्वरित आवेदन" : "1-Click Quick Apply"}
              </h3>
              <p className="text-xs text-slate-400">
                {job.title} • {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Application Success State */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white">
                {isHi ? "आवेदन सफलतापूर्वक भेजा गया!" : "Application Sent Successfully!"}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                {isHi
                  ? `आपकी प्रोफाइल सीधे ${job.company} के पास पहुँच गई है। नियोक्ता आपको कॉल या एसएमएस कर सकते हैं।`
                  : `Your profile has been delivered directly to ${job.company}. The employer will contact you shortly.`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">{isHi ? "पद:" : "Role:"}</span>
                <span className="font-bold text-white">{job.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isHi ? "नियोक्ता संपर्क:" : "Employer Contact:"}</span>
                <span className="text-amber-400 font-medium">{job.contactPerson} ({job.contactPhone})</span>
              </div>
            </div>

            {/* Direct Connect Options */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleWhatsappRecruiter}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isHi ? "व्हाट्सएप पर तुरंत पुष्टि करें" : "WhatsApp Recruiter Instantly"}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                {isHi ? "नौकरियां देखना जारी रखें" : "Continue Browsing Jobs"}
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Target Job Summary Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white block">{job.title}</span>
                <span className="text-slate-400 text-xs">{job.company} • {formatDistance(job.distanceKm, language)}</span>
              </div>
              <span className="text-amber-400 font-bold text-xs sm:text-sm">{job.salary}</span>
            </div>

            {/* Applicant Details Pre-filled */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isHi ? "आवेदक का नाम:" : "Your Full Name:"}
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold">{userProfile.name}</span>
                  <span className="text-[10px] text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {isHi ? "प्रोफाइल से सत्यापित" : "Verified Profile"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isHi ? "मोबाइल नंबर (कॉल हेतु):" : "Mobile Number (for employer call):"}
                </label>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 focus-within:border-amber-400">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-transparent text-white font-mono focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isHi ? "नियोक्ता के लिए त्वरित संदेश (Note):" : "Quick Note to Employer:"}
                </label>
                <textarea
                  rows={3}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>

            {/* Direct Warning & Privacy Guarantee */}
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
              🔒 {isHi
                ? "अभिज्ञान रोजगार साथी में कोई बिचौलिया या कमीशन नहीं है। आपका नंबर केवल इस नौकरी के नियोक्ता को दिखेगा।"
                : "Zero commission platform. Your contact details are securely shared only with this verified local employer."}
            </p>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                {isHi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? (isHi ? "भेजा जा रहा है..." : "Submitting...") : (isHi ? "आवेदन भेजें" : "Submit Application")}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
