"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Volume2, Sparkles, HelpCircle, Heart, MessageSquare } from "lucide-react";
import { fetchKannadaPhrases } from "@/lib/api";
import { KannadaPhrase } from "@/lib/types";
import KannadaAudioButton from "@/components/KannadaAudioButton";

export default function KannadaPage() {
  const [phrases, setPhrases] = useState<KannadaPhrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Situations" },
    { id: "greetings", label: "🙏 Greetings & Courtesies" },
    { id: "directions", label: "🧭 Directions & Asking Way" },
    { id: "transport", label: "🛺 Auto & Bus Travel" },
    { id: "dining", label: "🍛 Ordering Food & Meals" },
    { id: "shopping", label: "🛍️ Shopping & Markets" },
    { id: "emergency", label: "🚨 Help & Emergencies" },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchKannadaPhrases(selectedCategory, searchQuery);
      setPhrases(data);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F382A] to-[#0A261D] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F9B208] text-neutral-900 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Core Hackathon Differentiator</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Kannada Travel Companion
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#F9B208]">
            ಕನ್ನಡ ಯಾತ್ರಾ ಸಂಗಾತಿ • Practical Survival Phrases
          </p>
        </div>
        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Communicate with warmth and confidence. Every phrase includes verified Kannada script, standard English transliteration, phonetic pronunciation, and contextual guidance for travelers.
        </p>
      </div>

      {/* Cultural Etiquette Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1 text-xs text-amber-950">
          <span className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
            🙏 Respectful Suffixes
          </span>
          <p className="leading-relaxed">
            Adding <strong>&ldquo;-ri&rdquo;</strong> (ರೀ) or using plural forms like <strong>&ldquo;iddira&rdquo;</strong> shows genuine respect to auto drivers, shopkeepers, and elders.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1 text-xs text-emerald-950">
          <span className="font-bold text-sm text-[#0F382A] flex items-center gap-1.5">
            🍛 Ordering with &ldquo;Kodi&rdquo;
          </span>
          <p className="leading-relaxed">
            In Karnataka tiffin rooms, use <strong>&ldquo;Kodi&rdquo;</strong> (ಕೊಡಿ - please give) rather than commanding words. E.g., <em>&ldquo;Ondu coffee kodi&rdquo;</em>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-1 text-xs text-blue-950">
          <span className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
            🗣️ Speech Audio
          </span>
          <p className="leading-relaxed">
            Click any <strong>Pronounce</strong> button to hear the sentence spoken via your browser&apos;s speech synthesizer with regional phonetic cadence.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases by Kannada script, transliteration, or English meaning (e.g., Namaskara, bus, dosa, help)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F382A]"
          />
        </div>

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

      {/* Phrases Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500">Loading verified phrases...</div>
      ) : phrases.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-base font-semibold text-neutral-800">No phrases found.</p>
          <p className="text-xs text-neutral-500">Try searching for other words or reset the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-sans tracking-wide">
                      {phrase.kannada}
                    </h3>
                    <p className="text-xs font-semibold text-amber-800 mt-0.5">
                      {phrase.transliteration}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400">
                      Pronunciation: [{phrase.audio_phonetic}]
                    </p>
                  </div>
                  <KannadaAudioButton text={phrase.kannada} transliteration={phrase.transliteration} />
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-50 text-xs text-neutral-800 font-medium">
                  <strong>Meaning:</strong> {phrase.meaning}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
                <span>Context: {phrase.context}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#0F382A] font-semibold">
                  {phrase.politeness_level}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
