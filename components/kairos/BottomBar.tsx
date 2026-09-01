"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect, useState } from "react";
import { LangToggle } from "./SiteShell";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";

/* --------------------------------------------------------------------------
   NAVIGASI BAWAH (mobile & tablet)

   Di layar kecil, menu utama pindah ke jempol. Bilah atas cuma menyisakan
   identitas dan pilihan bahasa, sementara perpindahan halaman dan profil
   ditangani di sini — termasuk profil, yang di layar sempit muncul sebagai
   lembar yang naik dari bawah, bukan dropdown yang terpotong tepi layar.
   -------------------------------------------------------------------------- */

const ICON = {
  home: "M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-4.6v-5.4H9.6V21H5a1 1 0 0 1-1-1Z",
  room: "M4 8.4C4 6 5.6 4.6 8.4 4.6h7.2C18.4 4.6 20 6 20 8.4c0 2.4-1.6 3.8-4.4 3.8h-3l-3.6 3 .5-3C6.4 11.7 4 10.9 4 8.4Z",
  world: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 0c-2.4 2.1-3.6 4.9-3.6 8.5s1.2 6.4 3.6 8.5m0-17c2.4 2.1 3.6 4.9 3.6 8.5s-1.2 6.4-3.6 8.5M3.8 12h16.4",
  user: "M12 12.4a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8ZM5 20.4c.6-3.5 3.4-5.4 7-5.4s6.4 1.9 7 5.4",
};

function CommunityIcon() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9.2" r="3.1" />
      <circle cx="16.6" cy="10.8" r="2.4" />
      <path d="M3.6 19.4c.5-3 2.7-4.7 5.4-4.7s4.9 1.7 5.4 4.7" />
      <path d="M16.2 15.1c2 .3 3.4 1.7 3.8 4.3" />
    </g>
  );
}

