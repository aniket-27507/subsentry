import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import Button from './Button';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  selector?: string;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
}

interface InteractiveTutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  currentStepIndex: number;
  onClose: (completed: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const HIGHLIGHT_PADDING = 12;

export default function InteractiveTutorial({
  steps,
  isOpen,
  currentStepIndex,
  onClose,
  onNext,
  onPrev,
  onSkip,
}: InteractiveTutorialProps) {
  const activeStep = steps[currentStepIndex];
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const totalSteps = steps.length;
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= totalSteps - 1;
  const [calloutSize, setCalloutSize] = useState({ width: 0, height: 0 });
  const calloutRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const getTargetElement = useCallback(() => {
    if (!activeStep?.selector || typeof document === 'undefined') {
      return null;
    }
    return document.querySelector(activeStep.selector) as HTMLElement | null;
  }, [activeStep]);

  const syncTargetRect = useCallback(() => {
    if (!isOpen) {
      setTargetRect(null);
      return;
    }
    const element = getTargetElement();
    if (element) {
      setTargetRect(element.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [getTargetElement, isOpen]);

  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const element = getTargetElement();
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    const handleRecalculate = () => {
      syncTargetRect();
    };

    const animationFrame = window.requestAnimationFrame(handleRecalculate);

    window.addEventListener('resize', handleRecalculate);
    window.addEventListener('scroll', handleRecalculate, true);

    const scrollContainer = document.querySelector('[data-scroll-container]');
    scrollContainer?.addEventListener('scroll', handleRecalculate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleRecalculate);
      window.removeEventListener('scroll', handleRecalculate, true);
      scrollContainer?.removeEventListener('scroll', handleRecalculate);
    };
  }, [isOpen, activeStep, getTargetElement, syncTargetRect]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose(false);
      } else if (event.key === 'ArrowRight' && !isLastStep) {
        event.preventDefault();
        onNext();
      } else if (event.key === 'ArrowLeft' && !isFirstStep) {
        event.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, isFirstStep, isLastStep]);

  useLayoutEffect(() => {
    if (!isOpen || isMobile) return;
    const node = calloutRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setCalloutSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(node);
      return () => {
        resizeObserver.disconnect();
      };
    }

    return () => {};
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const preferredPlacement = useMemo(() => {
    if (!targetRect || typeof window === 'undefined') return 'auto';
    if (activeStep?.placement && activeStep.placement !== 'auto') {
      return activeStep.placement;
    }
    return targetRect.top > window.innerHeight / 2 ? 'top' : 'bottom';
  }, [activeStep?.placement, targetRect]);

  const calloutStyle = useMemo(() => {
    if (!targetRect || typeof window === 'undefined' || isMobile) {
      return {
        top: '50%',
        left: '50%',
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    const safeMargin = 20;
    const panelWidth = calloutSize.width || 360;
    const panelHeight = calloutSize.height || 240;
    let resolvedPlacement = preferredPlacement;

    if (
      (resolvedPlacement === 'bottom' || resolvedPlacement === 'auto') &&
      targetRect.bottom + margin + panelHeight > viewportHeight - safeMargin
    ) {
      resolvedPlacement = 'top';
    }
    if (
      (resolvedPlacement === 'top' || resolvedPlacement === 'auto') &&
      targetRect.top - margin - panelHeight < safeMargin
    ) {
      resolvedPlacement = 'bottom';
    }
    if (
      resolvedPlacement === 'left' &&
      targetRect.left - margin - panelWidth < safeMargin
    ) {
      resolvedPlacement = 'right';
    }
    if (
      resolvedPlacement === 'right' &&
      targetRect.right + margin + panelWidth > viewportWidth - safeMargin
    ) {
      resolvedPlacement = 'left';
    }

    let top: number;
    let left: number;

    switch (resolvedPlacement) {
      case 'top':
        top = targetRect.top - margin - panelHeight;
        left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - panelHeight / 2;
        left = targetRect.left - margin - panelWidth;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - panelHeight / 2;
        left = targetRect.right + margin;
        break;
      case 'bottom':
      default:
        top = targetRect.bottom + margin;
        left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
        break;
    }

    const clampedLeft = Math.min(
      Math.max(left, safeMargin),
      viewportWidth - safeMargin - panelWidth
    );
    const clampedTop = Math.min(
      Math.max(top, safeMargin),
      viewportHeight - safeMargin - panelHeight
    );

    return { top: clampedTop, left: clampedLeft };
  }, [preferredPlacement, targetRect, calloutSize, isMobile]);

  if (!isOpen || !activeStep || steps.length === 0) {
    return null;
  }

  const progress = totalSteps ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const handlePrimaryAction = () => {
    if (isLastStep) {
      onClose(true);
    } else {
      onNext();
    }
  };

  const panelBaseClasses = isMobile
    ? 'rounded-t-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-[0_-16px_60px_rgba(15,23,42,0.45)] p-6 space-y-5'
    : 'rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl p-5 space-y-4';

  const panelContent = (
    <div className={panelBaseClasses}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-primary dark:text-primary-dark font-semibold text-sm tracking-wide uppercase">
          <Sparkles size={18} />
          <span>Guided Tour</span>
        </div>
        <button
          aria-label="Close tutorial"
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-dark-text-secondary dark:hover:text-dark-text transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <p
          className={`${isMobile ? 'text-sm' : 'text-xs'} font-medium text-gray-500 dark:text-dark-text-secondary`}
        >
          Step {currentStepIndex + 1} of {steps.length}
        </p>
        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-dark-border overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-primary-dark transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
          {activeStep.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{activeStep.description}</p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-dark-text-secondary dark:hover:text-dark-text"
        >
          Skip tour
        </button>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="secondary"
            size={isMobile ? 'md' : 'sm'}
            onClick={onPrev}
            disabled={isFirstStep}
            className="flex items-center gap-1 flex-1 sm:flex-none"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size={isMobile ? 'md' : 'sm'}
            onClick={handlePrimaryAction}
            className="flex items-center gap-1 flex-1 sm:flex-none"
          >
            {isLastStep ? 'Finish' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
        onClick={() => onClose(false)}
      />

      {targetRect && (
        <div
          className="fixed z-[81] pointer-events-none rounded-xl border-2 border-primary/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)] transition-all duration-200"
          style={{
            top: targetRect.top - HIGHLIGHT_PADDING,
            left: targetRect.left - HIGHLIGHT_PADDING,
            width: targetRect.width + HIGHLIGHT_PADDING * 2,
            height: targetRect.height + HIGHLIGHT_PADDING * 2,
          }}
        />
      )}

      {isMobile ? (
        <div className="fixed inset-x-0 bottom-0 z-[82] pointer-events-auto px-4 pb-[calc(env(safe-area-inset-bottom,0)+1rem)]">
          <div className="mx-auto w-full max-w-md">{panelContent}</div>
        </div>
      ) : (
        <div
          className="fixed z-[82] max-w-sm w-[min(90vw,380px)] pointer-events-auto"
          style={calloutStyle}
          ref={calloutRef}
        >
          {panelContent}
        </div>
      )}
    </div>
  );
}

