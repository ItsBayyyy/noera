"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/kairos/i18n";

/* --------------------------------------------------------------------------
   TRANSISI ANTAR HALAMAN

   Bukan spinner. Selembar kertas krem naik menutupi layar dengan tepi sobek,
   logonya menggambar dirinya sendiri dengan tinta, lalu kertasnya pergi ke
   atas dan halaman baru sudah ada di baliknya.

   Batangnya mulai jalan begitu tautan diklik (bukan setelah halaman ganti),
   supaya klik terasa langsung direspons.
   -------------------------------------------------------------------------- */

const MIN_VISIBLE = 620; // biar transisinya sempat terbaca, bukan berkedip
const SAFETY = 3000; // kalau navigasi gagal, tirai tidak boleh nyangkut

function labelFor(path: string, t: (id: string, en: string) => string) {
  if (path.startsWith("/learn")) return t("membuka ruang…", "opening the room…");
  if (path.startsWith("/community"))
    return t("menyeberang ke komunitas…", "crossing to the community…");
  if (path.startsWith("/signin")) return t("membuka pintu…", "opening the door…");
  if (path.startsWith("/signup")) return t("menyiapkan profil…", "setting up…");
  return t("kembali ke beranda…", "back to the start…");
}

export function RouteTransition() {
  const pathname = usePathname();
  const t = useT();
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState<string>("/");
  const startedAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastPath = useRef(pathname);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  /* --- mulai saat tautan internal diklik --------------------------------- */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      // Tautan ke jangkar di halaman yang sama bukan pindah halaman.
      const [path] = href.split("#");
      if (!path || path === window.location.pathname) return;

      clearTimers();
      setTarget(path);
      setActive(true);
      startedAt.current = Date.now();
      timers.current.push(setTimeout(() => setActive(false), SAFETY));
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  /* --- selesai saat halaman benar-benar berganti ------------------------- */
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    clearTimers();
    // Navigasi lewat tombol back/forward tidak melewati listener klik.
    if (!active) {
      setTarget(pathname);
      setActive(true);
      startedAt.current = Date.now();
    }
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE - elapsed);
    timers.current.push(setTimeout(() => setActive(false), wait));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation}>
      {/* batang tinta di tepi atas layar */}
      <AnimatePresence>
        {active && (
          <m.div
            key="bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-[6px]"
          >
            <svg viewBox="0 0 1000 6" preserveAspectRatio="none" className="h-full w-full">
              <m.path
                d="M0 3.4 C 120 1.6, 240 4.6, 360 2.8 C 500 0.9, 640 4.8, 780 2.6 C 880 1.2, 950 3.8, 1000 2.8"
                fill="none"
                stroke="#ff6b35"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.85, ease: [0.2, 0, 0, 1] }}
              />
            </svg>
          </m.div>
        )}
      </AnimatePresence>

      {/* tirai kertas dengan tepi sobek */}
      <AnimatePresence>
        {active && (
          <m.div
            key="curtain"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.42, ease: [0.65, 0, 0.35, 1] }}
            className="grain pointer-events-none fixed inset-0 z-[105] flex items-center justify-center bg-cream"
            aria-hidden
          >
            {/* tepi sobek di sisi atas tirai */}
            <svg
              viewBox="0 0 1440 40"
              preserveAspectRatio="none"
              className="absolute -top-[38px] left-0 h-[40px] w-full"
            >
              <path
                d="M0 40 H1440 V16 C1320 34 1210 6 1080 20 C 940 35 830 8 700 18 C 560 29 470 6 340 16 C 210 26 110 10 0 24 Z"
                fill="#fbf8f3"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center">
              {/* logo menggambar dirinya sendiri */}
              <svg width="72" height="72" viewBox="0 0 40 40" aria-hidden>
                <m.path
                  d="M6 14 C6 8 10 5 17 5 L28 5 C34 5 37 8 37 14 C37 20 34 23 28 23 L20 23 L13 29 L14 23 C9 22 6 19 6 14 Z"
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                />
                <m.path
                  d="M3 24 C3 19 6 17 11 17 L20 17 C25 17 28 19 28 24 C28 29 25 32 20 32 L15 32 L8 37 L9 31 C5 30 3 28 3 24 Z"
                  fill="none"
                  stroke="#1c1512"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.14, ease: [0.2, 0, 0, 1] }}
                />
              </svg>

              <m.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="hand mt-3 text-[20px] text-clay"
              >
                {labelFor(target, t)}
              </m.p>

              {/* tiga titik tinta, ritme yang sama dengan garis di atas */}
              <div className="mt-2 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <m.span
                    key={i}
                    className="block h-1.5 w-1.5 rounded-full bg-mute"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
