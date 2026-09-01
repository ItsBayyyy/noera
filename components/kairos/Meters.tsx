"use client";

import { animate, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ATTRIBUTES } from "@/lib/kairos/data";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import type { AttributeKey } from "@/lib/kairos/types";

/** Number that counts to its value — the score should feel *arrived at*. */
function useCountUp(value: number, active: boolean) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.2, 0, 0, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, active, reduced]);
  return display;
}

function toneFor(value: number) {
  if (value >= 80) return { bar: "#3e7c5a", text: "text-sage" };
  if (value >= 55) return { bar: "#c2551f", text: "text-clay" };
  return { bar: "#b24c3c", text: "text-rose" };
}

export function ScoreMeter({
  label,
  value,
  active,
  delay = 0,
  hint,
}: {
  label: string;
  value: number;
  active: boolean;
  delay?: number;
  hint?: string;
}) {
  const shown = useCountUp(value, active);
  const tone = toneFor(value);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-mute">{label}</span>
        <span className={`display text-[1.6rem] tabular-nums ${tone.text}`}>
          {shown}
          <span className="text-[0.9rem] opacity-60">%</span>
        </span>
      </div>
      <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-parchment">
        <m.div
          className="h-full rounded-full"
          style={{ background: tone.bar }}
          initial={{ width: 0 }}
          animate={{ width: active ? `${value}%` : 0 }}
          transition={{ duration: 0.9, delay, ease: [0.2, 0, 0, 1] }}
        />
      </div>
      {hint && <p className="mt-2 text-[12px] leading-snug text-mute">{hint}</p>}
    </div>
  );
}

/**
 * Relationship is the meter that makes consequence *felt*: the marker slides
 * from where you stood to where you now stand, and the delta arrives late.
 */
export function RelationshipMeter({
  from,
  delta,
  active,
  name,
}: {
  from: number;
  delta: number;
  active: boolean;
  name: string;
}) {
  const t = useT();
  const to = Math.max(0, Math.min(100, from + delta));
  const positive = delta >= 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-mute">
          {t("Hubungan", "Relationship")} · {name}
        </span>
        <div className="flex items-baseline gap-2">
          <m.span
            className="display text-[1.6rem] tabular-nums text-ink"
            key={active ? "on" : "off"}
          >
            {active ? to : from}
          </m.span>
          <m.span
            initial={{ opacity: 0, y: -6 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ delay: 0.75, type: "spring", stiffness: 260, damping: 18 }}
            className={`rounded-full px-2 py-0.5 text-[12px] font-bold tabular-nums ${
              positive ? "bg-sage/12 text-sage" : "bg-rose/12 text-rose"
            }`}
          >
            {positive ? "+" : ""}
            {delta}
          </m.span>
        </div>
      </div>
      <div className="relative mt-3 h-[7px] w-full rounded-full bg-parchment">
        <m.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: positive ? "#3e7c5a" : "#b24c3c" }}
          initial={{ width: `${from}%` }}
          animate={{ width: `${active ? to : from}%` }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0, 0, 1] }}
        />
        <m.div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-white"
          initial={{ left: `${from}%` }}
          animate={{ left: `${active ? to : from}%` }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0, 0, 1] }}
        />
      </div>
    </div>
  );
}

