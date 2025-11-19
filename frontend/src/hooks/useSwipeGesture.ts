import { TouchEvent, useCallback, useRef, useState } from 'react';

interface UseSwipeGestureOptions {
  threshold?: number;
  maxTranslate?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

interface SwipeGestureResult {
  offset: number;
  isDragging: boolean;
  eventHandlers: {
    onTouchStart: (event: TouchEvent) => void;
    onTouchMove: (event: TouchEvent) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  };
  reset: () => void;
}

export function useSwipeGesture({
  threshold = 80,
  maxTranslate = 160,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: UseSwipeGestureOptions): SwipeGestureResult {
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const reset = useCallback(() => {
    startXRef.current = null;
    isDraggingRef.current = false;
    setOffset(0);
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled) return;
      const touch = event.touches[0];
      startXRef.current = touch.clientX;
      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (disabled) return;
      if (!isDraggingRef.current || startXRef.current === null) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - startXRef.current;

      // Prevent horizontal scroll jitter
      if (Math.abs(deltaX) < 5) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const clamped = Math.max(Math.min(deltaX, maxTranslate), -maxTranslate);
      setOffset(clamped);
    },
    [disabled, maxTranslate],
  );

  const completeSwipe = useCallback(() => {
    if (!isDraggingRef.current) return;

    if (offset <= -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (offset >= threshold && onSwipeRight) {
      onSwipeRight();
    }

    reset();
  }, [offset, onSwipeLeft, onSwipeRight, threshold, reset]);

  const eventHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: completeSwipe,
    onTouchCancel: completeSwipe,
  };

  return {
    offset,
    isDragging,
    eventHandlers,
    reset,
  };
}


