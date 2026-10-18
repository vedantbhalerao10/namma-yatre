"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, MapPin, Calendar, Users, IndianRupee, Compass, Car, Shield, Loader2 } from "lucide-react";
import { generateItinerary } from "@/lib/api";
import { TripPlanRequest } from "@/lib/types";

function PlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPref = searchParams.get("pref") || "";

  const [startingCity, setStartingCity] = useState("Bengaluru");
  const [destinationPref, setDestinationPref] = useState(initialPref);
  const [travelDays, setTravelDays] = useState(3);
  const [travelersCount, setTravelersCount] = useState(2);
  const [budgetTier, setBudgetTier] = useState<"budget" | "moderate" | "luxury">("moderate");
  const [interests, setInterests] = useState<string[]>(["heritage", "nature"]);
  const [travelPace, setTravelPace] = useState<"relaxed" | "balanced" | "packed">("balanced");
  const [transportPreference, setTransportPreference] = useState<"public_transport" | "cab_rental" | "self_drive">("cab_rental");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const popularCities = ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi", "Shivamogga"];

  const interestOptions = [
    { id: "heritage", label: "🏛️ Heritage & History" },
    { id: "nature", label: "🌿 Nature & Waterfalls" },
    { id: "wildlife", label: "🐘 Wildlife & Sanctuaries" },
    { id: "coastal", label: "🏖️ Coastal & Beaches" },
    { id: "food", label: "🍛 Karnataka Culinary" },
    { id: "spiritual", label: "🪔 Temples & Spiritual" },
    { id: "adventure", label: "⛰️ Hills & Adventure" },
    { id: "urban", label: "🏙️ Urban & Markets" },
  ];

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== id));
      }
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!startingCity.trim()) {
      setErrorMsg("Please specify a starting city.");
      return;
    }
    if (travelDays < 1 || travelDays > 14) {
      setErrorMsg("Trip duration must be between 1 and 14 days.");
      return;
    }
    if (travelersCount < 1) {
      setErrorMsg("Please specify at least 1 traveler.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: TripPlanRequest = {
        starting_city: startingCity.trim(),
        destination_preference: destinationPref.trim() || undefined,
        travel_days: travelDays,
        travelers_count: travelersCount,
        budget_tier: budgetTier,
        interests,
        travel_pace: travelPace,
        transport_preference: transportPreference,
        accessibility_needs: accessibilityNeeds.trim() || undefined,
      };

      const itinerary = await generateItinerary(payload);
      if (itinerary && itinerary.id) {
        // Store current active itinerary in sessionStorage for immediate fast view
        sessionStorage.setItem("current_itinerary", JSON.stringify(itinerary));
        router.push(`/itinerary?id=${itinerary.id}`);
      } else {
        setErrorMsg("Failed to generate itinerary. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while generating the plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0F382A] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#F9B208]" />
          <span>Intelligent Trip Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Plan Your Karnataka Journey
        </h1>
        <p className="text-neutral-600 text-sm">
          Customize your route, duration, budget, and language companion in one click.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 shadow-xl text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D62828] to-[#F9B208] flex items-center justify-center text-white mx-auto shadow-lg animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">
              Crafting Your Karnataka Itinerary...
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Curating verified destinations, computing deterministic budgets, and selecting contextual survival Kannada phrases.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 max-w-md mx-auto">
            💡 <em>Kannada Tip:</em> Did you know? In Karnataka, asking &ldquo;Oota aayitha?&rdquo; (ಊಟ ಆಯ್ತಾ? - Had your meal?) is a warm way of showing care!
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            <span>Validating places against official datasets</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xl space-y-8"
        >
          {/* Section 1: Starting City & Destination */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F382A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D62828]" />
              <span>1. Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Starting City in Karnataka *
                </label>
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Mysuru, Hubballi"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F382A] text-sm"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {popularCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setStartingCity(c)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                        startingCity === c
                          ? "bg-[#0F382A] text-white border-[#0F382A]"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preferred Region or Destination (Optional)
                </label>
                <input
                  type="text"
                  value={destinationPref}
                  onChange={(e) => setDestinationPref(e.target.value)}
                  placeholder="Leave blank for automatic recommendation, or enter e.g. Hampi, Coorg"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F382A] text-sm"
                />
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Leave blank to let AI recommend the best route for your interests.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Duration, Travelers & Budget */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F382A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F9B208]" />
              <span>2. Timing & Group</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Trip Duration (Days)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={travelDays}
                    onChange={(e) => setTravelDays(parseInt(e.target.value))}
                    className="w-full accent-[#0F382A]"
                  />
                  <span className="w-12 text-center px-2 py-1 rounded-lg bg-emerald-50 text-[#0F382A] font-bold text-sm">
                    {travelDays}d
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(parseInt(e.target.value))}
                    className="w-full accent-[#0F382A]"
                  />
                  <span className="w-12 text-center px-2 py-1 rounded-lg bg-emerald-50 text-[#0F382A] font-bold text-sm">
                    {travelersCount}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Budget Style
                </label>
                <select
                  value={budgetTier}
                  onChange={(e: any) => setBudgetTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#0F382A]"
                >
                  <option value="budget">Budget (Guesthouses / Local Food)</option>
                  <option value="moderate">Moderate (3-Star / Homestays)</option>
                  <option value="luxury">Luxury (Heritage Resorts / Fine Dine)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Interests Multi-Select */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F382A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>3. Travel Interests</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {interestOptions.map((opt) => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? "bg-[#0F382A] text-white border-[#0F382A] shadow-sm"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Travel Pace & Transport Preference */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F382A] flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-700" />
              <span>4. Pace & Transportation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Travel Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "relaxed", label: "Relaxed", sub: "2 spots/day" },
                    { id: "balanced", label: "Balanced", sub: "3 spots/day" },
                    { id: "packed", label: "Packed", sub: "4 spots/day" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTravelPace(p.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        travelPace === p.id
                          ? "bg-emerald-900 text-white border-emerald-900 font-bold"
                          : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="text-xs">{p.label}</div>
                      <div className="text-[10px] opacity-80">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Transportation Mode
                </label>
                <select
                  value={transportPreference}
                  onChange={(e: any) => setTransportPreference(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#0F382A]"
                >
                  <option value="cab_rental">Dedicated Cab Rental (Flexible)</option>
                  <option value="public_transport">Public Transport (KSRTC & Trains - Economical)</option>
                  <option value="self_drive">Self-Drive Rental Car</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Accessibility or Mobility Preferences (Optional)
              </label>
              <input
                type="text"
                value={accessibilityNeeds}
                onChange={(e) => setAccessibilityNeeds(e.target.value)}
                placeholder="e.g. Senior citizens, minimal stairs, wheelchair friendly"
                className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#0F382A]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D62828] to-[#F9B208] text-white font-extrabold text-base shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Personalized Karnataka Itinerary</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2">
              Generated in strict structured JSON with deterministic budget calculations & contextual Kannada phrases.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading trip planner...</div>}>
      <PlanForm />
    </Suspense>
  );
}
