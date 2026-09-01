"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { CharacterSpec, Expression } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   A single parametric hand-drawn actor.

   One SVG, driven by two props: who they are (CharacterSpec) and how they
   feel (Expression). Every animation here exists to communicate a social
   consequence — the blink and breath keep them alive between decisions, the
   brows / eyes / mouth / tilt / accessory carry the reaction to the learner's
   sentence. No decorative motion.
   -------------------------------------------------------------------------- */

const INK = "#1c1512";

type EyeType = "open" | "happy" | "wide" | "half" | "squint" | "sad";
type Accessory = "sweat" | "blush" | "spark" | "anger" | "question" | null;

interface Face {
  tilt: number;
  browY: number;
  browRotate: number;
  /** Asymmetric brow — the "confused" tell. */
  browSkew: number;
  eye: EyeType;
  mouth: string;
  mouthFill?: boolean;
  accessory: Accessory;
  /** Slight slump / straighten of the whole body. */
  bodyY: number;
}

const FACES: Record<Expression, Face> = {
  idle: {
    tilt: 0, browY: 0, browRotate: 0, browSkew: 0, eye: "open",
    mouth: "M 97 130 Q 110 138 123 130", accessory: null, bodyY: 0,
  },
  warm: {
    tilt: -2, browY: -1, browRotate: -2, browSkew: 0, eye: "open",
    mouth: "M 95 128 Q 110 142 125 128", accessory: null, bodyY: -1,
  },
  happy: {
    tilt: -4, browY: -4, browRotate: -4, browSkew: 0, eye: "happy",
    mouth: "M 92 126 Q 110 150 128 126", mouthFill: true, accessory: "spark", bodyY: -3,
  },
  neutral: {
    tilt: 0, browY: 2, browRotate: 0, browSkew: 0, eye: "open",
    mouth: "M 98 133 L 122 133", accessory: null, bodyY: 0,
  },
  confused: {
    tilt: 5, browY: -2, browRotate: 0, browSkew: 14, eye: "open",
    mouth: "M 98 134 Q 106 128 112 134 Q 118 140 124 133", accessory: "question", bodyY: 1,
  },
  awkward: {
    tilt: 3, browY: -3, browRotate: 8, browSkew: 4, eye: "squint",
    mouth: "M 96 133 Q 103 127 110 133 T 124 133", accessory: "sweat", bodyY: 2,
  },
  surprised: {
    tilt: -1, browY: -8, browRotate: -2, browSkew: 0, eye: "wide",
    mouth: "M 110 133 m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0", mouthFill: true,
    accessory: null, bodyY: -2,
  },
  embarrassed: {
    tilt: 6, browY: -2, browRotate: 10, browSkew: 0, eye: "half",
    mouth: "M 98 136 Q 110 128 122 136", accessory: "blush", bodyY: 3,
  },
  disappointed: {
    tilt: 2, browY: 3, browRotate: 9, browSkew: 0, eye: "sad",
    mouth: "M 97 138 Q 110 128 123 138", accessory: null, bodyY: 4,
  },
  angry: {
    tilt: -1, browY: 4, browRotate: -16, browSkew: 0, eye: "squint",
    mouth: "M 96 137 Q 110 129 124 137", accessory: "anger", bodyY: -1,
  },
};

/* ---------------------------------- parts --------------------------------- */

function Eye({ x, type }: { x: number; type: EyeType }) {
  const y = 102;
  if (type === "happy") {
    return (
      <path
        d={`M ${x - 9} ${y + 3} Q ${x} ${y - 8} ${x + 9} ${y + 3}`}
        stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
    );
  }
  if (type === "squint") {
    return (
      <path
        d={`M ${x - 9} ${y - 1} Q ${x} ${y + 6} ${x + 9} ${y - 1}`}
        stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
    );
  }
  if (type === "sad") {
    return (
      <>
        <circle cx={x} cy={y + 2} r="5.5" fill={INK} />
        <path
          d={`M ${x - 9} ${y - 4} Q ${x} ${y - 1} ${x + 9} ${y - 5}`}
          stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none"
        />
      </>
    );
  }
  if (type === "half") {
    return (
      <>
        <circle cx={x} cy={y + 2} r="6" fill={INK} />
        <path
          d={`M ${x - 8} ${y - 1} L ${x + 8} ${y - 1}`}
          stroke={INK} strokeWidth="5" strokeLinecap="round"
        />
      </>
    );
  }
  if (type === "wide") {
    return (
      <>
        <circle cx={x} cy={y} r="10" fill="#fffdf8" stroke={INK} strokeWidth="3" />
        <circle cx={x} cy={y + 1} r="5" fill={INK} />
      </>
    );
  }
  return (
    <>
      <circle cx={x} cy={y} r="6.5" fill={INK} />
      <circle cx={x + 2.4} cy={y - 2.4} r="2" fill="#fffdf8" />
    </>
  );
}

