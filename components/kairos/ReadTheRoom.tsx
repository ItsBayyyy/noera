"use client";

import { AnimatePresence, m } from "framer-motion";
import { Character } from "./Character";
import { HandNote } from "./Ink";
import { useT } from "@/lib/kairos/i18n";
import type { CharacterSpec, Choice, Expression, Verdict } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   READ THE ROOM

   Sebelum memilih kalimat, pengguna menebak dulu reaksi apa yang akan ia
   pancing keluar. Baru setelah tebakannya terkunci, pilihan kalimatnya muncul.

   Kenapa ini BUKAN kuis pilihan ganda:

   Tidak ada kunci jawaban. Reaksi yang benar-benar terjadi ditentukan oleh
   kalimat yang DIPILIH pengguna sesudahnya — jadi ketiga tebakan bisa sama-sama
   benar, tergantung apa yang ia ucapkan. Yang diukur bukan "tahu jawabannya",
   tapi "tahu apa yang akan dilakukan kalimatnya sendiri".

   Tidak ada data baru yang perlu ditulis: ketiga pilihan di tiap giliran sudah
   punya `reaction` yang berbeda-beda. Itulah ketiga tebakannya.
   -------------------------------------------------------------------------- */

/** Label reaksi — deskriptif, bukan penilaian. Tidak ada "benar"/"salah". */
const FACE_LABEL: Record<Expression, { id: string; en: string }> = {
  happy: { id: "Dia lega", en: "Relieved" },
  warm: { id: "Dia menghangat", en: "Warmer with you" },
  neutral: { id: "Menerima, tapi datar", en: "Accepts it, flatly" },
  surprised: { id: "Dia terkejut", en: "Caught off guard" },
  confused: { id: "Dia bingung", en: "Unsure what you meant" },
  awkward: { id: "Dia jadi kikuk", en: "Made it awkward" },
  disappointed: { id: "Dia menarik diri", en: "Pulls back" },
  angry: { id: "Dia tersinggung", en: "Takes offence" },
  embarrassed: { id: "Dia salah tingkah", en: "Embarrassed" },
  idle: { id: "Tidak berubah", en: "Unchanged" },
};

const BAND: Record<Verdict, number> = { ideal: 2, workable: 1, costly: 0 };

export type ReadQuality = "read" | "partial" | "missed";

/** Seberapa dekat tebakan dengan yang benar-benar terjadi. */
export function gradeRead(
  predicted: Expression,
  predictedVerdict: Verdict,
  actual: Choice,
): ReadQuality {
  if (predicted === actual.reaction) return "read";
  if (BAND[predictedVerdict] === BAND[actual.verdict]) return "partial";
  return "missed";
}

/* Urutan tebakan diacak stabil per giliran, supaya posisi tidak membocorkan
   apa pun — tapi tetap sama tiap kali giliran itu dibuka. */
function stableOrder<T>(items: T[], seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* -------------------------------------------------------------- tebakan --- */

export function ReadTheRoom({
  beatId,
  choices,
  npc,
  onPredict,
}: {
  beatId: string;
  choices: Choice[];
  npc: { spec: CharacterSpec; name: string };
  onPredict: (expression: Expression, verdict: Verdict) => void;
}) {
  const t = useT();
  const options = stableOrder(
    choices.map((c) => ({ expression: c.reaction, verdict: c.verdict })),
    beatId,
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="eyebrow text-clay">{t("Baca ruangannya", "Read the room")}</p>
      <h4 className="display mt-1.5 text-[1.35rem] leading-tight">
        {t(
          `Sebelum menjawab — menurutmu ${npc.name} akan bereaksi bagaimana?`,
          `Before you answer — how do you think ${npc.name} will react?`,
        )}
      </h4>
      <p className="mt-1.5 text-[13px] leading-relaxed text-mute">
        {t(
          "Tebak dulu, baru kalimatnya muncul. Tidak ada jawaban yang benar di sini — yang menentukan reaksinya adalah kalimat yang kamu pilih setelah ini.",
          "Commit first, then the sentences appear. There is no right answer here — what decides the reaction is the sentence you pick next.",
        )}
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.expression}
            onClick={() => onPredict(o.expression, o.verdict)}
            className="flex min-h-[44px] flex-col items-center gap-2 rounded-[1.1rem] border border-line bg-white px-3 py-4 text-center transition-colors hover:border-ink/40"
          >
            <Character spec={npc.spec} expression={o.expression} still size={64} className="h-auto w-[52px]" />
            <span className="text-[13px] font-semibold leading-snug text-ink">
              {t(FACE_LABEL[o.expression].id, FACE_LABEL[o.expression].en)}
            </span>
          </button>
        ))}
      </div>

      <HandNote className="mt-3" color="#b04a19">
        {t("membaca ruangan lebih dulu, bukan menebak kata", "read the room first, not the words")}
      </HandNote>
    </m.div>
  );
}

