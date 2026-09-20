import React from "react";
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  MapPin,
  Sliders,
  CheckCheck,
  Radio,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { JobNotification, NotificationSettings } from "../types";
import { formatDistance, formatRelativeTime } from "../utils/distance";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: JobNotification[];
  onMarkAllAsRead: () => void;
  onSelectJob: (jobId: string) => void;
  onQuickApply: (jobId: string) => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: Partial<NotificationSettings>) => void;
  onRequestBrowserNotification: () => void;
  browserPermission: NotificationPermission | "unsupported";
  onTriggerSimulatedAlert: () => void;
  language: "en" | "hi";
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectJob,
  onQuickApply,
  settings,
  onUpdateSettings,
  onRequestBrowserNotification,
  browserPermission,
  onTriggerSimulatedAlert,
  language,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const isHi = language === "hi";

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {isHi ? "नजदीकी रोजगार सूचनाएं" : "Nearby Job Alerts"}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {unreadCount} {isHi ? "नई" : "new"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {isHi ? "स्थानीय अवसरों के लिए रीयल-टाइम अलर्ट" : "Real-time proximity alerts for local openings"}
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

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
                  settings.soundEnabled
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
                title={isHi ? "ध्वनि अलर्ट चालू/बंद" : "Toggle Sound Alert"}
              >
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{settings.soundEnabled ? (isHi ? "ध्वनि चालू" : "Sound On") : (isHi ? "म्यूट" : "Mute")}</span>
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
                  showSettings
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>{isHi ? "सेटिंग्स" : "Settings"}</span>
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{isHi ? "सभी पढ़ा हुआ मार्क करें" : "Mark read"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3.5 text-xs text-slate-300 animate-in slide-in-from-top-2">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>{isHi ? "अलर्ट दायरा एवं प्राथमिकताएं" : "Alert Radius & Preferences"}</span>
              <span className="text-amber-400 font-bold">{settings.maxRadiusKm} km</span>
            </div>

            {/* Radius Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>{isHi ? "अलर्ट दायरा (Radius)" : "Maximum Distance"}</span>
                <span>{settings.maxRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={settings.maxRadiusKm}
                onChange={(e) => onUpdateSettings({ maxRadiusKm: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1 km (पैदल)</span>
                <span>5 km</span>
                <span>10 km</span>
                <span>25 km</span>
              </div>
            </div>

            {/* Browser Push Permission */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="pr-2">
                <p className="font-medium text-white">{isHi ? "ब्राउज़र पुश अलर्ट" : "Browser Push Alerts"}</p>
                <p className="text-[11px] text-slate-400">
                  {browserPermission === "granted"
                    ? isHi ? "अनुमति सक्रिय है" : "Permission active"
                    : isHi ? "स्क्रीन बंद होने पर भी अलर्ट पाएं" : "Receive alerts even when in background"}
                </p>
              </div>
              {browserPermission !== "granted" ? (
                <button
                  onClick={onRequestBrowserNotification}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                >
                  {isHi ? "सक्रिय करें" : "Enable"}
                </button>
              ) : (
                <span className="text-emerald-400 text-xs font-semibold">✓ {isHi ? "चालू" : "Active"}</span>
              )}
            </div>

            {/* Immediate Joining Only Filter */}
            <label className="flex items-center justify-between cursor-pointer">
              <span>{isHi ? "केवल तुरंत ज्वाइनिंग (Immediate) नौकरियां" : "Only Urgent / Immediate Openings"}</span>
              <input
                type="checkbox"
                checked={settings.immediateOnly}
                onChange={(e) => onUpdateSettings({ immediateOnly: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4"
              />
            </label>
          </div>
        )}

        {/* Live Simulator Trigger Bar */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              {isHi ? "रीयल-टाइम मॉनिटरिंग सक्रिय" : "Live Radar Scanning"}
            </span>
          </div>
          <button
            onClick={onTriggerSimulatedAlert}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{isHi ? "अलर्ट टेस्ट करें" : "Test Live Alert"}</span>
          </button>
        </div>

        {/* Notification Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-semibold text-white mb-1">
                {isHi ? "कोई नई सूचना नहीं है" : "No Notifications Yet"}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                {isHi
                  ? "जब भी आपके चुने गए दायरे में कोई नया अवसर आएगा, यहाँ तुरंत दिखेगा।"
                  : "Whenever a job opening is posted in your neighborhood, you will receive an alert here."}
              </p>
              <button
                onClick={onTriggerSimulatedAlert}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                {isHi ? "नया अलर्ट सिम्युलेट करें" : "Simulate Incoming Job Alert"}
              </button>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.read
                    ? "bg-slate-800/40 border-slate-800/80 text-slate-300"
                    : "bg-slate-800/90 border-amber-500/40 shadow-sm text-white ring-1 ring-amber-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px] border border-amber-500/30 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {formatDistance(notif.distanceKm, language)}
                    </span>
                    {notif.urgency === "urgent" && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[9px] border border-rose-500/30">
                        {isHi ? "तत्काल आवश्यकता" : "Urgent Hiring"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(notif.timestamp, language)}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-0.5">{notif.title}</h4>
                <p className="text-xs text-slate-300 mb-2">{notif.company}</p>

                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-slate-900/60 border border-slate-800 mb-3">
                  <span className="text-slate-400">{isHi ? "वेतन / मानदेय:" : "Pay:"}</span>
                  <span className="font-extrabold text-amber-400">{notif.salary}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
                  <button
                    onClick={() => {
                      onSelectJob(notif.jobId);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>{isHi ? "विवरण देखें" : "View Details"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      onQuickApply(notif.jobId);
                      onClose();
                    }}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                  >
                    {isHi ? "त्वरित आवेदन" : "Quick Apply"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Abhigyan Rojgar Sathi • {isHi ? "सत्यापित स्थानीय रोजगार मंच" : "Verified Local Opportunities"}
        </div>
      </div>
    </div>
  );
};
