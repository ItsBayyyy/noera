"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Character } from "./Character";
import { Flag } from "./Flag";
import { HandArrow, HandNote, ReactionMarks } from "./Ink";
import { useT } from "@/lib/kairos/i18n";
import type { CharacterSpec, Expression } from "@/lib/kairos/types";

/* The 10-second explanation of the product, placed in the hero.
   Two sentences, both correct. One of them costs you something. */

const NPC: CharacterSpec = {
  skin: "#e8c39a",
  hair: "#2c2320",
  hairStyle: "crop",
  outfit: "#3d6b8c",
  collar: "#f4ede1",
  glasses: true,
};

const LEARNER: CharacterSpec = {
  skin: "#c98d63",
  hair: "#241a16",
  hairStyle: "curls",
  outfit: "#c2551f",
  collar: "#f4ede1",
};

/* Keduanya nyaris sempurna secara tata bahasa — itu justru intinya. Angka
   akurasi sengaja hampir sama supaya yang membedakan hasilnya terbaca jelas:
   bukan bahasanya, melainkan kecocokan sosialnya. */
const OPTIONS = [
  {
    id: "warm",
    line: "Of course — I'll have it to you by tonight.",
    acc: 97,
    fit: 94,
    rel: 5,
    reaction: "happy" as Expression,
    reply: "Thank you. That helps me a great deal.",
    noteId: "Informasi yang sama, tapi disertai kepastian yang bisa dia jadikan pegangan.",
    note: "Same information, delivered with a commitment he can plan around.",
  },
  {
    id: "flat",
    line: "Yeah, sure, whenever I get to it.",
    acc: 98,
    fit: 31,
    rel: -9,
    reaction: "disappointed" as Expression,
    reply: "…I see. I'll ask the office to follow up.",
    noteId: "Tata bahasanya sempurna. Dia cuma diam-diam berhenti mengandalkanmu.",
    note: "Perfect grammar. He just quietly stopped relying on you.",
  },
];

/* Satu sel angka. Akurasi bahasa sengaja tidak pernah diberi warna nilai:
   ia benar di kedua pilihan, jadi mewarnainya akan menyiratkan ia yang
   menentukan hasil. Yang berwarna hanya dua kolom yang benar-benar berubah. */
function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "netral" | "baik" | "buruk";
}) {
  const color =
    tone === "baik" ? "text-sage" : tone === "buruk" ? "text-rose" : "text-ink";
  /* Labelnya bisa satu atau dua baris tergantung lebar layar; angkanya
     didorong ke dasar sel supaya ketiganya tetap duduk di garis yang sama. */
  return (
    <div className="flex flex-col justify-between bg-white px-3 py-2.5">
      <p className="eyebrow text-mute">{label}</p>
      <p className={`display mt-1 text-[1.45rem] leading-none sm:text-[1.6rem] ${color}`}>
        {value}
      </p>
    </div>
  );
}

