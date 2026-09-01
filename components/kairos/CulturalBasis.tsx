"use client";

import { useT } from "@/lib/kairos/i18n";
import type { Scenario } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   "Kenapa reaksinya begitu?"

   Kairos menilai kecocokan budaya, jadi ia harus bisa menjawab dari mana
   penilaian itu datang. Tanpa ini, satu-satunya pertanyaan juri yang tidak
   punya jawaban adalah: "kalian tahu dari mana ini bukan stereotip?"

   Tiga hal yang dilakukan blok ini, dan hanya tiga:
   1. menyebut variabel sosial yang sedang bekerja di adegan ini
   2. memindahkan sebabnya dari "bangsa" ke "hubungan + situasi"
   3. menyebut kerangka rujukannya, sekali, dengan suara pelan

   Bukan disclaimer hukum. Bukan halaman sitasi. Ia tertutup secara bawaan,
   pakai <details> asli supaya bisa dibuka keyboard tanpa JS sama sekali.
   -------------------------------------------------------------------------- */

export function CulturalBasis({ scenario }: { scenario: Scenario }) {
  const t = useT();

  // Faktornya diambil dari data adegan yang memang sudah ada — bukan daftar
  // umum yang sama untuk semua skenario.
  const factors = [
    scenario.tension,
    scenario.npc.role,
    scenario.npc.relationship >= 70
      ? t("hubungan yang sudah hangat", "an already-warm relationship")
      : scenario.npc.relationship >= 50
        ? t("hubungan yang masih baru", "a relationship still forming")
        : t("hubungan yang sedang renggang", "a relationship under strain"),
  ];

  return (
    <details className="group mt-3">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-[12.5px] font-semibold text-clay [&::-webkit-details-marker]:hidden">
        <span className="underline underline-offset-4">
          {t("Kenapa reaksinya begitu?", "Why did it land that way?")}
        </span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          aria-hidden
          className="shrink-0 transition-transform group-open:rotate-90 motion-reduce:transition-none"
        >
          <path
            d="M4 2 L8 6 L4 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="mt-1 border-l-2 border-line pl-4">
        <p className="eyebrow text-mute">
          {t("Yang bekerja di adegan ini", "What is at work in this scene")}
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          {factors.map((f) => (
            <li key={f} className="text-[12.5px] text-ink/75">
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[13px] leading-[1.6] text-ink/80">
          {t(
            `Kalimat yang langsung bisa terdengar tegas atau justru dingin — yang menentukan bukan negaranya, tapi jarak sosial, siapa yang punya posisi lebih tinggi, dan sudah sedekat apa kalian. Ubah salah satunya, reaksinya ikut berubah.`,
            `Direct language can read as clear or as cold — what decides it is not the country but social distance, who holds more standing, and how well you already know each other. Change one of those and the reaction changes.`,
          )}
        </p>

        <p className="mt-2 text-[12.5px] leading-[1.55] text-mute">
          {t(
            `Jadi ini kecenderungan yang sering muncul dalam hubungan seperti ini di ${scenario.city} — bukan aturan tentang semua orang ${scenario.region}. Orang yang berbeda di ruangan yang sama bisa membacanya lain.`,
            `So this is a tendency that often shows up in relationships like this one in ${scenario.city} — not a rule about everyone from ${scenario.region}. A different person in the same room may read it differently.`,
          )}
        </p>

        <p className="mt-2.5 text-[11.5px] leading-[1.5] text-mute">
          {t("Kerangka rujukan", "Frameworks")}: Brown &amp; Levinson,{" "}
          <i>Politeness Theory</i> (1987) · Meyer, <i>The Culture Map</i> (2014).{" "}
          {t(
            "Adegannya ditulis sebagai bahan latihan dari kerangka itu, bukan hasil survei.",
            "The scenes are written as practice material built on those frameworks, not survey data.",
          )}
        </p>
      </div>
    </details>
  );
}
