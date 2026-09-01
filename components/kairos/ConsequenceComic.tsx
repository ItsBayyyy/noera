"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Character } from "./Character";
import { HandArrow, ReactionMarks } from "./Ink";
import type { CharacterSpec, Expression } from "@/lib/kairos/types";
import { useT } from "@/lib/kairos/i18n";

/** The four beats every consequence runs through, named on the frames. */
const STEPS = [
  { label: "Your choice", color: "#1c1512" },
  { label: "Their reaction", color: "#c2551f" },
  { label: "The consequence", color: "#b24c3c" },
  { label: "The next scene", color: "#3d6b8c" },
];

/* Four frames, one sentence apart. The same request, two ways of asking —
   the strip exists to show that consequence is not a score, it is a story
   that keeps going after you stop talking. */

const NPC: CharacterSpec = {
  skin: "#f0d3ba",
  hair: "#a8562f",
  hairStyle: "bob",
  outfit: "#3e7c5a",
  collar: "#f4ede1",
};

interface Frame {
  caption: string;
  line: string;
  speaker: "you" | "her" | "narrator";
  expression: Expression;
  trust: number;
}

const BRANCHES: Record<
  "direct" | "considered",
  { label: string; blurb: string; tone: string; frames: Frame[] }
> = {
  direct: {
    label: "Say it directly",
    blurb: "Grammatically perfect. Socially expensive.",
    tone: "#b24c3c",
    frames: [
      {
        caption: "Monday, 9:40",
        line: "Send me the file.",
        speaker: "you",
        expression: "surprised",
        trust: 78,
      },
      {
        caption: "One second later",
        line: "…Right now? I'm in the middle of something.",
        speaker: "her",
        expression: "confused",
        trust: 71,
      },
      {
        caption: "Tuesday",
        line: "She answers your messages, but only your messages.",
        speaker: "narrator",
        expression: "neutral",
        trust: 66,
      },
      {
        caption: "Next project",
        line: "You are not on the invite. Nobody explains why.",
        speaker: "narrator",
        expression: "disappointed",
        trust: 58,
      },
    ],
  },
  considered: {
    label: "Say it with the moment",
    blurb: "Same request. It arrives differently.",
    tone: "#3e7c5a",
    frames: [
      {
        caption: "Monday, 9:40",
        line: "When you get a minute — could you send the file over?",
        speaker: "you",
        expression: "warm",
        trust: 78,
      },
      {
        caption: "One second later",
        line: "Sure, give me ten minutes and it's yours.",
        speaker: "her",
        expression: "happy",
        trust: 84,
      },
      {
        caption: "Tuesday",
        line: "She sends the newer version before you ask.",
        speaker: "narrator",
        expression: "warm",
        trust: 88,
      },
      {
        caption: "Next project",
        line: "“Put them on my team.” You never hear her say it.",
        speaker: "narrator",
        expression: "happy",
        trust: 93,
      },
    ],
  },
};

