import { ReactNode, useMemo } from 'react';
import { RotateCw } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
  threshold?: number;
  className?: string;
  pullDownText?: string;
  releaseText?: string;
  refreshingText?: string;
}

export default function PullToRefresh({
  children,
  onRefresh,
  disabled,
  threshold,
  className = '',
  pullDownText = 'Pull down to refresh',
  releaseText = 'Release to refresh',
  refreshingText = 'Refreshing...',
}: PullToRefreshProps) {
  const { distance, status, eventHandlers } = usePullToRefresh({
    onRefresh,
    disabled,
    threshold,
  });

  const indicatorText = useMemo(() => {
    switch (status) {
      case 'ready':
        return releaseText;
      case 'refreshing':
        return refreshingText;
      default:
        return pullDownText;
    }
  }, [status, pullDownText, releaseText, refreshingText]);

  return (
    <div className={`relative touch-pan-y ${className}`} {...eventHandlers}>
      <div
        className="flex flex-col items-center justify-center text-sm text-gray-500 dark:text-dark-text-secondary transition-all duration-200"
        style={{
          height: status === 'idle' ? 0 : 60,
          opacity: status === 'idle' ? 0 : 1,
        }}
      >
        <div
          className={`flex items-center gap-2 ${status === 'refreshing' ? 'animate-pulse' : ''}`}
          style={{
            transform: `translateY(${Math.max(distance / 5 - 12, 0)}px)`,
          }}
        >
          <RotateCw
            size={16}
            className={`transition-transform ${
              status === 'refreshing' ? 'animate-spin' : 'rotate-180'
            }`}
          />
          <span>{indicatorText}</span>
        </div>
      </div>
      {children}
    </div>
  );
}