function Hair({ spec, layer }: { spec: CharacterSpec; layer: "back" | "front" }) {
  const { hair, hairStyle } = spec;
  if (layer === "back") {
    if (hairStyle === "long")
      return (
        <path
          d="M 48 92 C 40 130 42 170 46 196 L 76 196 C 68 160 70 120 74 96 Z M 172 92 C 180 130 178 170 174 196 L 144 196 C 152 160 150 120 146 96 Z"
          fill={hair} stroke={INK} strokeWidth="3.5" strokeLinejoin="round"
        />
      );
    if (hairStyle === "bob")
      return (
        <path
          d="M 46 92 C 42 122 44 142 48 158 L 74 158 C 68 134 70 110 74 96 Z M 174 92 C 178 122 176 142 172 158 L 146 158 C 152 134 150 110 146 96 Z"
          fill={hair} stroke={INK} strokeWidth="3.5" strokeLinejoin="round"
        />
      );
    if (hairStyle === "bun")
      return <circle cx="110" cy="27" r="19" fill={hair} stroke={INK} strokeWidth="3.5" />;
    return null;
  }

  if (hairStyle === "curls")
    return (
      <g fill={hair} stroke={INK} strokeWidth="3.5">
        <circle cx="72" cy="66" r="18" />
        <circle cx="102" cy="52" r="21" />
        <circle cx="136" cy="60" r="19" />
        <circle cx="160" cy="82" r="16" />
        <circle cx="58" cy="88" r="15" />
      </g>
    );

  if (hairStyle === "wave")
    return (
      <path
        d="M 50 98 C 44 56 76 28 110 28 C 148 28 176 54 170 98 C 166 84 160 74 150 70 C 140 82 124 76 112 66 C 100 78 82 76 68 68 C 58 74 54 84 50 98 Z"
        fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round"
      />
    );

  return (
    <path
      d="M 50 98 C 46 54 78 28 110 28 C 146 28 176 54 170 98 C 166 76 148 62 110 62 C 74 62 54 74 50 98 Z"
      fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round"
    />
  );
}

