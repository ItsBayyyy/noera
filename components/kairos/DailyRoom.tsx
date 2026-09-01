"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Character } from "./Character";
import {
  PredictionChip,
  ReadReveal,
  ReadTheRoom,
  gradeRead,
  type ReadQuality,
} from "./ReadTheRoom";
import { HandNote, ReactionMarks } from "./Ink";
import { RelationshipMeter, ScoreMeter } from "./Meters";
import { DAILY_NEXT, DAILY_ROOM } from "@/lib/kairos/data";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import { untilTomorrow, useProgress } from "@/lib/kairos/state";
import type { Choice, Expression, Verdict } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   THE DAILY ROOM

   A reason to come back that is not a streak: one new social situation a day.
   Nothing is lost by missing yesterday — the room simply changes.
   -------------------------------------------------------------------------- */

const VERDICT_COLOR = { ideal: "#3e7c5a", workable: "#c2551f", costly: "#b24c3c" };

function Countdown() {
  const [left, setLeft] = useState<{ hours: number; minutes: number } | null>(null);
  useEffect(() => {
    const tick = () => setLeft(untilTomorrow());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  if (!left) return <span className="tabular-nums">—</span>;
  return (
    <span className="tabular-nums">
      {left.hours}h {String(left.minutes).padStart(2, "0")}m
    </span>
  );
}

export function DailyRoom() {
  const { recordDaily, dailyDone, progress, hydrated, recordRead} = useProgress();
  const t = useT();
  const reduced = useReducedMotion();
  const tr = useTr();
  // Locale date formatting differs between server and client, so it waits.
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" }),
    );
  }, []);
  const room = DAILY_ROOM;
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [revealed, setRevealed] = useState(false);
  /* Ruang harian memakai mekanik yang sama: tebak dulu reaksinya, baru
     kalimatnya muncul. Inilah alasan untuk kembali besok — bukan runtunan. */
  const [prediction, setPrediction] = useState<{ expression: Expression; verdict: Verdict } | null>(null);
  const [readQuality, setReadQuality] = useState<ReadQuality | null>(null);

  // A room played earlier today stays played — show what was said.
  const previous =
    dailyDone && !chosen
      ? room.choices.find((c) => c.id === progress.dailyChoice) ?? null
      : null;
  const shown = chosen ?? previous;

  function choose(choice: Choice) {
    setChosen(choice);
    if (prediction) {
      const q = gradeRead(prediction.expression, prediction.verdict, choice);
      setReadQuality(q);
      recordRead(q);
    }
    recordDaily(choice);
    setTimeout(() => setRevealed(true), 420);
  }

  return (
    <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white text-ink">
      <div className="relative z-10 grid md:grid-cols-[0.9fr_1fr]">
        <div className="relative flex flex-col justify-between border-b border-line bg-espresso px-6 py-6 text-cream md:border-b-0 md:border-r">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="eyebrow rounded-full bg-ember-deep px-3 py-1.5 text-white">
                {room.label}
              </span>
              <span className="eyebrow text-cream/50">{today}</span>
            </div>
            <h3 className="display mt-4 text-[1.5rem] leading-[1.14]">{tr(room.situation)}</h3>
            <p className="hand mt-2 text-[17px] text-cream/55">{tr(room.stage)}</p>
          </div>

          <div className="relative mt-6 flex items-end gap-3">
            <div className="relative shrink-0">
              <ReactionMarks expression={shown ? shown.reaction : "idle"} />
              <Character
                spec={room.npc.character}
                expression={shown ? shown.reaction : "idle"}
                talking={!shown}
                size={120}
                className="h-auto w-[104px]"
              />
            </div>
            <div className="mb-3 flex-1 rounded-[1.1rem] rounded-bl-sm bg-white px-4 py-2.5 text-[13.5px] leading-snug text-ink">
              {shown ? shown.reply : room.prompt}
            </div>
          </div>
          <p className="mt-3 text-[11.5px] text-cream/45">
            {room.npc.name} · {tr(room.npc.role)}
          </p>
        </div>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {!shown ? (
              <m.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!prediction ? (
                  <ReadTheRoom
                    beatId={room.id}
                    choices={room.choices}
                    npc={{ spec: room.npc.character, name: room.npc.name }}
                    onPredict={(expression, verdict) => setPrediction({ expression, verdict })}
                  />
                ) : (
                  <>
                <div className="mb-4">
                  <PredictionChip expression={prediction.expression} npcSpec={room.npc.character} />
                </div>
                <p className="eyebrow text-mute">
                  {t("Kamu balas apa?", "What do you send back?")}
                </p>
                <div className="mt-4 space-y-2.5">
                  {room.choices.map((choice, i) => (
                    <m.button
                      key={choice.id}
                      onClick={() => choose(choice)}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full rounded-[1.1rem] border border-line bg-paper/60 p-3.5 text-left transition-colors hover:border-ink/40 hover:bg-white"
                    >
                      <span className="block text-[14.5px] leading-snug text-ink">
                        “{choice.line}”
                      </span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.1em] text-mute">
                        {tr(choice.register)}
                      </span>
                    </m.button>
                  ))}
                </div>
                <p className="mt-4 text-[12.5px] text-mute">
                  {t(
                    "Satu ruang setiap hari. Tidak ada rentetan yang perlu dijaga — besok situasinya ganti apa pun yang terjadi.",
                    "One room a day. No streak to break — tomorrow is a different situation either way.",
                  )}
                </p>
                  </>
                )}
              </m.div>
            ) : (
              <m.div key="result" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="eyebrow text-mute">{t("Kamu bilang", "You said")}</p>
                <p className="mt-2 rounded-[1rem] border border-line bg-paper/60 px-4 py-3 text-[14px] italic leading-snug text-ink">
                  “{shown.line}”
                </p>

                <div className="mt-5 space-y-3.5">
                  <ScoreMeter
                    label={t("Ketepatan bahasa", "Language accuracy")}
                    value={shown.accuracy}
                    active={revealed || Boolean(previous)}
                  />
                  <ScoreMeter
                    label={t("Kecocokan budaya", "Cultural fit")}
                    value={shown.culturalFit}
                    active={revealed || Boolean(previous)}
                    delay={0.1}
                  />
                  <RelationshipMeter
                    from={78}
                    delta={shown.relationship}
                    active={revealed || Boolean(previous)}
                    name={room.npc.name}
                  />
                </div>

                <div
                  className="mt-5 rounded-[1.1rem] border-l-[4px] bg-paper/70 p-4"
                  style={{ borderLeftColor: VERDICT_COLOR[shown.verdict] }}
                >
                  <p className="eyebrow text-mute">
                    {t("Kenapa jatuhnya begitu", "Why it landed that way")}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-ink">{tr(shown.insight)}</p>
                </div>

                <div className="mt-5 border-t border-line pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-ink">
                      {t("Ruang besok terbuka dalam ", "Tomorrow's room opens in ")}
                      <Countdown />
                    </p>
                    <span className="eyebrow rounded-full bg-parchment px-2.5 py-1 text-mute">
                      {t(DAILY_NEXT.tagId, DAILY_NEXT.tagEn)}
                    </span>
                  </div>

                  {/* bocoran: cukup untuk penasaran, tidak cukup untuk dijawab */}
                  <div className="mt-3 flex items-center gap-3 rounded-[1.1rem] border border-dashed border-parchment bg-paper/70 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] text-cream">
                      ?
                    </span>
                    <p className="text-[13px] leading-snug text-ink/70">
                      {t(DAILY_NEXT.teaserId, DAILY_NEXT.teaserEn)}
                    </p>
                  </div>
                  {hydrated && (
                    <HandNote className="mt-2" color="#6b5d50">
                      {t("besok ruangnya beda", "a different room tomorrow")}
                    </HandNote>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
