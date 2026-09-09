import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "../../lib-clsx";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
}

// Botão grande com ícone — ações principais (registrar progresso etc).
// Regra de UX do projeto: reconhecer, não lembrar.
export function ActionButton({ icon: Icon, label, className, ...props }: ActionButtonProps) {
  return (
    <button
      className={clsx(
        "flex h-14 w-full items-center justify-center gap-2 rounded-md bg-pine text-base font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}
