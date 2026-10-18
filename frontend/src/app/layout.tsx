import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ) - AI Karnataka Travel Planner & Kannada Companion",
  description:
    "Explore Karnataka, experience its rich heritage, estimate your travel budget, and learn contextual Kannada phrases for the Kannada Digital Innovation Hackathon 2026.",
  keywords: [
    "Namma Yatre",
    "Karnataka Travel",
    "Kannada Digital Innovation",
    "AI Travel Planner",
    "Learn Kannada",
    "Mysuru Palace",
    "Hampi",
    "Coorg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#FAF8F5] text-neutral-800 font-sans selection:bg-[#F9B208] selection:text-neutral-900`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
