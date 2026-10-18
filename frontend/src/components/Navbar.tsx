"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Compass, BookOpen, Bookmark, Info, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan Trip", icon: Sparkles },
    { href: "/explore", label: "Explore Karnataka", icon: Compass },
    { href: "/kannada", label: "Kannada Companion", icon: BookOpen },
    { href: "/saved", label: "Saved Trips", icon: Bookmark },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F382A]/95 backdrop-blur-md border-b border-[#F9B208]/20 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D62828] to-[#F9B208] flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-xl">ನ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">Namma Yatre</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-[#F9B208]/20 text-[#F9B208] border border-[#F9B208]/30">
                  ನಮ್ಮ ಯಾತ್ರೆ
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 tracking-wider uppercase font-semibold">
                Karnataka AI Travel Planner
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#F9B208] text-neutral-900 shadow font-semibold"
                      : "text-emerald-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : "text-[#F9B208]"}`} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Plan Trip CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D62828] to-[#F9B208] text-white text-sm font-semibold hover:brightness-110 shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Plan</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a281e] border-b border-[#F9B208]/20 px-4 pt-2 pb-5 space-y-1 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#F9B208] text-neutral-900 font-semibold"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-[#F9B208]" />}
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/plan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D62828] to-[#F9B208] text-white font-semibold shadow"
            >
              <Sparkles className="w-4 h-4" />
              Start Planning Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
