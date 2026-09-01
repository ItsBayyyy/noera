"use client";

import { m } from "framer-motion";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter, SiteNav } from "@/components/kairos/SiteShell";
import { PerspectivePoll } from "@/components/kairos/PerspectivePoll";
import { GlobalChallenge } from "@/components/kairos/GlobalChallenge";
import { Flag } from "@/components/kairos/Flag";
import { HandNote } from "@/components/kairos/Ink";
import { ButtonLink, InkUnderline, TornEdge } from "@/components/kairos/ui";
import {
  COMMUNITY_THREADS,
  GLOBAL_CHALLENGE,
  LIVE_REGIONS,
  POLLS,
  count,
} from "@/lib/kairos/data";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";

export default function CommunityPage() {
  const t = useT();
  const tr = useTr();

  return (
    <MotionProvider>
      <SiteNav />

      <main className="flex flex-col overflow-x-hidden pt-[96px]">
        {/* ------------------------------------------------------- header */}
        <section className="mx-auto w-full max-w-[1400px] px-5 pb-12 pt-6 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-end">
            <div>
              <h1 className="display mt-5 text-[2.8rem] leading-[1.0] md:text-[4rem]">
                {t("Situasi sama.", "Same situation.")}
                <br />
                <InkUnderline color="#3e7c5a">
                  {t("Dunia berbeda.", "Different world.")}
                </InkUnderline>
              </h1>
              <p className="mt-6 max-w-[50ch] text-[15.5px] leading-[1.65] text-mute">
                {t(
                  "Semua pelajar di sini masuk ke momen sosial yang sama. Yang membedakan mereka adalah apa yang mereka anggap sopan. Jawab dulu, lalu temukan dari mana nalurimu berasal — dan di mana ia akan dibaca berbeda.",
                  "Every learner here walks into the same social moment. What separates them is what they consider polite. Answer first, then find out where your instinct came from — and where it would be read differently.",
                )}
              </p>
            </div>

            {/* live strip */}
            <div className="grain relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-clay">
                  {t("Sedang dilatih sekarang", "Being practised right now")}
                </p>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-sage">
                  <m.span
                    className="h-2 w-2 rounded-full bg-sage"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {t("3.849 online", "3,849 online")}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {LIVE_REGIONS.slice(0, 5).map((r, i) => (
                  <m.li
                    key={r.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-[13.5px]"
                  >
                    <Flag code={r.flag} size={22} />
                    <span className="font-semibold">{tr(r.name)}</span>
                    <span className="text-mute">— {tr(r.note)}</span>
                    <span className="ml-auto font-mono text-[12px] text-mute">
                      {r.learners}
                    </span>
                  </m.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- global challenge */}
        <section id="tantangan" className="grain relative scroll-mt-24 bg-espresso py-20 text-cream md:py-24">
          <TornEdge position="top" color="#fbf8f3" />
          <TornEdge position="bottom" color="#fbf8f3" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div className="max-w-[560px]">
                <p className="flex items-baseline gap-3">
                  <span className="display text-[2.6rem] leading-none text-ember/35">26</span>
                  <span className="max-w-[13ch] text-[11.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-cream/60">
                    {t("wilayah, satu situasi", "regions, one situation")}
                  </span>
                </p>
                <h2 className="display mt-5 text-[2.2rem] leading-[1.04] md:text-[3rem]">
                  {t("Satu situasi. Semua orang. Minggu ini.", "One situation. Everyone. This week.")}
                </h2>
              </div>
              <p className="max-w-[44ch] text-[15px] leading-[1.65] text-cream/65">
                {t(
                  `${count(GLOBAL_CHALLENGE.responders)} pelajar di ${GLOBAL_CHALLENGE.regionCount} wilayah mendapat tiga detik yang sama. Tetapkan jawabanmu, lalu lihat sejauh apa kalimat yang sama dibaca berbeda di tempat lain.`,
                  `${count(GLOBAL_CHALLENGE.responders)} learners in ${GLOBAL_CHALLENGE.regionCount} regions get the same three seconds. Commit to your answer, then see how differently the same sentence is read elsewhere.`,
                )}
              </p>
            </div>

            <GlobalChallenge />
          </div>
        </section>

        {/* ------------------------------------------------------- polls */}
        <section id="perspektif" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 py-20 md:px-10 md:py-24">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-[560px]">
              {/* Angka hantu: empat wilayah, satu situasi — angkanya yang
                  membuka, bukan label. Memutus tiga pembuka garis-redaksi
                  yang berurutan. */}
              <p className="flex items-baseline gap-3">
                <span className="display text-[2.6rem] leading-none text-ink/12">4</span>
                <span className="max-w-[14ch] text-[11.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-mute">
                  {t("wilayah, satu ruangan", "regions, one room")}
                </span>
              </p>
              <h2 className="display mt-4 text-[2.2rem] leading-[1.04] md:text-[3rem]">
                {t("Empat wilayah. Satu ruangan. Tidak ada kata sepakat.", "Four regions. One room. No agreement.")}
              </h2>
            </div>
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-mute">
              {t(
                "Tiap jajak pendapat terkunci sampai kamu menetapkan jawaban. Setelah itu sebarannya terbuka — dan yang lebih penting, seorang pelajar dari tiap wilayah menjelaskan kenapa jawabannya terasa sudah jelas buat dia.",
                "Each poll stays locked until you commit to an answer. Then it shows the split — and, more importantly, a learner from each region explaining why their answer felt obvious to them.",
              )}
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Aturannya sama untuk kedua kartu, jadi hanya ditulis sekali —
                dua kalimat identik berdampingan terbaca sebagai boilerplate. */}
            {POLLS.map((poll, i) => (
              <PerspectivePoll key={poll.id} poll={poll} showRule={i === 0} />
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- threads */}
        <section id="catatan" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 pb-24 md:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                <span className="h-px w-8 bg-mute/50" />
                {t("Catatan lapangan", "Field notes")}
              </p>
              <h2 className="display mt-4 text-[2rem] leading-none md:text-[2.6rem]">
                {t("Kesalahan yang layak dibaca.", "Mistakes worth reading.")}
              </h2>
            </div>
            <p className="max-w-[38ch] text-[14px] text-mute">
              {t(
                "Bukan pamer pencapaian — ini catatan momen yang jatuhnya keliru, ditulis oleh orang yang mengalaminya.",
                "Not a feed of achievements — a record of moments that landed wrong, written by the people they landed on.",
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {COMMUNITY_THREADS.map((item, i) => (
              <m.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={
                  i === 0
                    ? "relative flex flex-col border-t-2 border-ink pt-5 md:pr-6"
                    : "grain relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-6"
                }
              >
                <span className="eyebrow text-clay">{tr(item.scenario)}</span>
                <h3 className="display mt-3 text-[1.28rem] leading-[1.2]">{tr(item.title)}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-mute">
                  {tr(item.excerpt)}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
                  <span className="flex items-center gap-2 font-semibold">
                    <Flag code={item.flag} size={19} />
                    {item.author}
                  </span>
                  <span className="font-mono text-mute">
                    {t(
                      `${item.replies} balasan · ${item.insight} “ini membantu”`,
                      `${item.replies} replies · ${item.insight} “this helped”`,
                    )}
                  </span>
                </div>
              </m.article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-[1.75rem] border border-dashed border-parchment bg-paper/60 px-6 py-10 text-center">
            <HandNote color="#b04a19">
              {t("nalurimu adalah data buat orang lain", "your instinct is somebody else's data")}
            </HandNote>
            <h3 className="display text-[1.7rem] md:text-[2.1rem]">
              {t("Setiap jawaban jadi bagian dari petanya.", "Every answer becomes part of the map.")}
            </h3>
            <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-mute">
              {t(
                "Apa yang kamu pilih minggu ini adalah yang dibaca pelajar lain sebelum mereka masuk ke ruangan yang sama minggu depan.",
                "What you chose this week is what another learner reads before they walk into the same room next week.",
              )}
            </p>
            <ButtonLink href="/learn">{t("Mainkan satu skenario →", "Play a scenario →")}</ButtonLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </MotionProvider>
  );
}
