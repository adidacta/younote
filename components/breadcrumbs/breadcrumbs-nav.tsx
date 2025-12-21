"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedBreadcrumb } from "./animated-breadcrumb";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isGoingBackward, setIsGoingBackward] = useState(false);
  const [displayItems, setDisplayItems] = useState(items);
  const [itemsToRemove, setItemsToRemove] = useState<Set<number>>(new Set());
  const [animationComplete, setAnimationComplete] = useState(true); // Track if animation is done
  const [previouslyActiveIndex, setPreviouslyActiveIndex] = useState<number | null>(null); // Track which item was active before
  const prevItemsRef = useRef<BreadcrumbItem[] | null>(null);
  const isFirstRender = useRef(true);

  // Create a stable key for items comparison (ignoring editComponent)
  const itemsKey = JSON.stringify(items.map(i => ({ label: i.label, href: i.href })));
  const prevItemsKeyRef = useRef<string | null>(null);

  // Trigger animation on initial mount
  useEffect(() => {
    if (isFirstRender.current) {
      const timer = setTimeout(() => setShouldAnimate(true), 50);
      isFirstRender.current = false;
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Check if items actually changed using stable key comparison
    const prevItemsKey = prevItemsKeyRef.current;

    console.log('[useEffect] Running with pathname:', pathname, 'itemsKey:', itemsKey, 'prevItemsKey:', prevItemsKey);

    // Skip if items haven't changed
    if (prevItemsKey === itemsKey) {
      console.log('[useEffect] Items unchanged (same key), skipping animation');
      return;
    }

    // Get previous items from ref OR sessionStorage
    let prevItems = prevItemsRef.current;
    if (!prevItems) {
      try {
        const stored = sessionStorage.getItem('breadcrumb-prev-items');
        if (stored) {
          prevItems = JSON.parse(stored);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    console.log('[useEffect] Items changed - prevItems:', prevItems ? prevItems.map(i => i.label) : 'null', 'newItems:', items.map(i => i.label));

    // Detect navigation direction
    const goingBackward = prevItems && items.length < prevItems.length;

    console.log('[useEffect] Breadcrumb navigation detected:', {
      from: prevItems ? prevItems.map(i => i.label) : 'none',
      to: items.map(i => i.label),
      backward: goingBackward,
      isFirstRender: !prevItems
    });

    // Reset animation before making changes
    console.log('[useEffect] Setting shouldAnimate to false');
    setShouldAnimate(false);
    setAnimationComplete(false); // Start animation sequence

    // Track which item was previously active (for forward navigation)
    const prevActiveIndex = prevItems ? prevItems.length - 1 : null;
    setPreviouslyActiveIndex(prevActiveIndex);

    // When going backward, show previous items initially, then fade them out
    if (goingBackward && prevItems.length > items.length) {
      // Set direction first (synchronously)
      setIsGoingBackward(true);

      // Keep showing old items temporarily
      setDisplayItems(prevItems);

      // Mark items that will be removed
      const toRemove = new Set<number>();
      for (let i = items.length; i < prevItems.length; i++) {
        toRemove.add(i);
      }
      setItemsToRemove(toRemove);

      // Calculate total animation time based on cascading delays
      // Each item has 300ms delay + 300ms animation time
      const numItemsToRemove = toRemove.size;
      const totalAnimationTime = (numItemsToRemove * 300) + 200; // Last item delay + animation

      // Trigger animation after a brief delay
      const timer = setTimeout(() => {
        console.log('[useEffect TIMEOUT] Setting shouldAnimate to TRUE (backward)');
        setShouldAnimate(true);

        // After all animations complete, remove the extra items
        setTimeout(() => {
          setDisplayItems(items);
          setItemsToRemove(new Set());
          setIsGoingBackward(false);
          setPreviouslyActiveIndex(null);
          prevItemsRef.current = items;
          prevItemsKeyRef.current = itemsKey;
          // Store only serializable data (label, href) - skip editComponent
          const serializableItems = items.map(({ label, href }) => ({ label, href }));
          sessionStorage.setItem('breadcrumb-prev-items', JSON.stringify(serializableItems));

          // Mark animation as complete after everything is done
          setAnimationComplete(true);
        }, totalAnimationTime);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Forward navigation - update items immediately
      setIsGoingBackward(false);
      setDisplayItems(items);
      setItemsToRemove(new Set());

      // Trigger animation after a brief delay
      const timer = setTimeout(() => {
        console.log('[useEffect TIMEOUT] Setting shouldAnimate to TRUE (forward)');
        setShouldAnimate(true);
        prevItemsRef.current = items;
        prevItemsKeyRef.current = itemsKey;
        // Store only serializable data (label, href) - skip editComponent
        const serializableItems = items.map(({ label, href }) => ({ label, href }));
        sessionStorage.setItem('breadcrumb-prev-items', JSON.stringify(serializableItems));

        // Mark animation as complete after animation finishes (50ms delay + ~300ms animation)
        setTimeout(() => {
          setAnimationComplete(true);
          setPreviouslyActiveIndex(null);
        }, 350);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname, itemsKey, items]);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-2xl mb-1">
          {displayItems.map((item, index) => {
            // Calculate positions based on what's currently DISPLAYED
            const displayedIsLast = index === displayItems.length - 1;
            const displayedIsSecondToLast = index === displayItems.length - 2;

            // Calculate positions based on target state (after animation)
            const targetIsLast = index === items.length - 1;
            const willBeRemoved = itemsToRemove.has(index);
            const isActive = targetIsLast && !willBeRemoved;
            const wasPreviouslyActive = previouslyActiveIndex === index;

            // Determine which items should animate
            let shouldAnimateThisItem = false;

            if (shouldAnimate) {
              if (isGoingBackward) {
                // When going backward: animate removed items AND the new active item
                // - Items being removed fade out
                // - Item that becomes active gets bold
                if (willBeRemoved) {
                  shouldAnimateThisItem = true; // Fade out
                } else if (targetIsLast) {
                  shouldAnimateThisItem = true; // Become bold (new active)
                }
              } else {
                // Going forward: animate previously active item AND new active item
                // - Previously active item fades from bold to regular
                // - New active item fades from regular to bold
                shouldAnimateThisItem = wasPreviouslyActive || targetIsLast;
              }
            }

            // Calculate base delay for cascading fade-out effect
            let baseDelay = 0;
            if (isGoingBackward && willBeRemoved) {
              // Count how many items after this one are also being removed
              let numItemsAfter = 0;
              for (let i = index + 1; i < displayItems.length; i++) {
                if (itemsToRemove.has(i)) {
                  numItemsAfter++;
                }
              }
              // Each item waits for all items after it to finish (300ms per item)
              baseDelay = numItemsAfter * 0.3; // 300ms in seconds
            }

            // Calculate chevron animation (chevron fades with the item after it)
            const nextItemWillBeRemoved = itemsToRemove.has(index + 1);
            let chevronBaseDelay = 0;
            let chevronDuration = 0.3; // Default duration
            if (isGoingBackward && nextItemWillBeRemoved) {
              // Count how many items after the NEXT one are also being removed
              let numItemsAfterNext = 0;
              for (let i = index + 2; i < displayItems.length; i++) {
                if (itemsToRemove.has(i)) {
                  numItemsAfterNext++;
                }
              }
              chevronBaseDelay = numItemsAfterNext * 0.3;

              // Calculate duration based on next item's text length
              // Animation time = (letters - 1) * staggerDelay + letterDuration
              const nextItem = displayItems[index + 1];
              const nextItemLength = nextItem.label.length;
              const staggerDelay = 0.017; // 17ms for backward animation
              const letterDuration = 0.167; // 167ms per letter
              chevronDuration = (nextItemLength - 1) * staggerDelay + letterDuration;
            }

            // Debug logging for last item
            if (targetIsLast) {
              console.log(`[RENDER] Last item "${item.label}":`, {
                shouldAnimate,
                shouldAnimateThisItem,
                isActive,
                isGoingBackward
              });
            }

            return (
              <div key={item.href} className="flex items-center gap-2">
                {targetIsLast && !willBeRemoved ? (
                  item.isEditable && item.editComponent ? (
                    // For editable items: show text until animation completes, then show editComponent
                    !animationComplete ? (
                      <AnimatedBreadcrumb
                        text={item.label}
                        isActive={isActive}
                        wasPreviouslyActive={wasPreviouslyActive}
                        animationKey={`breadcrumb-${index}-${item.label}`}
                        shouldAnimate={shouldAnimateThisItem}
                        isGoingBackward={isGoingBackward}
                        shouldFadeOut={willBeRemoved}
                        baseDelay={baseDelay}
                      />
                    ) : (
                      <div className={isActive ? "" : "text-muted-foreground"}>
                        {item.editComponent}
                      </div>
                    )
                  ) : (
                    <AnimatedBreadcrumb
                      text={item.label}
                      isActive={isActive}
                      wasPreviouslyActive={wasPreviouslyActive}
                      animationKey={`breadcrumb-${index}-${item.label}`}
                      shouldAnimate={shouldAnimateThisItem}
                      isGoingBackward={isGoingBackward}
                      shouldFadeOut={willBeRemoved}
                      baseDelay={baseDelay}
                    />
                  )
                ) : item.isEditable && item.editComponent ? (
                  <div className={isActive ? "" : "text-muted-foreground"}>
                    {item.editComponent}
                  </div>
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
                      shouldAnimate={shouldAnimateThisItem}
                      isGoingBackward={isGoingBackward}
                      shouldFadeOut={willBeRemoved}
                      baseDelay={baseDelay}
                    />
                  </Link>
                )}
                {index < displayItems.length - 1 && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: shouldAnimate && nextItemWillBeRemoved ? 0 : 1
                    }}
                    transition={{
                      duration: shouldAnimate && nextItemWillBeRemoved ? chevronDuration : 0,
                      delay: chevronBaseDelay,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </motion.div>
                )}
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
