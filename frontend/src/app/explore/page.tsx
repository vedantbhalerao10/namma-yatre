"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, Compass, ShieldCheck, ArrowRight, IndianRupee, Utensils } from "lucide-react";
import { fetchDestinations } from "@/lib/api";
import { Destination } from "@/lib/types";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Places" },
    { id: "heritage", label: "🏛️ Heritage" },
    { id: "nature", label: "🌿 Nature" },
    { id: "coastal", label: "🏖️ Coastal" },
    { id: "spiritual", label: "🪔 Spiritual" },
    { id: "wildlife", label: "🐘 Wildlife" },
    { id: "adventure", label: "⛰️ Adventure" },
    { id: "urban", label: "🏙️ Urban" },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDestinations(selectedCategory, searchQuery);
      setDestinations(data);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0F382A] text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-[#F9B208]" />
          <span>Verified Place Database</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          Explore Karnataka Destinations
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          Discover UNESCO World Heritage monuments, misty coffee hills, sacred coastal shrines, and authentic regional culinary specialties.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination name, district, or Kannada keywords (e.g. Mysuru, Hampi, Badami)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F382A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#0F382A] text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500">
          Loading verified Karnataka destinations...
        </div>
      ) : destinations.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-base font-semibold text-neutral-800">No destinations match your query.</p>
          <p className="text-xs text-neutral-500">Try adjusting your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-52 w-full overflow-hidden bg-neutral-200">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/chamundi_temple.jpg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0F382A]/90 text-white backdrop-blur-sm">
                  {dest.category}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-neutral-900 backdrop-blur-sm">
                  {dest.entry_fee_inr === 0 ? "Free Entry" : `₹${dest.entry_fee_inr} Ticket`}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.district} District</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#0F382A] transition-colors leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800">
                    {dest.kannada_name}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                    {dest.description}
                  </p>
                </div>

                {/* Practical Details */}
                <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duration: ~{dest.suggested_duration_mins} mins</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    <strong>Timings:</strong> {dest.opening_hours}
                  </div>

                  {dest.cultural_note && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-900">
                      <strong>Cultural Note:</strong> {dest.cultural_note}
                    </div>
                  )}

                  {dest.must_try_food && (
                    <div className="flex items-start gap-1 text-[11px] text-amber-900 font-medium">
                      <Utensils className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <span>{dest.must_try_food}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.latitude},${dest.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
                  >
                    Directions ↗
                  </a>
                  <Link
                    href={`/plan?pref=${encodeURIComponent(dest.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F382A] hover:bg-[#D62828] text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Plan Trip Here</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
