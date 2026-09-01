'use client';

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { TRANSITION } from '@/lib/motion/transitions';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig transition={TRANSITION.standard}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
