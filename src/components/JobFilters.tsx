import React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { JobCategory, PayType } from "../types";
import { CATEGORY_LABELS } from "../data/mockJobs";

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: JobCategory;
  onSelectCategory: (cat: JobCategory) => void;
  selectedRadiusKm: number; // 0 = all
  onSelectRadius: (radius: number) => void;
  selectedPayType: "all" | PayType;
  onSelectPayType: (pt: "all" | PayType) => void;
  immediateOnly: boolean;
  onToggleImmediate: () => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  sortBy: "distance" | "salary" | "recent";
  onSelectSort: (s: "distance" | "salary" | "recent") => void;
  totalCount: number;
  onResetFilters: () => void;
  language: "en" | "hi";
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedRadiusKm,
  onSelectRadius,
  selectedPayType,
  onSelectPayType,
  immediateOnly,
  onToggleImmediate,
  verifiedOnly,
  onToggleVerified,
  sortBy,
  onSelectSort,
  totalCount,
  onResetFilters,
  language,
}) => {
  const isHi = language === "hi";

  const radiusOptions = [
    { label: isHi ? "सभी दूरी" : "All Distances", value: 0 },
    { label: isHi ? "1 किमी (पैदल)" : "Within 1 km", value: 1 },
    { label: isHi ? "3 किमी" : "Within 3 km", value: 3 },
    { label: isHi ? "5 किमी" : "Within 5 km", value: 5 },
    { label: isHi ? "10 किमी" : "Within 10 km", value: 10 },
  ];

  const categoryKeys = Object.keys(CATEGORY_LABELS) as JobCategory[];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isHi
                ? "पद, कौशल, दुकान या लैंडमार्क खोजें (जैसे: बिलिंग, डिलीवरी, ड्राइवर)..."
                : "Search by job role, skill, shop or landmark (e.g. delivery, cashier, driver)..."
            }
            className="w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="distance">{isHi ? "निकटतम दूरी पहले (Distance)" : "Closest Distance First"}</option>
            <option value="salary">{isHi ? "अधिकतम वेतन (Highest Pay)" : "Highest Salary First"}</option>
            <option value="recent">{isHi ? "नवीनतम पोस्ट (Recently Added)" : "Most Recent First"}</option>
          </select>
        </div>
      </div>

      {/* Proximity Radius Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium mr-1">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>{isHi ? "दूरी दायरा:" : "Radius:"}</span>
        </div>
        {radiusOptions.map((opt) => {
          const isActive = selectedRadiusKm === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectRadius(opt.value)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categoryKeys.map((catKey) => {
          const cat = CATEGORY_LABELS[catKey];
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => onSelectCategory(catKey)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all border ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-bold"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border-slate-700/60"
              }`}
            >
              {isHi ? cat.hi : cat.en}
            </button>
          );
        })}
      </div>

      {/* Quick Filter Toggles & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          {/* Pay Type Filter */}
          <div className="flex items-center gap-1 bg-slate-800/70 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onSelectPayType("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedPayType === "all" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {isHi ? "सभी वेतन" : "All Pay"}
            </button>
            <button
              onClick={() => onSelectPayType("monthly")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedPayType === "monthly" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {isHi ? "मासिक" : "Monthly"}
            </button>
            <button
              onClick={() => onSelectPayType("daily")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedPayType === "daily" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {isHi ? "दैनिक मजदूरी" : "Daily Wage"}
            </button>
          </div>

          {/* Urgent / Immediate Joining Toggle */}
          <button
            onClick={onToggleImmediate}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              immediateOnly
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold"
                : "bg-slate-800/70 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>{isHi ? "तत्काल ज्वाइनिंग" : "Immediate Start"}</span>
          </button>

          {/* Verified Employers Only */}
          <button
            onClick={onToggleVerified}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              verifiedOnly
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold"
                : "bg-slate-800/70 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? "सत्यापित नियोक्ता" : "Verified Only"}</span>
          </button>
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            {isHi ? (
              <>
                <strong className="text-white font-bold">{totalCount}</strong> स्थानीय नौकरियां उपलब्ध
              </>
            ) : (
              <>
                Showing <strong className="text-white font-bold">{totalCount}</strong> local openings
              </>
            )}
          </span>

          {(searchQuery ||
            selectedCategory !== "all" ||
            selectedRadiusKm !== 0 ||
            selectedPayType !== "all" ||
            immediateOnly ||
            verifiedOnly) && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isHi ? "रीसेट" : "Reset"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
