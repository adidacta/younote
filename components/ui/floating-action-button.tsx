"use client";

import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface FloatingActionButtonProps {
  children: ReactNode;
}

export function FloatingActionButton({ children }: FloatingActionButtonProps) {
  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50">
      {children}
    </div>
  );
}

interface FABTriggerProps {
  onClick?: () => void;
}

export function FABTrigger({ onClick }: FABTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      aria-label="Add"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
