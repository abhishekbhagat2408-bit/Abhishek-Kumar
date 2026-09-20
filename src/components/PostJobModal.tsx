import React, { useState } from "react";
import {
  X,
  PlusCircle,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Coins,
  Send,
  CheckCircle2,
} from "lucide-react";
import { JobCategory, JobOpportunity, PayType } from "../types";
import { CATEGORY_LABELS, LOCALITIES_LIST } from "../data/mockJobs";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewJob: (newJob: JobOpportunity) => void;
  currentLocality: string;
  language: "en" | "hi";
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onAddNewJob,
  currentLocality,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === "hi";

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState<JobCategory>("retail_sales");
  const [payAmount, setPayAmount] = useState("₹18,000 / month");
  const [payType, setPayType] = useState<PayType>("monthly");
  const [workHours, setWorkHours] = useState("9:30 AM - 6:30 PM (6 Days/Week)");
  const [locality, setLocality] = useState(currentLocality || "Sector 18 Market");
  const [landmark, setLandmark] = useState("");
  const [vacancies, setVacancies] = useState(2);
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [whatsapp, setWhatsapp] = useState("+91 ");
  const [immediateJoining, setImmediateJoining] = useState(true);
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState(
    "Punctual & dependable\nBasic experience or quick learner\nAadhaar card required"
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiEnhance = async () => {
    if (!title) {
      alert(isHi ? "कृपया पहले पद का नाम (Job Title) लिखें।" : "Please enter a Job Title first.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/gemini/generate-job-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: title,
          businessType: company || "Local Business",
          location: locality,
          payRate: payAmount,
          language,
        }),
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      }
      if (Array.isArray(data.requirements) && data.requirements.length > 0) {
        setRequirementsText(data.requirements.join("\n"));
      }
    } catch (e) {
      setDescription(
        isHi
          ? `हमारे ${locality} स्थित प्रतिष्ठान के लिए फुर्तीले एवं मेहनती ${title} की तत्काल आवश्यकता। समय पर वेतन एवं अच्छा कार्य वातावरण।`
          : `Immediate requirement for motivated ${title} in ${locality}. Competitive on-time pay and friendly work environment.`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLocObj = LOCALITIES_LIST.find((l) => l.name === locality) || LOCALITIES_LIST[0];

    const requirements = requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const newJob: JobOpportunity = {
      id: `job-${Date.now()}`,
      title,
      company: company || (isHi ? "स्थानीय प्रतिष्ठान" : "Local Business"),
      category,
      location: locality,
      locality,
      landmark: landmark || (isHi ? "मुख्य बाजार के निकट" : "Near Main Market"),
      distanceKm: 0.5,
      latitude: selectedLocObj.lat,
      longitude: selectedLocObj.lng,
      salary: payAmount,
      payType,
      payAmountNumeric: parseInt(payAmount.replace(/[^\d]/g, "")) || 18000,
      workHours,
      timings: workHours,
      vacancies,
      isUrgent: immediateJoining,
      isVerified: true,
      immediateJoining,
      postedTimeAgo: isHi ? "अभी-अभी" : "Just now",
      timestamp: Date.now(),
      description:
        description ||
        `Hiring for ${title} at ${company || "our workplace"}. Immediate start with timely payout.`,
      requirements: requirements.length > 0 ? requirements : ["Punctual & trustworthy", "Ready to start immediately"],
      perks: [
        isHi ? "समय पर भुगतान" : "On-time direct payout",
        isHi ? "सुरक्षित वातावरण" : "Safe work environment",
        isHi ? "सीधा मालिक से संपर्क" : "Direct owner hiring"
      ],
      contactPerson: contactPerson || (isHi ? "प्रबंधक" : "Manager"),
      contactPhone: phone || "+91 98000 00000",
      contactWhatsapp: whatsapp || phone || "+91 98000 00000",
      minEducation: isHi ? "10वीं / 12वीं पास" : "10th / 12th Pass",
      minExperience: isHi ? "फ्रेशर या 6 महीने का अनुभव" : "Fresher or Experienced"
    };

    onAddNewJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isHi ? "स्थानीय नौकरी पोस्ट करें (60 सेकंड)" : "Post a Local Job (in 60s)"}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "नजदीकी नौकरी चाहने वालों तक तुरंत सूचना (Real-time Alert) पहुंचेगी"
                  : "Broadcasts an instant real-time notification to nearby seekers within radius"}
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Role Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "पद का नाम (Job Title)*" : "Job Role / Title*"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isHi ? "उदा. बिलिंग सहायक, डिलीवरी बॉय, कुक..." : "e.g. Store Cashier, Delivery Partner, Driver..."}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "श्रेणी (Category)*" : "Job Category*"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {isHi ? v.hi : v.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Business Name & Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "दुकान / कंपनी का नाम*" : "Shop / Business / Company Name*"}
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={isHi ? "उदा. गुप्ता डिपार्टमेंटल स्टोर" : "e.g. Sharma Logistics / City Mart"}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "कार्य क्षेत्र / इलाका (Locality)*" : "Work Area / Locality*"}
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
              >
                {LOCALITIES_LIST.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "नजदीकी लैंडमार्क या पता" : "Nearby Landmark or Address Detail"}
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder={isHi ? "उदा. मेट्रो गेट नंबर 2 के सामने, बस स्टैंड के पास" : "e.g. Near Metro Gate 2, Opposite Post Office"}
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Pay Amount, Pay Type & Vacancies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "प्रस्तावित वेतन (Pay Amount)*" : "Offered Pay / Salary*"}
              </label>
              <input
                type="text"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="₹18,000 / month or ₹800 / day"
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "भुगतान का प्रकार" : "Payout Type"}
              </label>
              <select
                value={payType}
                onChange={(e) => setPayType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              >
                <option value="monthly">{isHi ? "मासिक वेतन (Monthly)" : "Monthly Salary"}</option>
                <option value="daily">{isHi ? "दैनिक मजदूरी (Daily Wage)" : "Daily Wage"}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "खाली पद (Vacancies)" : "Open Vacancies"}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={vacancies}
                onChange={(e) => setVacancies(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          {/* Work Hours */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "कार्य समय एवं शिफ्ट" : "Work Hours & Shift"}
            </label>
            <input
              type="text"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              placeholder="10:00 AM - 7:00 PM (Day Shift, 6 Days/week)"
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* AI Helper for Job Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">
                {isHi ? "कार्य विवरण (Description)" : "Job Description"}
              </label>
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={isGeneratingAi}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                <span>{isGeneratingAi ? (isHi ? "AI लिख रहा है..." : "AI Generating...") : (isHi ? "AI से विवरण तैयार करें" : "Auto-Generate with AI")}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isHi ? "काम के बारे में संक्षेप में बताएं..." : "Describe primary responsibilities..."}
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Requirements (Line by line) */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "योग्यताएं (प्रति पंक्ति एक)" : "Candidate Requirements (one per line)"}
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                {isHi ? "संपर्क व्यक्ति" : "Contact Person"}
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Name / Owner"
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                {isHi ? "कॉल नंबर" : "Calling Phone"}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Urgent / Immediate Joining Toggle */}
          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <input
              type="checkbox"
              checked={immediateJoining}
              onChange={(e) => setImmediateJoining(e.target.checked)}
              className="rounded accent-rose-500 w-4 h-4"
            />
            <span className="font-semibold text-xs">
              {isHi
                ? "⚡ तुरंत आवश्यकता (Immediate Joining) — आसपास के सभी उम्मीदवारों को तेज नोटिफिकेशन जाएगा"
                : "⚡ Immediate / Urgent Hiring — Broadcast priority real-time alert to nearby job seekers"}
            </span>
          </label>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isHi ? "नौकरी प्रकाशित करें एवं अलर्ट भेजें" : "Publish & Broadcast Alert"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
