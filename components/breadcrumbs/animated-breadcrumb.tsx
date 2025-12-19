"use client";

import { motion } from "framer-motion";

interface AnimatedBreadcrumbProps {
  text: string;
  isActive: boolean;
  wasPreviouslyActive?: boolean;
  className?: string;
  onClick?: () => void;
  animationKey?: string;
  shouldAnimate?: boolean;
  isGoingBackward?: boolean;
}

export function AnimatedBreadcrumb({
  text,
  isActive,
  wasPreviouslyActive = false,
  className = "",
  onClick,
  animationKey,
  shouldAnimate = false,
  isGoingBackward = false
}: AnimatedBreadcrumbProps) {
  const letters = text.split("");

  // If this was previously active, it starts bold and fades to normal
  // If this is currently active, it starts normal and fades to bold
  const initialWeight = wasPreviouslyActive ? 700 : 400;
  const targetWeight = isActive ? 700 : 400;

  // Color animation: active items are foreground color, inactive are muted
  const initialOpacity = wasPreviouslyActive ? 1 : 0.5;
  const targetOpacity = isActive ? 1 : 0.5;

  // Animation timing: faster when going forward, normal when going backward
  const staggerDelay = isGoingBackward ? 0.025 : 0.015;

  return (
    <motion.span
      className={className}
      onClick={onClick}
    >
      {letters.map((letter, index) => {
        // Calculate delay based on direction
        let delay = 0;
        if (shouldAnimate) {
          if (isActive) {
            // When activating: forward = left-to-right, backward = right-to-left
            delay = isGoingBackward
              ? (letters.length - index - 1) * staggerDelay
              : index * staggerDelay;
          } else {
            // When deactivating: forward = left-to-right, backward = right-to-left
            delay = isGoingBackward
              ? (letters.length - index - 1) * staggerDelay
              : index * staggerDelay;
          }
        }

        return (
          <motion.span
            key={`${animationKey || text}-${index}`}
            initial={{ fontWeight: initialWeight, opacity: initialOpacity }}
            animate={{
              fontWeight: shouldAnimate ? targetWeight : initialWeight,
              opacity: shouldAnimate ? targetOpacity : initialOpacity,
            }}
            transition={{
              duration: shouldAnimate ? 0.25 : 0,
              delay,
              ease: "easeInOut",
            }}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
