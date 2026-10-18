import Link from "next/link";
import { Sparkles, Compass, BookOpen, ShieldCheck, ArrowRight, MapPin, IndianRupee, Volume2 } from "lucide-react";
import { MOCK_DESTINATIONS, MOCK_PHRASES } from "@/lib/mockData";
import KannadaAudioButton from "@/components/KannadaAudioButton";

export default function HomePage() {
  const featuredDestinations = MOCK_DESTINATIONS.slice(0, 4);
  const samplePhrases = MOCK_PHRASES.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F382A] via-[#124232] to-[#0A261D] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F9B208] blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#D62828] blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#F9B208]/40 text-xs sm:text-sm text-[#F9B208] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#F9B208] animate-ping" />
            <span>Kannada Digital Innovation Hackathon 2026 • Problem Statement 6</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Your Next Karnataka <br />
              <span className="bg-gradient-to-r from-[#F9B208] via-amber-200 to-white bg-clip-text text-transparent">
                Adventure Starts Here.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-emerald-200 font-sans">
              ನಮ್ಮ ಯಾತ್ರೆ • Namma Yatre
            </p>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Create personalized travel plans, discover Karnataka’s hidden gems, estimate your trip budget with transparent arithmetic, and learn useful Kannada phrases along the way.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/plan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D62828] to-[#F9B208] text-white text-base font-bold shadow-xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Plan My Karnataka Trip</span>
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/20 backdrop-blur-sm transition-all"
            >
              <Compass className="w-5 h-5 text-[#F9B208]" />
              <span>Explore Destinations</span>
            </Link>
          </div>

          {/* Core differentiators pill row */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-emerald-200">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              ⚡ Personalized AI Routes
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              🏛️ Verified Places & Fees
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              🗣️ Contextual Kannada Audio
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
              💰 Deterministic Budgets
            </div>
          </div>
        </div>
      </section>

      {/* How Namma Yatre Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D62828]">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
            How Namma Yatre Works
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            Connecting real Karnataka places, practical travel decisions, and meaningful cultural learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0F382A] font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Share Your Preferences</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Tell us your starting city, duration, group size, budget tier, travel pace, and interests (heritage, beaches, waterfalls, food).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Get a Verified Day-by-Day Plan</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Our system generates morning, afternoon, and evening stops with verified coordinates, duration notes, entry fees, and route maps.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Speak Kannada On The Go</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Learn situation-specific Kannada phrases for ordering dosas, negotiating auto fares, and asking directions with audio pronunciation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Destinations Showcase */}
      <section className="py-12 bg-white border-y border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F382A]">
                Curated Heritage & Nature
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                Explore Karnataka Destinations
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F382A] hover:text-[#D62828] transition-colors"
            >
              <span>View all destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group rounded-2xl overflow-hidden border border-neutral-200 bg-[#FAF8F5] flex flex-col shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
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
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-[#F9B208] backdrop-blur-sm">
                    {dest.entry_fee_inr === 0 ? "Free Entry" : `₹${dest.entry_fee_inr}`}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-[#0F382A] transition-colors line-clamp-1">
                      {dest.name}
                    </h3>
                    <p className="text-xs font-medium text-amber-800 line-clamp-1">
                      {dest.kannada_name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      {dest.district}
                    </span>
                    <Link
                      href={`/plan?pref=${encodeURIComponent(dest.name)}`}
                      className="text-xs font-semibold text-[#0F382A] hover:underline"
                    >
                      Plan Here →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contextual Kannada Learning Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-br from-[#0F382A] to-[#0A261D] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9B208] text-neutral-900">
                Core Differentiator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Contextual Survival Kannada
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                Namma Yatre bridges trip planning with practical language learning. Don’t just visit monuments — speak with auto drivers, order food at traditional messes, and greet locals respectfully.
              </p>
              <div className="pt-2">
                <Link
                  href="/kannada"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0F382A] font-bold text-sm hover:bg-[#F9B208] transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Kannada Travel Companion</span>
                </Link>
              </div>
            </div>

            {/* Interactive Sample Phrase Cards */}
            <div className="space-y-3">
              {samplePhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-2 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-white font-sans">{phrase.kannada}</div>
                      <div className="text-xs text-[#F9B208] font-semibold">
                        {phrase.transliteration} ({phrase.audio_phonetic})
                      </div>
                    </div>
                    <KannadaAudioButton text={phrase.kannada} transliteration={phrase.transliteration} />
                  </div>
                  <p className="text-xs text-emerald-100 font-medium">{phrase.meaning}</p>
                  <div className="text-[11px] text-emerald-300/80">Context: {phrase.context}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Tourism Charter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl border border-emerald-900/30 bg-emerald-50/70 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0F382A]">
            <ShieldCheck className="w-6 h-6 text-[#0F382A]" />
            <h3 className="text-xl font-bold">Our Responsible Tourism Charter</h3>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Namma Yatre encourages ethical, sustainable travel across Karnataka. We highlight local artisan cooperatives, verify monument entry rules, and discourage behaviors that could disturb wildlife sanctuaries or fragile ecological habitats in the Western Ghats.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700 pt-2">
            <div className="p-3 rounded-lg bg-white border border-emerald-100">
              🌱 <strong>Zero-Litter Ghats:</strong> Carry all plastic waste back from waterfalls and forest treks.
            </div>
            <div className="p-3 rounded-lg bg-white border border-emerald-100">
              🪔 <strong>Cultural Sanctity:</strong> Respect local temple etiquette and deposit footwear outside.
            </div>
            <div className="p-3 rounded-lg bg-white border border-emerald-100">
              🎨 <strong>Support Local Craft:</strong> Buy GI-tagged Channapatna toys, Ilkal sarees, and Mysore silk.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
