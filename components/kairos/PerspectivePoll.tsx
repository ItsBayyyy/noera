"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { Flag } from "./Flag";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import type { PerspectivePoll as Poll } from "@/lib/kairos/types";

/* "Same situation, different world."
   You must commit to an answer before the world is revealed — otherwise you
   read the majority and learn nothing about yourself. */

const KEY_COLOR: Record<string, string> = {
  A: "#c2551f",
  B: "#3d6b8c",
  C: "#3e7c5a",
};

export function PerspectivePoll({
  poll,
  compact = false,
  showRule = true,
}: {
  poll: Poll;
  compact?: boolean;
  /** Aturan "jawab dulu" berlaku untuk SEMUA jajak pendapat, bukan per kartu.
      Kalau dua kartu tampil berdampingan, kalimat yang sama muncul dua kali di
      satu layar — dan itu memperlihatkan komponennya, bukan desainnya. */
  showRule?: boolean;
}) {
  const t = useT();
  const tr = useTr();
  const [answer, setAnswer] = useState<string | null>(null);
  const [openRegion, setOpenRegion] = useState<string | null>(null);

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white">
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow text-clay">{t("Situasi yang sama", "The same situation")}</span>
          {answer && (
            <span className="eyebrow rounded-full bg-parchment px-3 py-1.5 text-mute">
              {t(`Kamu pilih ${answer}`, `You chose ${answer}`)}
            </span>
          )}
        </div>

        <h3 className="display mt-3 text-[1.5rem] leading-tight md:text-[1.9rem]">
          {tr(poll.scenario)}
        </h3>
        <p className="mt-2 text-[14px] text-mute">{tr(poll.setting)}</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {poll.options.map((opt) => {
            const picked = answer === opt.key;
            return (
              <m.button
                key={opt.key}
                onClick={() => setAnswer(opt.key)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-[1.1rem] border p-4 text-left transition-colors ${
                  picked
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-paper/60 hover:border-ink/35"
                }`}
              >
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: picked ? "#ff9d6b" : KEY_COLOR[opt.key] }}
                >
                  {opt.key}
                </span>
                <span className="mt-1 block text-[14px] leading-snug">{opt.line}</span>
                {/* Kosakata yang sama dengan pilihan di dalam skenario, supaya
                    jawaban komunitas terbaca sebagai pelajaran yang sama —
                    bukan sekadar jajak pendapat. */}
                {opt.dimension && (
                  <span
                    className={`mt-1.5 block text-[10.5px] font-bold uppercase tracking-[0.08em] ${
                      picked ? "text-cream/70" : "text-mute"
                    }`}
                  >
                    {tr(opt.dimension)}
                  </span>
                )}
              </m.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!answer ? (
            showRule ? (
            <m.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 border-t border-line pt-4 text-[13px] text-mute"
            >
              {t(
                "Jawab dulu. Dunia baru terbuka setelah kamu memutuskan — membaca suara terbanyak sebelum memilih tidak mengajarimu apa pun tentang nalurimu sendiri.",
                "Answer first. The world opens after you commit — reading the majority before deciding teaches you nothing about your own instinct.",
              )}
            </m.p>
            ) : null
          ) : (
            <m.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className="mt-6 border-t border-line pt-5"
            >
              <p className="eyebrow text-mute">
                {t("Jawaban 4.812 pelajar", "How 4,812 learners answered")}
              </p>

              <div className={`mt-4 space-y-3 ${compact ? "" : "md:space-y-4"}`}>
                {poll.regions.map((region, i) => {
                  const open = openRegion === region.region;
                  const majority = Object.entries(region.split).sort(
                    (a, b) => b[1] - a[1],
                  )[0];
                  const agrees = majority[0] === answer;
                  return (
                    <div key={region.region}>
                      <button
                        onClick={() => setOpenRegion(open ? null : region.region)}
                        className="flex w-full items-center gap-3 text-left"
                        aria-expanded={open}
                      >
                        <span className="flex w-[124px] shrink-0 items-center gap-2 text-[13.5px] font-semibold sm:w-[140px]">
                          <Flag code={region.flag} size={20} />
                          {tr(region.region)}
                        </span>
                        <span className="flex h-[26px] flex-1 overflow-hidden rounded-full border border-line">
                          {poll.options.map((opt, oi) => (
                            <m.span
                              key={opt.key}
                              initial={{ width: 0 }}
                              animate={{ width: `${region.split[opt.key] ?? 0}%` }}
                              transition={{
                                duration: 0.7,
                                delay: 0.1 * i + 0.06 * oi,
                                ease: [0.2, 0, 0, 1],
                              }}
                              className="flex items-center justify-center text-[10.5px] font-bold text-white/90"
                              style={{
                                background: KEY_COLOR[opt.key],
                                opacity: answer === opt.key ? 1 : 0.45,
                              }}
                            >
                              {(region.split[opt.key] ?? 0) >= 18
                                ? `${region.split[opt.key]}%`
                                : ""}
                            </m.span>
                          ))}
                        </span>
                        <span
                          className={`hidden w-[112px] shrink-0 text-right text-[11.5px] font-semibold sm:block ${
                            agrees ? "text-sage" : "text-rose"
                          }`}
                        >
                          {agrees
                            ? t("sepakat denganmu", "agrees with you")
                            : t("akan berbeda", "would differ")}
                        </span>
                      </button>

                      <AnimatePresence>
                        {open && (
                          <m.blockquote
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <span className="mt-2 block rounded-[1rem] bg-paper px-4 py-3 text-[13.5px] leading-relaxed text-ink/80">
                              “{tr(region.voice)}”
                              <span className="mt-1.5 block text-[12px] text-mute">
                                — {region.speaker}
                              </span>
                            </span>
                          </m.blockquote>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[12px] text-mute">
                {t(
                  "Ketuk salah satu wilayah untuk mendengar alasan mereka.",
                  "Tap a region to hear why they chose it.",
                )}
              </p>

              <div className="mt-5 rounded-[1.2rem] border-l-[4px] border-slateblue bg-paper p-4">
                <p className="eyebrow text-slateblue">
                  {t("Kenapa dunia tidak sepakat", "Why the world disagrees")}
                </p>
                <p className="mt-2 text-[14px] leading-[1.62] text-ink/85">
                  {tr(poll.explanation)}
                </p>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
