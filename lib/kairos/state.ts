"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ATTRIBUTES, strengthsAndGaps, tierFor } from "./data";
import type { AttributeKey, Choice } from "./types";

export interface Progress {
  /** Whether someone is "signed in" — a local session flag, no backend. */
  signedIn: boolean;
  name: string;
  attributes: Record<AttributeKey, number>;
  /** scenarioId -> id of the last choice made */
  completed: Record<string, string>;
  /** scenarioId -> current relationship value, carried between visits */
  relationships: Record<string, number>;
  /** The scenario chosen at sign-up, opened first on the learning page. */
  startScenario: string | null;
  /** yyyy-mm-dd of the last Daily Room played, so it opens once a day. */
  dailyDoneOn: string | null;
  dailyChoice: string | null;
  /** Answer submitted to the current Global Challenge. */
  challengeAnswer: string | null;
  /** Tingkat terakhir yang sudah dirayakan, supaya naik tingkat terasa sekali. */
  seenTier: string | null;
  /** Tidak ada tur yang menunggu.

      Dulu ini berarti "sudah pernah menjalani tur", dan bawaannya false —
      akibatnya tur terbuka sendiri menutupi halaman Belajar untuk setiap
      pengguna baru. Sekarang bawaannya true: halaman langsung bisa dipakai,
      dan tur hanya berjalan kalau diminta lewat restartTour(). */
  tourDone: boolean;
  /** Seberapa sering tebakan "Baca ruangannya" cocok dengan yang terjadi.
      Tiga angka ini TIDAK pernah ditampilkan sebagai meteran — hanya dipakai
      untuk menyusun satu kalimat di Potret Sosial. */
  reads: { read: number; partial: number; missed: number };
}

const KEY = "kairos.progress.v2";

const BASE: Record<AttributeKey, number> = {
  respect: 52,
  empathy: 58,
  adaptability: 44,
  context: 40,
  confidence: 61,
  cultural: 38,
};

export const emptyProgress = (): Progress => ({
  signedIn: false,
  name: "Learner",
  attributes: { ...BASE },
  completed: {},
  relationships: {},
  startScenario: null,
  dailyDoneOn: null,
  dailyChoice: null,
  challengeAnswer: null,
  seenTier: null,
  // true = tidak ada tur yang menunggu; lihat catatan pada Progress.tourDone
  tourDone: true,
  reads: { read: 0, partial: 0, missed: 0 },
});

/**
 * The one-click demo profile, for reviewers who should not have to play
 * through three conversations before the product has anything to show.
 * It starts mid-journey: two conversations lived, two relationships already
 * carrying history, and a Connector-level profile — but the Daily Room and the
 * Global Challenge are left untouched so both reveals still happen live.
 */
export const demoProgress = (): Progress => ({
  signedIn: true,
  name: "Reviewer",
  attributes: {
    respect: 74,
    empathy: 70,
    adaptability: 66,
    context: 60,
    confidence: 76,
    cultural: 58,
  },
  completed: { "tokyo-professor": "a", "berlin-feedback": "a" },
  relationships: { "tokyo-professor": 80, "berlin-feedback": 79 },
  startScenario: "tokyo-professor",
  dailyDoneOn: null,
  dailyChoice: null,
  challengeAnswer: null,
  seenTier: "Adapter",
  tourDone: true,
  reads: { read: 1, partial: 1, missed: 0 },
});

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Hours and minutes until the next room opens (local midnight). */
export function untilTomorrow() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const ms = next.getTime() - now.getTime();
  return {
    hours: Math.floor(ms / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
  };
}

function read(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...emptyProgress(),
      ...parsed,
      attributes: { ...BASE, ...(parsed.attributes ?? {}) },
      // progres yang tersimpan sebelum fitur ini ada tidak punya `reads`
      reads: { read: 0, partial: 0, missed: 0, ...(parsed.reads ?? {}) },
    };
  } catch {
    return emptyProgress();
  }
}

function write(next: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage disabled — session-only progress is fine */
  }
}

function applyAttributes(
  attributes: Record<AttributeKey, number>,
  deltas: Partial<Record<AttributeKey, number>>,
) {
  const next = { ...attributes };
  (Object.keys(deltas) as AttributeKey[]).forEach((k) => {
    next[k] = Math.max(0, Math.min(100, next[k] + (deltas[k] ?? 0)));
  });
  return next;
}

