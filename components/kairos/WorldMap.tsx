"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { DESTINATIONS, SCENARIOS, TIERS } from "@/lib/kairos/data";
import { Character } from "./Character";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import { Flag } from "./Flag";
import { HandNote } from "./Ink";

/* A journey, not an atlas. Each stop is a social system rather than a
   destination, so the map is a hand-drawn route between situations — geography
   would only invite the wrong reading (tourism). */

/* Rute yang dijalani, bukan data yang diplot.

   Dua hal yang dulu membuatnya terbaca sebagai grafik: tiga garis bantu
   mendatar di belakangnya, dan perhentian yang jaraknya nyaris sama rata di
   sumbu X sehingga sisanya cuma naik-turun. Garis bantunya sudah dihapus, dan
   koordinat perhentiannya (lib/kairos/data.ts) diatur ulang supaya rutenya
   mengembara — termasuk sekali berbalik ke kiri di Jakarta.

   Jalur ini lewat TEPAT di atas keenam perhentian itu. Kalau koordinat di
   data.ts diubah, kurva di sini harus ikut diubah. */
/* viewBox-nya 200x100, sama dengan perbandingan kotaknya (16/8), supaya
   penskalaannya seragam.

   Sebelumnya viewBox 100x100 dipaksa masuk lewat preserveAspectRatio="none".
   Kombinasi itu dengan pathLength={1} dan non-scaling-stroke membuat panjang
   garis putus-putus yang ditulis Framer (stroke-dasharray: 1px 1px) tidak lagi
   sepadan dengan panjang jalur yang terlihat — ruas yang paling curam, Berlin→
   New York dan Seoul→Jakarta, hilang sama sekali dari layar.

   Koordinat X di bawah ini = koordinat persen di data.ts dikali dua. Kalau
   posisi perhentian di data.ts berubah, kurva ini harus ikut. */
const ROUTE =
  "M 8 78 C 12 76 18 73 24 70 C 34 62 44 44 60 34 C 72 27 88 22 104 22 C 120 22 136 33 144 42 C 150 52 136 64 116 68 C 132 74 156 70 172 72 C 180 73 188 76 194 74";

const tierIndex = (name: string) => TIERS.findIndex((t) => t.name === name);

