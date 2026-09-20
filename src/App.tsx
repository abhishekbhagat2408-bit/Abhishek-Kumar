import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Briefcase,
  MapPin,
  Bell,
  Sparkles,
  Compass,
  Users,
  Building2,
  Phone,
  MessageCircle,
  Clock,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  User,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import {
  JobOpportunity,
  JobCategory,
  PayType,
  JobNotification,
  UserProfile,
  JobApplication,
  NotificationSettings,
} from "./types";
import { INITIAL_JOBS, LOCALITIES_LIST, CATEGORY_LABELS } from "./data/mockJobs";
import { Header } from "./components/Header";
import { JobFilters } from "./components/JobFilters";
import { JobCard } from "./components/JobCard";
import { JobDetailModal } from "./components/JobDetailModal";
import { QuickApplyModal } from "./components/QuickApplyModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { NotificationToast } from "./components/NotificationToast";
import { ApplicationsTracker } from "./components/ApplicationsTracker";
import { PostJobModal } from "./components/PostJobModal";
import { AiSathiAssistantModal } from "./components/AiSathiAssistantModal";
import { RadarMapModal } from "./components/RadarMapModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { playAlertChime } from "./utils/audioAlert";
import { calculateDistanceKm, formatDistance } from "./utils/distance";

