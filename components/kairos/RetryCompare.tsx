"use client";

import { m } from "framer-motion";
import { HandArrow, HandNote } from "./Ink";
import { useT } from "@/lib/kairos/i18n";
import type { Choice, Verdict } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   PERCOBAAN PERTAMA vs SEKARANG

   "Coba kalimat lain" sebelumnya hanya mengulang giliran tanpa menyimpan apa
   pun. Pengguna bisa memperbaiki jawabannya, tapi tidak pernah melihat APA
   yang berubah — dan itu bagian yang sebenarnya mengajar.

   Blok ini bukan "jawaban yang benar". Tidak ada kunci jawaban di Kairos.
   Yang ditampilkan: dua kalimat yang sama-sama benar tata bahasanya, dua arah
   hubungan yang berbeda, dan satu kalimat yang menyebut apa yang bergeser.
   -------------------------------------------------------------------------- */

const TONE: Record<Verdict, string> = {
  ideal: "#3e7c5a",
  workable: "#c2551f",
  costly: "#b24c3c",
};

/**
 * Apa yang sebenarnya berubah.
 *
 * Sengaja TIDAK menyisipkan label register ke dalam kalimat: labelnya ditulis
 * dalam bahasa Inggris ("Warm · deferential · specific") dan kalau ditempel ke
 * prosa Indonesia hasilnya jadi "tapi dengan warm".
 */
function whatChanged(before: { from: number; to: number }, nowTo: number, lang: "id" | "en") {
  const beforeDelta = before.to - before.from;
  const nowDelta = nowTo - before.from;
  const better = nowDelta > beforeDelta;
  const same = nowDelta === beforeDelta;

  if (lang === "id") {
    if (same)
      return "Dua-duanya mendarat di tempat yang sama. Bedanya ada di rasa, bukan di posisi — dan kadang memang begitu.";
    return better
      ? `Isinya sama persis. Yang berubah cuma cara menyampaikannya, dan itu yang menggeser hubungannya ${nowDelta - beforeDelta} poin lebih jauh — bukan tata bahasanya, yang dari tadi memang sudah benar.`
      : `Yang pertama justru lebih pas untuk ruangan ini. Isinya tetap sama, tapi cara yang ini harganya ${Math.abs(nowDelta - beforeDelta)} poin.`;
  }
  if (same)
    return "Both landed in the same place. The difference is in how it felt, not where it left you — and sometimes that is the honest answer.";
  return better
    ? `The content is identical. Only the delivery changed, and that is what moved the relationship ${nowDelta - beforeDelta} points further — not the grammar, which was fine both times.`
    : `The first one fitted this room better. Same content, but this delivery costs ${Math.abs(nowDelta - beforeDelta)} points.`;
}

/* Didefinisikan di tingkat modul, bukan di dalam RetryCompare — komponen yang
   dibuat ulang tiap render punya identitas baru tiap kali dan memaksa React
   melepas lalu memasang ulang seluruh subpohonnya. */
function Row({
  label,
  line,
  register,
  from,
  to,
  verdict,
  faded,
}: {
  label: string;
  line: string;
  register: string;
  from: number;
  to: number;
  verdict: Verdict;
  faded?: boolean;
}) {
  return (
    <div
      className={`border-l-2 pl-4 ${faded ? "border-line" : ""}`}
      style={faded ? undefined : { borderLeftColor: TONE[verdict] }}
    >
      <p className="eyebrow text-mute">{label}</p>
      <p className={`mt-1 text-[14px] leading-snug ${faded ? "text-ink/60" : "text-ink"}`}>
        “{line}”
      </p>
      <p className="mt-1 text-[11.5px] uppercase tracking-[0.08em] text-mute">{register}</p>
      <p className="mt-1.5 flex items-center gap-2 font-mono text-[13px] text-ink">
        {from}
        <span className="text-mute">→</span>
        <span style={{ color: TONE[verdict] }}>{to}</span>
        <HandArrow direction={to >= from ? "up" : "down"} color={TONE[verdict]} length={22} />
      </p>
    </div>
  );
}

export function RetryCompare({
  before,
  now,
  nowTo,
  lang,
}: {
  before: { line: string; register: string; verdict: Verdict; from: number; to: number };
  now: Choice;
  nowTo: number;
  lang: "id" | "en";
}) {
  const t = useT();
  const beforeDelta = before.to - before.from;
  const nowDelta = nowTo - before.from;

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-4 rounded-[1.2rem] border border-line bg-paper/60 p-4"
    >
      <p className="eyebrow text-clay">
        {t("Kalimat yang sama, dikatakan dua cara", "The same thing, said two ways")}
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Row
          label={t("Percobaan pertama", "First attempt")}
          line={before.line}
          register={before.register}
          from={before.from}
          to={before.to}
          verdict={before.verdict}
          faded
        />
        <Row
          label={t("Sekarang", "This time")}
          line={now.line}
          register={now.register}
          from={before.from}
          to={nowTo}
          verdict={now.verdict}
        />
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="eyebrow text-mute">{t("Yang berubah", "What changed")}</p>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-ink/85">
          {whatChanged(before, nowTo, lang)}
        </p>
        <HandNote className="mt-1.5" color={nowDelta > beforeDelta ? "#3e7c5a" : "#b04a19"}>
          {nowDelta > beforeDelta
            ? t("tata bahasanya tidak berubah sedikit pun", "the grammar never changed")
            : t("dua-duanya benar. cuma satu yang pas", "both are correct. only one fits")}
        </HandNote>
      </div>
    </m.div>
  );
}
