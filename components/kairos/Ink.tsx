"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { Expression } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   The hand-drawn layer.

   Roughly 20% of the interface: annotations, imperfect arrows, circled
   emphasis and reaction marks. The other 80% stays clean editorial UI. Every
   mark here is attached to a moment — nothing is decoration for its own sake.
   -------------------------------------------------------------------------- */

const DRAW = { duration: 0.55, ease: [0.2, 0, 0, 1] as const };

/** Handwritten margin note. Optionally with a little arrow pointing at things. */
export function HandNote({
  children,
  arrow = "none",
  color = "#b04a19",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  arrow?: "none" | "left" | "right" | "down" | "up";
  color?: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.span
      initial={reduced ? false : { opacity: 0, y: 6, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay, duration: 0.4 }}
      className={`hand pointer-events-none inline-flex items-center gap-1.5 text-[17px] leading-tight ${className}`}
      style={{ color }}
    >
      {arrow === "left" && <HandArrow direction="left" color={color} delay={delay + 0.15} />}
      {arrow === "up" && <HandArrow direction="up" color={color} delay={delay + 0.15} />}
      <span>{children}</span>
      {arrow === "right" && <HandArrow direction="right" color={color} delay={delay + 0.15} />}
      {arrow === "down" && <HandArrow direction="down" color={color} delay={delay + 0.15} />}
    </m.span>
  );
}

/** Deliberately imperfect arrow — drawn, not iconographic. */
export function HandArrow({
  direction = "right",
  color = "#b04a19",
  className = "",
  delay = 0,
  length = 46,
}: {
  direction?: "left" | "right" | "up" | "down";
  color?: string;
  className?: string;
  delay?: number;
  length?: number;
}) {
  const reduced = useReducedMotion();
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[direction];
  return (
    <svg
      viewBox="0 0 60 24"
      width={length}
      height={(length * 24) / 60}
      className={`shrink-0 overflow-visible ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <m.path
        d="M2 15 C 14 6, 30 20, 46 9"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ ...DRAW, delay }}
      />
      <m.path
        d="M38 5 L47 9 L40 16"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ ...DRAW, delay: delay + 0.25 }}
      />
    </svg>
  );
}

/** A scribbled ellipse drawn *around* whatever it wraps. */
export function HandCircle({
  children,
  active = true,
  color = "#c2551f",
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  color?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <AnimatePresence>
        {active && (
          <svg
            viewBox="0 0 200 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]"
            aria-hidden
          >
            <m.path
              d="M28 12 C 84 2, 150 4, 182 20 C 196 30, 188 58, 150 68 C 108 79, 44 76, 18 62 C 2 52, 4 24, 34 14"
              fill="none"
              stroke={color}
              strokeWidth="2.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.2, 0, 0, 1] }}
            />
          </svg>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Wobbly rule for separating beats of a conversation. */
export function HandRule({ className = "", color = "#e2d7c7" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 300 8" preserveAspectRatio="none" className={`h-2 w-full ${className}`} aria-hidden>
      <path
        d="M2 5 C 40 1, 78 7, 118 4 C 158 1, 196 7, 236 4 C 262 2, 282 5, 298 4"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Reaction marks — the drawn punctuation on a character's feeling            */
/* -------------------------------------------------------------------------- */

const MARKS: Partial<Record<Expression, { d: string; color: string }[]>> = {
  happy: [
    { d: "M18 40 L8 30", color: "#c2551f" },
    { d: "M30 26 L26 12", color: "#c2551f" },
    { d: "M156 26 L162 12", color: "#c2551f" },
    { d: "M168 40 L180 32", color: "#c2551f" },
  ],
  warm: [
    { d: "M28 30 L20 20", color: "#3e7c5a" },
    { d: "M160 30 L170 20", color: "#3e7c5a" },
  ],
  surprised: [
    { d: "M22 24 L10 12", color: "#3d6b8c" },
    { d: "M90 8 L90 -6", color: "#3d6b8c" },
    { d: "M160 24 L172 12", color: "#3d6b8c" },
  ],
  disappointed: [
    { d: "M24 30 C 20 44, 20 52, 22 60", color: "#7a6a5c" },
    { d: "M162 30 C 166 44, 166 52, 164 60", color: "#7a6a5c" },
  ],
  awkward: [
    { d: "M170 20 C 178 26, 166 32, 174 38 C 180 42, 172 48, 178 52", color: "#7a6a5c" },
  ],
  embarrassed: [
    { d: "M16 46 C 24 50, 24 56, 16 60", color: "#b24c3c" },
    { d: "M170 46 C 162 50, 162 56, 170 60", color: "#b24c3c" },
  ],
  angry: [
    { d: "M156 16 L166 8 L160 20 L172 12", color: "#b24c3c" },
  ],
  confused: [
    { d: "M30 22 C 22 14, 34 8, 40 16", color: "#3d6b8c" },
  ],
  neutral: [],
  idle: [],
};

/**
 * Drawn marks that appear around a character the instant they react — the
 * visual evidence that a sentence did something to someone.
 */
export function ReactionMarks({
  expression,
  className = "",
}: {
  expression: Expression;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const marks = MARKS[expression] ?? [];
  return (
    <svg
      viewBox="0 0 190 90"
      className={`pointer-events-none absolute inset-x-0 -top-2 h-auto w-full overflow-visible ${className}`}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <m.g key={expression}>
          {marks.map((mark, i) => (
            <m.path
              key={`${expression}-${i}`}
              d={mark.d}
              stroke={mark.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0.75] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            />
          ))}
        </m.g>
      </AnimatePresence>
    </svg>
  );
}
