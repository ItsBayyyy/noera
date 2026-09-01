"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { Character } from "./Character";
import { Flag } from "./Flag";
import { ReactionMarks } from "./Ink";
import { DESTINATIONS, TIERS } from "@/lib/kairos/data";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";

/* --------------------------------------------------------------------------
   NAIK TINGKAT

   Satu-satunya momen di seluruh produk yang berhenti dan berkata: kamu
   berubah. Tanpa ini, enam atribut cuma angka yang bergeser diam-diam.
   Muncul sekali per tingkat, memberi tahu apa yang baru terbuka, lalu
   menyingkir.
   -------------------------------------------------------------------------- */

const CAST = [
  { skin: "#e8c39a", hair: "#2c2320", hairStyle: "crop" as const, outfit: "#3d6b8c", collar: "#f4ede1", glasses: true },
  { skin: "#8d5a3b", hair: "#241a16", hairStyle: "curls" as const, outfit: "#c2551f", collar: "#f4ede1" },
];

export function TierUp() {
  const { tier, score, progress, hydrated, markTierSeen } = useProgress();
  const t = useT();
  const tr = useTr();
  const [open, setOpen] = useState(false);

  const seenIndex = TIERS.findIndex((x) => x.name === progress.seenTier);
  const nowIndex = TIERS.findIndex((x) => x.name === tier.name);

  useEffect(() => {
    if (!hydrated) return;
    // Pengguna baru: catat tingkat awal tanpa perayaan.
    if (progress.seenTier === null) {
      markTierSeen(tier.name);
      return;
    }
    if (nowIndex > seenIndex) setOpen(true);
  }, [hydrated, nowIndex, seenIndex, progress.seenTier, tier.name, markTierSeen]);

  function close() {
    markTierSeen(tier.name);
    setOpen(false);
  }

  const opened = DESTINATIONS.filter((d) => d.unlocksAt === tier.name);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-5 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
        >
          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="grain relative w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-line bg-cream text-ink"
          >
            <div className="relative overflow-hidden bg-espresso px-6 pt-7 text-cream">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 80% at 50% 0%, rgba(255,177,120,0.28), transparent 65%)",
                }}
              />
              <div className="relative text-center">
                <p className="eyebrow text-ember">{t("Kamu berubah", "You changed")}</p>
                <m.h2
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.12, type: "spring", stiffness: 240, damping: 18 }}
                  className="display mt-2 text-[2.6rem] leading-none"
                >
                  {tier.name}
                </m.h2>
                <p className="mt-2 text-[14px] text-cream/70">{tr(tier.description)}</p>
              </div>

              <div className="relative mt-4 flex items-end justify-center gap-1">
                {CAST.map((spec, i) => (
                  <div key={i} className="relative">
                    <ReactionMarks expression="happy" />
                    <Character
                      spec={spec}
                      expression="happy"
                      size={i === 0 ? 132 : 118}
                      className={`h-auto ${i === 0 ? "w-[116px]" : "w-[104px] scale-x-[-1]"}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6">
              {/* tangga tingkat */}
              <div className="flex items-center gap-1.5">
                {TIERS.map((x, i) => (
                  <m.span
                    key={x.name}
                    initial={{ scaleX: i <= nowIndex ? 0.2 : 1, opacity: 0.4 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className={`h-[6px] flex-1 rounded-full ${
                      i <= nowIndex ? "bg-clay" : "bg-parchment"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[12px] uppercase tracking-[0.1em] text-mute">
                  {t("Skor komunikasi", "Communication score")}
                </span>
                <span className="font-mono text-[14px] font-bold tabular-nums">{score}</span>
              </div>

              <div className="mt-5 rounded-[1.1rem] border border-line bg-white p-4">
                <p className="eyebrow text-clay">{t("Yang terbuka sekarang", "What opens now")}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{tr(tier.unlocks)}</p>
              </div>

              {opened.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-3 space-y-2"
                >
                  {opened.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-3 rounded-[1.1rem] border border-sage/40 bg-sage/8 px-4 py-3"
                    >
                      <Flag code={d.flag} size={24} />
                      <span className="flex-1">
                        <span className="block text-[14px] font-bold">
                          {t(`${d.city} terbuka`, `${d.city} is open`)}
                        </span>
                        <span className="block text-[12px] text-mute">{tr(d.theme)}</span>
                      </span>
                      <span className="eyebrow rounded-full bg-sage px-2.5 py-1 text-white">
                        {t("baru", "new")}
                      </span>
                    </div>
                  ))}
                </m.div>
              )}

              <button
                onClick={close}
                className="mt-6 w-full rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-cream transition-colors hover:bg-espresso"
              >
                {t("Lanjut ke ruang berikutnya", "On to the next room")}
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
