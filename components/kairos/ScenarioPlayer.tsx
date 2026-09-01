"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Character } from "./Character";
import { Flag } from "./Flag";
import { HandCircle, HandNote, HandRule, ReactionMarks } from "./Ink";
import { RelationshipMeter, ScoreMeter } from "./Meters";
import { Listen } from "./Listen";
import { SpeakPractice } from "./SpeakPractice";
import { ScenarioBrief } from "./ScenarioBrief";
import { ATTRIBUTES } from "@/lib/kairos/data";
import { useLang, useT } from "@/lib/kairos/i18n";
import { CulturalBasis } from "./CulturalBasis";
import { DeliveryReflection } from "./DeliveryReflection";
import { RetryCompare } from "./RetryCompare";
import {
  PredictionChip,
  ReadReveal,
  ReadTheRoom,
  gradeRead,
  type ReadQuality,
} from "./ReadTheRoom";
import { LearningSpine, type Stage } from "./LearningSpine";
import { useTr } from "@/lib/kairos/id";
import type {
  AttributeKey,
  Beat,
  Choice,
  Expression,
  Scenario,
  Verdict,
} from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   A conversation, not a question.

   choice → reaction → consequence → the next line changes → it ends somewhere.
   The relationship you build in exchange one is the relationship you carry
   into exchange three. Nothing here is ever "correct" or "wrong".
   -------------------------------------------------------------------------- */

const VERDICT = {
  ideal: {
    id: "Nadanya pas dengan hubungannya",
    en: "The tone matched the relationship",
    color: "#3e7c5a",
    chip: "bg-sage/12 text-sage",
    noteId: "ruangannya mencair",
    noteEn: "the room relaxed",
  },
  workable: {
    id: "Selamat — tapi nyaris",
    en: "It survives — barely",
    color: "#c2551f",
    chip: "bg-clay/12 text-clay",
    noteId: "tidak ada yang rusak. tidak ada yang terbangun juga",
    noteEn: "nothing broke. nothing built, either",
  },
  costly: {
    id: "Benar secara tata bahasa, mahal secara sosial",
    en: "Technically correct, socially risky",
    color: "#b24c3c",
    chip: "bg-rose/12 text-rose",
    noteId: "tata bahasa tidak pernah jadi masalahnya",
    noteEn: "grammar was never the problem",
  },
} as const;

/* Dia masih membawa percakapan terakhir.

   Hubungan sudah tersimpan per skenario sejak dulu, tapi tidak pernah
   DIUCAPKAN. Akibatnya tiap kunjungan terasa seperti soal baru, bukan orang
   yang sama yang masih ingat. Kalimat ini yang mengubahnya. */
function memoryLine(from: number, base: number, lang: "id" | "en") {
  const d = from - base;
  if (Math.abs(d) < 3) return null;
  if (lang === "id") {
    if (d >= 12) return "Dia menyapa lebih dulu kali ini. Cara kamu menutup percakapan terakhir masih terbawa.";
    if (d >= 3) return "Dia terlihat lebih nyaman denganmu dibanding pertemuan sebelumnya.";
    if (d <= -12) return "Nadanya sopan, tapi menjaga jarak. Percakapan terakhir belum benar-benar selesai buat dia.";
    return "Setelah percakapan tadi, dia masih sedikit berhati-hati.";
  }
  if (d >= 12) return "He greets you first this time. How you closed the last conversation is still with him.";
  if (d >= 3) return "He seems more at ease with you than last time.";
  if (d <= -12) return "Polite, but keeping distance. The last conversation is not quite finished for him.";
  return "After the last conversation, he is still a little careful with you.";
}

function promptFor(beat: Beat, previous: Verdict | null) {
  if (typeof beat.prompt === "string") return beat.prompt;
  return beat.prompt[previous ?? "workable"];
}

