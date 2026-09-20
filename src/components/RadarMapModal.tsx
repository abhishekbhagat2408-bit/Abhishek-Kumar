import React, { useState } from "react";
import {
  X,
  Compass,
  MapPin,
  Zap,
  CheckCircle2,
  Building2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { JobOpportunity } from "../types";
import { formatDistance } from "../utils/distance";

interface RadarMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpportunity[];
  currentLocality: string;
  onSelectJob: (job: JobOpportunity) => void;
  language: "en" | "hi";
}

export const RadarMapModal: React.FC<RadarMapModalProps> = ({
  isOpen,
  onClose,
  jobs,
  currentLocality,
  onSelectJob,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === "hi";
  const [selectedPin, setSelectedPin] = useState<JobOpportunity | null>(null);

  // Center radar radius = 5km maximum for visual plotting
  const maxRadiusKm = 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isHi ? "स्थानीय रोजगार रडार (Nearby Radar)" : "Local Employment Radar"}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? `स्थान: ${currentLocality}` : `Current Location: ${currentLocality}`}
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

        {/* Radar Graphic Stage */}
        <div className="relative flex-1 bg-radial from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
          {/* Radar Circles Container */}
          <div className="relative w-[300px] h-[300px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">
            {/* Outer Ring (5 km) */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 flex items-start justify-center">
              <span className="text-[10px] text-emerald-500/60 bg-slate-950/80 px-1.5 -translate-y-2 rounded">
                5.0 km
              </span>
            </div>

            {/* Middle Ring (3 km) */}
            <div className="absolute w-[60%] h-[60%] rounded-full border border-emerald-500/30 flex items-start justify-center">
              <span className="text-[10px] text-emerald-500/70 bg-slate-950/80 px-1.5 -translate-y-2 rounded">
                3.0 km
              </span>
            </div>

            {/* Inner Ring (1 km - Walking) */}
            <div className="absolute w-[25%] h-[25%] rounded-full border border-amber-500/40 flex items-start justify-center bg-amber-500/5">
              <span className="text-[9px] text-amber-400/90 bg-slate-950/80 px-1 rounded -translate-y-2">
                1.0 km ({isHi ? "पैदल" : "Walk"})
              </span>
            </div>

            {/* Rotating Radar Sweep Line */}
            <div className="absolute w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-emerald-400 right-1/2 top-1/2 origin-right animate-spin" />

            {/* Center User Location Pin */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-amber-500/30">
              <Navigation className="w-4 h-4" />
            </div>

            {/* Plotted Job Pins */}
            {jobs.map((job, idx) => {
              // Calculate polar coordinate angle based on index or pseudo-seed
              const angle = (idx * (360 / Math.max(jobs.length, 1)) * Math.PI) / 180;
              const normalizedDist = Math.min(job.distanceKm / maxRadiusKm, 0.95);
              const radiusPx = (normalizedDist * 200); // scaled for max 400px container

              const x = Math.cos(angle) * radiusPx;
              const y = Math.sin(angle) * radiusPx;

              const isSelected = selectedPin?.id === job.id;

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedPin(job)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className={`absolute z-20 transition-transform hover:scale-125 focus:outline-none ${
                    isSelected ? "scale-125 z-30" : ""
                  }`}
                  title={`${job.title} (${formatDistance(job.distanceKm, language)})`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md border ${
                      job.immediateJoining
                        ? "bg-rose-500 text-white border-rose-300 ring-2 ring-rose-500/40 animate-pulse"
                        : "bg-emerald-500 text-slate-950 border-emerald-300"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Pin Popover Card */}
          {selectedPin && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl p-3.5 shadow-2xl z-30 animate-in fade-in-50 text-xs">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    {formatDistance(selectedPin.distanceKm, language)}
                  </span>
                  {selectedPin.immediateJoining && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[9px]">
                      {isHi ? "तत्काल" : "Immediate"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h4 className="font-bold text-sm text-white">{selectedPin.title}</h4>
              <p className="text-slate-400 mb-1.5">{selectedPin.company} • {selectedPin.landmark}</p>
              <p className="text-amber-400 font-extrabold text-sm mb-2.5">{selectedPin.salary}</p>

              <button
                onClick={() => {
                  onSelectJob(selectedPin);
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{isHi ? "पूरा विवरण एवं आवेदन" : "View Full Details & Apply"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Radar Legend */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {isHi ? "आप (सेंटर)" : "You (Center)"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              {isHi ? "तत्काल आवश्यकता" : "Immediate Joining"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {isHi ? "स्थानीय नौकरी" : "Local Opening"}
            </span>
          </div>
          <span>{jobs.length} {isHi ? "नौकरियां रडार पर" : "pins active on radar"}</span>
        </div>
      </div>
    </div>
  );
};
