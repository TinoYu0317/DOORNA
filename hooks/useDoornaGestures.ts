import { useEffect, useRef } from 'react';

interface GestureCallbacks {
  onTwoFingerPullDown: () => void;
  onThreeFingerTap: () => void;
  onPan: (deltaX: number, deltaY: number) => void;
  onPanEnd: (deltaX: number, velocity: number) => void;
}

export const useDoornaGestures = (callbacks: GestureCallbacks, enabled: boolean = true) => {
  const stateRef = useRef({
    touches: 0,
    startTime: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    initialSpacing: 0,
    maxTouches: 0,
    hasTriggered: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const s = stateRef.current;
      s.touches = e.touches.length;
      s.maxTouches = Math.max(s.maxTouches, s.touches);
      s.startTime = Date.now();
      s.hasTriggered = false;

      // Track primary finger
      if (e.touches[0]) {
        s.startX = e.touches[0].clientX;
        s.startY = e.touches[0].clientY;
        s.lastX = e.touches[0].clientX;
        s.lastY = e.touches[0].clientY;
      }

      // 2-Finger Pull Setup
      if (s.touches === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        s.initialSpacing = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const s = stateRef.current;
      if (s.hasTriggered) return;
      
      const now = Date.now();
      const dt = now - s.startTime;
      
      // Update current position of primary finger
      const currX = e.touches[0].clientX;
      const currY = e.touches[0].clientY;
      const deltaX = currX - s.startX;
      const deltaY = currY - s.startY;
      
      // 1) Two-Finger Pull Down
      if (e.touches.length === 2) {
        // Calculate average vertical movement
        // Check Spacing (Cancel Pinch)
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentSpacing = Math.hypot(dx, dy);
        const spacingChange = Math.abs(currentSpacing - s.initialSpacing) / s.initialSpacing;

        // Strict rules: spacing 30-240pt, change < 10%
        if (s.initialSpacing >= 30 && s.initialSpacing <= 240 && spacingChange < 0.1) {
            // Check vertical delta
            if (deltaY > 110 && Math.abs(deltaX) < 35) {
                callbacks.onTwoFingerPullDown();
                s.hasTriggered = true;
                return;
            }
        }
      }

      // 3) General Pan (1 finger)
      if (e.touches.length === 1 && !s.hasTriggered) {
         callbacks.onPan(deltaX, deltaY);
      }

      s.lastX = currX;
      s.lastY = currY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const s = stateRef.current;
      const now = Date.now();
      const duration = now - s.startTime;

      if (!s.hasTriggered) {
          // 2) Three-finger tap
          if (s.maxTouches === 3 && duration >= 80 && duration <= 220) {
              callbacks.onThreeFingerTap();
          } else if (s.maxTouches === 1) {
              // Pan End
              const dt = now - s.startTime;
              const deltaX = s.lastX - s.startX;
              // velocity px/ms -> *1000 for px/s
              const velocity = (deltaX / dt) * 1000;
              callbacks.onPanEnd(deltaX, velocity);
          }
      }
      
      // Reset if no fingers left
      if (e.touches.length === 0) {
        s.maxTouches = 0;
        s.touches = 0;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [callbacks, enabled]);
};