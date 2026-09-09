import { Link } from "react-router-dom";
import type { Servico } from "../types";
import { StatusBadge } from "./StatusBadge";
import { relativeTime } from "../utils/format";

const CATEGORIA_LABEL: Record<Servico["categoria"], string> = {
  ventilador: "Ventilador",
  eletrodomestico: "Eletrodoméstico",
  informatica: "Informática",
  outro: "Outro",
};

const CAPA_PADRAO: Record<Servico["categoria"], string> = {
  ventilador: "/covers/fan.svg",
  eletrodomestico: "/covers/microwave.svg",
  informatica: "/covers/laptop.svg",
  outro: "/covers/printer.svg",
};

// Hierarquia visual: foto > cor de status > título > última nota.
export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <Link
      to={`/servicos/${servico.uuid}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(26,25,22,0.04)] transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
        <img src={servico.fotoCapaUrl || CAPA_PADRAO[servico.categoria]} alt="" className="size-full object-cover" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={servico.status} className="bg-cream/90 backdrop-blur-sm" />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h2 className="font-display text-lg font-medium leading-snug tracking-tight text-ink">{servico.titulo}</h2>
        <p className="text-sm text-muted">
          {servico.nomeCliente || "Sem cliente"} · {CATEGORIA_LABEL[servico.categoria]}
        </p>
        {servico.ultimaNota ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{servico.ultimaNota}</p>
        ) : (
          <p className="text-sm text-muted">Nenhuma nota ainda</p>
        )}
        <p className="pt-1 text-xs tabular-nums text-muted">{relativeTime(servico.atualizadoEm)}</p>
      </div>
    </Link>
  );
}
