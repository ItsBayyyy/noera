"use client";

import { useEffect, useRef } from "react";
import { useLang, useT } from "@/lib/kairos/i18n";

/* --------------------------------------------------------------------------
   TULANG PUNGGUNG BELAJAR KAIROS

   Sebelumnya empat keterampilan ini tampil sebagai empat pil berjajar —
   MEMBACA · MENYIMAK · BERBICARA · KONTEKS BUDAYA. Itu daftar fitur, bukan
   sistem. Juri jadi harus merangkai sendiri hubungan antar bagiannya.

   Enam tahap di bawah ini adalah satu putaran utuh, dan bentuknya sama di
   mana pun ia muncul: sebagai pengantar di beranda, dan sebagai penanda
   tahap yang sedang berjalan di dalam percakapan.

   Bukan progress bar, bukan stepper SaaS: garisnya digambar tangan, tahapnya
   berupa kata, dan yang sedang berjalan dilingkari — bukan diisi warna.
   -------------------------------------------------------------------------- */

/* Tahap yang belum aktif TIDAK boleh memakai text-mute dengan opacity —
   #6b5d50 pada 70% jadi #968b81 di atas krem, rasionya 3,14:1 dan gagal WCAG.
   Pembeda antara aktif dan tidak sudah cukup dari warna penuh + lingkaran
   tangan di tahap yang sedang berjalan. */
export type Stage = "baca" | "dengar" | "pilih" | "ucapkan" | "akibat" | "kenapa";

/* Urutannya sama persis dengan yang dijalankan ScenarioPlayer: memilih dulu,
   lalu akibatnya, lalu sebabnya, dan baru diucapkan. Sebelumnya "ucapkan"
   ditaruh di posisi keempat, sehingga lingkaran tahap melompat mundur ketika
   percakapan sampai ke latihan mengucapkan — dan beranda mengajarkan urutan
   yang bukan urutan sebenarnya. */
export const STAGES: Stage[] = ["baca", "dengar", "pilih", "akibat", "kenapa", "ucapkan"];

function useStageLabels() {
  const t = useT();
  return {
    baca: t("Baca", "Read"),
    dengar: t("Dengar", "Listen"),
    pilih: t("Pilih", "Choose"),
    ucapkan: t("Ucapkan", "Speak"),
    akibat: t("Akibat", "Consequence"),
    kenapa: t("Kenapa", "Why"),
  } as Record<Stage, string>;
}

const NOTE: Record<Stage, { id: string; en: string }> = {
  baca: { id: "apa yang sebenarnya diminta?", en: "what is actually being asked?" },
  dengar: { id: "nadanya bilang apa?", en: "what does the tone say?" },
  pilih: { id: "tiga-tiganya benar", en: "all three are correct" },
  ucapkan: { id: "katakan, jangan cuma pilih", en: "say it, don't just pick it" },
  akibat: { id: "wajahnya berubah", en: "their face changes" },
  kenapa: { id: "dan kamu tahu sebabnya", en: "and you learn why" },
};

/**
 * Menyembunyikan goresan penghubung yang jatuh di ujung baris.
 *
 * Deretan tahap ini boleh melipat, dan titik lipatnya tidak bisa ditebak dari
 * lebar layar: penanda di dalam percakapan ikut lebar panelnya, yang di 1024px
 * justru lebih sempit daripada di 820px karena tata letaknya berubah dua kolom.
 * Jadi barisnya diukur langsung — sebuah goresan disembunyikan kalau tahap
 * sesudahnya ternyata sudah pindah baris, karena di situ ia tidak menyambung
 * ke apa pun dan malah menunjuk ke arah yang salah.
 *
 * Dipakai `visibility`, bukan `display`: ruangnya harus tetap ada. Kalau
 * goresannya benar-benar dikeluarkan dari aliran, tempat yang kosong itu bisa
 * membuat tahap berikutnya naik ke baris ini, lalu goresannya perlu muncul
 * lagi, lalu melipat lagi — dan pengamat ukuran akan berputar tanpa henti.
 */
