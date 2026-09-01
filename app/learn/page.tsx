"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter, SiteNav } from "@/components/kairos/SiteShell";
import { ScenarioPlayer } from "@/components/kairos/ScenarioPlayer";
import { DailyRoom } from "@/components/kairos/DailyRoom";
import { TierUp } from "@/components/kairos/TierUp";
import { Onboarding } from "@/components/kairos/Onboarding";
import { ButtonLink } from "@/components/kairos/ui";
import { Flag } from "@/components/kairos/Flag";
import {
  ATTRIBUTES,
  SCENARIOS,
  axisForRoom,
  firstUntestedAxis,
  profileNarrative,
  recommendedRoom,
  socialReadings,
} from "@/lib/kairos/data";
import { LearningSpine } from "@/components/kairos/LearningSpine";
import { useProgress } from "@/lib/kairos/state";
import { useLang, useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import type { AttributeKey, Choice } from "@/lib/kairos/types";

const labelFor = (key: AttributeKey) =>
  ATTRIBUTES.find((a) => a.key === key)?.label ?? key;

export default function LearnPage() {
  const t = useT();
  const tr = useTr();
  const { lang } = useLang();
  const [index, setIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const {
    progress,
    record,
    tier,
    completedCount,
    hydrated,
    dailyDone,
    strengths,
    gaps,
    restartTour,
    recordRead,
  } = useProgress();


  /* Tiga langkah yang dilalui setiap ruang, dijelaskan untuk pendatang baru. */
  const STEPS = [
    {
      n: "1",
      title: t("Baca ruangannya", "Read the room"),
      body: t(
        "Ada pesan yang datang sebelum pertemuannya. Cari tahu apa yang sebenarnya diminta — bukan apa yang tertulis.",
        "A message arrives before the meeting does. Work out what is actually being asked — not what the words say.",
      ),
      skill: t("Pemahaman bacaan", "Reading comprehension"),
      tone: "#3d6b8c",
    },
    {
      n: "2",
      title: t("Katakan sesuatu", "Say something"),
      body: t(
        "Tiga kalimat, semuanya benar secara tata bahasa. Dengar dulu cara lawan bicaramu, baru pilih yang pas untuk dia.",
        "Three sentences, all grammatically correct. Hear how the other person speaks, then pick the one that fits them.",
      ),
      skill: t("Menyimak · Percakapan", "Listening · Conversation"),
      tone: "#c2551f",
    },
    {
      n: "3",
      title: t("Tanggung akibatnya", "Live with it"),
      body: t(
        "Wajahnya berubah, hubungannya bergeser, dan kalimat berikutnya jadi lain. Setelah itu, ucapkan kalimatmu sendiri.",
        "Their face moves, the relationship shifts, and the next line changes. Then say your line out loud yourself.",
      ),
      skill: t("Berbicara · Konsekuensi", "Speaking · Consequence"),
      tone: "#3e7c5a",
    },
  ];

  // Ruang yang dipilih saat daftar (atau dari peta) terbuka lebih dulu.
  useEffect(() => {
    if (!hydrated || !progress.startScenario) return;
    const i = SCENARIOS.findIndex((s) => s.id === progress.startScenario);
    if (i >= 0) setIndex(i);
  }, [hydrated, progress.startScenario]);

  /* Masuk lewat profil contoh mendarat tepat di ruangnya, bukan di puncak
     halaman. Dijalankan setelah hidrasi supaya elemennya sudah ada, dan
     seketika — bukan bergulir halus — karena perpindahannya terjadi di balik
     tirai transisi: saat tirainya naik, skenarionya sudah di layar. */
  useEffect(() => {
    if (!hydrated || window.location.hash !== "#room") return;
    /* Posisinya dihitung sendiri, bukan lewat scrollIntoView: bilah atas
       memakai posisi tetap, dan `scroll-margin` tidak ikut terpakai saat
       pengguliran dijalankan dari skrip — judul ruangnya berakhir tepat di
       balik bilah itu. Angka 96px sama dengan scroll-mt-24 milik jangkar ini.

       Dijalankan dua kali: sekali lebih awal, lalu sekali lagi setelah router
       menuntaskan pengguliran jangkarnya sendiri, yang kalau dibiarkan akan
       menimpa hitungan ini. Keduanya masih terjadi di balik tirai transisi
       (MIN_VISIBLE 620ms), jadi tidak ada lompatan yang terlihat. */
    const align = () => {
      const el = document.getElementById("room");
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
    };
    const timers = [setTimeout(align, 120), setTimeout(align, 450)];
    return () => timers.forEach(clearTimeout);
  }, [hydrated]);

  const scenario = SCENARIOS[index];
  const standing = progress.relationships[scenario.id] ?? scenario.npc.relationship;
  const playedCount = SCENARIOS.filter((s) => progress.completed[s.id]).length;
  const nextUnplayed = SCENARIOS.find((s) => !progress.completed[s.id]);
  const allDone = hydrated && playedCount === SCENARIOS.length;

  /* Ruangan yang disarankan berikutnya, dipilih dari atribut paling
     tertinggal. Aturan tetap, bukan pembelajaran mesin — dan tidak diklaim
     begitu. Yang penting: apa yang pernah diucapkan menentukan apa yang
     ditawarkan berikutnya. */
  const nextRoom = recommendedRoom(progress.attributes, progress.completed, tier.name);

  /* Sumbu yang belum pernah menguji pengguna — dipakai untuk menutup sesi
     dengan pertanyaan terbuka. Kalau keenamnya sudah dijalani, nilainya null
     dan blok penutup itu tidak muncul: tidak ada sumbu karangan. */
  const untested = firstUntestedAxis(progress.completed);

  function handleResolved(choice: Choice, relationshipAfter: number) {
    record(scenario.id, choice, relationshipAfter);
  }

  function goTo(i: number) {
    setIndex(i);
    if (typeof window !== "undefined") {
      document.getElementById("room")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function next() {
    goTo((index + 1) % SCENARIOS.length);
  }

  return (
    <MotionProvider>
      <SiteNav />
      <TierUp />
      <Onboarding />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 pb-20 pt-[104px] md:px-10">
        {/* ------------------------------------------------------- header */}
        <header className="flex flex-col justify-between gap-5 border-b border-line pb-7 lg:flex-row lg:items-end">
          <div>
            <h1 className="display mt-4 text-[2.2rem] leading-none md:text-[2.8rem]">
              {t("Satu ruang dalam satu waktu.", "One room at a time.")}
            </h1>
            <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-mute">
              {t(
                "Satu ruang berisi satu situasi sosial: baca pesannya, katakan sesuatu, lalu tanggung akibatnya. Bukan kuis, tidak ada skor yang dikejar — cuma percakapan dan harganya.",
                "Each room is one social situation: read the message, say something, live with what it does. No quiz, no score to chase — just the conversation and what it costs.",
              )}
            </p>
            <button
              onClick={() => {
                setShowGuide(true);
                restartTour();
              }}
              className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay underline underline-offset-4 hover:text-ink"
            >
              {t("Bagaimana cara kerjanya?", "How does this work?")}
            </button>
          </div>

          <div className="flex items-center gap-5 rounded-[1.4rem] border border-line bg-white px-5 py-4">
            <div>
              <p className="eyebrow text-mute">{t("Kamu sekarang", "You are")}</p>
              <p className="display text-[1.7rem] leading-none">
                {hydrated ? tier.name : "—"}
              </p>
            </div>
            <div className="h-10 w-px bg-line" />
            <div className="text-right">
              <p className="eyebrow text-mute">{t("Ruang dijalani", "Rooms lived")}</p>
              <p className="display text-[1.7rem] leading-none tabular-nums">
                {hydrated ? `${playedCount}/${SCENARIOS.length}` : "—"}
              </p>
            </div>
          </div>
        </header>

        {/* ----------------------------------------- perjalanan selesai */}
        {allDone && (
          <m.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grain relative mt-7 overflow-hidden rounded-[1.75rem] border border-sage/40 bg-sage/8 p-6 md:p-7"
          >
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-sage">{t("Enam ruang, selesai", "Six rooms, done")}</p>
                <h2 className="display mt-2 text-[1.6rem] md:text-[2rem]">
                  {t(
                    "Kamu sudah masuk ke enam ruangan yang berbeda.",
                    "You have walked into six different rooms.",
                  )}
                </h2>
                <p className="mt-2 max-w-[54ch] text-[14px] leading-relaxed text-ink/75">
                  {t(
                    "Profil komunikasimu sekarang dibentuk dari kalimat-kalimat yang kamu pilih sendiri, bukan dari berapa hari kamu membuka aplikasi.",
                    "Your communication profile is now shaped by sentences you actually chose, not by how many days you opened an app.",
                  )}
                </p>
              </div>
              <ButtonLink href="/community">
                {t("Bandingkan dengan dunia →", "Compare with the world →")}
              </ButtonLink>
            </div>
          </m.section>
        )}

        {/* --------------------------------------------- cara main satu ruang */}
        <AnimatePresence>
          {showGuide && (
            <m.section
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="mt-7 overflow-hidden"
            >
              <div
                data-tour="steps"
                className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-6 md:p-7"
              >
                <div className="relative z-10">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-clay">{t("Mulai dari sini", "Start here")}</p>
                      <h2 className="display mt-2 text-[1.5rem] md:text-[1.8rem]">
                        {t("Cara kerja satu ruang", "How a room works")}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowGuide(false)}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-mute transition-colors hover:border-ink/40 hover:text-ink"
                    >
                      {t("Sudah paham", "Got it")}
                    </button>
                  </div>

                  <ol className="mt-5 grid gap-4 md:grid-cols-3">
                    {STEPS.map((step, i) => (
                      <m.li
                        key={step.n}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative rounded-[1.2rem] border border-line bg-paper/50 p-5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold text-white"
                            style={{ background: step.tone }}
                          >
                            {step.n}
                          </span>
                          <h3 className="text-[15px] font-bold text-ink">{step.title}</h3>
                        </div>
                        <p className="mt-2.5 text-[13.5px] leading-relaxed text-mute">
                          {step.body}
                        </p>
                        <p
                          className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em]"
                          style={{ color: step.tone }}
                        >
                          {step.skill}
                        </p>
                      </m.li>
                    ))}
                  </ol>

                  <p className="mt-4 text-[13px] text-mute">
                    {t(
                      "Sekitar tiga menit per ruang. Semua yang kamu katakan diingat — ruang berikutnya dibuka dengan posisi yang kamu tinggalkan.",
                      "About three minutes each. Everything you say is remembered — the next room opens with the standing you left behind.",
                    )}
                  </p>
                </div>
              </div>
            </m.section>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------- perjalananmu */}
        <section data-tour="journey" className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              {/* Angka hantu, bukan label pil: enam ruangan adalah keseluruhan
                  perjalanan, jadi angkanya sendiri yang membuka seksi ini. */}
              <div className="flex items-end gap-3">
                <span className="display text-[2.6rem] leading-[0.8] text-ink/12">6</span>
                <h2 className="display mb-0.5 text-[1.35rem] leading-tight">
                  {t("Enam ruang, enam naluri", "Six rooms, six instincts")}
                </h2>
              </div>
              {/* Kalimat inilah yang membalik tafsirnya: enam bukan batas
                  konten, tapi jumlah sumbu yang memang dirancang. */}
              <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-mute">
                {t(
                  "Bukan enam skenario acak. Tiap ruang menguji satu cara membaca orang — dan keenamnya persis membentuk profil komunikasimu.",
                  "Not six random scenarios. Each room tests one way of reading people — and together the six are exactly what your communication profile is made of.",
                )}
              </p>
            </div>
            {hydrated && nextUnplayed && (
              <p className="text-[13px] text-mute">
                {t("Berikutnya: ", "Next up: ")}
                <button
                  onClick={() => goTo(SCENARIOS.indexOf(nextUnplayed))}
                  className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] font-semibold text-ink underline underline-offset-4"
                >
                  {nextUnplayed.city} · {tr(nextUnplayed.title)}
                </button>
              </p>
            )}
          </div>

          <div className="hide-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
            {SCENARIOS.map((s, i) => {
              const done = Boolean(progress.completed[s.id]);
              const active = i === index;
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`w-[212px] shrink-0 rounded-[1.2rem] border p-4 text-left transition-colors ${
                    active
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-white text-ink hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Flag code={s.flag} size={22} />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                        active ? "text-cream/60" : done ? "text-sage" : "text-mute"
                      }`}
                    >
                      {active
                        ? t("di ruang ini", "in this room")
                        : done
                          ? t("selesai", "lived")
                          : `${t("Ruang", "Room")} ${s.index}`}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[14.5px] font-bold leading-snug">{tr(s.title)}</p>
                  <p
                    className={`mt-1 text-[12px] leading-snug ${
                      active ? "text-cream/60" : "text-mute"
                    }`}
                  >
                    {s.city} · {tr(s.tension)}
                  </p>
                  {/* Sumbu yang diuji ruangan ini — nama yang sama persis
                      dengan yang muncul di Potret Sosial, supaya hubungan
                      RUANG → SUMBU → PROFIL terlihat tanpa dijelaskan. */}
                  {axisForRoom(s.id) && (
                    <p
                      className={`mt-2 border-t pt-2 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        active ? "border-cream/20 text-cream/70" : "border-line text-clay"
                      }`}
                    >
                      {t("Menguji", "Tests")} · {tr(labelFor(axisForRoom(s.id)!))}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------ ruangnya */}
        <section id="room" className="mt-8 scroll-mt-24">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="display text-[1.35rem]">
                {t("Ruang", "Room")} {scenario.index} · {scenario.city}
              </h2>
              {/* Empat pil keterampilan diganti penanda putaran: ia menyebut
                  keterampilan yang sama, tapi sekaligus menunjukkan posisi
                  pengguna di dalamnya. Satu baris, bukan empat label. */}
              <LearningSpine className="ml-1" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
            <m.div
              data-tour="room"
              key={scenario.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            >
              <ScenarioPlayer
                scenario={scenario}
                startingRelationship={standing}
                onRead={recordRead}
                openQuestion={
                  hydrated && untested && untested.room
                    ? { label: tr(untested.label), city: untested.room.city }
                    : null
                }
                onResolved={handleResolved}
                onNext={next}
                nextLabel={`${t("Ruang berikutnya", "Next room")} · ${
                  SCENARIOS[(index + 1) % SCENARIOS.length].city
                }`}
              />
            </m.div>

            <aside
              data-tour="reputation"
              className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-6 lg:sticky lg:top-24"
            >
              <p className="eyebrow text-clay">{t("Reputasi sosial", "Social reputation")}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">
                {hydrated
                  ? profileNarrative(tier.name, strengths, gaps, lang)
                  : t(
                      "Katakan sesuatu, lalu lihat atribut mana yang membayarnya.",
                      "Say something and watch which attribute pays for it.",
                    )}
              </p>

              {/* Enam meteran atribut yang dulu ada di sini sudah dihapus.
                  Angkanya tetap dihitung — dipakai untuk memilih ruangan
                  berikutnya — tapi tidak lagi ditampilkan sebagai papan skor.
                  Yang tampil sekarang: kalimat tentang cara orang membacamu. */}
              <ul className="mt-4 space-y-2.5">
                {socialReadings(progress.attributes, lang)
                  .slice(0, 3)
                  .map((r) => (
                    <li
                      key={r.key}
                      className={`border-l-2 pl-3 text-[12.5px] leading-[1.5] text-ink/80 ${
                        r.tone === "high" ? "border-sage/50" : "border-line"
                      }`}
                    >
                      {hydrated
                        ? r.text
                        : t(
                            "Katakan sesuatu, lalu baris ini berubah.",
                            "Say something and this line changes.",
                          )}
                    </li>
                  ))}
              </ul>

              {/* Rute adaptif: kelemahan terbesar menentukan ruangan berikutnya,
                  dan tombolnya benar-benar membuka ruangan itu. */}
              {/* Rantai sebabnya ditulis lengkap, bukan cuma hasilnya.
                  "Ini rekomendasi" tidak membuktikan apa pun; "karena X, maka
                  Y, dan fokusnya Z" membuktikan sistemnya benar-benar membaca
                  apa yang sudah kamu lakukan. */}
              {hydrated && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="eyebrow text-mute">
                    {t("Kenapa ruangan ini", "Why this room")}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-ink/80">
                    {completedCount === 0
                      ? t(
                          `Kamu belum menjalani percakapan apa pun, jadi Noera mulai dari yang paling mendasar: ${tr(labelFor(nextRoom.attribute)).toLowerCase()}.`,
                          `You have not lived a conversation yet, so Noera starts at the base: ${labelFor(nextRoom.attribute).toLowerCase()}.`,
                        )
                      : t(
                          `Dari ${completedCount} percakapan yang sudah kamu jalani, ${tr(labelFor(nextRoom.attribute)).toLowerCase()} yang paling tertinggal.`,
                          `Across the ${completedCount} conversation${completedCount === 1 ? "" : "s"} you have lived, ${labelFor(nextRoom.attribute).toLowerCase()} is furthest behind.`,
                        )}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.55] text-ink/80">
                    {t(
                      `Karena itu Noera menyarankan ${nextRoom.scenario.city} — ruangan yang mengujinya paling langsung.`,
                      `So Noera suggests ${nextRoom.scenario.city} — the room that tests it most directly.`,
                    )}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-[1.5] text-mute">
                    <span className="font-semibold text-ink">
                      {t("Fokus latihan: ", "Practice focus: ")}
                    </span>
                    {tr(nextRoom.scenario.tension)}
                  </p>
                  <button
                    onClick={() => goTo(SCENARIOS.indexOf(nextRoom.scenario))}
                    className="mt-3 inline-flex min-h-[44px] w-full items-center gap-2 rounded-[1.1rem] border border-line px-3.5 py-2.5 text-left transition-colors hover:border-ink/35"
                  >
                    <span className="display text-[15px]">{nextRoom.scenario.city}</span>
                    <span className="text-[12px] text-mute">
                      {nextRoom.replay
                        ? t("· ulangi ruangan ini", "· walk it again")
                        : t("· belum kamu jalani", "· not yet lived")}
                    </span>
                  </button>
                </div>
              )}

              <div className="mt-5 rounded-[1.1rem] bg-paper p-4">
                <p className="eyebrow text-mute">{t("Di ruang ini", "In this room")}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
                  {completedCount === 0
                    ? t(
                        "Belum ada yang bergerak. Kalimat pertama adalah yang paling murah untuk salah.",
                        "Nothing has moved yet. The first sentence is the cheapest one to get wrong.",
                      )
                    : t(
                        `Posisimu ${standing}/100 di mata ${scenario.npc.name}. Masih bisa diperbaiki — tapi tidak bisa dihapus.`,
                        `You stand at ${standing}/100 with ${scenario.npc.name}. Repair is possible — erasure isn't.`,
                      )}
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* --------------------------------------------------- ruang harian */}
        <section id="harian" data-tour="daily" className="mt-14 scroll-mt-24 border-t border-line pt-9">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                <span className="h-px w-8 bg-mute/50" />
                {t("Kalau ada dua menit", "When you have two minutes")}
              </p>
              <h2 className="display mt-2 text-[1.35rem]">
                {t("Ruang tambahan hari ini", "Today's extra room")}
              </h2>
              <p className="mt-2 max-w-[54ch] text-[13.5px] leading-relaxed text-mute">
                {t(
                  "Satu situasi pendek dari kehidupan sehari-hari, ganti tiap hari. Ini bukan bagian dari perjalanan di atas — ini alasan untuk kembali besok.",
                  "One short situation from everyday life, changed daily. It is not part of the journey above — it is the reason to come back tomorrow.",
                )}
              </p>
            </div>
            {hydrated && dailyDone && (
              <span className="eyebrow rounded-full bg-sage/12 px-3 py-1.5 text-sage">
                {t("Sudah dimainkan hari ini", "Played today")}
              </span>
            )}
          </div>
          <DailyRoom />
        </section>
      </main>

      <SiteFooter />
    </MotionProvider>
  );
}