function Accessories({ kind }: { kind: Accessory }) {
  if (!kind) return null;
  const common = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  };
  if (kind === "sweat")
    return (
      <m.path
        {...common}
        animate={{ opacity: 1, scale: 1, y: [0, 5, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        d="M 166 78 C 172 88 176 94 176 99 a 6 6 0 0 1 -12 0 c 0 -5 4 -11 6 -21 Z"
        fill="#7fb6d6" stroke={INK} strokeWidth="2.5"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    );
  if (kind === "blush")
    return (
      <m.g {...common}>
        <ellipse cx="78" cy="120" rx="12" ry="7" fill="#b24c3c" opacity="0.32" />
        <ellipse cx="142" cy="120" rx="12" ry="7" fill="#b24c3c" opacity="0.32" />
      </m.g>
    );
  if (kind === "spark")
    return (
      <m.g
        {...common}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <path d="M 178 44 L 182 56 L 194 60 L 182 64 L 178 76 L 174 64 L 162 60 L 174 56 Z" fill="#ff6b35" />
        <path d="M 40 62 L 43 70 L 51 73 L 43 76 L 40 84 L 37 76 L 29 73 L 37 70 Z" fill="#ff6b35" opacity="0.7" />
      </m.g>
    );
  if (kind === "question")
    return (
      <m.text
        {...common}
        animate={{ opacity: 1, scale: 1, rotate: [-6, 6, -6] }}
        transition={{ rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
        x="176" y="58" fontSize="40" fontFamily="var(--font-fraunces), serif"
        fontWeight="700" fill="#3d6b8c"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        ?
      </m.text>
    );
  return (
    <m.g
      {...common}
      animate={{ opacity: 1, scale: [1, 1.18, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
      stroke="#b24c3c" strokeWidth="4" strokeLinecap="round"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <path d="M 166 44 L 178 34 M 178 44 L 166 34 M 172 30 L 172 48" />
    </m.g>
  );
}

/* -------------------------------- component ------------------------------- */

export function Character({
  spec,
  expression = "idle",
  talking = false,
  size = 220,
  className = "",
  still = false,
}: {
  spec: CharacterSpec;
  expression?: Expression;
  talking?: boolean;
  size?: number;
  className?: string;
  /** Untuk pemakaian dekoratif (pratinjau, thumbnail): tanpa napas dan
      tanpa kedip. Karakter yang sedang diajak bicara tetap hidup. */
  still?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const reduced = reducedMotion || still;
  const face = FACES[expression] ?? FACES.idle;

  return (
    <m.svg
      viewBox="0 0 220 210"
      width={size}
      height={(size * 210) / 220}
      className={className}
      role="img"
      aria-label={`Illustrated character looking ${expression}`}
      animate={reduced ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ overflow: "visible" }}
    >
      <m.g
        animate={{ y: face.bodyY }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        {/* body */}
        <path
          d="M 30 210 C 30 172 62 148 110 148 C 158 148 190 172 190 210 Z"
          fill={spec.outfit} stroke={INK} strokeWidth="4" strokeLinejoin="round"
        />
        <path
          d="M 92 150 L 110 176 L 128 150 L 118 146 L 110 160 L 102 146 Z"
          fill={spec.collar} stroke={INK} strokeWidth="3" strokeLinejoin="round"
        />
        {/* neck */}
        <path d="M 96 128 L 124 128 L 124 154 L 96 154 Z" fill={spec.skin} stroke={INK} strokeWidth="4" />

        <m.g
          animate={{ rotate: face.tilt }}
          transition={{ type: "spring", stiffness: 140, damping: 13 }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 90%" }}
        >
          <Hair spec={spec} layer="back" />
          {/* ears */}
          <circle cx="52" cy="104" r="9" fill={spec.skin} stroke={INK} strokeWidth="3.5" />
          <circle cx="168" cy="104" r="9" fill={spec.skin} stroke={INK} strokeWidth="3.5" />
          {/* head */}
          <path
            d="M 110 30 C 148 30 170 58 170 96 C 170 130 144 152 110 152 C 76 152 50 130 50 96 C 50 58 72 30 110 30 Z"
            fill={spec.skin} stroke={INK} strokeWidth="4"
          />
          <Hair spec={spec} layer="front" />

          {/* brows — the fastest-reading signal of a social consequence */}
          <m.g
            animate={{ y: face.browY }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none"
          >
            <m.path
              d="M 80 86 Q 90 80 100 85"
              animate={{ rotate: face.browRotate + face.browSkew }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <m.path
              d="M 120 85 Q 130 80 140 86"
              animate={{ rotate: -face.browRotate }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </m.g>

          {/* eyes + blink */}
          <m.g
            animate={reduced ? {} : { scaleY: [1, 1, 0.08, 1] }}
            transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 3.4, times: [0, 0.6, 0.8, 1] }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <AnimatePresence mode="wait">
              <m.g
                key={face.eye}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <Eye x={88} type={face.eye} />
                <Eye x={132} type={face.eye} />
              </m.g>
            </AnimatePresence>
          </m.g>

          {/* nose */}
          <path d="M 110 108 L 108 118 L 115 118" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* mouth — scales while speaking so dialogue feels spoken, not typed */}
          <m.g
            animate={talking && !reduced ? { scaleY: [1, 0.55, 1.15, 0.8, 1] } : { scaleY: 1 }}
            transition={talking ? { duration: 0.55, repeat: Infinity } : { duration: 0.2 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <AnimatePresence mode="wait">
              <m.path
                key={face.mouth}
                d={face.mouth}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.16 }}
                fill={face.mouthFill ? INK : "none"}
                stroke={INK}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </AnimatePresence>
          </m.g>

          {spec.glasses && (
            <g stroke={INK} strokeWidth="3.5" fill="none">
              <circle cx="88" cy="102" r="17" fill="#fffdf8" fillOpacity="0.22" />
              <circle cx="132" cy="102" r="17" fill="#fffdf8" fillOpacity="0.22" />
              <path d="M 105 102 L 115 102 M 71 99 L 54 96 M 149 99 L 166 96" strokeLinecap="round" />
            </g>
          )}

          <AnimatePresence>
            <Accessories key={face.accessory ?? "none"} kind={face.accessory} />
          </AnimatePresence>
        </m.g>
      </m.g>
    </m.svg>
  );
}
