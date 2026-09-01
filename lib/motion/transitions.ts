import type { Transition } from 'framer-motion';

const EASE_STANDARD = [0.4, 0.0, 0.2, 1] as const;
const EASE_EMPHASIZED = [0.2, 0.0, 0, 1] as const;

export const SPRING = {
  soft: { type: 'spring', stiffness: 100, damping: 20 },
  bouncy: { type: 'spring', stiffness: 150, damping: 15 },
  stiff: { type: 'spring', stiffness: 200, damping: 25 },
} satisfies Record<string, Transition>;

export const TRANSITION = {
  standard: { duration: 0.3, ease: EASE_STANDARD },
  fast: { duration: 0.15, ease: EASE_STANDARD },
  slow: { duration: 0.6, ease: EASE_EMPHASIZED },
} satisfies Record<string, Transition>;
