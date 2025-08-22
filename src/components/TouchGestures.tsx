import React, { useEffect, useRef } from 'react';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number) => void;
  onDoubleTap?: () => void;
}

export function TouchGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onDoubleTap
}: TouchGesturesProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - track for swipe
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      } else if (e.touches.length === 2 && onPinchZoom) {
        // Two touches - track for pinch
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        pinchStartRef.current = { distance, scale: 1 };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartRef.current && onPinchZoom) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = distance / pinchStartRef.current.distance;
        onPinchZoom(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1 && touchStartRef.current) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Check for double tap
        if (onDoubleTap && distance < 10 && deltaTime < 300) {
          const now = Date.now();
          if (now - lastTapRef.current < 300) {
            onDoubleTap();
          }
          lastTapRef.current = now;
        }

        // Check for swipe (minimum distance and speed)
        if (distance > 50 && deltaTime < 500) {
          const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
          
          if (Math.abs(angle) < 45) {
            // Right swipe
            onSwipeRight?.();
          } else if (Math.abs(angle) > 135) {
            // Left swipe
            onSwipeLeft?.();
          } else if (angle > 45 && angle < 135) {
            // Down swipe
            onSwipeDown?.();
          } else if (angle < -45 && angle > -135) {
            // Up swipe
            onSwipeUp?.();
          }
        }

        touchStartRef.current = null;
      }

      if (e.touches.length === 0) {
        pinchStartRef.current = null;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinchZoom, onDoubleTap]);

  return (
    <div ref={elementRef} className="h-full w-full">
      {children}
    </div>
  );
}