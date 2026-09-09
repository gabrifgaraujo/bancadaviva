import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "../../lib-clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          "h-12 w-full rounded-md border border-border bg-card px-3.5 text-base text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-pine",
          className
        )}
        {...props}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
