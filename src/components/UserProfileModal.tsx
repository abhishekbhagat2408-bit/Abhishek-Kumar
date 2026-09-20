import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { UserProfile, JobCategory } from "../types";
import { CATEGORY_LABELS } from "../data/mockJobs";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  language: "en" | "hi";
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === "hi";

  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [location, setLocation] = useState(userProfile.location);
  const [pincode, setPincode] = useState(userProfile.pincode);
  const [skillsText, setSkillsText] = useState(userProfile.skills.join(", "));
  const [experience, setExperience] = useState(userProfile.experience);
  const [education, setEducation] = useState(userProfile.education);
  const [availability, setAvailability] = useState(userProfile.availability);
  const [bio, setBio] = useState(userProfile.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveProfile({
      ...userProfile,
      name,
      phone,
      location,
      pincode,
      skills,
      experience,
      education,
      availability,
      bio,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isHi ? "मेरी रोजगार प्रोफाइल" : "My Rojgar Profile"}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? "1-क्लिक आवेदन और नजदीकी मैचिंग के लिए विवरण" : "Details used for 1-click apply & proximity matching"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "पूरा नाम*" : "Full Name*"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "मोबाइल नंबर (कॉल हेतु)*" : "Mobile Phone*"}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "निवास का इलाका / कॉलोनी" : "Colony / Living Area"}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "पिनकोड" : "Pincode"}
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "हुनर / कौशल (अल्पविराम से अलग करें)" : "Skills / Trades (comma separated)"}
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. Billing, Excel, Driving, Bike, Cooking, Electrical, Sales"
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "कार्य अनुभव" : "Experience Level"}
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
              >
                <option value="Fresher">{isHi ? "नया / फ्रेशर (0 साल)" : "Fresher (0 years)"}</option>
                <option value="1-2 Years">{isHi ? "1-2 वर्ष का अनुभव" : "1-2 Years Experience"}</option>
                <option value="3-5 Years">{isHi ? "3-5 वर्ष का अनुभव" : "3-5 Years Experience"}</option>
                <option value="5+ Years">{isHi ? "5+ वर्ष कुशल अनुभव" : "5+ Years Skilled"}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isHi ? "शिक्षा स्तर" : "Education"}
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
              >
                <option value="8th / Below">{isHi ? "8वीं पास या बुनियादी" : "8th Pass or Basic"}</option>
                <option value="10th Pass">{isHi ? "10वीं पास (मैट्रिक)" : "10th Pass (Matric)"}</option>
                <option value="12th Pass">{isHi ? "12वीं पास (इंटरमीडिएट)" : "12th Pass (Intermediate)"}</option>
                <option value="ITI / Diploma">{isHi ? "ITI / तकनीकी डिप्लोमा" : "ITI / Technical Diploma"}</option>
                <option value="Graduate">{isHi ? "स्नातक (Graduate)" : "Graduate or Above"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "ज्वाइन करने की उपलब्धता" : "Joining Availability"}
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
            >
              <option value="immediate">{isHi ? "तुरंत / आज या कल से (Immediate)" : "Immediate (Today or Tomorrow)"}</option>
              <option value="within_week">{isHi ? "1 सप्ताह के भीतर" : "Within 1 Week"}</option>
              <option value="flexible">{isHi ? "लचीला समय" : "Flexible Timing"}</option>
            </select>
          </div>

          {/* Bio / Summary */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHi ? "संक्षिप्त परिचय (Bio)" : "Brief Bio / Introduction"}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isHi ? "प्रोफाइल सहेजें" : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
