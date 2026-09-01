"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/* --------------------------------------------------------------------------
   Bahasa antarmuka.

   Lomba ini di Indonesia, jadi bahasa Indonesia adalah default. Bahasa
   Inggris tetap tersedia satu klik — dan itu sekaligus bagian dari temanya:
   platform untuk komunitas global.

   Yang TIDAK diterjemahkan: kalimat yang diucapkan karakter dan tiga pilihan
   jawaban. Itu materi yang sedang dipelajari, bukan antarmuka.
   -------------------------------------------------------------------------- */

export type Lang = "id" | "en";

const KEY = "kairos.lang";

let lang: Lang = "id";
let hydrated = false;
const listeners = new Set<() => void>();

interface Snapshot {
  lang: Lang;
  hydrated: boolean;
}

const SERVER: Snapshot = { lang: "id", hydrated: false };
let snapshot: Snapshot = SERVER;

function publish() {
  snapshot = { lang, hydrated };
  // Dokumennya ikut ganti bahasa, bukan cuma teksnya. Tanpa ini pembaca layar
  // tetap melafalkan apa pun yang tampil memakai fonem bahasa sebelumnya.
  if (typeof document !== "undefined") document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER;

function hydrateOnce() {
  if (hydrated) return;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "en" || stored === "id") lang = stored;
  } catch {
    /* storage disabled — default stays */
  }
  hydrated = true;
  publish();
}

export function useLang() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateOnce();
  }, []);

  const setLang = useCallback((next: Lang) => {
    lang = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    publish();
  }, []);

  return { lang: snap.lang, hydrated: snap.hydrated, setLang };
}

/**
 * t("teks Indonesia", "English text")
 *
 * Pasangan bahasa ditulis langsung di tempat pakainya — tanpa file kunci
 * terpisah, sehingga terjemahan selalu terbaca bersama konteksnya.
 */
export function useT() {
  const { lang: current } = useLang();
  return useCallback(
    (id: string, en: string) => (current === "id" ? id : en),
    [current],
  );
}
