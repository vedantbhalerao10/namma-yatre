"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Calendar, Users, IndianRupee, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { Itinerary } from "@/lib/types";
import { getLocalSavedItineraries, deleteFromLocalCache } from "@/lib/api";

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getLocalSavedItineraries();
    setSavedTrips(list);
    setLoading(false);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this saved trip?")) {
      deleteFromLocalCache(id);
      setSavedTrips((prev) => prev.filter((it) => it.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0F382A] text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 text-[#F9B208]" />
            <span>Guest Trip Vault</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900">Your Saved Journeys</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage and review your saved Karnataka itineraries and customized routes.
          </p>
        </div>

        <Link
          href="/plan"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F382A] text-white text-xs font-bold hover:bg-[#D62828] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plan New Journey</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-sm">Loading saved trips...</div>
      ) : savedTrips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">No Saved Trips Yet</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You haven&apos;t saved any Karnataka itineraries yet. Use our smart trip planner to design your first custom itinerary!
          </p>
          <div className="pt-2">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D62828] to-[#F9B208] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#0F382A] uppercase tracking-wider">
                    {trip.mode === "live_ai_generated" ? "Live AI" : "Curated Demo"}
                  </span>
                  <button
                    onClick={(e) => handleDelete(trip.id, e)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#0F382A] transition-colors leading-tight">
                  {trip.trip_title}
                </h3>
                <p className="text-xs font-semibold text-amber-800">
                  {trip.kannada_title}
                </p>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                  {trip.summary}
                </p>
              </div>

              {/* Meta stats */}
              <div className="pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{trip.travel_days} Days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{trip.travelers_count} Person{trip.travelers_count > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-[#0F382A]">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>₹{trip.budget_estimate.per_person_inr.toLocaleString("en-IN")}/p</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400">
                  Saved on {new Date(trip.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/itinerary?id=${trip.id}`}
                  className="inline-flex items-center gap-1 font-bold text-[#0F382A] hover:text-[#D62828] transition-colors"
                >
                  <span>Open Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