export function BottomBar() {
  const pathname = usePathname();
  const t = useT();
  const { signedIn, progress, tier, score, signOut, completedCount, hydrated } =
    useProgress();
  const [sheet, setSheet] = useState(false);

  // Halaman masuk/daftar adalah alur terfokus — bilahnya menyingkir.
  const hidden = pathname === "/signin" || pathname === "/signup";

  // Tutup lembar profil setiap kali halaman berganti.
  useEffect(() => setSheet(false), [pathname]);

  // Kunci gulir di belakang lembar profil.
  useEffect(() => {
    if (!sheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheet]);

  if (hidden) return null;

  /* Urutannya disamakan dengan nav desktop: Peta tepat setelah Beranda,
     karena ia memang bagian dari Beranda — bukan halaman tersendiri. */
  const items = [
    { href: "/", label: t("Beranda", "Home"), path: ICON.home },
    {
      href: "/#world",
      label: t("Peta", "Map"),
      path: ICON.world,
      hint: t("bagian dari Beranda", "a section of Home"),
    },
    { href: "/learn", label: t("Belajar", "Learn"), path: ICON.room },
    { href: "/community", label: t("Komunitas", "Community"), icon: <CommunityIcon /> },
  ];

  const initial = (progress.name?.trim()?.[0] ?? "N").toUpperCase();

  return (
    <LazyMotion features={domAnimation}>
      <nav
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-cream/95 backdrop-blur-[8px] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={t("Navigasi utama", "Main navigation")}
      >
        <ul className="mx-auto flex max-w-[520px] items-stretch">
          {items.map((item) => {
            const active =
              item.href === "/#world"
                ? false
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.hint ? `${item.label} — ${item.hint}` : undefined}
                  className={`relative flex h-[62px] flex-col items-center justify-center gap-1 transition-colors ${
                    active ? "text-ink" : "text-mute"
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                    {item.icon ?? (
                      <path
                        d={item.path}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                  <span className="text-[10.5px] font-semibold tracking-[0.01em]">
                    {item.label}
                  </span>

                  {/* garis tinta di bawah tab aktif */}
                  {active && (
                    <m.svg
                      layoutId="bottom-active"
                      viewBox="0 0 40 6"
                      className="absolute bottom-1.5 h-[5px] w-9 overflow-visible"
                      aria-hidden
                    >
                      <path
                        d="M2 4 C 10 1.5, 20 5, 30 2.5 C 34 1.6, 36 3.4, 38 2.8"
                        fill="none"
                        stroke="#ff6b35"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </m.svg>
                  )}
                </Link>
              </li>
            );
          })}

          {/* profil / masuk */}
          <li className="flex-1">
            <button
              onClick={() => setSheet(true)}
              aria-haspopup="dialog"
              aria-expanded={sheet}
              className={`relative flex h-[62px] w-full flex-col items-center justify-center gap-1 transition-colors ${
                sheet ? "text-ink" : "text-mute"
              }`}
            >
              {hydrated && signedIn ? (
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink text-[11px] font-bold text-cream">
                  {initial}
                </span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d={ICON.user}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span className="text-[10.5px] font-semibold">
                {hydrated && signedIn ? t("Profil", "Profile") : t("Masuk", "Sign in")}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* ---------------------------------------------- lembar profil ---- */}
      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <m.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
              aria-label={t("Tutup", "Close")}
              className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            />
            <m.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              role="dialog"
              aria-modal="true"
              aria-label={t("Profil", "Profile")}
              className="grain absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[1.75rem] border-t border-line bg-cream"
              style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
            >
              <div className="relative z-10 px-5 pt-3">
                <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-parchment" />

                {hydrated && signedIn ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[17px] font-bold text-cream">
                        {initial}
                      </span>
                      <div className="flex-1">
                        <p className="text-[16px] font-bold">{progress.name}</p>
                        <p className="text-[12.5px] text-mute">
                          {tier.name} ·{" "}
                          {t(
                            `${completedCount} percakapan dijalani`,
                            `${completedCount} conversations lived`,
                          )}
                        </p>
                      </div>
                      <span className="display text-[1.8rem] leading-none tabular-nums">
                        {score}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <Link
                        href="/learn"
                        className="block rounded-[1rem] border border-line bg-white px-4 py-3.5 text-[15px] font-semibold"
                      >
                        {t("Ruangmu", "Your rooms")}
                      </Link>
                      <Link
                        href="/community"
                        className="block rounded-[1rem] border border-line bg-white px-4 py-3.5 text-[15px] font-semibold"
                      >
                        {t("Tantangan global", "Global challenge")}
                      </Link>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-[1rem] border border-line bg-white px-4 py-3">
                      <span className="text-[14px] font-semibold">
                        {t("Bahasa", "Language")}
                      </span>
                      <LangToggle />
                    </div>

                    <button
                      onClick={() => {
                        signOut();
                        setSheet(false);
                      }}
                      className="mt-4 w-full rounded-full border border-rose/40 px-5 py-3 text-[14.5px] font-semibold text-rose"
                    >
                      {t("Keluar", "Sign out")}
                    </button>
                    <p className="mt-3 text-center text-[11.5px] leading-snug text-mute">
                      {t(
                        "Keluar tidak menghapus progres — semuanya tetap tersimpan di browser ini.",
                        "Signing out keeps your progress — it stays in this browser.",
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-clay">{t("Belum masuk", "Not signed in")}</p>
                    <h3 className="display mt-2 text-[1.5rem] leading-tight">
                      {t(
                        "Simpan percakapan dan hubunganmu.",
                        "Keep your conversations and relationships.",
                      )}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-mute">
                      {t(
                        "Progres tersimpan di browser ini. Juri bisa masuk satu klik lewat tombol demo di halaman Masuk.",
                        "Progress is stored in this browser. Judges can enter in one click via the demo button on the sign-in page.",
                      )}
                    </p>
                    <div className="mt-4 space-y-2">
                      <Link
                        href="/signin"
                        className="block rounded-full bg-ink px-5 py-3.5 text-center text-[15px] font-semibold text-cream"
                      >
                        {t("Masuk", "Sign in")}
                      </Link>
                      <Link
                        href="/signup"
                        className="block rounded-full border border-line bg-white px-5 py-3.5 text-center text-[15px] font-semibold"
                      >
                        {t("Daftar", "Sign up")}
                      </Link>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-[1rem] border border-line bg-white px-4 py-3">
                      <span className="text-[14px] font-semibold">
                        {t("Bahasa", "Language")}
                      </span>
                      <LangToggle />
                    </div>
                  </>
                )}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
