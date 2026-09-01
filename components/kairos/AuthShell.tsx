"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import type { ReactNode } from "react";
import { Character } from "./Character";
import { Logo } from "./SiteShell";
import { HandNote } from "./Ink";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";

/* Authentication stays quiet on purpose — the product starts on the other
   side of this page, so the only job here is to get out of the way. */

/**
 * One-click entry for reviewers. Loads the demo profile (mid-journey, with
 * relationships already carrying history) and drops straight into a scenario.
 * The real form stays exactly where it is, directly underneath.
 */
export function DemoLogin({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const { loadDemo } = useProgress();
  const t = useT();
  const buttonLabel = label ?? t("Jelajahi profil contoh", "Explore a sample profile");

  function enterDemo() {
    loadDemo();
    // Langsung ke ruangnya, bukan ke puncak halaman Belajar.
    router.push("/learn#room");
  }

  return (
    <div className={className}>
      <div className="grain relative overflow-hidden rounded-[1.2rem] border border-line bg-paper/70 p-4">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow text-clay">
              {t("Untuk juri & peninjau", "For judges & reviewers")}
            </p>
            <span className="eyebrow rounded-full bg-white px-2.5 py-1 text-mute">
              {t("Tanpa kata sandi", "No password")}
            </span>
          </div>

          <m.button
            type="button"
            onClick={enterDemo}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ember-deep px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(255,107,53,0.28)] transition-colors hover:bg-clay"
          >
            {buttonLabel} →
          </m.button>

          {/* Satu kalimat sebelum tombol. Rinciannya menunggu di sisi lain —
              menjelaskan seluruh sistem sebelum orang menekan apa pun justru
              menunda hal yang paling menjelaskan produknya. */}
          <p className="mt-3 text-[13.5px] leading-relaxed text-mute">
            {t(
              "Profil yang sudah menjalani dua percakapan, dengan hubungan yang tersimpan.",
              "A profile with two conversations already lived, and relationships that carried over.",
            )}
          </p>
          <HandNote className="mt-1" color="#b04a19">
            {t("langsung masuk ke skenario", "straight into a scenario")}
          </HandNote>
        </div>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow text-mute">
          {t("atau pakai formulir", "or use the form")}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}

export function AuthField({
  label,
  type = "text",
  name,
  placeholder,
  autoComplete,
  required = true,
}: {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-mute">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-mute focus:border-ink"
      />
    </label>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  quote,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  quote: { line: string; caption: string };
}) {
  const t = useT();
  return (
    <div className="grid min-h-screen items-start lg:grid-cols-[1fr_0.85fr]">
      {/* form side — ini isi utama halamannya, jadi <main>. Tanpa landmark,
          axe menandai dua halaman auth ini "content not contained by
          landmarks" dan pengguna pembaca layar tidak punya cara melompat. */}
      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Link href="/" className="inline-flex min-h-[44px] w-fit items-center">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <h1 className="display text-[2.3rem] leading-none md:text-[2.7rem]">{title}</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-[14px] text-mute">{footer}</div>
        </div>

        <p className="text-[12px] text-mute">
          {t(
            "Karya konsep · tidak ada akun sungguhan yang dibuat, progres tersimpan di browser kamu.",
            "Concept project · no real accounts are created, progress lives in your browser.",
          )}
        </p>
      </main>

      {/* stage side — naratif, bukan isi utama, jadi <aside>. */}
      <aside className="grain relative hidden overflow-hidden bg-espresso px-10 py-12 text-cream lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 70% 20%, rgba(255,177,120,0.18), transparent 65%)",
          }}
        />
        <p className="eyebrow relative text-ember">Noera</p>

        <div className="relative">
          <m.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="display max-w-[16ch] text-[2.4rem] leading-[1.05]"
          >
            {quote.line}
          </m.blockquote>
          <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-cream/60">
            {quote.caption}
          </p>
        </div>

        <div className="relative">
          <div className="relative flex items-end gap-1">
            {/* satu garis tangan tipis, melengkung tepat di antara dua kepala */}
            <svg
              className="pointer-events-none absolute left-[112px] top-[34px] h-8 w-[92px] overflow-visible"
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                pathLength={1}
                className="ink-now"
                d="M3 24 C 22 6, 52 3, 74 9 C 86 12, 94 18, 97 24"
                fill="none"
                stroke="#ff9d6b"
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.55"
              />
            </svg>
            <Character
              spec={{ skin: "#e8c39a", hair: "#2c2320", hairStyle: "crop", outfit: "#3d6b8c", collar: "#f4ede1", glasses: true }}
              expression="warm"
              size={158}
            />
            <div className="scale-x-[-1]">
              <Character
                spec={{ skin: "#c98d63", hair: "#241a16", hairStyle: "wave", outfit: "#c2551f", collar: "#f4ede1" }}
                expression="happy"
                size={140}
              />
            </div>
          </div>

          {/* lantai: satu garis, cukup untuk membuat ini terasa ruangan */}
          <span className="mt-1 block h-px w-[78%] bg-cream/15" />
          <p className="hand mt-2 text-[17px] text-cream/45">
            {/* Dulu berbunyi "percakapannya berlanjut" — persis mengulang judul
              panel di /signin ("Percakapannya berlanjut tanpa kamu."). Sekarang
              menambah hal baru: ingatan sosial, yang memang fitur nyata. */}
            {t("dan dia masih ingat", "and he still remembers")}
          </p>
        </div>
      </aside>
    </div>
  );
}