function useTalking(line: string) {
  const [talking, setTalking] = useState(true);
  useEffect(() => {
    setTalking(true);
    const t = setTimeout(() => setTalking(false), 1500);
    return () => clearTimeout(t);
  }, [line]);
  return talking;
}

function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative max-w-[36ch] rounded-[1.4rem] border border-line bg-white px-5 py-4 text-[15px] leading-[1.5] text-ink shadow-[0_10px_30px_rgba(28,21,18,0.10)]"
    >
      {children}
      <svg viewBox="0 0 24 18" className="absolute -bottom-[15px] left-8 h-[16px] w-[22px]" aria-hidden>
        <path d="M2 0 C 8 2 12 8 14 17 C 16 8 20 3 23 0 Z" fill="#ffffff" stroke="#e2d7c7" strokeWidth="1" />
      </svg>
    </m.div>
  );
}

interface Exchange {
  beatId: string;
  said: string;
  reply: string;
  choice: Choice;
  relationshipAfter: number;
}

export function ScenarioPlayer({
  scenario,
  variant = "full",
  startingRelationship,
  onResolved,
  onRead,
  openQuestion,
  onNext,
  nextLabel = "Next scenario",
}: {
  scenario: Scenario;
  variant?: "full" | "demo";
  startingRelationship?: number;
  onResolved?: (choice: Choice, relationshipAfter: number) => void;
  onRead?: (quality: ReadQuality) => void;
  /** Sumbu yang belum pernah menguji pengguna, dihitung di halaman Belajar.
      null = keenam ruangan sudah dijalani; jangan mengarang sumbu berikutnya. */
  openQuestion?: { label: string; city: string } | null;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const t = useT();
  const reduced = useReducedMotion();
  const tr = useTr();
  const { lang } = useLang();
  const opening = startingRelationship ?? scenario.npc.relationship;

  /** A room runs read → talk → live with it. The landing demo skips the
      reading step so the hero stays a ten-second explanation. */
  const [phase, setPhase] = useState<"brief" | "talk">(
    variant === "full" ? "brief" : "talk",
  );
  const [beatIndex, setBeatIndex] = useState(0);
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [revealed, setRevealed] = useState(false);

  /* Tahap mana yang sedang berjalan — diturunkan dari keadaan yang memang
     sudah ada, bukan state baru: belum memilih = PILIH, sudah memilih =
     AKIBAT, dan begitu penjelasannya terbuka = KENAPA. */
  const [reflecting, setReflecting] = useState(false);

  /* Posisi sekarang di dalam putaran. Begitu blok mengucapkan terbuka,
     penanda utama ikut maju ke "ucapkan" — kalau tidak, panel gelap masih
     melingkari "kenapa" sementara panel terang sudah melingkari "ucapkan",
     dan ada dua tahap "sedang berjalan" di satu layar. Varian demo tidak
     memuat blok itu, jadi putarannya memang berhenti di "kenapa". */
  const stage: Stage = !chosen
    ? "pilih"
    : variant === "full" && reflecting
      ? "ucapkan"
      : revealed
        ? "kenapa"
        : "akibat";

  /* Percobaan sebelumnya pada giliran yang SAMA.

     "Coba kalimat lain" dulu hanya menghapus pilihan — pengguna mengulang
     tanpa pernah melihat apa bedanya. Padahal justru perbandingan itu yang
     mengajar: kalimat mana, hubungannya bergerak ke mana, dan kenapa.
     Disimpan per giliran, dibuang saat berpindah giliran. */
  const [priorAttempt, setPriorAttempt] = useState<{
    beatId: string;
    line: string;
    register: string;
    from: number;
    to: number;
    verdict: Verdict;
  } | null>(null);
  /* Tebakan "Baca ruangannya" untuk giliran yang sedang berjalan. Dikunci
     sebelum pilihan kalimat muncul, dan dibuang saat berpindah giliran. */
  const [prediction, setPrediction] = useState<{
    beatId: string;
    expression: Expression;
    verdict: Verdict;
  } | null>(null);
  const [readQuality, setReadQuality] = useState<ReadQuality | null>(null);

  const [history, setHistory] = useState<Exchange[]>([]);
  const [finished, setFinished] = useState(false);
  const [relationship, setRelationship] = useState(opening);
  /** Where this conversation began — fixed for the whole session, so that
      saving progress mid-conversation never restarts the scene. */
  const [sessionStart, setSessionStart] = useState(opening);
  const latestOpening = useRef(opening);
  latestOpening.current = opening;

  const restart = useCallback(() => {
    setPhase(variant === "full" ? "brief" : "talk");
    setBeatIndex(0);
    setChosen(null);
    setRevealed(false);
    setReflecting(false);
    setHistory([]);
    setFinished(false);
    setRelationship(sessionStart);
  }, [sessionStart, variant]);

  // Only a genuinely different scenario resets the room.
  useEffect(() => {
    setPhase(variant === "full" ? "brief" : "talk");
    setBeatIndex(0);
    setChosen(null);
    setRevealed(false);
    setReflecting(false);
    setHistory([]);
    setFinished(false);
    setSessionStart(latestOpening.current);
    setRelationship(latestOpening.current);
  }, [scenario.id, variant]);

  const beat = scenario.beats[beatIndex];
  const lastVerdict = history.length ? history[history.length - 1].choice.verdict : null;
  const npcLine = chosen ? chosen.reply : promptFor(beat, lastVerdict);
  const talking = useTalking(npcLine);
  const expression: Expression = chosen ? chosen.reaction : beatIndex === 0 ? "idle" : "warm";
  const verdict = chosen ? VERDICT[chosen.verdict] : null;
  const isLastBeat = beatIndex === scenario.beats.length - 1;

  const totalDelta = useMemo(
    () => history.reduce((sum, h) => sum + h.choice.relationship, 0),
    [history],
  );
  const band: Verdict = totalDelta >= 6 ? "ideal" : totalDelta >= -4 ? "workable" : "costly";

  /** Atribut apa saja yang bergerak sepanjang percakapan ini — hadiah yang
      bisa dilihat, bukan angka yang diam-diam berubah di panel lain. */
  const moved = useMemo(() => {
    const totals = {} as Record<AttributeKey, number>;
    history.forEach((h) => {
      (Object.keys(h.choice.attributes) as AttributeKey[]).forEach((k) => {
        totals[k] = (totals[k] ?? 0) + (h.choice.attributes[k] ?? 0);
      });
    });
    return ATTRIBUTES.filter((a) => totals[a.key]).map((a) => ({
      key: a.key,
      label: a.label,
      delta: totals[a.key],
    }));
  }, [history]);

  /* Jeda pengungkapan disimpan supaya bisa dibatalkan. Tanpa ini, berpindah
     giliran atau meninggalkan halaman sebelum jedanya habis akan membuat
     pengungkapan lama menyala di atas giliran yang baru. */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  function choose(choice: Choice) {
    if (chosen) return;
    const after = Math.max(0, Math.min(100, relationship + choice.relationship));
    setChosen(choice);
    if (prediction && prediction.beatId === beat.id) {
      const q = gradeRead(prediction.expression, prediction.verdict, choice);
      setReadQuality(q);
      onRead?.(q);
    }
    onResolved?.(choice, after);
    // Wajahnya bergerak lebih dulu, angkanya menyusul — dirasakan dulu, dibaca
    // kemudian. Jedanya cukup untuk menangkap ekspresi tanpa membuat antarmuka
    // terasa lambat. Kalau pengguna meminta gerak minimal, keduanya langsung
    // muncul: jeda ini alat pengatur tempo, dan tempo itu yang mereka tolak.
    clearTimers();
    if (reduced) {
      setRevealed(true);
      setReflecting(true);
      return;
    }
    timers.current.push(setTimeout(() => setRevealed(true), 700));
    timers.current.push(setTimeout(() => setReflecting(true), 1700));
  }

  function advance() {
    if (!chosen) return;
    clearTimers();
    const after = Math.max(0, Math.min(100, relationship + chosen.relationship));
    setHistory((h) => [
      ...h,
      { beatId: beat.id, said: chosen.line, reply: chosen.reply, choice: chosen, relationshipAfter: after },
    ]);
    setRelationship(after);
    setChosen(null);
    setRevealed(false);
    setReflecting(false);
    setPriorAttempt(null);
    setPrediction(null);
    setReadQuality(null);
    if (isLastBeat) setFinished(true);
    else setBeatIndex((i) => i + 1);
  }

  function sayDifferently() {
    clearTimers();
    if (chosen) {
      setPriorAttempt({
        beatId: beat.id,
        line: chosen.line,
        register: chosen.register,
        from: relationship,
        to: Math.max(0, Math.min(100, relationship + chosen.relationship)),
        verdict: chosen.verdict,
      });
    }
    setChosen(null);
    setRevealed(false);
    setReflecting(false);
    // Tebakannya sengaja TIDAK dihapus: mencoba kalimat lain dengan tebakan
    // yang sama justru pelajarannya — apakah kalimat berbeda sampai ke reaksi
    // yang kamu bayangkan.
    setReadQuality(null);
  }

  if (phase === "brief") {
    return <ScenarioBrief scenario={scenario} onEnter={() => setPhase("talk")} />;
  }

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-paper">
      <div className="relative z-10 grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        {/* ---------------------------------------------------------- scene */}
        <div className="relative flex flex-col border-b border-line bg-espresso px-6 py-7 text-cream lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 12%, rgba(255,177,120,0.20), transparent 62%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="eyebrow rounded-full bg-white/10 px-3 py-1.5 text-cream/80">
              {t("Ruang", "Room")} #{String(scenario.index).padStart(2, "0")}
            </span>
            <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-ember-deep px-3 py-1.5 text-white">
              <Flag code={scenario.flag} size={16} />
              {scenario.city}
            </span>
            <span className="eyebrow rounded-full border border-white/20 px-3 py-1.5 text-cream/70">
              {tr(scenario.tension)}
            </span>
          </div>

          <h3 className="display relative mt-4 text-[1.6rem] md:text-[1.9rem]">
            {tr(scenario.title)}
          </h3>
          <p className="relative mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-cream/65">
            {tr(scenario.setting)}
          </p>

          {/* where we are in the conversation */}
          <div className="relative mt-5 flex items-center gap-2.5">
            {scenario.beats.map((b, i) => (
              <span key={b.id} className="flex items-center gap-2.5">
                <span
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i < beatIndex || finished
                      ? "w-6 bg-ember"
                      : i === beatIndex
                        ? "w-6 bg-cream"
                        : "w-2 bg-white/25"
                  }`}
                />
              </span>
            ))}
            <span className="hand text-[16px] text-cream/55">
              {finished
                ? t("percakapan selesai", "the conversation ended")
                : t(
                    `giliran ${beatIndex + 1} dari ${scenario.beats.length}`,
                    `exchange ${beatIndex + 1} of ${scenario.beats.length}`,
                  )}
            </span>
            {variant === "full" && (
              <button
                onClick={() => setPhase("brief")}
                className="ml-auto text-[11.5px] font-semibold text-cream/45 underline underline-offset-4 transition-colors hover:text-cream"
              >
                {t("Baca ulang pesannya", "Re-read the message")}
              </button>
            )}
          </div>

          {/* Posisi sekarang di dalam putaran yang sama yang diperkenalkan di
              beranda. Bukan progress bar — tahapnya berupa kata, dan yang
              sedang berjalan dilingkari tangan. */}
          <LearningSpine
            active={stage}
            onDark
            className="mt-3 border-t border-white/10 pt-3"
          />

          {/* Dia ingat. Tanpa baris ini, tiap kunjungan terasa seperti soal
              baru — padahal posisinya memang dibawa dari percakapan terakhir. */}
          {/* `opening`, bukan `sessionStart`: sessionStart sengaja dibekukan
              saat komponen dipasang supaya menyimpan progres di tengah
              percakapan tidak mengulang adegan — tapi itu berarti nilainya
              terekam SEBELUM localStorage terbaca, jadi selalu sama dengan
              nilai dasar. `opening` sudah membawa hubungan yang tersimpan. */}
          {beatIndex === 0 && !chosen && memoryLine(opening, scenario.npc.relationship, lang) && (
            <p className="hand mt-3 text-[17px] leading-snug text-ember/90">
              {memoryLine(opening, scenario.npc.relationship, lang)}
            </p>
          )}

          <div className="relative mt-6 flex flex-1 flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <div className="relative shrink-0">
              {/* Tanda reaksi digambar selebar pembungkusnya sendiri, jadi
                  karakternya dikurung terpisah dari nama dan perannya di
                  bawah. Kalau digabung, lebar kotaknya ikut teks peran yang
                  lebih panjang, dan goresannya mendarat di samping kepala
                  alih-alih memeluknya. */}
              <span className="relative mx-auto block w-fit">
                <ReactionMarks expression={expression} />
                <Character
                  spec={scenario.npc.character}
                  expression={expression}
                  talking={talking && !finished}
                  size={variant === "demo" ? 168 : 196}
                  className={`h-auto drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)] ${
                    variant === "demo" ? "w-[150px] sm:w-[168px]" : "w-[156px] sm:w-[196px]"
                  }`}
                />
              </span>
              <div className="mt-1 text-center">
                <p className="text-[14px] font-bold">{scenario.npc.name}</p>
                <p className="text-[11.5px] text-cream/55">{tr(scenario.npc.role)}</p>
              </div>
            </div>

            <div className="w-full sm:mb-10 sm:flex-1">
              {!finished && beat.stage && !chosen && (
                <m.p
                  key={beat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hand mb-2 ml-1 text-[16px] text-cream/50"
                >
                  {tr(beat.stage)}
                </m.p>
              )}
              <AnimatePresence mode="wait">
                <div key={finished ? "ended" : npcLine}>
                  {finished ? (
                    <SpeechBubble>
                      <span className="italic text-mute">{tr(scenario.ending[band])}</span>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble>{npcLine}</SpeechBubble>
                  )}
                </div>
              </AnimatePresence>
              {!finished && (
                <div className="mt-3 ml-1">
                  <Listen
                    text={npcLine}
                    region={scenario.flag}
                    label={t("Dengar cara dia bicara", "Hear how he says it")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* running relationship — always visible, always moving */}
          <div className="relative mt-6 border-t border-white/10 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-cream/50">
                {t("Posisimu di mata", "Standing with")} {scenario.npc.name}
              </span>
              <span className="font-mono text-[13px] font-bold tabular-nums">
                {relationship}
                <span className="text-cream/40">/100</span>
              </span>
            </div>
            <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-white/10">
              <m.div
                className="h-full rounded-full bg-ember"
                animate={{ width: `${relationship}%` }}
                transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- decision panel */}
        <div className="flex flex-col px-6 py-7 lg:px-8 lg:py-9">
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------- 1 · choose */}
            {!finished && !chosen && (
              <m.div
                key={`choices-${beat.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* BACA RUANGANNYA — tebakan dikunci lebih dulu.

                    Pilihan kalimat sengaja belum ditampilkan sampai tebakannya
                    masuk. Kalau keduanya muncul bersamaan, pengguna akan
                    membaca ketiga kalimat dulu lalu menebak mundur dari situ —
                    dan yang diuji berubah jadi "tebak jawabannya", bukan
                    "baca ruangannya". */}
                {!prediction || prediction.beatId !== beat.id ? (
                  <ReadTheRoom
                    beatId={beat.id}
                    choices={beat.choices}
                    npc={{ spec: scenario.npc.character, name: scenario.npc.name }}
                    onPredict={(expression, verdict) =>
                      setPrediction({ beatId: beat.id, expression, verdict })
                    }
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <PredictionChip
                        expression={prediction.expression}
                        npcSpec={scenario.npc.character}
                      />
                    </div>
                    <p className="eyebrow text-mute">
                      {beatIndex === 0
                        ? t("Langkah 2 · Pilih kalimatmu", "Step 2 · Choose your sentence")
                        : t("Percakapan berlanjut", "The conversation continues")}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-mute">
                      {t(
                        "Ketiganya benar secara tata bahasa. Cuma satu yang pas untuk orang di depanmu saat ini.",
                        "All three are grammatically correct. Only one fits the person in front of you right now.",
                      )}
                    </p>
                <div className="mt-5 space-y-3">
                  {beat.choices.map((choice, i) => (
                    <m.button
                      key={choice.id}
                      onClick={() => choose(choice)}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i, type: "spring", stiffness: 200, damping: 22 }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.985 }}
                      className="group flex w-full items-start gap-3 rounded-[1.2rem] border border-line bg-white p-4 text-left transition-colors hover:border-ink/40 hover:shadow-[0_8px_24px_rgba(28,21,18,0.07)]"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[12px] font-bold text-mute transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
                        {choice.id.toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium leading-[1.45] text-ink">
                          “{choice.line}”
                        </span>
                        <span className="mt-1 block text-[11.5px] uppercase tracking-[0.1em] text-mute">
                          {tr(choice.register)}
                        </span>
                      </span>
                    </m.button>
                  ))}
                </div>
                    {beatIndex > 0 && (
                      <p className="hand mt-4 text-[17px] text-clay">
                        {t(
                          "dia masih memegang kalimatmu yang tadi",
                          "he is still holding what you said last time",
                        )}
                      </p>
                    )}
                  </>
                )}
              </m.div>
            )}

            {/* --------------------------------------------- 2 · consequence */}
            {!finished && chosen && (
              <m.div
                key="consequence"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-mute">
                    {t("Langkah 3 · Konsekuensi sosial", "Step 3 · Social consequence")}
                  </p>
                  {verdict && (
                    <m.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.85 }}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${verdict.chip}`}
                    >
                      {t(verdict.id, verdict.en)}
                    </m.span>
                  )}
                </div>

                <div className="mt-3">
                  <HandCircle active={revealed} color={verdict?.color}>
                    <span className="block rounded-[1rem] border border-line bg-white px-4 py-3 text-[14px] italic leading-relaxed text-ink">
                      {t("Kamu bilang", "You said")}: “{chosen.line}”
                    </span>
                  </HandCircle>
                </div>

                {/* Tiga bacaan ini satu-satunya bagian yang berubah setiap
                    kali sebuah kalimat dipilih, jadi hanya bagian ini yang
                    diumumkan ulang oleh pembaca layar. */}
                <div className="mt-6 space-y-4" role="status" aria-live="polite">
                  <ScoreMeter
                    label={t("Ketepatan bahasa", "Language accuracy")}
                    value={chosen.accuracy}
                    active={revealed}
                  />
                  <ScoreMeter
                    label={t("Kecocokan budaya", "Cultural fit")}
                    value={chosen.culturalFit}
                    active={revealed}
                    delay={0.12}
                  />
                  <RelationshipMeter
                    from={relationship}
                    delta={chosen.relationship}
                    active={revealed}
                    name={scenario.npc.name}
                  />
                </div>

                {revealed && verdict && (
                  <HandNote className="mt-2" color={verdict.color} delay={0.9}>
                    {t(verdict.noteId, verdict.noteEn)}
                  </HandNote>
                )}

                <AnimatePresence>
                  {reflecting && (
                    <m.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 24 }}
                      className="mt-5"
                    >
                      {/* Tebakan vs kenyataan, sebelum penjelasannya. Urutannya
                          penting: pengguna harus melihat dulu apakah bacaannya
                          benar, baru tahu kenapa. */}
                      {prediction &&
                        prediction.beatId === beat.id &&
                        readQuality && (
                          <ReadReveal
                            predicted={prediction.expression}
                            actual={chosen}
                            quality={readQuality}
                            npcSpec={scenario.npc.character}
                            lang={lang}
                          />
                        )}

                      <div
                        className="mt-4 rounded-[1.2rem] border-l-[4px] bg-white p-4"
                        style={{ borderLeftColor: verdict?.color }}
                      >
                        <p className="eyebrow text-mute">
                          {t("Kenapa jatuhnya begitu", "Why it landed that way")}
                        </p>
                        <p className="mt-2 text-[14px] leading-[1.6] text-ink">{tr(chosen.insight)}</p>

                        {/* Di sinilah penilaian budaya itu dijatuhkan, jadi di
                            sini pula ia harus bisa dipertanggungjawabkan. */}
                        <CulturalBasis scenario={scenario} />
                      </div>

                      {/* Kalau giliran ini pernah dicoba dengan kalimat lain,
                          tunjukkan dua-duanya berdampingan. Ini momen paling
                          mengajar di seluruh Kairos: dua kalimat yang sama
                          benarnya, dua arah hubungan yang berbeda. */}
                      {priorAttempt && priorAttempt.beatId === beat.id && (
                        <RetryCompare
                          before={priorAttempt}
                          now={chosen}
                          nowTo={Math.max(0, Math.min(100, relationship + chosen.relationship))}
                          lang={lang}
                        />
                      )}

                      {/* UCAPKAN → REFLEKSI. Sebelumnya SpeakPractice berdiri
                          sendiri di bawah penjelasan, seolah latihan tambahan.
                          Sekarang keduanya satu tahap dalam putaran yang sama:
                          ucapkan kalimatnya, lalu sebut sendiri bagaimana kamu
                          menyampaikannya — dan Kairos menjelaskan artinya di
                          dalam hubungan ini. */}
                      {variant === "full" && (
                        <div className="mt-4 rounded-[1.2rem] border border-line bg-paper/50 p-4">
                          <LearningSpine active="ucapkan" className="mb-3" />
                          <SpeakPractice line={chosen.line} />
                          <DeliveryReflection
                            verdict={chosen.verdict}
                            npcRole={tr(scenario.npc.role)}
                          />
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <m.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={advance}
                          className="rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-cream transition-colors hover:bg-espresso"
                        >
                          {isLastBeat
                            ? t("Lihat akhirnya →", "See how it ended →")
                            : t("Lanjutkan percakapan →", "Continue the conversation →")}
                        </m.button>
                        <button
                          onClick={sayDifferently}
                          className="rounded-full border border-line bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
                        >
                          {t("Coba kalimat lain", "Say it differently")}
                        </button>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            )}

            {/* -------------------------------------------------- 3 · ending */}
            {finished && (
              <m.div
                key="ending"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-mute">
                    {t("Bagaimana percakapan ini berakhir", "How the conversation ended")}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${VERDICT[band].chip}`}
                  >
                    {totalDelta >= 0 ? "+" : ""}
                    {totalDelta} {t("total", "overall")}
                  </span>
                </div>

                <p className="display mt-3 text-[1.35rem] leading-[1.25]">
                  {t(
                    `Posisimu di mata ${scenario.npc.name} sekarang `,
                    `${scenario.npc.name} now sits at `,
                  )}
                  <span style={{ color: VERDICT[band].color }}>{relationship}</span>
                  {t(".", " with you.")}
                </p>

                {moved.length > 0 && (
                  <div className="mt-4 rounded-[1.2rem] border border-line bg-white p-4">
                    <p className="eyebrow text-clay">
                      {t("Yang berubah dalam dirimu", "What this moved in you")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {moved.map((a, i) => (
                        <m.span
                          key={a.key}
                          initial={{ opacity: 0, y: 8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: 0.15 + i * 0.09,
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                          }}
                          className={`rounded-full px-3 py-1.5 text-[12.5px] font-bold ${
                            a.delta > 0 ? "bg-sage/12 text-sage" : "bg-rose/12 text-rose"
                          }`}
                        >
                          {tr(a.label)} {a.delta > 0 ? "+" : ""}
                          {a.delta}
                        </m.span>
                      ))}
                    </div>
                    <p className="mt-3 text-[12.5px] leading-relaxed text-mute">
                      {t(
                        "Enam atribut ini yang menentukan ruang mana yang terbuka berikutnya.",
                        "These six attributes decide which rooms open to you next.",
                      )}
                    </p>
                  </div>
                )}

                <HandRule className="my-4" />

                {/* the transcript — your sentences, in order */}
                <ol className="space-y-3">
                  {history.map((h, i) => (
                    <m.li
                      key={h.beatId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="rounded-[1rem] border border-line bg-white p-3.5"
                    >
                      <p className="text-[13.5px] leading-snug text-ink">“{h.said}”</p>
                      <p className="mt-1.5 text-[12.5px] italic leading-snug text-mute">
                        → {h.reply}
                      </p>
                      <span
                        className="mt-2 inline-block text-[11px] font-bold uppercase tracking-[0.08em]"
                        style={{ color: VERDICT[h.choice.verdict].color }}
                      >
                        {h.choice.relationship >= 0 ? "+" : ""}
                        {h.choice.relationship} · {tr(h.choice.register)}
                      </span>
                    </m.li>
                  ))}
                </ol>

                {variant === "full" && (
                  <div className="mt-4 rounded-[1.2rem] bg-parchment/70 p-4">
                    <p className="eyebrow text-mute">
                      {t("Catatan budaya", "Cultural note")} · {scenario.region}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/80">{tr(scenario.note)}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={restart}
                    className="rounded-full border border-line bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
                  >
                    {t("↺ Ulangi percakapan ini", "↺ Try the conversation again")}
                  </button>
                  {onNext && (
                    <m.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onNext}
                      className="rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-cream transition-colors hover:bg-espresso"
                    >
                      {nextLabel} →
                    </m.button>
                  )}
                </div>
                <p className="hand mt-3 text-[17px] text-clay">
                  {t(
                    "hubungan itu menetap — dia akan ingat ini lain kali",
                    "relationships persist — he remembers this next time",
                  )}
                </p>

                {/* PERTANYAAN TERBUKA.

                    Sesi ini selesai, tapi kurikulumnya belum. Menyebut satu
                    sumbu yang belum pernah mengujimu membuat sesi berakhir
                    dengan pertanyaan, bukan dengan titik — dan itu alasan
                    untuk kembali yang tidak butuh rentetan harian.

                    Kalau keenam ruangan sudah dijalani, blok ini tidak muncul
                    sama sekali. Tidak ada sumbu karangan. */}
                {openQuestion && (
                  <div className="mt-6 border-t border-line pt-5">
                    <p className="eyebrow text-mute">
                      {t("Yang belum kamu ketahui tentang dirimu", "What you still don't know about yourself")}
                    </p>
                    <p className="display mt-1.5 text-[1.35rem] leading-tight">
                      {openQuestion.label}
                    </p>
                    <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-ink/80">
                      {t(
                        `Satu sumbu ini belum pernah mengujimu. ${openQuestion.city} masih menunggu.`,
                        `This axis has never tested you. ${openQuestion.city} is still waiting.`,
                      )}
                    </p>
                    <HandNote className="mt-2" color="#b04a19">
                      {t(
                        "pertanyaannya bukan kalimat mana yang benar",
                        "the question is not which sentence is correct",
                      )}
                    </HandNote>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
