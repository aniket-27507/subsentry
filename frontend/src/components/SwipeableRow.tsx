import { ReactNode, useMemo } from 'react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useIsMobile } from '../hooks/useIsMobile';

type ActionVariant = 'primary' | 'danger' | 'neutral';

interface SwipeAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: ActionVariant;
}

interface SwipeableRowProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

const ACTION_STYLES: Record<ActionVariant, string> = {
  primary: 'bg-primary text-white',
  danger: 'bg-danger text-white',
  neutral: 'bg-gray-700 text-white',
};

export default function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
  className = '',
  disabled = false,
}: SwipeableRowProps) {
  const isMobile = useIsMobile();
  const showSwipe = isMobile && (!disabled && (leftActions.length > 0 || rightActions.length > 0));

  const {
    offset,
    isDragging,
    eventHandlers,
    reset,
  } = useSwipeGesture({
    onSwipeLeft: leftActions[0]?.onClick,
    onSwipeRight: rightActions[0]?.onClick,
    disabled: !showSwipe,
  });

  const actionButtons = useMemo(() => {
    const createButtons = (actions: SwipeAction[], position: 'left' | 'right') => (
      <div
        className={`absolute inset-y-0 ${position === 'left' ? 'left-0' : 'right-0'} flex ${
          position === 'left' ? 'flex-row' : 'flex-row-reverse'
        } gap-0`}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`flex items-center gap-2 px-4 min-w-[90px] justify-center text-sm font-semibold ${ACTION_STYLES[action.variant ?? 'primary']}`}
            onClick={() => {
              action.onClick();
              reset();
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    );

    return {
      left: leftActions.length > 0 ? createButtons(leftActions, 'right') : null,
      right: rightActions.length > 0 ? createButtons(rightActions, 'left') : null,
    };
  }, [leftActions, rightActions, reset]);

  return (
    <div className={`relative overflow-hidden touch-pan-x ${className}`}>
      {showSwipe && (
        <>
          {actionButtons.right}
          {actionButtons.left}
        </>
      )}

      <div
        className={`relative bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border transition-[transform] ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          transform: `translateX(${showSwipe ? offset : 0}px)`,
        }}
        {...eventHandlers}
      >
        {children}
      </div>
    </div>
  );
}


