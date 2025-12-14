import { useEffect, useRef } from 'react';

interface GestureCallbacks {
  onTwoFingerPullDown: () => void;
  onThreeFingerTap: () => void;
  onPan: (deltaX: number, deltaY: number) => void;
  onPanEnd: (deltaX: number, velocity: number) => void;
  onPinchIn?: () => void;  // Squeeze
  onPinchOut?: () => void; // Expand
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
    isPanning: false,
    panAxis: null as 'x' | 'y' | null, // 'x' | 'y' | null
  });

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const s = stateRef.current;
      s.touches = e.touches.length;
      s.maxTouches = Math.max(s.maxTouches, s.touches);
      s.startTime = Date.now();
      s.hasTriggered = false;
      s.isPanning = false;
      s.panAxis = null;

      // Track primary finger
      if (e.touches[0]) {
        s.startX = e.touches[0].clientX;
        s.startY = e.touches[0].clientY;
        s.lastX = e.touches[0].clientX;
        s.lastY = e.touches[0].clientY;
      }

      // 2-Finger Setup
      if (s.touches === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        s.initialSpacing = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const s = stateRef.current;
      
      // PREVENT BROWSER ZOOM/NAV on Multi-touch
      if (e.touches.length > 1) {
          e.preventDefault();
      }

      if (s.hasTriggered) return;
      
      const now = Date.now();
      
      // Update current position of primary finger
      const currX = e.touches[0].clientX;
      const currY = e.touches[0].clientY;
      const deltaX = currX - s.startX;
      const deltaY = currY - s.startY;
      
      // 2-Finger Gestures
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentSpacing = Math.hypot(dx, dy);
        
        // Avoid division by zero
        if (s.initialSpacing > 0) {
            const scale = currentSpacing / s.initialSpacing;

            // PINCH IN (SQUEEZE) -> RETREAT
            if (scale < 0.65 && callbacks.onPinchIn) {
                callbacks.onPinchIn();
                s.hasTriggered = true;
                return;
            }

            // PINCH OUT (EXPAND) -> OPEN
            if (scale > 1.5 && callbacks.onPinchOut) {
                callbacks.onPinchOut();
                s.hasTriggered = true;
                return;
            }
        }

        const spacingChange = Math.abs(currentSpacing - s.initialSpacing) / s.initialSpacing;

        // Pull Down (Only if spacing hasn't changed much, to differentiate from pinch)
        if (s.initialSpacing >= 30 && s.initialSpacing <= 240 && spacingChange < 0.2) {
            // Check vertical delta (Pull Down)
            if (deltaY > 110 && Math.abs(deltaX) < 50) {
                callbacks.onTwoFingerPullDown();
                s.hasTriggered = true;
                return;
            }
        }
      }

      // 3) General Pan (1 finger) with Direction Lock
      if (e.touches.length === 1 && !s.hasTriggered) {
         // Determine Axis if not set
         if (!s.panAxis && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
             s.panAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
         }

         // Only fire onPan if we are mostly moving horizontally (since our main Pan gesture is for paging/door)
         // Or if the component consuming this handles both, we send both.
         // But for Doorna V1, panning is mainly for Door (X) and Paging (X).
         // Vertical scrolling should be native. 
         // So if axis is Y, we do NOT call onPan, allowing native scroll to happen (if not preventDefaulted).
         
         if (s.panAxis === 'x') {
             // We prevent default to stop native horizontal swipes (nav back/forward)
             if (e.cancelable) e.preventDefault();
             callbacks.onPan(deltaX, deltaY);
         }
      }

      s.lastX = currX;
      s.lastY = currY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const s = stateRef.current;
      const now = Date.now();
      const duration = now - s.startTime;

      if (!s.hasTriggered) {
          // 3-Finger Tap
          if (s.maxTouches === 3 && duration >= 80 && duration <= 300) {
              callbacks.onThreeFingerTap();
          } else if (s.maxTouches === 1 && s.panAxis === 'x') {
              // Pan End (Only if we were panning X)
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
        s.panAxis = null;
      }
    };

    // Use { passive: false } to allow preventDefault
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