/* -------------------------------------------------- tebakan yang terkunci --- */

export function PredictionChip({
  expression,
  npcSpec,
}: {
  expression: Expression;
  npcSpec: CharacterSpec;
}) {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 py-1 pl-1 pr-3">
      <Character spec={npcSpec} expression={expression} still size={30} className="h-auto w-[26px]" />
      <span className="text-[12px] font-semibold text-mute">
        {t("Tebakanmu: ", "You predicted: ")}
        <span className="text-ink">
          {t(FACE_LABEL[expression].id, FACE_LABEL[expression].en)}
        </span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------- hasilnya --- */

const VERDICT_COPY: Record<ReadQuality, { id: string; en: string }> = {
  read: {
    id: "Kamu tahu persis apa yang akan dilakukan kalimatmu. Itu bukan tebakan — itu membaca ruangan.",
    en: "You knew exactly what your sentence would do. That is not guessing — that is reading the room.",
  },
  partial: {
    id: "Arahnya kamu baca benar, tapi bukan persis reaksinya. Nadanya tertangkap; yang belum, seberapa jauh hubungan kalian menahannya.",
    en: "You read the direction right, but not the exact reaction. You caught the tone; what you missed is how much the relationship absorbs.",
  },
  missed: {
    id: "Kamu membaca kata-katanya. Konteksnya memberi sinyal lain — jarak dan posisi di ruangan ini menggeser arti kalimat yang sama.",
    en: "You read the words. The context was signalling something else — distance and standing shift what the same sentence means here.",
  },
};

const QUALITY_TONE: Record<ReadQuality, string> = {
  read: "#3e7c5a",
  partial: "#c2551f",
  missed: "#b24c3c",
};

/* Didefinisikan di tingkat modul: komponen yang dibuat ulang tiap render punya
   identitas baru setiap kali, sehingga React melepas dan memasang ulang seluruh
   subpohonnya. */
function Side({
  label,
  expression,
  npcSpec,
  dim,
}: {
  label: string;
  expression: Expression;
  npcSpec: CharacterSpec;
  dim?: boolean;
}) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <Character
        spec={npcSpec}
        expression={expression}
        still
        size={56}
        className={`h-auto w-[46px] ${dim ? "opacity-60" : ""}`}
      />
      <div>
        <p className="eyebrow text-mute">{label}</p>
        <p className={`mt-0.5 text-[13.5px] font-semibold ${dim ? "text-ink/65" : "text-ink"}`}>
          {t(FACE_LABEL[expression].id, FACE_LABEL[expression].en)}
        </p>
      </div>
    </div>
  );
}

export function ReadReveal({
  predicted,
  actual,
  quality,
  npcSpec,
  lang,
}: {
  predicted: Expression;
  actual: Choice;
  quality: ReadQuality;
  npcSpec: CharacterSpec;
  lang: "id" | "en";
}) {
  const t = useT();

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 rounded-[1.2rem] border border-line bg-paper/60 p-4"
      >
        <p className="eyebrow text-clay">{t("Yang terjadi", "What actually happened")}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Side
            label={t("Tebakanmu", "You predicted")}
            expression={predicted}
            npcSpec={npcSpec}
            dim
          />
          <span className="hidden text-mute sm:block" aria-hidden>
            →
          </span>
          <Side
            label={t("Yang terjadi", "What happened")}
            expression={actual.reaction}
            npcSpec={npcSpec}
          />
        </div>

        <div
          className="mt-4 border-l-2 pl-4"
          style={{ borderLeftColor: QUALITY_TONE[quality] }}
        >
          <p className="text-[14px] leading-[1.6] text-ink/85">
            {lang === "id" ? VERDICT_COPY[quality].id : VERDICT_COPY[quality].en}
          </p>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
