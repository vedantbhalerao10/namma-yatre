import { Shield, Sparkles, BookOpen, Layers, CheckCircle2, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title Banner */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F9B208]/20 border border-[#F9B208]/40 text-[#0F382A] text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>Kannada Digital Innovation Hackathon 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          About Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ)
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          Selected Problem Statement 6: AI Travel Planner for Karnataka
        </p>
      </div>

      {/* Problem & Solution Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D62828]">
            The Problem We Are Solving
          </span>
          <h2 className="text-xl font-bold text-neutral-900">
            Fragmented Planning & Language Barriers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Planning a journey across Karnataka often requires navigating separate sites for attractions, transit schedules, food, and budgets. Moreover, non-Kannada speaking tourists often struggle to communicate with auto drivers, restaurant servers, and local artisans, missing out on deep cultural connections.
          </p>
          <ul className="space-y-2 text-xs text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>Disjointed itineraries with unrealistic transit schedules.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>AI chatbots hallucinating ticket prices and impossible routes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>Zero integration between travel stops and local language practice.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-[#0F382A] to-[#0A261D] rounded-3xl p-8 text-white shadow-md space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F9B208]">
            The Namma Yatre Solution
          </span>
          <h2 className="text-xl font-bold text-white">
            Travel Planning & Practical Kannada in One
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Namma Yatre unites structured AI travel curation with verified destination records, deterministic budget calculations, and situation-specific Kannada phrases accompanied by audio pronunciation.
          </p>
          <ul className="space-y-2 text-xs text-emerald-100">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F9B208] flex-shrink-0" />
              <span>Personalized day-by-day plans anchored in verified data.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F9B208] flex-shrink-0" />
              <span>Interactive Leaflet maps with Google Maps turn-by-turn links.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F9B208] flex-shrink-0" />
              <span>Contextual survival Kannada with browser speech synthesis.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Kannada Digital Innovation Contribution */}
      <div className="bg-amber-50/80 rounded-3xl p-8 border border-amber-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-800" />
          <h3 className="text-xl font-bold text-amber-950">
            Kannada Digital Innovation Contribution
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          Rather than isolating language learning inside flashcard apps, Namma Yatre situates Kannada in real-life travel contexts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="p-3.5 rounded-xl bg-white border border-amber-200">
            <strong>Authentic Script & Phonetics:</strong> Verified Unicode Kannada script with standard English transliteration and phonetic guides.
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-amber-200">
            <strong>Activity Linking:</strong> A visit to Mylari prompts ordering phrases; an auto journey prompts negotiation phrases.
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-amber-200">
            <strong>Politeness Cues:</strong> Explaining cultural nuances like <em>&ldquo;kodi&rdquo;</em> vs <em>&ldquo;kodu&rdquo;</em> to foster respectful local interactions.
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#0F382A]" />
          <h3 className="text-xl font-bold text-neutral-900">Technical Architecture</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900">Frontend</span>
            <p className="text-neutral-600">Next.js 14/15, React 19, TypeScript, Tailwind CSS, Lucide icons.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900">Backend API</span>
            <p className="text-neutral-600">Python 3.14, FastAPI, Pydantic v2 schemas, REST endpoints.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900">AI & Fallback</span>
            <p className="text-neutral-600">Google Gemini API with seamless Curated Demonstration Engine fallback.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900">Maps & Audio</span>
            <p className="text-neutral-600">Leaflet OpenStreetMap, Google Maps navigation links, Web Speech API.</p>
          </div>
        </div>
      </div>

      {/* Prototype Limitations Disclosure */}
      <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 space-y-2">
        <h4 className="font-bold text-neutral-800 uppercase tracking-wide">
          Prototype Scope & Limitations
        </h4>
        <ul className="list-disc list-inside space-y-1 text-neutral-600">
          <li>Budget calculations represent deterministic regional estimates; actual hotel and transport rates may vary during high-demand festival periods (e.g. Mysuru Dussehra).</li>
          <li>Weather forecasts are indicative and do not block itinerary generation if external feeds are unavailable.</li>
          <li>Live speech synthesis depends on browser support for Kannada voices (`kn-IN`).</li>
        </ul>
      </div>
    </div>
  );
}
