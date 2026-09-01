"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";

/* --------------------------------------------------------------------------
   TUR PERKENALAN

   Bukan modal berisi paragraf. Sorotan yang menunjuk elemen asli di halaman,
   dilingkari tinta tangan, satu kalimat per langkah. Muncul sekali untuk
   pengguna baru, bisa dilewati kapan saja, dan bisa diulang lewat tombol
   "Ulangi tur" di halaman Belajar.
   -------------------------------------------------------------------------- */

interface Step {
  selector: string;
  title: string;
  body: string;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 10;

/**
 * Lingkaran tinta pada koordinat layar.
 * SVG-nya sendiri tidak pernah berpindah atau berubah ukuran — hanya jalur
 * "d"-nya yang digambar ulang. Itu perubahan tahap paint, jadi tidak pernah
 * terhitung sebagai pergeseran tata letak, dan tebal garisnya tetap presisi.
 */
function inkLoop(rect: Rect) {
  const x = rect.left - 6;
  const y = rect.top - 6;
  const w = rect.width + 12;
  const h = rect.height + 12;
  const r = Math.min(w, h) * 0.16;
  const px = (v: number) => x + v;
  const py = (v: number) => y + v;
  return [
    `M ${px(r * 0.9)} ${py(h * 0.2)}`,
    `C ${px(w * 0.3)} ${py(-h * 0.04)}, ${px(w * 0.72)} ${py(h * 0.03)}, ${px(w - r * 0.5)} ${py(h * 0.22)}`,
    `C ${px(w + r * 0.3)} ${py(h * 0.45)}, ${px(w - r * 0.1)} ${py(h * 0.8)}, ${px(w - r)} ${py(h * 0.94)}`,
    `C ${px(w * 0.65)} ${py(h + h * 0.04)}, ${px(w * 0.3)} ${py(h * 0.99)}, ${px(r * 0.7)} ${py(h * 0.9)}`,
    `C ${px(-r * 0.35)} ${py(h * 0.72)}, ${px(-r * 0.1)} ${py(h * 0.3)}, ${px(r * 1.4)} ${py(h * 0.16)}`,
  ].join(" ");
}

export function Onboarding() {
  const { progress, hydrated, markTourDone } = useProgress();
  const t = useT();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [running, setRunning] = useState(false);

  const steps: Step[] = [
    {
      selector: '[data-tour="steps"]',
      title: t("Tiga langkah, selalu sama", "Three steps, every time"),
      body: t(
        "Setiap ruang berjalan lewat urutan ini: baca pesannya, katakan sesuatu, lalu tanggung akibatnya. Kartu ini bisa kamu tutup kalau sudah hafal.",
        "Every room runs in this order: read the message, say something, live with the consequence. You can close this card once it becomes second nature.",
      ),
    },
    {
      selector: '[data-tour="journey"]',
      title: t("Enam ruang, satu perjalanan", "Six rooms, one journey"),
      body: t(
        "Tiap kartu adalah satu situasi sosial di kota yang berbeda. Yang sudah kamu jalani ditandai, dan “Berikutnya” selalu menunjuk ruang yang belum dibuka.",
        "Each card is one social situation in a different city. The ones you have lived get marked, and “Next up” always points at the room you have not opened.",
      ),
    },
    {
      selector: '[data-tour="room"]',
      title: t("Di sinilah semuanya terjadi", "This is where it happens"),
      body: t(
        "Kamu memilih satu dari tiga kalimat yang sama-sama benar. Wajah lawan bicara berubah lebih dulu, angkanya menyusul — dan kalimat dia berikutnya ikut berubah.",
        "You pick one of three sentences that are all correct. Their face moves first, the numbers follow — and their next line changes because of it.",
      ),
    },
    {
      selector: '[data-tour="reputation"]',
      title: t("Angka yang kamu bangun sendiri", "Numbers you built yourself"),
      body: t(
        "Enam atribut ini cuma bergerak kalau ada orang di dalam skenario yang bereaksi pada ucapanmu. Tidak ada XP, tidak ada rentetan harian.",
        "These six attributes only move when someone inside a scenario reacts to what you said. No XP, no daily streaks.",
      ),
    },
    {
      selector: '[data-tour="daily"]',
      title: t("Alasan untuk kembali besok", "A reason to come back tomorrow"),
      body: t(
        "Satu situasi pendek yang berganti tiap hari, plus bocoran ruang besok. Melewatkan satu hari tidak menghilangkan apa pun.",
        "One short situation that changes daily, plus a peek at tomorrow's room. Missing a day costs you nothing.",
      ),
    },
  ];

  const measure = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top - PAD,
      left: r.left - PAD,
      width: r.width + PAD * 2,
      height: r.height + PAD * 2,
    };
  }, []);

  // Mulai sendiri untuk pengguna yang baru pertama kali masuk.
  useEffect(() => {
    if (!hydrated || progress.tourDone || running) return;
    const timer = setTimeout(() => setRunning(true), 700);
    return () => clearTimeout(timer);
  }, [hydrated, progress.tourDone, running]);

  // Bawa target ke tengah layar, lalu ukur setelah gulirannya berhenti.
  useEffect(() => {
    if (!running) return;
    const step = steps[index];
    const el = document.querySelector(step.selector);
    if (!el) {
      // Elemennya tidak ada (mis. kartu panduan sudah ditutup) — lompati.
      if (index < steps.length - 1) setIndex((i) => i + 1);
      else finish();
      return;
    }
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    const timer = setTimeout(() => setRect(measure(step.selector)), reduced ? 60 : 480);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, reduced]);

  useEffect(() => {
    if (!running) return;
    const onResize = () => setRect(measure(steps[index].selector));
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index]);

  function finish() {
    setRunning(false);
    setRect(null);
    setIndex(0);
    markTourDone();
  }

  if (!running || !rect) return null;

  const isLast = index === steps.length - 1;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const below = rect.top + rect.height + 200 < vh;
  const cardTop = below ? rect.top + rect.height + 16 : Math.max(16, rect.top - 216);
  const cardLeft = Math.min(Math.max(16, rect.left), Math.max(16, vw - 372));

  return (
    <AnimatePresence>
      <m.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[95]"
        role="dialog"
        aria-modal="true"
        aria-label={t("Tur perkenalan", "Introduction tour")}
      >
        {/* Sorotan dan lasso digerakkan lewat transform (x/y/scale), bukan
            top/left/width/height. Properti layout memicu pergeseran tata letak
            yang terhitung CLS; transform dikomposit GPU dan tidak. */}
        <m.div
          className="pointer-events-none absolute left-0 top-0 h-[100px] w-[100px] origin-top-left rounded-[1.2rem]"
          animate={{
            x: rect.left,
            y: rect.top,
            scaleX: rect.width / 100,
            scaleY: rect.height / 100,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          style={{ boxShadow: "0 0 0 9999px rgba(28,21,18,0.62)" }}
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <m.path
            key={index}
            d={inkLoop(rect)}
            fill="none"
            stroke="#ff6b35"
            strokeWidth="2.6"
            strokeLinecap="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.85, ease: [0.2, 0, 0, 1] }}
          />
        </svg>

        {/* kartu penjelasan */}
        <m.div
          key={`card-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: cardLeft, y: cardTop }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="grain absolute left-0 top-0 w-[calc(100vw-32px)] max-w-[356px] overflow-hidden rounded-[1.4rem] border border-line bg-cream p-5 shadow-[0_20px_50px_rgba(28,21,18,0.28)]"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-clay">
                {t(`Langkah ${index + 1} dari ${steps.length}`, `Step ${index + 1} of ${steps.length}`)}
              </span>
              <button
                onClick={finish}
                className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] text-[12px] font-semibold text-mute underline underline-offset-4 hover:text-ink"
              >
                {t("Lewati tur", "Skip tour")}
              </button>
            </div>

            <h3 className="display mt-2 text-[1.3rem] leading-[1.2]">{steps[index].title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">{steps[index].body}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.selector}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-5 bg-clay" : "w-1.5 bg-parchment"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => setIndex((i) => i - 1)}
                    className="rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-mute transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    {t("Kembali", "Back")}
                  </button>
                )}
                <m.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-espresso"
                >
                  {isLast ? t("Mulai main", "Start playing") : t("Lanjut", "Next")}
                </m.button>
              </div>
            </div>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}
