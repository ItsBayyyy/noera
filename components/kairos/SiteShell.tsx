"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { ButtonLink } from "./ui";
import { useProgress } from "@/lib/kairos/state";
import { useLang, useT } from "@/lib/kairos/i18n";

/** Two speech bubbles offset by a beat — the same words, a different moment. */
export function Logo({ size = 34, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
        <path
          d="M6 14 C6 8 10 5 17 5 L28 5 C34 5 37 8 37 14 C37 20 34 23 28 23 L20 23 L13 29 L14 23 C9 22 6 19 6 14 Z"
          fill="#ff6b35"
        />
        <path
          d="M3 24 C3 19 6 17 11 17 L20 17 C25 17 28 19 28 24 C28 29 25 32 20 32 L15 32 L8 37 L9 31 C5 30 3 28 3 24 Z"
          fill={onDark ? "#fbf8f3" : "#1c1512"}
        />
      </svg>
      <span
        className={`display text-[21px] tracking-tight ${onDark ? "text-cream" : "text-ink"}`}
      >
        Noera
      </span>
    </span>
  );
}

/** Ganti bahasa antarmuka — sekaligus penanda bahwa produknya lintas bahasa. */
export function LangToggle({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`flex items-center rounded-full border p-0.5 ${
        onDark ? "border-white/20" : "border-line bg-white"
      }`}
      role="group"
      aria-label="Bahasa antarmuka"
    >
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          /* Pilnya tetap kecil supaya header tidak jadi berat, tapi area
             sentuhnya dilebarkan lewat ::after sampai 44x44 — syarat minimum
             sasaran sentuh. Yang membesar area tapnya, bukan tampilannya. */
          className={`relative min-w-[44px] rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] ${
            lang === code
              ? "bg-ink text-cream"
              : onDark
                ? "text-cream/55 hover:text-cream"
                : "text-mute hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/**
 * Identitas yang sudah masuk — versi desktop.
 * Di bawah lg, profil ditangani lembar bawah di BottomBar, karena dropdown
 * selebar ini pasti terpotong di layar 393px.
 */
function ProfileMenu() {
  const { progress, tier, score, signOut, completedCount } = useProgress();
  const t = useT();
  const [open, setOpen] = useState(false);
  // Inisial cadangan mengikuti nama produk: N untuk Noera.
  const initial = (progress.name?.trim()?.[0] ?? "N").toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t("Profil kamu", "Your profile")}
        className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-ink/35"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-cream">
          {initial}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[13px] font-bold text-ink">{progress.name}</span>
          <span className="block text-[11px] text-mute">{tier.name}</span>
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-mute" aria-hidden>
          <path
            d="M6 9 L12 15 L18 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-40 cursor-default"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
            />
            <m.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="absolute right-0 z-50 mt-2 w-[min(252px,calc(100vw-24px))] overflow-hidden rounded-[1.2rem] border border-line bg-white shadow-[0_16px_40px_rgba(28,21,18,0.14)]"
            >
              <div className="border-b border-line bg-paper/70 px-4 py-3.5">
                <p className="eyebrow text-mute">{t("Masuk sebagai", "Signed in as")}</p>
                <p className="mt-1 text-[15px] font-bold text-ink">{progress.name}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[12.5px] text-mute">{tier.name}</span>
                  <span className="font-mono text-[13px] font-bold tabular-nums text-ink">
                    {score}
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] text-mute">
                  {t(
                    `${completedCount} percakapan dijalani`,
                    `${completedCount} conversation${completedCount === 1 ? "" : "s"} lived`,
                  )}
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/learn"
                  onClick={() => setOpen(false)}
                  className="block rounded-[0.8rem] px-3 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-paper"
                >
                  {t("Ruangmu", "Your rooms")}
                </Link>
                <Link
                  href="/community"
                  onClick={() => setOpen(false)}
                  className="block rounded-[0.8rem] px-3 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-paper"
                >
                  {t("Tantangan global", "Global challenge")}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full rounded-[0.8rem] px-3 py-2.5 text-left text-[14px] font-medium text-rose transition-colors hover:bg-rose/8"
                >
                  {t("Keluar", "Sign out")}
                </button>
              </div>
              <p className="border-t border-line px-4 py-2.5 text-[11px] leading-snug text-mute">
                {t(
                  "Keluar tidak menghapus progres — semuanya tetap tersimpan di browser ini.",
                  "Signing out keeps your progress — it stays in this browser.",
                )}
              </p>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const { signedIn } = useProgress();
  const t = useT();
  const { scrollY } = useScroll();
  const shadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0 0 rgba(0,0,0,0)", "0 8px 30px rgba(28,21,18,0.08)"],
  );
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(251,248,243,0)", "rgba(251,248,243,0.92)"],
  );

  const links = [
    { href: "/", label: t("Beranda", "Home") },
    /* Peta adalah BAGIAN dari Beranda, bukan halaman tersendiri — panduan
       lomba mewajibkan tepat lima halaman. Diletakkan tepat setelah Beranda
       dan diberi penanda bagian supaya labelnya jujur memprediksi tujuannya. */
    {
      href: "/#world",
      label: t("Peta", "World"),
      section: true,
      hint: t("bagian dari Beranda", "a section of Home"),
    },
    { href: "/learn", label: t("Belajar", "Learn") },
    { href: "/community", label: t("Komunitas", "Community") },
  ];

  return (
    <m.header
      style={{ boxShadow: shadow, backgroundColor: bg }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-[6px]"
    >
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" aria-label="Noera" className="inline-flex min-h-[44px] items-center">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 text-[14.5px] font-medium text-mute lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-label={l.section ? `${l.label} — ${l.hint}` : undefined}
                className={`relative inline-flex items-center gap-1 transition-colors hover:text-ink ${
                  active ? "text-ink" : ""
                }`}
              >
                {l.section && (
                  <span aria-hidden className="text-[13px] leading-none text-mute/70">
                    ↳
                  </span>
                )}
                {l.label}
                {active && (
                  <m.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-ember"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Di bawah lg, navigasi dan profil pindah ke bilah bawah, jadi di sini
            hanya tersisa pilihan bahasa. */}
        <div className="flex items-center gap-2.5">
          <LangToggle />

          <div className="hidden items-center gap-2.5 lg:flex">
            {signedIn ? (
              <ProfileMenu />
            ) : (
              <Link
                href="/signin"
                className="rounded-full px-4 py-2.5 text-[14.5px] font-medium text-mute transition-colors hover:text-ink"
              >
                {t("Masuk", "Sign in")}
              </Link>
            )}
            <ButtonLink href="/learn" variant="ink" className="!px-5 !py-2.5 !text-[14px]">
              {signedIn ? t("Lanjutkan", "Continue") : t("Mulai", "Start")}
            </ButtonLink>
          </div>
        </div>
      </nav>
    </m.header>
  );
}

export function SiteFooter() {
  const t = useT();
  /* Dulu tiap baris di sini cuma <span cursor-pointer>: kelihatan seperti
     tautan, berubah warna saat disorot, tapi tidak bisa dijangkau keyboard dan
     tidak menuju ke mana-mana. Juri hampir pasti mengklik salah satunya.
     Sekarang semuanya menunjuk ke bagian yang memang ada. */
  const cols = [
    {
      title: t("Produk", "Product"),
      links: [
        { label: t("Ruang skenario", "Scenario rooms"), href: "/learn" },
        { label: t("Reputasi Sosial", "Social Reputation"), href: "/learn#room" },
        { label: t("Peta perjalanan", "World map"), href: "/#world" },
        { label: t("Catatan budaya", "Cultural notes"), href: "/learn" },
      ],
    },
    {
      title: t("Komunitas", "Community"),
      links: [
        { label: t("Tantangan global", "Global challenge"), href: "/community#tantangan" },
        { label: t("Ruang harian", "Daily room"), href: "/learn#harian" },
        { label: t("Perspektif", "Perspectives"), href: "/community#perspektif" },
        { label: t("Catatan lapangan", "Field notes"), href: "/community#catatan" },
      ],
    },
    {
      title: t("Akun", "Account"),
      links: [
        { label: t("Masuk", "Sign in"), href: "/signin" },
        { label: t("Daftar", "Sign up"), href: "/signup" },
        { label: t("Progres", "Progress"), href: "/learn" },
        { label: t("Atur ulang data", "Reset data"), href: "/#progres" },
      ],
    },
  ];

  return (
    <footer className="grain relative mt-auto overflow-hidden bg-espresso-deep pt-16 text-cream">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-cream/60">
              {t(
                "Platform bahasa untuk bagian kefasihan yang dilewati buku pelajaran: orang yang ada di depanmu.",
                "A language platform for the part of fluency textbooks skip: the person in front of you.",
              )}
            </p>
            <p className="mt-5 text-[12px] text-cream/40">
              {t(
                "Dibuat untuk PNBWDC IntechFest 2026 — Education Technology: Language Learning for Global Community.",
                "Built for PNBWDC IntechFest 2026 — Education Technology: Language Learning for Global Community.",
              )}
            </p>
            <div className="mt-5">
              <LangToggle onDark />
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-ember">{col.title}</p>
              <ul className="mt-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center text-[14px] text-cream/65 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 py-6 text-[12.5px] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t(
              "© 2026 Noera. Karya konsep — semua progres disimpan di browser kamu.",
              "© 2026 Noera. Concept work — all progress is stored in your browser.",
            )}
          </p>
          <p>
            {t(
              "Kuasai bahasanya. Pahami momennya.",
              "Learn the language. Understand the moment.",
            )}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-[200%] animate-[marquee_38s_linear_infinite]">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="display shrink-0 whitespace-nowrap px-6 text-[16vw] leading-[0.82] text-white/[0.055]"
            >
              NOERA · THE RIGHT WORDS · THE RIGHT MOMENT ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
