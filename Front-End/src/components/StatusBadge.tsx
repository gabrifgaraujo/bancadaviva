import type { StatusServico } from "../types";
import { clsx } from "../lib-clsx";

const ROTULOS: Record<StatusServico, string> = {
  aguardando: "Aguardando",
  em_andamento: "Em andamento",
  aguardando_peca: "Aguardando peça",
  pronto: "Pronto",
  entregue: "Entregue",
};

const TOM: Record<StatusServico, string> = {
  aguardando: "bg-wait/15 text-wait border-wait/25",
  em_andamento: "bg-warn/12 text-warn border-warn/25",
  aguardando_peca: "bg-hold/18 text-hold border-hold/30",
  pronto: "bg-ok/15 text-ok border-ok/25",
  entregue: "bg-muted/15 text-muted border-border",
};

export function StatusBadge({ status, className }: { status: StatusServico; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        TOM[status],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {ROTULOS[status]}
    </span>
  );
}
