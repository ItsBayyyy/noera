"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/* Small shared vocabulary: badge, hand-drawn underline, paper card, doodles.
   These carry the original design's DNA (pill badges, rounded cards, organic
   shapes) into the new product. */

export function Eyebrow({
  children,
  tone = "clay",
  className = "",
}: {
  children: ReactNode;
  tone?: "clay" | "cream" | "sage";
  className?: string;
}) {
  const tones = {
    clay: "bg-white text-clay border-line",
    cream: "bg-white/10 text-cream border-white/20",
    sage: "bg-white text-sage border-line",
  };
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 ${tones[tone]} ${className}`}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      {children}
    </span>
  );
}

/** Underline that draws itself on reveal — the "hand" in the interface. */
export function InkUnderline({
  children,
  color = "#ff6b35",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute left-0 -bottom-2 w-full h-[0.38em] overflow-visible"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="ink-draw"
          d="M 3 11 C 42 4 78 14 118 8 C 148 3.5 172 9 197 6"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function PaperCard({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "paper" | "ink";
}) {
  const tones = {
    white: "bg-white border-line",
    paper: "bg-paper border-parchment",
    ink: "bg-espresso-deep border-white/10 text-cream",
  };
  return (
    <div
      className={`grain relative overflow-hidden rounded-[1.75rem] border ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  wipe = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink" | "onDark";
  /** Sapuan warna dari kiri saat disentuh. Lihat `.btn-wipe` di globals.css. */
  wipe?: boolean;
  className?: string;
}) {
  const styles = {
    primary:
      "bg-ember-deep text-white shadow-[0_6px_20px_rgba(255,107,53,0.28)] hover:bg-clay",
    ghost:
      "bg-white text-ink border border-line hover:border-mute/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    ink: "bg-ink text-cream hover:bg-espresso",
    onDark: "bg-cream/10 text-cream border border-white/25 hover:bg-cream/20",
  };

  /* Warna sapuan per varian. Masing-masing dipilih supaya warna teks yang
     sedang berjalan tetap terbaca di atasnya, jadi label tidak perlu ikut
     berganti warna di tengah sapuan. */
  const wipeColor = {
    primary: "var(--color-clay)",
    ghost: "var(--color-parchment)",
    ink: "var(--color-espresso)",
    onDark: "rgba(251,248,243,0.22)",
  };

  /* Saat menyapu, pergantian latar bawaan varian dimatikan — kalau keduanya
     jalan bersamaan, warna latar berubah lebih dulu dan sapuannya tidak lagi
     terlihat menyeberang. */
  const surface = wipe
    ? styles[variant].replace(/\s*hover:bg-\S+/, "")
    : styles[variant];

  return (
    <Link
      href={href}
      style={wipe ? ({ "--wipe": wipeColor[variant] } as CSSProperties) : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-[transform,background-color,border-color] duration-200 will-change-transform hover:-translate-y-0.5 active:scale-[0.98] ${
        wipe ? "btn-wipe" : ""
      } ${surface} ${className}`}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}

/** Organic ink doodles reused from the original visual language. */
export function Doodle({
  kind,
  className = "",
  color = "#ff6b35",
}: {
  kind: "squiggle" | "spark" | "arc" | "dots";
  className?: string;
  color?: string;
}) {
  const paths = {
    squiggle: (
      <path
        d="M4 24 Q 10 8 20 20 Q 30 4 38 22 Q 46 10 54 24"
        stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
    ),
    spark: (
      <path
        d="M28 2 L33 21 L52 26 L33 31 L28 50 L23 31 L4 26 L23 21 Z"
        fill={color}
      />
    ),
    arc: (
      <path
        d="M4 30 Q 28 2 52 30"
        stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
    ),
    dots: (
      <g fill={color}>
        <circle cx="10" cy="14" r="3.5" />
        <circle cx="28" cy="24" r="3.5" />
        <circle cx="46" cy="12" r="3.5" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 58 52" className={className} aria-hidden>
      {paths[kind]}
    </svg>
  );
}

/** Torn-paper section edge — evolves the original's clip-path section breaks. */
export function TornEdge({
  position = "top",
  color = "#fbf8f3",
  className = "",
}: {
  position?: "top" | "bottom";
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`absolute left-0 w-full h-[34px] md:h-[48px] ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } ${className}`}
      aria-hidden
    >
      <path
        d="M0 0 H1440 V22 C1320 40 1210 12 1080 26 C 940 41 830 14 700 24 C 560 35 470 12 340 22 C 210 32 110 16 0 30 Z"
        fill={color}
      />
    </svg>
  );
}
