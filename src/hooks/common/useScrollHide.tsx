import { useMotionValueEvent, useScroll } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

export function useScrollHide(triggerDistance?: number) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastUpdateTime = useRef(0);
  const triggerRef = useRef(triggerDistance ?? 30);

  const { scrollY } = useScroll();

  // Update trigger distance when prop changes
  if (triggerDistance !== undefined && triggerDistance !== triggerRef.current) {
    triggerRef.current = triggerDistance;
  }

  const updateVisibility = useCallback((show: boolean) => {
    const now = Date.now();
    if (now - lastUpdateTime.current > 50) {
      // 50ms debounce
      setIsVisible(show);
      lastUpdateTime.current = now;
    }
  }, []);

  useMotionValueEvent(scrollY, 'change', (currentScrollY) => {
    const scrollDiff = currentScrollY - lastScrollY.current;
    if (currentScrollY > triggerRef.current) {
      if (Math.abs(scrollDiff) > 10) {
        if (scrollDiff > 0) {
          // Scrolling down - hide
          updateVisibility(false);
        } else {
          // Scrolling up - show
          updateVisibility(true);
        }
      }
    } else {
      // Always visible when above trigger distance
      updateVisibility(true);
    }

    lastScrollY.current = currentScrollY;
  });

  return isVisible;
}
