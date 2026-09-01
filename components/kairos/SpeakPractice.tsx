"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/kairos/i18n";

/* --------------------------------------------------------------------------
   SPEAKING

   Choosing the right sentence is half the skill; being able to say it out
   loud, at the moment it is needed, is the other half. Uses the browser's own
   speech recognition — frontend only, nothing leaves the device. Where the
   browser has no microphone API, the panel degrades into a read-aloud prompt
   rather than disappearing.
   -------------------------------------------------------------------------- */

/* Minimal typings: the Web Speech API is not in the standard DOM lib. */
interface SpeechResultAlternative {
  transcript: string;
}
interface SpeechResult {
  0: SpeechResultAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechEvent {
  results: { length: number; [i: number]: SpeechResult };
}
interface SpeechRecognizer {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type RecognizerCtor = new () => SpeechRecognizer;

function getRecognizer(): RecognizerCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognizerCtor;
    webkitSpeechRecognition?: RecognizerCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

/** How much of the target sentence actually made it out of your mouth. */
function overlap(target: string, said: string) {
  const want = clean(target);
  const got = new Set(clean(said));
  if (!want.length) return 0;
  const hit = want.filter((w) => got.has(w)).length;
  return Math.round((hit / want.length) * 100);
}

function feedbackFor(score: number) {
  if (score >= 80)
    return {
      tone: "#3e7c5a",
      title: "Said, not just chosen",
      body: "That is the sentence, out loud, at speed. The gap between knowing the line and being able to deliver it is where most learners freeze.",
    };
  if (score >= 45)
    return {
      tone: "#c2551f",
      title: "Most of it landed",
      body: "You carried the shape of the line. Try it once more without looking — in the real room you will not have the sentence in front of you.",
    };
  return {
    tone: "#b24c3c",
    title: "Something got lost on the way out",
    body: "Either the room was noisy or the sentence was. Slow it down and say the first four words as if the other person were standing there.",
  };
}

export function SpeakPractice({
  line,
  lang = "en-US",
  onDark = false,
}: {
  line: string;
  lang?: string;
  onDark?: boolean;
}) {
  const t = useT();
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [denied, setDenied] = useState(false);
  const recRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    setSupported(Boolean(getRecognizer()));
    return () => recRef.current?.stop();
  }, []);

  function start() {
    const Ctor = getRecognizer();
    if (!Ctor) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    setTranscript("");
    setScore(null);
    setDenied(false);

    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let said = "";
      for (let i = 0; i < e.results.length; i += 1) said += e.results[i][0].transcript;
      setTranscript(said.trim());
      if (e.results[e.results.length - 1]?.isFinal) {
        setScore(overlap(line, said));
      }
    };
    rec.onerror = () => {
      setDenied(true);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  const border = onDark ? "border-white/15" : "border-line";
  const muted = onDark ? "text-cream/60" : "text-mute";
  const result = score !== null ? feedbackFor(score) : null;

  return (
    <div className={`rounded-[1.1rem] border ${border} ${onDark ? "bg-white/5" : "bg-paper/60"} p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`eyebrow ${onDark ? "text-ember" : "text-clay"}`}>
          {t("Sekarang ucapkan", "Now say it out loud")}
        </p>
        {score !== null && (
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ color: result?.tone }}
          >
            {t(`${score}% dari kalimatnya`, `${score}% of the line`)}
          </span>
        )}
      </div>

      <p className={`mt-2 text-[14px] italic leading-snug ${onDark ? "text-cream" : "text-ink"}`}>
        “{line}”
      </p>

      {supported ? (
        <>
          <button
            onClick={start}
            className={`mt-3 flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${
              listening
                ? "bg-rose text-white"
                : onDark
                  ? "bg-cream text-ink hover:bg-white"
                  : "bg-ink text-cream hover:bg-espresso"
            }`}
          >
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z" strokeLinejoin="round" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
              </svg>
              {listening && (
                <m.span
                  className="absolute inset-0 rounded-full bg-white/40"
                  animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              )}
            </span>
            {listening
              ? t("Mendengarkan — ucapkan sekarang", "Listening — say the line now")
              : t("Tekan, lalu ucapkan kalimatnya", "Tap, then say the line out loud")}
          </button>

          <AnimatePresence>
            {(transcript || result) && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3"
              >
                {transcript && (
                  <p className={`text-[13px] leading-snug ${muted}`}>
                    <span className="font-semibold">{t("Terdengar: ", "Heard: ")}</span>“
                    {transcript}”
                  </p>
                )}
                {result && (
                  <div
                    className={`mt-2 rounded-[0.9rem] border-l-[3px] ${onDark ? "bg-white/5" : "bg-white"} p-3`}
                    style={{ borderLeftColor: result.tone }}
                  >
                    <p
                      className="text-[12px] font-bold uppercase tracking-[0.08em]"
                      style={{ color: result.tone }}
                    >
                      {result.title}
                    </p>
                    <p className={`mt-1 text-[13px] leading-relaxed ${onDark ? "text-cream/75" : "text-ink/80"}`}>
                      {result.body}
                    </p>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>

          {denied && (
            <p className={`mt-2 text-[12px] ${muted}`}>
              {t(
                "Mikrofonnya diblokir. Izinkan lewat bilah alamat, atau ucapkan saja kalimatnya keras-keras — yang penting latihannya, bukan skornya.",
                "The microphone was blocked. Allow it in the address bar, or simply say the line aloud — the practice is the point, not the score.",
              )}
            </p>
          )}
        </>
      ) : (
        <p className={`mt-3 text-[12.5px] leading-relaxed ${muted}`}>
          {t(
            "Browser ini tidak punya API mikrofon, jadi ucapkan sendiri kalimatnya sebelum lanjut — membaca kalimat dan mampu mengeluarkannya saat dibutuhkan itu dua keterampilan berbeda.",
            "This browser has no microphone API, so say the line aloud yourself before you continue — reading a sentence and being able to produce it in the moment are different skills.",
          )}
        </p>
      )}
    </div>
  );
}
