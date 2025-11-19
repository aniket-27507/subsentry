import { ReactNode } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface MobileChartWrapperProps {
  children: (context: { height: number; isMobile: boolean }) => ReactNode;
  desktopHeight?: number;
  mobileHeight?: number;
  isLoading?: boolean;
}

export default function MobileChartWrapper({
  children,
  desktopHeight = 320,
  mobileHeight = 220,
  isLoading = false,
}: MobileChartWrapperProps) {
  const isMobile = useIsMobile();
  const height = isMobile ? mobileHeight : desktopHeight;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-dark-bg/60 backdrop-blur-sm rounded-xl">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      {children({ height, isMobile })}
    </div>
  );
}