/* --------------------------------------------------------------------------
   One store, many readers.

   The navbar, the scenario player, the Daily Room and the reputation panel all
   read the same profile, so it lives in a single module-level store rather
   than in per-component state — otherwise signing out in one component leaves
   the others showing a stale session.
   -------------------------------------------------------------------------- */

interface Snapshot {
  progress: Progress;
  hydrated: boolean;
}

const SERVER_SNAPSHOT: Snapshot = { progress: emptyProgress(), hydrated: false };
let snapshot: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function publish(progress: Progress, hydrated = true) {
  snapshot = { progress, hydrated };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;

/** Reads storage once, on the client, after mount — never during render. */
function hydrateOnce() {
  if (snapshot.hydrated) return;
  publish(read());
}

/**
 * Client-side progression. Deliberately tiny: no backend, and every number
 * here only moves because of a sentence someone chose in a conversation.
 */
export function useProgress() {
  const { progress, hydrated } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    hydrateOnce();
  }, []);

  const update = useCallback((fn: (prev: Progress) => Progress) => {
    const next = fn(snapshot.progress);
    write(next);
    publish(next);
  }, []);

  /** One exchange resolved inside a conversation. */
  const record = useCallback(
    (scenarioId: string, choice: Choice, relationshipAfter: number) => {
      update((prev) => ({
        ...prev,
        attributes: applyAttributes(prev.attributes, choice.attributes),
        completed: { ...prev.completed, [scenarioId]: choice.id },
        relationships: {
          ...prev.relationships,
          [scenarioId]: Math.max(0, Math.min(100, relationshipAfter)),
        },
      }));
    },
    [update],
  );

  const recordDaily = useCallback(
    (choice: Choice) => {
      update((prev) => ({
        ...prev,
        attributes: applyAttributes(prev.attributes, choice.attributes),
        dailyDoneOn: todayKey(),
        dailyChoice: choice.id,
      }));
    },
    [update],
  );

  const answerChallenge = useCallback(
    (key: string) => update((prev) => ({ ...prev, challengeAnswer: key })),
    [update],
  );

  const setName = useCallback(
    (name: string) => update((prev) => ({ ...prev, name })),
    [update],
  );

  const signIn = useCallback(
    (name?: string) =>
      update((prev) => ({
        ...prev,
        signedIn: true,
        name: name?.trim() ? name.trim() : prev.name,
      })),
    [update],
  );

  /** Ends the session but keeps what was learned — progress is the point. */
  const signOut = useCallback(
    () => update((prev) => ({ ...prev, signedIn: false })),
    [update],
  );

  const setStartScenario = useCallback(
    (id: string) => update((prev) => ({ ...prev, startScenario: id })),
    [update],
  );

  const markTierSeen = useCallback(
    (name: string) => update((prev) => ({ ...prev, seenTier: name })),
    [update],
  );

  /** Mencatat seberapa tepat satu tebakan "Baca ruangannya". */
  const recordRead = useCallback(
    (quality: "read" | "partial" | "missed") =>
      update((prev) => ({
        ...prev,
        reads: { ...prev.reads, [quality]: prev.reads[quality] + 1 },
      })),
    [update],
  );

  const markTourDone = useCallback(
    () => update((prev) => ({ ...prev, tourDone: true })),
    [update],
  );

  const restartTour = useCallback(
    () => update((prev) => ({ ...prev, tourDone: false })),
    [update],
  );

  const reset = useCallback(() => update(() => emptyProgress()), [update]);

  const loadDemo = useCallback(() => update(() => demoProgress()), [update]);

  const score = Math.round(
    ATTRIBUTES.reduce((sum, a) => sum + progress.attributes[a.key], 0) /
      ATTRIBUTES.length,
  );

  return {
    progress,
    hydrated,
    record,
    recordDaily,
    answerChallenge,
    setName,
    setStartScenario,
    signIn,
    signOut,
    markTierSeen,
    markTourDone,
    recordRead,
    restartTour,
    reset,
    loadDemo,
    signedIn: hydrated && progress.signedIn,
    score,
    tier: tierFor(score),
    ...strengthsAndGaps(progress.attributes),
    completedCount: Object.keys(progress.completed).length,
    dailyDone: hydrated && progress.dailyDoneOn === todayKey(),
  };
}