export function ConsequenceComic() {
  const tx = useT();
  const [branch, setBranch] = useState<"direct" | "considered">("direct");
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const reduced = useReducedMotion();
  const data = BRANCHES[branch];

  // Kalau pengguna meminta gerak dikurangi, keempat panel langsung terbaca —
  // ceritanya tidak boleh bergantung pada urutan animasi.
  useEffect(() => {
    if (reduced) setStep(data.frames.length - 1);
  }, [reduced, branch, data.frames.length]);

  useEffect(() => {
    if (reduced) return;
    if (!inView) return;
    if (step >= data.frames.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 1900);
    return () => clearTimeout(t);
  }, [inView, step, data.frames.length]);

  function switchBranch(next: "direct" | "considered") {
    setBranch(next);
    setStep(0);
  }

  return (
    <div ref={ref}>
      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        {(Object.keys(BRANCHES) as ("direct" | "considered")[]).map((key) => (
          <button
            key={key}
            onClick={() => switchBranch(key)}
            className={`rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors ${
              branch === key
                ? "border-ink bg-ink text-cream"
                : "border-line bg-white text-ink hover:border-ink/40"
            }`}
          >
            {BRANCHES[key].label}
          </button>
        ))}
        <span className="text-[13.5px] italic text-mute">{data.blurb}</span>
      </div>

      {/* Di ponsel panel-panel ini digulir mendatar dan isinya cuma teks —
          tidak ada elemen yang bisa difokus, jadi pengguna keyboard tidak bisa
          menggulirnya sama sekali (axe: scrollable-region-focusable, serius).
          tabIndex membuat wadahnya bisa difokus dan digulir dengan panah. */}
      <div
        tabIndex={0}
        role="group"
        aria-label={tx("Empat panel akibat, gulir mendatar", "Four consequence panels, scroll horizontally")}
        className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {data.frames.map((frame, i) => {
          const reached = i <= step;
          const prevTrust = i === 0 ? frame.trust : data.frames[i - 1].trust;
          const delta = frame.trust - prevTrust;
          return (
            <div key={`${branch}-${i}`} className="relative w-[76vw] shrink-0 sm:w-auto">
              {i < data.frames.length - 1 && (
                <span className="pointer-events-none absolute -right-[30px] top-[45%] z-10 hidden lg:block">
                  <HandArrow direction="right" color="#7a6a5c" length={28} delay={0.2} />
                </span>
              )}
            <m.figure
              animate={{
                opacity: reached ? 1 : 0.32,
                y: reached ? 0 : 10,
                filter: reached ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
              className="grain relative w-full snap-start overflow-hidden rounded-[1.4rem] border-2 border-ink bg-white"
            >
              <div className="border-b-2 border-ink bg-paper px-3.5 py-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: STEPS[i].color }}
                  >
                    {STEPS[i].label}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.08em] text-mute">
                  {frame.caption}
                </span>
              </div>

              <div className="relative flex h-[168px] items-end justify-center overflow-hidden bg-parchment/50">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(90% 70% at 50% 100%, rgba(255,107,53,0.14), transparent 70%)",
                  }}
                />
                <div className="relative">
                  {reached && <ReactionMarks expression={frame.expression} />}
                  <Character
                    spec={NPC}
                    expression={reached ? frame.expression : "idle"}
                    talking={reached && frame.speaker === "her"}
                    size={150}
                    className="h-auto w-[150px]"
                  />
                </div>
              </div>

              <figcaption className="border-t-2 border-ink px-4 py-3.5">
                <p className="eyebrow text-mute">
                  {frame.speaker === "you"
                    ? "You"
                    : frame.speaker === "her"
                      ? "Anja"
                      : "Later"}
                </p>
                <p
                  className={`mt-1.5 text-[14px] leading-[1.5] ${
                    frame.speaker === "narrator" ? "italic text-ink/70" : "text-ink"
                  }`}
                >
                  {frame.speaker === "narrator" ? frame.line : `“${frame.line}”`}
                </p>

                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                  <span className="eyebrow text-mute">Trust</span>
                  <span className="font-mono text-[13px] font-bold tabular-nums text-ink">
                    {reached ? frame.trust : "--"}
                  </span>
                  {reached && delta !== 0 && (
                    <m.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        delta > 0 ? "bg-sage/12 text-sage" : "bg-rose/12 text-rose"
                      }`}
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}
                    </m.span>
                  )}
                  <span className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-parchment">
                    <m.span
                      className="block h-full rounded-full"
                      style={{ background: data.tone }}
                      animate={{ width: reached ? `${frame.trust}%` : "0%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </span>
                </div>
              </figcaption>
            </m.figure>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          onClick={() => setStep(0)}
          className="min-h-[44px] rounded-full border border-line bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
        >
          ↺ Replay the scene
        </button>
        <p className="text-[13px] text-mute">
          Nobody told you what went wrong. That is exactly how it works outside.
        </p>
      </div>
    </div>
  );
}
