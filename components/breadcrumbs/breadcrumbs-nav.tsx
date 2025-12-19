"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedBreadcrumb } from "./animated-breadcrumb";
import { useEffect, useState } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isEditable?: boolean;
  editComponent?: React.ReactNode;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  subtitle?: string;
  action?: React.ReactNode;
}

export function BreadcrumbsNav({ items, subtitle, action }: BreadcrumbsNavProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isGoingBackward, setIsGoingBackward] = useState(false);

  useEffect(() => {
    // Get previous count from sessionStorage to persist across remounts
    const storedCount = sessionStorage.getItem('breadcrumbCount');
    const previousItemCount = storedCount ? parseInt(storedCount, 10) : items.length;

    // Detect navigation direction
    if (items.length < previousItemCount) {
      setIsGoingBackward(true);
    } else {
      setIsGoingBackward(false);
    }

    // Store current count for next navigation
    sessionStorage.setItem('breadcrumbCount', items.length.toString());

    // Reset and trigger animation after page loads
    setShouldAnimate(false);
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [items.length]);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-2xl mb-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isSecondToLast = index === items.length - 2;
            const isActive = isLast;
            const wasPreviouslyActive = isSecondToLast;

            return (
              <div key={item.href} className="flex items-center gap-2">
                {item.isEditable && item.editComponent ? (
                  <div className={isActive ? "" : "text-muted-foreground"}>
                    {item.editComponent}
                  </div>
                ) : isLast ? (
                  <AnimatedBreadcrumb
                    text={item.label}
                    isActive={isActive}
                    wasPreviouslyActive={false}
                    animationKey={`breadcrumb-${index}-${item.label}`}
                    shouldAnimate={shouldAnimate}
                    isGoingBackward={isGoingBackward}
                  />
                ) : (
                  <Link
                    href={item.href}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <AnimatedBreadcrumb
                      text={item.label}
                      isActive={false}
                      wasPreviouslyActive={wasPreviouslyActive}
                      animationKey={`breadcrumb-${index}-${item.label}`}
                      shouldAnimate={shouldAnimate}
                      isGoingBackward={isGoingBackward}
                    />
                  </Link>
                )}
                {!isLast && <ChevronRight className="h-6 w-6 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
