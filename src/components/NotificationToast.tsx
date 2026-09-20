import React, { useEffect } from "react";
import { Bell, MapPin, X, ArrowRight, Zap } from "lucide-react";
import { JobNotification } from "../types";
import { formatDistance } from "../utils/distance";

interface NotificationToastProps {
  notification: JobNotification | null;
  onClose: () => void;
  onSelectJob: (jobId: string) => void;
  onQuickApply: (jobId: string) => void;
  language: "en" | "hi";
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onSelectJob,
  onQuickApply,
  language,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isHi = language === "hi";

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-40px)] bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-amber-500/20">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
            {isHi ? "⚡ नया नजदीकी रोजगार अलर्ट" : "⚡ New Nearby Job Alert"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1 text-[11px]">
          <MapPin className="w-3 h-3 text-amber-400" />
          {formatDistance(notification.distanceKm, language)}
        </span>
        <span className="text-slate-400 truncate font-medium">{notification.locality}</span>
      </div>

      <h4 className="font-extrabold text-sm text-white mb-0.5 leading-snug">
        {notification.title}
      </h4>
      <p className="text-xs text-slate-300 mb-2">{notification.company}</p>

      <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/80 border border-slate-800 mb-3">
        <span className="text-slate-400">{isHi ? "वेतन:" : "Pay:"}</span>
        <span className="font-extrabold text-amber-400">{notification.salary}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onSelectJob(notification.jobId);
            onClose();
          }}
          className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1 transition-colors border border-slate-700"
        >
          <span>{isHi ? "विवरण देखें" : "View"}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            onQuickApply(notification.jobId);
            onClose();
          }}
          className="py-1.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
        >
          {isHi ? "त्वरित आवेदन" : "Quick Apply"}
        </button>
      </div>
    </div>
  );
};