export default function App() {
  // App Language: 'hi' for Hindi, 'en' for English
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const isHi = language === "hi";

  // Location State
  const [currentLocality, setCurrentLocality] = useState(LOCALITIES_LIST[0].name);
  const [currentCoords, setCurrentCoords] = useState({
    lat: LOCALITIES_LIST[0].lat,
    lng: LOCALITIES_LIST[0].lng,
  });
  const [isLocating, setIsLocating] = useState(false);

  // Job Listings State
  const [jobs, setJobs] = useState<JobOpportunity[]>(() => {
    // Calculate initial distances based on first locality
    return INITIAL_JOBS.map((j) => ({
      ...j,
      distanceKm: calculateDistanceKm(
        LOCALITIES_LIST[0].lat,
        LOCALITIES_LIST[0].lng,
        j.latitude,
        j.longitude
      ),
    }));
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>("all");
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(0); // 0 = all
  const [selectedPayType, setSelectedPayType] = useState<"all" | PayType>("all");
  const [immediateOnly, setImmediateOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "salary" | "recent">("distance");

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Abhishek Bhagat",
    phone: "+91 98123 45678",
    location: "Sector 18 Market",
    pincode: "201301",
    latitude: LOCALITIES_LIST[0].lat,
    longitude: LOCALITIES_LIST[0].lng,
    skills: ["Billing", "Customer Service", "Computer Basic", "English Comprehension", "Inventory"],
    experience: "1-2 Years",
    education: "12th Pass",
    preferredWorkType: "Full-time",
    preferredCategory: "retail_sales",
    availability: "immediate",
    bio: "Hardworking and punctual candidate living in Sector 18. Ready to start immediately.",
  });

  // Job Applications Tracker
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: "app-seed-1",
      jobId: "job-1",
      jobTitle: "Store Billing & Inventory Assistant",
      company: "Verma Departmental & Super Store",
      salary: "₹16,500 - ₹19,000 / month",
      location: "Sector 18 Market",
      appliedAt: Date.now() - 45 * 60 * 1000,
      status: "reviewing",
      applicantName: "Abhishek Bhagat",
      applicantPhone: "+91 98123 45678",
      customNote: "I live 500m away in Sector 18 and can join tomorrow morning.",
    },
  ]);

  // Real-Time Notifications State
  const [notifications, setNotifications] = useState<JobNotification[]>([
    {
      id: "notif-1",
      jobId: "job-1",
      title: "New Opening: Store Billing Assistant",
      message: "Verma Departmental Store is urgently hiring within 0.6 km.",
      distanceKm: 0.6,
      locality: "Sector 18 Market",
      salary: "₹16,500 - ₹19,000 / mo",
      timestamp: Date.now() - 15 * 60 * 1000,
      read: false,
      urgency: "urgent",
      company: "Verma Departmental & Super Store",
    },
    {
      id: "notif-2",
      jobId: "job-2",
      title: "Express Delivery Rider Opening",
      message: "QuickKart Hub posted 5 urgent openings within 1.1 km.",
      distanceKm: 1.1,
      locality: "Civil Lines North",
      salary: "₹18,000 - ₹24,000 / mo",
      timestamp: Date.now() - 35 * 60 * 1000,
      read: false,
      urgency: "urgent",
      company: "QuickKart Express Hub",
    },
  ]);

  const [activeToast, setActiveToast] = useState<JobNotification | null>(null);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    maxRadiusKm: 5,
    soundEnabled: true,
    vibrateEnabled: true,
    minPayThreshold: 0,
    immediateOnly: false,
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  // Modals & Drawers
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobOpportunity | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isAiSathiOpen, setIsAiSathiOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  // Recalculate job distances when currentCoords change
  useEffect(() => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => ({
        ...j,
        distanceKm: calculateDistanceKm(
          currentCoords.lat,
          currentCoords.lng,
          j.latitude,
          j.longitude
        ),
      }))
    );
  }, [currentCoords]);

  // Request live geolocation
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      alert(isHi ? "ब्राउज़र में GPS समर्थित नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoords({ lat, lng });
        setCurrentLocality(isHi ? "मेरा लाइव GPS स्थान" : "My Live GPS Location");
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation denied or unavailable:", err.message);
        // Soft fallback to current locality
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Request browser push notification permission
  const handleRequestBrowserNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === "granted" && notificationSettings.soundEnabled) {
        playAlertChime();
      }
    }
  };

  // Function to dispatch a real-time notification
  const dispatchRealtimeNotification = useCallback(
    (notif: JobNotification) => {
      setNotifications((prev) => [notif, ...prev]);
      setActiveToast(notif);

      // Play audio chime if enabled
      if (notificationSettings.soundEnabled) {
        playAlertChime();
      }

      // Trigger browser push notification if permitted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(`Abhigyan Rojgar Sathi: ${notif.title}`, {
            body: `${notif.company} • ${notif.salary} • ${formatDistance(notif.distanceKm, language)}`,
            icon: "/assets/favicon.ico",
          });
        } catch (e) {
          // ignore notification errors
        }
      }
    },
    [notificationSettings.soundEnabled, language]
  );

  // Trigger simulated incoming opening alert
  const handleTriggerSimulatedAlert = () => {
    const randomSeedTitles = [
      {
        title: isHi ? "तत्काल डिलीवरी राइडर (ग्रॉसरी हब)" : "Immediate Grocery Delivery Partner",
        company: "Zepto Express Hub",
        salary: "₹20,000 - ₹24,000 / mo",
        locality: currentLocality,
        distanceKm: 0.8,
        urgency: "urgent" as const,
      },
      {
        title: isHi ? "स्टोर कैशियर एवं सेल्स बॉय" : "Retail Store Cashier & Assistant",
        company: "Blink Supermart",
        salary: "₹17,000 / mo",
        locality: currentLocality,
        distanceKm: 1.2,
        urgency: "urgent" as const,
      },
      {
        title: isHi ? "दैनिक लोडर एवं हेल्पर (शाम को पेमेंट)" : "Warehouse Loader (Daily Cash UPI)",
        company: "Om Logistics Hub",
        salary: "₹850 / Day",
        locality: currentLocality,
        distanceKm: 1.5,
        urgency: "urgent" as const,
      },
    ];

    const pick = randomSeedTitles[Math.floor(Math.random() * randomSeedTitles.length)];

    const newNotif: JobNotification = {
      id: `notif-${Date.now()}`,
      jobId: jobs[0]?.id || "job-1",
      title: pick.title,
      message: `${pick.company} has an urgent opening within ${pick.distanceKm} km.`,
      distanceKm: pick.distanceKm,
      locality: pick.locality,
      salary: pick.salary,
      timestamp: Date.now(),
      read: false,
      urgency: pick.urgency,
      company: pick.company,
    };

    dispatchRealtimeNotification(newNotif);
  };

  // Submit quick application
  const handleSubmitApplication = (job: JobOpportunity, customNote: string, phone: string) => {
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      salary: job.salary,
      location: job.locality,
      appliedAt: Date.now(),
      status: "applied",
      applicantName: userProfile.name,
      applicantPhone: phone,
      customNote,
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  // Add newly created employer job
  const handleAddNewJob = (newJob: JobOpportunity) => {
    setJobs((prev) => [newJob, ...prev]);

    // Dispatch instant real-time notification alert to nearby job seekers!
    const newNotif: JobNotification = {
      id: `notif-${Date.now()}`,
      jobId: newJob.id,
      title: `${isHi ? "नया स्थानीय अवसर:" : "New Local Opening:"} ${newJob.title}`,
      message: `${newJob.company} posted an immediate opening within ${newJob.distanceKm} km!`,
      distanceKm: newJob.distanceKm,
      locality: newJob.locality,
      salary: newJob.salary,
      timestamp: Date.now(),
      read: false,
      urgency: newJob.immediateJoining ? "urgent" : "normal",
      company: newJob.company,
    };

    dispatchRealtimeNotification(newNotif);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle =
            job.title.toLowerCase().includes(q) || (job.titleHi && job.titleHi.toLowerCase().includes(q));
          const matchesCompany = job.company.toLowerCase().includes(q);
          const matchesLocality = job.locality.toLowerCase().includes(q) || job.landmark.toLowerCase().includes(q);
          const matchesCategory = job.category.toLowerCase().includes(q);
          const matchesRequirements = job.requirements.some((r) => r.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCompany && !matchesLocality && !matchesCategory && !matchesRequirements) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== "all" && job.category !== selectedCategory) {
          return false;
        }

        // Radius
        if (selectedRadiusKm > 0 && job.distanceKm > selectedRadiusKm) {
          return false;
        }

        // Pay Type
        if (selectedPayType !== "all" && job.payType !== selectedPayType) {
          return false;
        }

        // Immediate Only
        if (immediateOnly && !job.immediateJoining) {
          return false;
        }

        // Verified Only
        if (verifiedOnly && !job.isVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "distance") {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === "salary") {
          return b.payAmountNumeric - a.payAmountNumeric;
        }
        if (sortBy === "recent") {
          return b.timestamp - a.timestamp;
        }
        return 0;
      });
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedRadiusKm,
    selectedPayType,
    immediateOnly,
    verifiedOnly,
    sortBy,
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Main Navigation */}
      <Header
        currentLocality={currentLocality}
        onSelectLocality={(loc) => {
          setCurrentLocality(loc.name);
          setCurrentCoords({ lat: loc.lat, lng: loc.lng });
        }}
        onRequestGeolocation={handleRequestGeolocation}
        isLocating={isLocating}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAiSathi={() => setIsAiSathiOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenApplications={() => setIsApplicationsOpen(true)}
        onOpenRadar={() => setIsRadarOpen(true)}
        applicationsCount={applications.length}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* Seeker Welcome & Proximity Radar Strip */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                  {isHi ? "रीयल-टाइम नजदीकी मॉनिटरिंग" : "Proximity Radar Active"}
                </span>
                <span className="text-xs text-slate-400">
                  {currentLocality}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isHi ? (
                  <>
                    नमस्ते, <span className="text-amber-400">{userProfile.name}</span>! आपके आस-पास{" "}
                    <span className="underline decoration-amber-500/50">{filteredJobs.length} रोजगार</span> उपलब्ध हैं।
                  </>
                ) : (
                  <>
                    Welcome, <span className="text-amber-400">{userProfile.name}</span>! Showing{" "}
                    <span className="underline decoration-amber-500/50">{filteredJobs.length} local opportunities</span> near you.
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {isHi
                  ? "सीधे स्थानीय दुकानदारों एवं कंपनियों से जुड़ें। बिना किसी एजेंट या बिचौलिये के कॉल या व्हाट्सएप करें।"
                  : "Connect directly with neighborhood employers. Call or WhatsApp recruiters with zero middleman or agency fees."}
              </p>
            </div>

            {/* Quick Action Badges & Profile Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setIsRadarOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? "नक्शा रडार (Radar)" : "Proximity Radar"}</span>
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>{isHi ? "मेरी प्रोफाइल" : "My Profile"}</span>
              </button>

              <button
                onClick={() => setIsAiSathiOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHi ? "रोजगार साथी AI" : "Ask Sathi AI"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search & Proximity Filters */}
        <JobFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRadiusKm={selectedRadiusKm}
          onSelectRadius={setSelectedRadiusKm}
          selectedPayType={selectedPayType}
          onSelectPayType={setSelectedPayType}
          immediateOnly={immediateOnly}
          onToggleImmediate={() => setImmediateOnly((prev) => !prev)}
          verifiedOnly={verifiedOnly}
          onToggleVerified={() => setVerifiedOnly((prev) => !prev)}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={filteredJobs.length}
          onResetFilters={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setSelectedRadiusKm(0);
            setSelectedPayType("all");
            setImmediateOnly(false);
            setVerifiedOnly(false);
            setSortBy("distance");
          }}
          language={language}
        />

        {/* Jobs Grid Section */}
        {filteredJobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 my-6">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {isHi ? "इस दायरे में कोई नौकरी नहीं मिली" : "No Openings Found in this Range"}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              {isHi
                ? "दूरी का दायरा (Radius) बढ़ाकर देखें या फिल्टर रीसेट करें। आप चाहें तो खुद भी इस इलाके में भर्ती पोस्ट कर सकते हैं।"
                : "Try expanding your proximity radius or clearing your filters to see more local opportunities."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedRadiusKm(0);
                setSelectedPayType("all");
                setImmediateOnly(false);
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              {isHi ? "सभी दूरियों की नौकरियां देखें" : "View All Distances"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredJobs.map((job) => {
              const isApplied = applications.some((a) => a.jobId === job.id);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={isApplied}
                  onSelect={(j) => setSelectedJob(j)}
                  onQuickApply={(j) => setApplyingJob(j)}
                  language={language}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Real-Time Notification Bell Action Button (Mobile) */}
      <button
        onClick={() => setIsNotificationsOpen(true)}
        className="fixed bottom-5 left-5 z-40 sm:hidden w-12 h-12 rounded-full bg-slate-900 border border-amber-500/50 text-amber-400 shadow-xl flex items-center justify-center ring-4 ring-amber-500/20"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Abhigyan Rojgar Sathi</span>
            <span>•</span>
            <span>{isHi ? "स्थानीय रोजगार एवं तुरंत सूचना मंच" : "Hyperlocal Opportunities & Proximity Alerts"}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsRadarOpen(true)} className="hover:text-amber-400">
              {isHi ? "रडार दृश्य" : "Radar View"}
            </button>
            <span>•</span>
            <button onClick={() => setIsAiSathiOpen(true)} className="hover:text-amber-400">
              {isHi ? "साथी AI" : "AI Coach"}
            </button>
            <span>•</span>
            <button onClick={() => setIsPostJobOpen(true)} className="hover:text-amber-400">
              {isHi ? "नौकरी पोस्ट करें" : "Employer Post"}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onQuickApply={(j) => {
          setSelectedJob(null);
          setApplyingJob(j);
        }}
        isApplied={selectedJob ? applications.some((a) => a.jobId === selectedJob.id) : false}
        userProfile={userProfile}
        language={language}
      />

      <QuickApplyModal
        job={applyingJob}
        userProfile={userProfile}
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        onSubmitApplication={handleSubmitApplication}
        language={language}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
        onSelectJob={(jobId) => {
          const found = jobs.find((j) => j.id === jobId);
          if (found) setSelectedJob(found);
        }}
        onQuickApply={(jobId) => {
          const found = jobs.find((j) => j.id === jobId);
          if (found) setApplyingJob(found);
        }}
        settings={notificationSettings}
        onUpdateSettings={(newSet) => setNotificationSettings((prev) => ({ ...prev, ...newSet }))}
        onRequestBrowserNotification={handleRequestBrowserNotification}
        browserPermission={browserPermission}
        onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
        language={language}
      />

      <NotificationToast
        notification={activeToast}
        onClose={() => setActiveToast(null)}
        onSelectJob={(jobId) => {
          const found = jobs.find((j) => j.id === jobId);
          if (found) setSelectedJob(found);
        }}
        onQuickApply={(jobId) => {
          const found = jobs.find((j) => j.id === jobId);
          if (found) setApplyingJob(found);
        }}
        language={language}
      />

      <ApplicationsTracker
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
        applications={applications}
        language={language}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onAddNewJob={handleAddNewJob}
        currentLocality={currentLocality}
        language={language}
      />

      <AiSathiAssistantModal
        isOpen={isAiSathiOpen}
        onClose={() => setIsAiSathiOpen(false)}
        userProfile={userProfile}
        jobs={jobs}
        language={language}
      />

      <RadarMapModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        jobs={jobs}
        currentLocality={currentLocality}
        onSelectJob={(j) => setSelectedJob(j)}
        language={language}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={setUserProfile}
        language={language}
      />
    </div>
  );
}