function useHideWrappedConnectors(ref: React.RefObject<HTMLOListElement | null>) {
  const { lang } = useLang();
  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const apply = () => {
      const items = Array.from(ol.children) as HTMLElement[];
      items.forEach((li, i) => {
        const conn = li.querySelector<SVGElement>("[data-conn]");
        if (!conn) return;
        const next = items[i + 1];
        const wrapped = !next || next.offsetTop > li.offsetTop + 2;
        conn.style.visibility = wrapped ? "hidden" : "";
      });
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(ol);
    return () => observer.disconnect();
    // Ganti bahasa mengubah lebar kata, jadi titik lipatnya ikut bergeser.
  }, [ref, lang]);
}

/* Garis tangan penghubung antar tahap — satu goresan pendek, tidak lurus. */
function Link({ color = "#c9bbaa", className = "" }: { color?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 12"
      width="34"
      height="10"
      data-conn
      className={`shrink-0 overflow-visible ${className}`}
      aria-hidden
    >
      <path
        d="M2 7 C 10 3, 18 10, 26 5 C 30 3, 34 6, 37 6"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Lingkaran tangan di sekeliling tahap yang sedang berjalan. */
function Ring({ color = "#b04a19" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+16px)]"
      aria-hidden
    >
      <path
        className="ink-now"
        d="M18 8 C 52 2, 92 3, 110 12 C 118 17, 112 33, 84 39 C 54 45, 20 43, 8 35 C 0 29, 3 12, 22 7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * `variant="narrative"` — versi beranda: tiap tahap membawa catatan tangan
 * kecil, jadi terbaca sebagai penjelasan cara kerja Kairos.
 *
 * `variant="marker"` — versi di dalam percakapan: ringkas, satu baris, hanya
 * menandai posisi sekarang.
 */
export function LearningSpine({
  active,
  variant = "marker",
  onDark = false,
  className = "",
}: {
  active?: Stage;
  variant?: "narrative" | "marker";
  onDark?: boolean;
  className?: string;
}) {
  const t = useT();
  const labels = useStageLabels();
  const lineColor = onDark ? "rgba(255,240,225,0.28)" : "#c9bbaa";
  const ringColor = onDark ? "#ff9d6b" : "#b04a19";
  const ref = useRef<HTMLOListElement>(null);
  useHideWrappedConnectors(ref);

  if (variant === "narrative") {
    return (
      <ol ref={ref} className={`flex flex-wrap items-start gap-x-1 gap-y-5 ${className}`}>
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-start gap-1">
            <div className="w-[128px] sm:w-auto sm:min-w-[104px] sm:max-w-[132px]">
              <span className="relative inline-block">
                {active === s && <Ring color={ringColor} />}
                <span
                  className={`display text-[1.15rem] leading-none ${
                    onDark ? "text-cream" : "text-ink"
                  }`}
                >
                  {labels[s]}
                </span>
              </span>
              <span
                className={`hand mt-1.5 block text-[16px] leading-tight ${
                  onDark ? "text-cream/55" : "text-mute"
                }`}
              >
                {t(NOTE[s].id, NOTE[s].en)}
              </span>
            </div>
            {/* Di varian ini tiap tahap sejajar atas (`items-start`), jadi
                goresannya jatuh 5px di atas titik tengah kata dan terlihat
                mengambang. Turunkan supaya sejajar secara optis. */}
            {i < STAGES.length - 1 && <Link color={lineColor} className="mt-[5px]" />}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      ref={ref}
      className={`flex flex-wrap items-center gap-x-1 gap-y-2 ${className}`}
      aria-label={t("Tahap percakapan", "Conversation stages")}
    >
      {STAGES.map((s, i) => (
        <li key={s} className="flex items-center gap-1">
          <span className="relative inline-block px-0.5">
            {active === s && <Ring color={ringColor} />}
            <span
              className={`text-[11.5px] font-bold uppercase tracking-[0.1em] ${
                active === s
                  ? onDark
                    ? "text-cream"
                    : "text-ink"
                  : onDark
                    ? "text-cream/65"
                    : "text-mute"
              }`}
              aria-current={active === s ? "step" : undefined}
            >
              {labels[s]}
            </span>
          </span>
          {i < STAGES.length - 1 && <Link color={lineColor} />}
        </li>
      ))}
    </ol>
  );
}
