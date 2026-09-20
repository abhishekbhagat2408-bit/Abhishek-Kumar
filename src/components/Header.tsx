import React from "react";
import {
  MapPin,
  Bell,
  Sparkles,
  PlusCircle,
  Briefcase,
  FileCheck,
  Compass,
  Globe2,
  Navigation,
} from "lucide-react";
import { LOCALITIES_LIST } from "../data/mockJobs";

interface HeaderProps {
  currentLocality: string;
  onSelectLocality: (locality: (typeof LOCALITIES_LIST)[0]) => void;
  onRequestGeolocation: () => void;
  isLocating: boolean;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenAiSathi: () => void;
  onOpenPostJob: () => void;
  onOpenApplications: () => void;
  onOpenRadar: () => void;
  applicationsCount: number;
  language: "en" | "hi";
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocality,
  onSelectLocality,
  onRequestGeolocation,
  isLocating,
  unreadCount,
  onOpenNotifications,
  onOpenAiSathi,
  onOpenPostJob,
  onOpenApplications,
  onOpenRadar,
  applicationsCount,
  language,
  onToggleLanguage,
}) => {
  const isHi = language === "hi";

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  Abhigyan <span className="text-amber-400 font-bold">Rojgar Sathi</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isHi ? "सक्रिय स्थानीय नेटवर्क" : "Local Live Hub"}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isHi
                  ? "नजदीकी रोजगार के अवसर एवं तुरंत सूचना साथी"
                  : "Hyperlocal Opportunities & Real-Time Proximity Alerts"}
              </p>
            </div>
          </div>

          {/* Center / Locality Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-400">{isHi ? "स्थान:" : "Area:"}</span>
            <select
              value={currentLocality}
              onChange={(e) => {
                const found = LOCALITIES_LIST.find((loc) => loc.name === e.target.value);
                if (found) onSelectLocality(found);
              }}
              className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer pr-1"
            >
              {LOCALITIES_LIST.map((loc) => (
                <option key={loc.name} value={loc.name} className="bg-slate-900 text-white">
                  {loc.name}
                </option>
              ))}
            </select>
            <button
              onClick={onRequestGeolocation}
              disabled={isLocating}
              title={isHi ? "मेरा वर्तमान GPS स्थान उपयोग करें" : "Use my live GPS location"}
              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              title="Change Language / भाषा बदलें"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? "EN" : "हिन्दी"}</span>
            </button>

            {/* Radar View Button */}
            <button
              onClick={onOpenRadar}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              title={isHi ? "नक्शा रडार दृश्य" : "Proximity Radar View"}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? "रडार" : "Radar"}</span>
            </button>

            {/* AI Sathi Assistant Button */}
            <button
              onClick={onOpenAiSathi}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">{isHi ? "साथी AI" : "AI Sathi"}</span>
            </button>

            {/* Applications Tracker */}
            <button
              onClick={onOpenApplications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title={isHi ? "मेरे आवेदन" : "My Applications"}
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              {applicationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {applicationsCount}
                </span>
              )}
            </button>

            {/* Real-time Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title={isHi ? "तुरंत सूचनाएं" : "Real-time Notifications"}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Post a Job Button (For Local Hirers/Employers) */}
            <button
              onClick={onOpenPostJob}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{isHi ? "नौकरी पोस्ट करें" : "Post a Job"}</span>
              <span className="sm:hidden">{isHi ? "पोस्ट" : "Post"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Locality bar */}
        <div className="lg:hidden pb-3 pt-1 flex items-center justify-between text-xs border-t border-slate-800 text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-medium">{currentLocality}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRequestGeolocation}
              disabled={isLocating}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700"
            >
              <Navigation className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isHi ? "GPS" : "GPS"}</span>
            </button>
            <button
              onClick={onOpenRadar}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700"
            >
              <Compass className="w-3 h-3" />
              <span>{isHi ? "रडार" : "Radar"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
