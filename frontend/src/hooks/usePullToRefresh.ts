import { TouchEvent, useCallback, useMemo, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  threshold?: number;
  disabled?: boolean;
  resistance?: number;
  onRefresh: () => Promise<void> | void;
}

interface PullToRefreshResult {
  distance: number;
  status: 'idle' | 'pulling' | 'ready' | 'refreshing';
  eventHandlers: {
    onTouchStart: (event: TouchEvent) => void;
    onTouchMove: (event: TouchEvent) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  };
  reset: () => void;
}

const DEFAULT_SCROLL_SELECTOR = '[data-scroll-container]';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function usePullToRefresh({
  threshold = 80,
  disabled = false,
  resistance = 2,
  onRefresh,
}: UsePullToRefreshOptions): PullToRefreshResult {
  const startYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [distance, setDistance] = useState(0);
  const [status, setStatus] = useState<'idle' | 'pulling' | 'ready' | 'refreshing'>('idle');

  const getScrollContainer = useCallback(() => {
    if (typeof document === 'undefined') return null;
    return document.querySelector(DEFAULT_SCROLL_SELECTOR) as HTMLElement | null;
  }, []);

  const reset = useCallback(() => {
    startYRef.current = null;
    isDraggingRef.current = false;
    setDistance(0);
    setStatus('idle');
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled || status === 'refreshing') return;
      const scrollContainer = getScrollContainer();
      if (scrollContainer && scrollContainer.scrollTop > 0) {
        return;
      }

      const touch = event.touches[0];
      startYRef.current = touch.clientY;
      isDraggingRef.current = true;
    },
    [disabled, status, getScrollContainer],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (disabled) return;
      if (!isDraggingRef.current || startYRef.current === null) return;
      const touch = event.touches[0];
      const deltaY = touch.clientY - startYRef.current;

      if (deltaY <= 0) {
        reset();
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const pulledDistance = deltaY / resistance;
      setDistance(pulledDistance);
      setStatus(pulledDistance > threshold ? 'ready' : 'pulling');
    },
    [disabled, resistance, threshold, reset],
  );

  const completePull = useCallback(async () => {
    if (disabled) return;
    if (!isDraggingRef.current) return;

    if (status === 'ready') {
      setStatus('refreshing');
      setDistance(threshold);
      await Promise.resolve(onRefresh());
      await sleep(300);
    }

    reset();
  }, [disabled, onRefresh, reset, status, threshold]);

  const eventHandlers = useMemo(
    () => ({
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: completePull,
      onTouchCancel: completePull,
    }),
    [completePull, handleTouchMove, handleTouchStart],
  );

  return {
    distance,
    status,
    eventHandlers,
    reset,
  };
}


