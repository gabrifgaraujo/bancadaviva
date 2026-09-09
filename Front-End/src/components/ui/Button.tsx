import type { ButtonHTMLAttributes } from "react";
import { clsx } from "../../lib-clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg" | "xl" | "icon";
}

export function Button({ variant = "primary", size = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-pine-2",
        variant === "secondary" && "bg-secondary text-ink hover:bg-border",
        variant === "outline" && "border border-border bg-card text-ink hover:bg-secondary",
        variant === "ghost" && "text-ink hover:bg-secondary",
        variant === "destructive" && "bg-destructive text-primary-foreground hover:opacity-90",
        size === "sm" && "h-9 px-3 text-sm",
        size === "default" && "h-11 px-4",
        size === "lg" && "h-12 px-5 text-base",
        size === "xl" && "h-14 px-6 text-base",
        size === "icon" && "size-11",
        className
      )}
      {...props}
    />
  );
}