export function HeroExchange() {
  const t = useT();
  const [picked, setPicked] = useState<(typeof OPTIONS)[number] | null>(null);

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_18px_50px_rgba(28,21,18,0.10)]">
      <div className="relative z-10">
        {/* stage */}
        <div className="relative overflow-hidden bg-paper px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-parchment/60" />
          <div className="flex items-center justify-between">
            <span className="eyebrow inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-clay">
              <Flag code="JP" size={16} />
              {t("Tokyo · pertemuan pertama", "Tokyo · first meeting")}
            </span>
            <span className="eyebrow hidden text-mute sm:inline">
              {t("Contoh langsung", "Live example")}
            </span>
          </div>

          <div className="relative mt-3 flex items-end justify-between gap-2">
            {/* NPC side */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <m.div
                  key={picked ? picked.id : "prompt"}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative mb-2 ml-1 max-w-[24ch] rounded-[1.2rem] border border-line bg-white px-4 py-3 text-[14px] leading-snug shadow-[0_8px_20px_rgba(28,21,18,0.08)] sm:max-w-[30ch]"
                >
                  {picked ? picked.reply : "Could you send me the report?"}
                </m.div>
              </AnimatePresence>
              <span className="relative block">
                <ReactionMarks expression={picked ? picked.reaction : "idle"} />
                <Character
                  spec={NPC}
                  expression={picked ? picked.reaction : "idle"}
                  talking={!picked}
                  size={150}
                  className="h-auto w-[116px] sm:w-[150px]"
                />
              </span>
            </div>

            {/* learner side */}
            <div className="relative hidden sm:block">
              <AnimatePresence>
                {picked && (
                  <m.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 mr-1 ml-auto max-w-[26ch] rounded-[1.2rem] bg-ink px-4 py-3 text-[13.5px] leading-snug text-cream"
                  >
                    “{picked.line}”
                  </m.div>
                )}
              </AnimatePresence>
              <div className="scale-x-[-1]">
                <Character spec={LEARNER} expression={picked ? "warm" : "idle"} size={132} />
              </div>
            </div>

          </div>
        </div>

        {/* choices */}
        <div className="border-t border-line p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {!picked ? (
              <m.div key="opts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                  <p className="eyebrow text-mute">
                    {t("Keduanya benar secara tata bahasa", "Both are grammatically correct")}
                  </p>
                  <span className="flex items-center gap-1">
                    <span className="hand text-[17px] leading-none text-clay">
                      {t("pilih satu — lalu lihat wajahnya", "pick one — then watch his face")}
                    </span>
                    <HandArrow direction="down" color="#b04a19" length={26} delay={0.4} />
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {OPTIONS.map((o) => (
                    <m.button
                      key={o.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPicked(o)}
                      className="flex min-h-[44px] items-center rounded-[1.1rem] border border-line bg-paper/70 px-4 py-3 text-left text-[14px] leading-snug transition-colors hover:border-ink/40 hover:bg-white"
                    >
                      “{o.line}”
                    </m.button>
                  ))}
                </div>
              </m.div>
            ) : (
              <m.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Tiga bacaan sekaligus. Wajahnya sudah berubah sejak 0ms;
                    angkanya menyusul supaya dirasakan dulu, dibaca kemudian. */}
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.32, ease: [0.2, 0, 0, 1] }}
                  role="status"
                  aria-live="polite"
                  className="mb-3.5 grid grid-cols-3 gap-px overflow-hidden rounded-[1rem] border border-line bg-line"
                >
                  <Metric
                    label={t("Ketepatan bahasa", "Language accuracy")}
                    value={`${picked.acc}%`}
                    tone="netral"
                  />
                  <Metric
                    label={t("Kecocokan budaya", "Cultural fit")}
                    value={`${picked.fit}%`}
                    tone={picked.fit > 60 ? "baik" : "buruk"}
                  />
                  <Metric
                    label={t("Hubungan", "Relationship")}
                    value={`${picked.rel > 0 ? "+" : "−"}${Math.abs(picked.rel)}`}
                    tone={picked.rel > 0 ? "baik" : "buruk"}
                  />
                </m.div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="max-w-[44ch]">
                  <p className="text-[13.5px] leading-relaxed text-ink/80">
                    {t(picked.noteId, picked.note)}
                  </p>
                  <HandNote className="mt-1" color={picked.rel > 0 ? "#3e7c5a" : "#b24c3c"}>
                    {picked.rel > 0
                      ? t("ruangannya mencair", "the room relaxed")
                      : t(
                          "tata bahasa tidak pernah jadi masalahnya",
                          "grammar was never the problem",
                        )}
                  </HandNote>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPicked(null)}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-mute transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    {t("↺ Coba jawaban lain", "↺ Other reply")}
                  </button>
                  <Link
                    href="/learn"
                    className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-espresso"
                  >
                    {t("Lanjut ngobrol →", "Keep talking →")}
                  </Link>
                </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
