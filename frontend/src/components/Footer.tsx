import Link from "next/link";
import { Heart, Compass, ShieldCheck, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#09241b] text-white border-t border-emerald-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D62828] to-[#F9B208] flex items-center justify-center font-bold text-white text-base">
                ನ
              </div>
              <span className="font-extrabold text-xl text-white">Namma Yatre</span>
            </div>
            <p className="text-xs text-[#F9B208] font-medium">ನಮ್ಮ ಯಾತ್ರೆ • Our Journey</p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Explore Karnataka. Experience Its Culture. Speak Kannada. An intelligent, culturally authentic travel architect.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F9B208]" />
              <span>Verified Destination Data</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F9B208] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link href="/plan" className="hover:text-white transition-colors">
                  AI Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Karnataka Destinations
                </Link>
              </li>
              <li>
                <Link href="/kannada" className="hover:text-white transition-colors">
                  Kannada Travel Companion
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Trips
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Hackathon Context & Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Karnataka Regions */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F9B208] mb-3">
              Regions & Circuits
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#F9B208]" />
                <span>Mysuru & Southern Heritage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#F9B208]" />
                <span>Vijayanagara Hampi & Badami</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#F9B208]" />
                <span>Kodagu Coorg & Chikkamagaluru</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#F9B208]" />
                <span>Karavali Coastal Gokarna & Udupi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#F9B208]" />
                <span>Shivamogga & Malnad Waterfalls</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Credentials & Charter */}
          <div className="space-y-2 text-xs text-neutral-300">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F9B208] mb-3">
              Hackathon 2026
            </h4>
            <p className="text-neutral-300">
              Submitted for <strong className="text-white">Kannada Digital Innovation Hackathon 2026</strong>.
            </p>
            <p className="text-neutral-400">
              Problem Statement 6: AI Travel Planner for Karnataka.
            </p>
            <div className="p-2.5 rounded-lg bg-black/30 border border-emerald-900/40 text-[11px] leading-relaxed text-emerald-200">
              🌿 <strong>Responsible Tourism:</strong> Respect local heritage, minimize single-use plastics, and honor local temple customs across Karnataka.
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>© 2026 Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ). Crafted with pride for Karnataka.</p>
          <p className="flex items-center gap-1">
            Built for Karnataka Digital Innovation with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
