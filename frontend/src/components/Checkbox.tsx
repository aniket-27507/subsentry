import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

const setRefs = (
  node: HTMLInputElement | null,
  ref?: React.Ref<HTMLInputElement>
) => {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(node);
  } else {
    (ref as MutableRefObject<HTMLInputElement | null>).current = node;
  }
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className = '', ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const input = (
      <input
        type="checkbox"
        ref={(node) => {
          internalRef.current = node;
          setRefs(node, ref);
        }}
        className={`h-4 w-4 rounded border-gray-300 dark:border-dark-border text-primary dark:text-primary-dark focus:ring-primary/30 dark:focus:ring-primary-dark/30 focus:ring-2 ${className}`}
        {...props}
      />
    );

    if (!label) {
      return input;
    }

    return (
      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-dark-text-secondary cursor-pointer select-none">
        {input}
        {label}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

