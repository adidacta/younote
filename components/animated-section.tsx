"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On server and initial client render, show content without animation wrapper
  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  // After hydration, use motion.div for animations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
