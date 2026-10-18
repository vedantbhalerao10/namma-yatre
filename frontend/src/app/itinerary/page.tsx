"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Share2,
  Printer,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertCircle,
  IndianRupee,
  Compass,
} from "lucide-react";
import { Itinerary, ItineraryActivity } from "@/lib/types";
import { saveToLocalCache, getLocalSavedItineraries } from "@/lib/api";
import KannadaAudioButton from "@/components/KannadaAudioButton";
import InteractiveMap from "@/components/InteractiveMap";
import BudgetCard from "@/components/BudgetCard";

function ItineraryViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get("id");

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  useEffect(() => {
    // 1. Try to load from sessionStorage (most recent generation)
    const cached = sessionStorage.getItem("current_itinerary");
    if (cached) {
      try {
        const parsed: Itinerary = JSON.parse(cached);
        if (!tripId || parsed.id === tripId) {
          setItinerary(parsed);
          checkIfAlreadySaved(parsed.id);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Try to load from saved trips in localStorage
    const savedList = getLocalSavedItineraries();
    if (tripId) {
      const match = savedList.find((it) => it.id === tripId);
      if (match) {
        setItinerary(match);
        setIsSaved(true);
        return;
      }
    }

    // 3. If no trip found, redirect to plan
    if (savedList.length > 0) {
      setItinerary(savedList[0]);
    } else {
      router.push("/plan");
    }
  }, [tripId, router]);

  const checkIfAlreadySaved = (id: string) => {
    const list = getLocalSavedItineraries();
    const exists = list.some((it) => it.id === id);
    setIsSaved(exists);
  };

  const handleSaveTrip = () => {
    if (!itinerary) return;
    saveToLocalCache(itinerary);
    setIsSaved(true);
    setSaveSuccessMsg("Trip saved to your device!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!itinerary) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-neutral-500">Loading your Karnataka itinerary...</p>
      </div>
    );
  }

  const currentDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0F382A] via-[#154a38] to-[#0A261D] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                itinerary.mode === "live_ai_generated"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-[#F9B208]/20 text-[#F9B208] border border-[#F9B208]/30"
              }`}
            >
              {itinerary.mode === "live_ai_generated"
                ? "✨ Live AI Generated"
                : "🏛️ Curated Demonstration Mode"}
            </span>
            <span className="text-xs text-emerald-200">
              Trip ID: <code className="bg-white/10 px-1.5 py-0.5 rounded">{itinerary.id}</code>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTrip}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                isSaved
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-[#0F382A] hover:bg-[#F9B208] hover:text-neutral-900"
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved" : "Save Trip"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-medium">
            {saveSuccessMsg}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {itinerary.trip_title}
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#F9B208]">
            {itinerary.kannada_title}
          </p>
          <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
            {itinerary.summary}
          </p>
        </div>

        {/* Trip Meta Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-emerald-100">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-neutral-300 block text-[10px] uppercase font-bold">From</span>
            <span className="font-semibold text-white">{itinerary.starting_city}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-neutral-300 block text-[10px] uppercase font-bold">Duration</span>
            <span className="font-semibold text-white">{itinerary.travel_days} Days / {itinerary.travel_days - 1} Nights</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-neutral-300 block text-[10px] uppercase font-bold">Travelers</span>
            <span className="font-semibold text-white">{itinerary.travelers_count} Person(s)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-neutral-300 block text-[10px] uppercase font-bold">Budget Tier</span>
            <span className="font-semibold text-[#F9B208] capitalize">{itinerary.budget_tier}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Day Timeline vs Sidebar (Map + Budget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Day Tabs & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itinerary.days.map((day, idx) => (
              <button
                key={day.day_number}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeDayIndex === idx
                    ? "bg-[#0F382A] text-white shadow-md scale-[1.02]"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                Day {day.day_number}
              </button>
            ))}
          </div>

          {/* Current Day Title Card */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D62828]">
                Daily Schedule
              </span>
              <h2 className="text-xl font-extrabold text-neutral-900">{currentDay.title}</h2>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">{currentDay.theme}</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F382A]">
              {currentDay.activities.length} Activities
            </span>
          </div>

          {/* Activity Cards Timeline */}
          <div className="space-y-4">
            {currentDay.activities.map((act, actIdx) => (
              <div
                key={actIdx}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Time & Place Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-[#0F382A] border border-emerald-100">
                      {act.time_of_day}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                        {act.place_name}
                      </h3>
                      {act.kannada_name && (
                        <p className="text-xs font-semibold text-amber-800 mt-0.5">
                          {act.kannada_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {typeof act.estimated_cost_inr === "number" && (
                    <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded-lg">
                      {act.estimated_cost_inr === 0 ? "Free Entry" : `₹${act.estimated_cost_inr}`}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {act.description}
                </p>

                {/* Duration & Cultural Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duration: ~{act.duration_minutes} mins</span>
                  </div>
                  {act.latitude && act.longitude && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${act.latitude},${act.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F382A] font-semibold hover:underline"
                      >
                        Directions in Google Maps ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Cultural Etiquette / Food Tip */}
                {(act.cultural_note || act.must_try_food) && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs space-y-1.5">
                    {act.cultural_note && (
                      <div className="text-amber-900">
                        <strong>Cultural Respect:</strong> {act.cultural_note}
                      </div>
                    )}
                    {act.must_try_food && (
                      <div className="text-amber-950 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span><strong>Regional Food:</strong> {act.must_try_food}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Contextual Kannada Phrases for this activity */}
                {act.kannada_phrases && act.kannada_phrases.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F382A]">
                      🗣️ Practical Kannada for this stop:
                    </span>
                    <div className="space-y-2">
                      {act.kannada_phrases.map((phrase) => (
                        <div
                          key={phrase.id}
                          className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-sm font-bold text-neutral-900 font-sans">
                              {phrase.kannada}
                            </div>
                            <div className="text-xs text-emerald-800 font-semibold">
                              {phrase.transliteration} ({phrase.audio_phonetic})
                            </div>
                            <div className="text-xs text-neutral-600 mt-0.5">
                              {phrase.meaning}
                            </div>
                          </div>
                          <KannadaAudioButton text={phrase.kannada} transliteration={phrase.transliteration} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Route Map & Budget Estimate (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Map Component */}
          <InteractiveMap
            activities={currentDay.activities}
            selectedDay={currentDay.day_number}
          />

          {/* Budget Breakdown Card */}
          <BudgetCard
            budget={itinerary.budget_estimate}
            travelers={itinerary.travelers_count}
            days={itinerary.travel_days}
          />

          {/* Responsible Tourism Box */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F382A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Responsible Tourism Tips</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              {itinerary.responsible_tourism_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading itinerary...</div>}>
      <ItineraryViewer />
    </Suspense>
  );
}
