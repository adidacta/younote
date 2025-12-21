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
  shouldFadeOut?: boolean; // New prop for fade-out behavior
  customContent?: React.ReactNode; // Custom content to render instead of text
  baseDelay?: number; // Base delay before animation starts (for cascading effects)
}

export function AnimatedBreadcrumb({
  text,
  isActive,
  wasPreviouslyActive = false,
  className = "",
  onClick,
  animationKey,
  shouldAnimate = false,
  isGoingBackward = false,
  shouldFadeOut = false,
  customContent,
  baseDelay = 0
}: AnimatedBreadcrumbProps) {
  const letters = text.split("");

  // Detect if text contains RTL characters (Hebrew, Arabic, etc.)
  const isRTL = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F]/.test(text);

  // If this was previously active, it starts bold and fades to normal
  // If this is currently active, it starts normal and fades to bold
  const initialWeight = wasPreviouslyActive ? 700 : 400;
  const targetWeight = isActive ? 700 : 400;

  // Color animation: active items are foreground color, inactive are muted
  // When fading out (going backward), animate to complete transparency
  const initialOpacity = wasPreviouslyActive ? 1 : 0.5;
  const targetOpacity = shouldFadeOut ? 0 : (isActive ? 1 : 0.5);

  // Animation timing: 50% faster than original
  // Backward: 0.017s (was 0.025s), Forward: 0.01s (was 0.015s)
  const staggerDelay = isGoingBackward ? 0.017 : 0.01;

  // If custom content is provided, render it with container-level animation only
  if (customContent) {
    return (
      <motion.span
        className={className}
        onClick={onClick}
        initial={{ fontWeight: initialWeight, opacity: initialOpacity }}
        animate={{
          fontWeight: shouldAnimate ? targetWeight : initialWeight,
          opacity: shouldAnimate ? targetOpacity : initialOpacity,
        }}
        transition={{
          duration: shouldAnimate ? 0.167 : 0,
          delay: baseDelay,
          ease: "easeInOut",
        }}
        style={{ display: "inline-block" }}
      >
        {customContent}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={className}
      onClick={onClick}
      dir="auto"
      style={{ unicodeBidi: "isolate", direction: isRTL ? "rtl" : "ltr" }}
    >
      {letters.map((letter, index) => {
        // Calculate delay based on direction
        let delay = baseDelay; // Start with base delay for cascading effects
        if (shouldAnimate) {
          if (isActive) {
            // When activating: forward = left-to-right, backward = right-to-left
            delay += isGoingBackward
              ? (letters.length - index - 1) * staggerDelay
              : index * staggerDelay;
          } else {
            // When deactivating: forward = left-to-right, backward = right-to-left
            delay += isGoingBackward
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
              duration: shouldAnimate ? 0.167 : 0, // 50% faster (was 0.25s)
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