export function WorldMap() {
  const [active, setActive] = useState(DESTINATIONS[0].id);
  const { tier, setStartScenario, hydrated } = useProgress();
  const t = useT();
  const tr = useTr();
  const selected = DESTINATIONS.find((d) => d.id === active) ?? DESTINATIONS[0];
  // Cuplikan adegan: siapa yang menunggu di kota itu, dan kalimat pembukanya.
  const scene = SCENARIOS.find((sc) => sc.id === selected.scenarioId);
  const opening =
    scene && typeof scene.beats[0].prompt === "string" ? scene.beats[0].prompt : null;
  // A stop opens when your communication maturity reaches it — the world is a
  // content progression, not decoration.
  const reached = hydrated ? tierIndex(tier.name) : 0;
  const isLocked = (unlocksAt: string) => tierIndex(unlocksAt) > reached;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-paper p-5 md:p-7">
        {/* route */}
        <div className="relative hidden aspect-[16/8] w-full md:block">
          {/* Tiga garis bantu mendatar yang dulu ada di sini sudah dihapus.
              Itu yang membuat panel ini terbaca sebagai grafik, bukan peta.
              preserveAspectRatio="none" juga dilepas supaya goresannya tidak
              ikut melar mengikuti kotak. */}
          <svg
            viewBox="0 0 200 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            {/* Digambar pakai .ink-scroll — sistem tinta CSS yang sudah dipakai
                seluruh situs ini, bukan animasi pathLength dari Framer.

                Framer menganimasikan pathLength dengan menulis
                stroke-dasharray/-offset sendiri, dan itu bentrok dengan
                pathLength={1} di sini: ruas-ruas paling curam berhenti
                tergambar. .ink-scroll memakai satu dasharray tetap, jadi
                jalurnya utuh — sekaligus otomatis diam kalau pengguna minta
                gerak dikurangi, dan tidak memakai JS sama sekali. */}
            <path
              className="ink-scroll"
              d={ROUTE}
              fill="none"
              stroke="#c94a12"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {DESTINATIONS.map((d, i) => {
            const isActive = d.id === active;
            // Label diletakkan di bawah penanda, kecuali Tokyo di pojok
            // kiri-bawah. Selang-seling ganjil-genap yang lama menaruh label
            // Jakarta persis di atas ruas Seoul→Jakarta, sehingga rutenya
            // tampak putus padahal cuma tertutup pil putih.
            const above = i === 0;
            return (
              <m.button
                key={d.id}
                onClick={() => setActive(d.id)}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.11, type: "spring", stiffness: 220, damping: 18 }}
                /* Titiknya tetap kecil, tapi area tapnya 44x44 lewat ::after —
                   sebelumnya cuma 17x17 di tablet. */
                className="absolute -translate-x-1/2 -translate-y-1/2 after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                aria-pressed={isActive}
              >
                {/* the marker sits exactly on the route; the label floats off it */}
                <span className="relative flex h-6 w-6 items-center justify-center">
                  {isActive && (
                    <m.span
                      className="absolute inset-0 rounded-full"
                      style={{ background: d.accent }}
                      animate={{ scale: [1, 2.1, 1], opacity: [0.28, 0, 0.28] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    />
                  )}
                  <span
                    className={`relative rounded-full border-2 border-ink transition-all ${
                      isActive ? "h-5 w-5" : "h-3.5 w-3.5"
                    }`}
                    style={{ background: isLocked(d.unlocksAt) ? "#f3ece1" : d.accent }}
                  />
                  <StationLabel
                    dest={d}
                    isActive={isActive}
                    className={`absolute left-1/2 -translate-x-1/2 ${
                      above ? "bottom-full mb-2" : "top-full mt-2"
                    }`}
                  />
                </span>
              </m.button>
            );
          })}
        </div>

        {/* Ponsel: rute yang sama, dibaca dari atas ke bawah.

            Sebelumnya bagian ini runtuh jadi enam kartu yang bentuknya persis
            sama — perjalanannya hilang. Sekarang garisnya benar-benar
            tersambung menurun di antara perhentian, dan tiap baris tidak
            berkotak: yang membedakan perhentian aktif adalah tebal tulisan dan
            penanda pada garis, bukan kotak baru. */}
        <ol className="relative md:hidden">
          {/* Garis rutenya menggambar sendiri saat digulir — CSS, tanpa JS,
              dan otomatis diam kalau pengguna minta gerak dikurangi. */}
          <svg
            className="pointer-events-none absolute left-[21px] top-3 h-[calc(100%-24px)] w-[10px] overflow-visible"
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="ink-scroll"
              d="M5 0 C 2 14, 8 26, 5 38 C 2 50, 8 62, 5 74 C 3 84, 6 92, 5 100"
              fill="none"
              stroke="#c94a12"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {DESTINATIONS.map((d) => {
            const isActive = d.id === active;
            const locked = isLocked(d.unlocksAt);
            return (
              <li key={d.id}>
                <button
                  onClick={() => setActive(d.id)}
                  aria-pressed={isActive}
                  className="flex w-full items-center gap-3 py-1.5 text-left"
                >
                  {/* penanda duduk tepat di atas garis */}
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                    <span
                      className={`rounded-full border-2 border-ink transition-all ${
                        isActive ? "h-[18px] w-[18px]" : "h-3 w-3"
                      }`}
                      style={{ background: locked ? "#f3ece1" : d.accent }}
                    />
                  </span>
                  <Flag code={d.flag} size={22} />
                  <span className="min-w-0">
                    <span
                      className={`block text-[15px] leading-tight ${
                        isActive ? "font-bold text-ink" : "font-semibold text-ink/70"
                      }`}
                    >
                      {d.city}
                    </span>
                    <span className="block text-[11.5px] leading-tight text-mute">
                      {tr(d.theme)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-4 hidden text-[12px] text-mute md:block">
          {t(
            "Enam perhentian, satu rute. Ketuk sebuah kota — masing-masing melatih naluri sosial yang berbeda.",
            "Six stops, one route. Tap a city — each trains a different social instinct.",
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          <m.div
            key={selected.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <Flag code={selected.flag} size={34} />
              <div>
                <h3 className="display text-[1.6rem] leading-none">{selected.city}</h3>
                <p
                  className="mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: selected.accent }}
                >
                  {tr(selected.theme)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{tr(selected.blurb)}</p>

            <div className="mt-4 border-t border-line pt-4">
              <p className="eyebrow text-mute">
                {t("Skenario yang melatihnya", "The scenario that teaches it")}
              </p>
              <p className="mt-1.5 text-[15px] font-bold text-ink">{tr(selected.scenarioTitle)}</p>

              {scene && opening && (
                <div className="mt-3 flex items-end gap-2.5">
                  <Character
                    spec={scene.npc.character}
                    expression="idle"
                    size={62}
                    still
                    className="h-auto w-[54px] shrink-0"
                  />
                  <span className="relative mb-1.5 rounded-[0.9rem] rounded-bl-[3px] border border-line bg-paper/70 px-3 py-2 text-[12.5px] italic leading-snug text-ink/75">
                    “{opening.length > 58 ? `${opening.slice(0, 56)}…` : opening}”
                  </span>
                </div>
              )}

              {/* Baris ini dulu berbunyi "+11 skenario lain di kota ini",
                  diambil dari metadata `scenarios` — padahal tiap kota hanya
                  punya satu percakapan yang benar-benar bisa dimainkan.
                  Diganti keterangan yang jujur tentang sifat ruangannya, tanpa
                  klaim jumlah. */}
              <p className="mt-2 text-[12px] leading-snug text-mute">
                {t(
                  "Percakapan penuh — akibatnya menetap setelah kamu keluar.",
                  "A full conversation — the consequence stays after you leave.",
                )}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span
                className={`eyebrow rounded-full px-3 py-1.5 ${
                  isLocked(selected.unlocksAt)
                    ? "bg-parchment text-mute"
                    : "bg-sage/12 text-sage"
                }`}
              >
                {isLocked(selected.unlocksAt)
                  ? t(`Terbuka di ${selected.unlocksAt}`, `Opens at ${selected.unlocksAt}`)
                  : t("Terbuka sekarang", "Open now")}
              </span>
              {isLocked(selected.unlocksAt) ? (
                <HandNote color="#6b5d50">
                  {t("ruang yang lebih sulit, nanti", "harder rooms, later")}
                </HandNote>
              ) : (
                <Link
                  href="/learn"
                  onClick={() => setStartScenario(selected.scenarioId)}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-espresso"
                >
                  {t("Masuk ke ruang ini →", "Enter this room →")}
                </Link>
              )}
            </div>
          </m.div>
        </AnimatePresence>

        <div className="hidden grid-cols-2 gap-2.5 md:grid">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`flex min-h-[44px] items-center gap-2 rounded-[1rem] border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                d.id === active
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-white text-ink hover:border-ink/35"
              }`}
            >
              <Flag code={d.flag} size={20} />
              {d.city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StationLabel({
  dest,
  isActive,
  className = "",
}: {
  dest: (typeof DESTINATIONS)[number];
  isActive: boolean;
  className?: string;
}) {
  const trLabel = useTr();
  return (
    <span
      className={`flex flex-col items-center whitespace-nowrap ${className}`}
    >
      <span
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-bold transition-colors ${
          isActive
            ? "border-ink bg-ink text-cream"
            : "border-line bg-white/85 text-ink"
        }`}
      >
        <Flag code={dest.flag} size={16} />
        {dest.city}
      </span>
      {/* the theme only shows for the active stop, so six labels never collide */}
      {isActive && (
        <m.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink"
        >
          {trLabel(dest.theme)}
        </m.span>
      )}
    </span>
  );
}
