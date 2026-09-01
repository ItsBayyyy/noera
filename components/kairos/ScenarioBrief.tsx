"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Listen } from "./Listen";
import { HandNote } from "./Ink";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import type { Scenario } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   READING — step 1 of a room.

   Before you walk in, you read the message that got you invited, and answer
   one question about what is *actually* being asked. Comprehension here is
   never vocabulary: it is subtext, intent and tone — the part of reading that
   decides how you should answer.
   -------------------------------------------------------------------------- */

export function ScenarioBrief({
  scenario,
  onEnter,
}: {
  scenario: Scenario;
  onEnter: () => void;
}) {
  const t = useT();
  const reduced = useReducedMotion();
  const tr = useTr();
  const { brief } = scenario;
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = brief.options.find((o) => o.id === picked) ?? null;

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-paper text-ink">
      <div className="relative z-10 grid lg:grid-cols-[1fr_1fr]">
        {/* --------------------------------------------------- the message */}
        <div className="border-b border-line px-6 py-7 lg:border-b-0 lg:border-r lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="eyebrow rounded-full bg-white px-3 py-1.5 text-clay">
              {t("Langkah 1 · Baca ruangannya", "Step 1 · Read the room")}
            </span>
            <Listen
              text={brief.body}
              region={scenario.flag}
              tone="light"
              label={t("Bacakan", "Read aloud")}
            />
          </div>

          {/* the message itself, on its own sheet */}
          <m.article
            initial={{ opacity: 0, y: 10, rotate: -0.4 }}
            animate={{ opacity: 1, y: 0, rotate: -0.4 }}
            transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
            className="mt-4 rounded-[1.2rem] border border-line bg-white p-5 shadow-[0_10px_30px_rgba(28,21,18,0.07)]"
          >
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <p className="text-[13.5px] font-bold text-ink">{brief.from}</p>
              <p className="font-mono text-[11px] text-mute">{brief.channel}</p>
            </div>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.66] text-ink/85">
              {brief.body}
            </p>
          </m.article>

          <HandNote className="mt-3" color="#6b5d50">
            {t(
              "yang diminta tidak selalu yang tertulis",
              "what is being asked is not always what is written",
            )}
          </HandNote>
        </div>

        {/* ------------------------------------------------ comprehension */}
        <div className="px-6 py-7 lg:px-8">
          <p className="eyebrow text-mute">
            {t("Pemahaman bacaan", "Reading comprehension")}
          </p>
          <h3 className="display mt-2 text-[1.35rem] leading-[1.22]">
            {tr(brief.question)}
          </h3>

          <div className="mt-4 space-y-2.5">
            {brief.options.map((opt, i) => {
              const isPicked = picked === opt.id;
              const revealed = picked !== null;
              return (
                <m.button
                  key={opt.id}
                  onClick={() => setPicked(opt.id)}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={!revealed ? { x: 4 } : undefined}
                  className={`flex w-full items-start gap-3 rounded-[1.1rem] border p-3.5 text-left transition-colors ${
                    isPicked
                      ? opt.correct
                        ? "border-sage bg-sage/8"
                        : "border-clay bg-clay/8"
                      : revealed && opt.correct
                        ? "border-sage/50 bg-white"
                        : "border-line bg-white hover:border-ink/35"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold ${
                      isPicked
                        ? opt.correct
                          ? "border-sage bg-sage text-white"
                          : "border-clay bg-clay text-white"
                        : "border-line text-mute"
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="text-[14.5px] leading-snug">{tr(opt.text)}</span>
                </m.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {chosen ? (
              <m.div
                key={chosen.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                className="mt-5"
              >
                <div
                  className="rounded-[1.1rem] border-l-[4px] bg-white p-4"
                  style={{ borderLeftColor: chosen.correct ? "#3e7c5a" : "#c2551f" }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: chosen.correct ? "#3e7c5a" : "#c2551f" }}
                  >
                    {chosen.correct
                      ? t("Itu bacaan yang tepat", "That is the reading")
                      : t(
                          "Bacaan yang umum — tapi bukan yang ini",
                          "A common reading — but not this one",
                        )}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.62] text-ink/85">
                    {tr(chosen.note)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <m.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onEnter}
                    className="rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-cream transition-colors hover:bg-espresso"
                  >
                    {t("Masuk ke ruangannya →", "Walk into the room →")}
                  </m.button>
                  {!chosen.correct && (
                    <button
                      onClick={() => setPicked(null)}
                      className="rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-mute transition-colors hover:border-ink/40 hover:text-ink"
                    >
                      {t("Baca ulang", "Read it again")}
                    </button>
                  )}
                </div>
              </m.div>
            ) : (
              <m.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4"
              >
                <p className="flex-1 text-[13px] leading-relaxed text-mute">
                  {t(
                    "Jawab dulu sebelum masuk — cara kamu membaca pesan ini menentukan kalimat mana yang nanti terasa pas.",
                    "Answer before you go in — how you read this message decides which sentence will fit once you are standing there.",
                  )}
                </p>
                <button
                  onClick={onEnter}
                  className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] text-[12.5px] font-semibold text-mute underline underline-offset-4 hover:text-ink"
                >
                  {t("Langsung ke percakapan", "Skip to the conversation")}
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
