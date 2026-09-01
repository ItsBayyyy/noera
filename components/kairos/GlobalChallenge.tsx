"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Character } from "./Character";
import { Flag } from "./Flag";
import { HandCircle, HandNote, ReactionMarks } from "./Ink";
import { GLOBAL_CHALLENGE, count } from "@/lib/kairos/data";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";

/* --------------------------------------------------------------------------
   GLOBAL CHALLENGE

   Every learner gets the same three seconds. You answer first — then the
   world opens. The splits are what the people who answered chose, never a
   claim about who anyone is.
   -------------------------------------------------------------------------- */

const KEY_COLOR: Record<string, string> = {
  A: "#c2551f",
  B: "#3d6b8c",
  C: "#3e7c5a",
};

export function GlobalChallenge({ compact = false }: { compact?: boolean }) {
  const c = GLOBAL_CHALLENGE;
  const { progress, answerChallenge, hydrated } = useProgress();
  const t = useT();
  const reduced = useReducedMotion();
  const tr = useTr();
  const [showRegions, setShowRegions] = useState(false);
  const answer = hydrated ? progress.challengeAnswer : null;
  const picked = c.options.find((o) => o.key === answer) ?? null;

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white text-ink">
      <div className="relative z-10 grid lg:grid-cols-[0.85fr_1fr]">
        {/* ------------------------------------------------------ the room */}
        <div className="relative flex flex-col justify-between border-b border-line bg-paper px-6 py-7 lg:border-b-0 lg:border-r lg:px-7">
          <div>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-clay">
              <span className="relative flex h-1.5 w-1.5">
                <m.span
                  className="absolute inline-flex h-full w-full rounded-full bg-clay"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              {t("Tantangan global minggu ini", "This week's global challenge")}
            </span>
            <h3 className="display mt-4 text-[1.6rem] leading-[1.12] md:text-[1.95rem]">
              {tr(c.situation)}
            </h3>
            <p className="hand mt-2 text-[17px] text-mute">{tr(c.stage)}</p>
          </div>

          <div className="relative mt-6 flex items-end gap-3">
            <div className="relative shrink-0">
              <ReactionMarks expression={picked ? picked.reaction : "idle"} />
              <Character
                spec={c.npc.character}
                expression={picked ? picked.reaction : "warm"}
                talking={!picked}
                size={140}
                className="h-auto w-[120px] sm:w-[140px]"
              />
            </div>
            <div className="mb-4 flex-1">
              <div className="relative rounded-[1.2rem] border border-line bg-white px-4 py-3 text-[14px] leading-snug shadow-[0_8px_20px_rgba(28,21,18,0.06)]">
                {c.prompt}
                <svg viewBox="0 0 24 18" className="absolute -bottom-[13px] left-6 h-[14px] w-[20px]" aria-hidden>
                  <path d="M2 0 C 8 2 12 8 14 17 C 16 8 20 3 23 0 Z" fill="#fff" stroke="#e2d7c7" strokeWidth="1" />
                </svg>
              </div>
              <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-mute">
                {c.npc.name} · {tr(c.npc.role)}
              </p>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- the answers */}
        <div className="px-6 py-7 lg:px-8">
          <AnimatePresence mode="wait">
            {!answer ? (
              <m.div key="options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                <p className="eyebrow text-mute">
                  {t("Kamu benar-benar akan bilang apa?", "What would you actually say?")}
                </p>
                <div className="mt-4 space-y-2.5">
                  {c.options.map((opt, i) => (
                    <m.button
                      key={opt.key}
                      onClick={() => answerChallenge(opt.key)}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.985 }}
                      className="group flex w-full items-start gap-3 rounded-[1.2rem] border border-line bg-paper/60 p-4 text-left transition-colors hover:border-ink/40 hover:bg-white"
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[12px] font-bold transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-cream"
                        style={{ color: KEY_COLOR[opt.key] }}
                      >
                        {opt.key}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium leading-snug text-ink">
                          {opt.line}
                        </span>
                        <span className="mt-1 block text-[11.5px] uppercase tracking-[0.1em] text-mute">
                          {tr(opt.register)}
                        </span>
                      </span>
                    </m.button>
                  ))}
                </div>
                <p className="mt-4 border-t border-line pt-4 text-[13px] text-mute">
                  {t(
                    `Jawab dulu sebelum melihat. ${count(c.responders)} pelajar dari ${c.regionCount} wilayah sudah melewati tiga detik yang sama.`,
                    `Answer before you look. ${count(c.responders)} learners across ${c.regionCount} regions have already taken these three seconds.`,
                  )}
                </p>
              </m.div>
            ) : (
              <m.div
                key="results"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow text-mute">{t("Jawabanmu", "Your answer")}</p>
                  <button
                    onClick={() => answerChallenge("")}
                    className="text-[12.5px] font-semibold text-mute underline underline-offset-4 hover:text-ink"
                  >
                    {t("Jawab ulang", "Answer again")}
                  </button>
                </div>

                <div className="mt-3">
                  <HandCircle color={KEY_COLOR[answer]}>
                    <span className="block rounded-[1rem] border border-line bg-paper/70 px-4 py-3 text-[14.5px] leading-snug text-ink">
                      {picked?.line}
                    </span>
                  </HandCircle>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-mute">
                  <span className="font-semibold text-ink">
                    {t("Yang dijaga jawaban ini: ", "What this protects: ")}
                  </span>
                  {tr(picked?.reading)}
                </p>

                {/* global split */}
                <p className="eyebrow mt-6 text-mute">
                  {t("Bagaimana semua orang menjawab", "How everyone answered")}
                </p>
                <div className="mt-3 space-y-2.5">
                  {c.options.map((opt, i) => {
                    const pct = c.global[opt.key];
                    const mine = opt.key === answer;
                    return (
                      <div key={opt.key} className="flex items-center gap-3">
                        <span
                          className="w-4 shrink-0 font-mono text-[12px] font-bold"
                          style={{ color: KEY_COLOR[opt.key] }}
                        >
                          {opt.key}
                        </span>
                        <span className="h-[26px] flex-1 overflow-hidden rounded-full bg-parchment">
                          <m.span
                            className="flex h-full items-center justify-end rounded-full pr-3 text-[11px] font-bold text-white"
                            style={{ background: KEY_COLOR[opt.key], opacity: mine ? 1 : 0.55 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.2, 0, 0, 1] }}
                          >
                            {pct}%
                          </m.span>
                        </span>
                        {mine && (
                          <span className="hand text-[16px] text-clay">
                            {t("kamu", "you")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* regional split */}
                <button
                  onClick={() => setShowRegions((v) => !v)}
                  className="mt-5 flex w-full items-center justify-between rounded-[1rem] border border-line bg-paper/60 px-4 py-3 text-left transition-colors hover:border-ink/35"
                  aria-expanded={showRegions}
                >
                  <span>
                    <span className="block text-[13.5px] font-bold text-ink">
                      {t("Jawaban per wilayah", "Responses by region")}
                    </span>
                    <span className="block text-[12px] text-mute">
                      {t(
                        "Kecenderungan pelajar yang menjawab — bukan aturan tentang siapa pun.",
                        "Tendencies among learners who answered — not rules about anyone.",
                      )}
                    </span>
                  </span>
                  <span className="text-[18px] text-mute">{showRegions ? "−" : "+"}</span>
                </button>

                <AnimatePresence>
                  {showRegions && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3">
                        {c.regions.map((r, i) => (
                          <div key={r.region}>
                            <div className="flex items-center gap-3">
                              <span className="flex w-[132px] shrink-0 items-center gap-2 text-[13px] font-semibold">
                                <Flag code={r.flag} size={19} />
                                {tr(r.region)}
                              </span>
                              <span className="flex h-[20px] flex-1 overflow-hidden rounded-full border border-line">
                                {c.options.map((opt, oi) => (
                                  <m.span
                                    key={opt.key}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${r.split[opt.key] ?? 0}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.07 + oi * 0.04 }}
                                    style={{
                                      background: KEY_COLOR[opt.key],
                                      opacity: opt.key === answer ? 1 : 0.4,
                                    }}
                                  />
                                ))}
                              </span>
                            </div>
                            <p className="mt-1 pl-[144px] text-[12px] leading-snug text-mute">
                              {tr(r.note)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {!compact && (
                  <div className="mt-5 rounded-[1.2rem] border-l-[4px] border-slateblue bg-paper p-4">
                    <p className="eyebrow text-slateblue">
                      {t("Apa arti sebaran ini", "What the split actually means")}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.62] text-ink/85">
                      {tr(c.reflection)}
                    </p>
                  </div>
                )}

                <HandNote className="mt-4" color="#6b5d50">
                  {t(
                    "tiga detik yang sama · dibaca berbeda",
                    "same three seconds · read differently",
                  )}
                </HandNote>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
