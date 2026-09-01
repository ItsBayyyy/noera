"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   LISTENING

   Every line a character speaks can be heard, not just read — tone is half of
   what a sentence means, and a learner cannot practise reading a room from
   text alone. Uses the browser's own speech synthesis: no backend, no audio
   files, nothing to download.
   -------------------------------------------------------------------------- */

/** Rough voice hints per scenario region, when the browser offers a choice. */
const VOICE_LANG: Record<string, string> = {
  JP: "en-GB",
  DE: "de-DE",
  US: "en-US",
  KR: "en-US",
  ID: "id-ID",
  FR: "fr-FR",
};

export function useSpeechSupport() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);
  return supported;
}

export function Listen({
  text,
  region,
  label = "Hear it",
  tone = "dark",
  className = "",
}: {
  text: string;
  region?: string;
  label?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const supported = useSpeechSupport();
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Never let a line keep talking after the scene has moved on.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  if (!supported) return null;

  function speak() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const wanted = region ? VOICE_LANG[region] : undefined;
    if (wanted) {
      const voice = synth
        .getVoices()
        .find((v) => v.lang?.toLowerCase().startsWith(wanted.slice(0, 2)));
      if (voice) utter.voice = voice;
      utter.lang = wanted;
    }
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    synth.speak(utter);
  }

  const dark = tone === "dark";

  return (
    <button
      onClick={speak}
      aria-label={speaking ? "Stop" : `${label}: ${text.slice(0, 60)}`}
      className={`relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
        dark
          ? "border-white/25 text-cream/70 hover:border-white/50 hover:text-cream"
          : "border-line text-mute hover:border-ink/40 hover:text-ink"
      } ${className}`}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <path d="M4 9v6h4l5 4V5L8 9H4Z" strokeLinejoin="round" />
        </svg>
        {speaking && (
          <m.span
            className="absolute -right-1.5 flex gap-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1].map((i) => (
              <m.span
                key={i}
                className="block h-[3px] w-[3px] rounded-full bg-current"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </m.span>
        )}
      </span>
      {speaking ? "Playing" : label}
    </button>
  );
}
