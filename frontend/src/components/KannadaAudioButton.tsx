"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  text: string;
  transliteration?: string;
  className?: string;
}

export default function KannadaAudioButton({ text, transliteration, className = "" }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio playback is not supported by your browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Find Kannada voice if installed in the client OS / browser
    const voices = window.speechSynthesis.getVoices();
    const knVoice = voices.find((v) => v.lang.includes("kn") || v.lang.includes("KN"));
    if (knVoice) {
      utterance.voice = knVoice;
    }
    utterance.lang = "kn-IN";
    utterance.rate = 0.85; // Slightly slower for clear learner pronunciation

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      type="button"
      title={`Listen to pronunciation: ${transliteration || text}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        isPlaying
          ? "bg-[#F9B208] text-neutral-900 ring-2 ring-[#F9B208]/40 scale-105"
          : "bg-emerald-800/40 text-emerald-200 hover:bg-emerald-700/50 hover:text-white border border-emerald-700/50"
      } ${className}`}
      aria-label="Listen to Kannada pronunciation"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 animate-pulse text-neutral-900" />
          <span className="font-semibold">Playing...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#F9B208]" />
          <span>Pronounce</span>
        </>
      )}
    </button>
  );
}
