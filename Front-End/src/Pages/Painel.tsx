import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { Heatmap } from "../components/Heatmap";
import type { DashboardData, StatusServico } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

const ROTULOS_STATUS: Record<StatusServico, string> = {
  aguardando: "Aguardando",
  em_andamento: "Em andamento",
  aguardando_peca: "Aguardando peça",
  pronto: "Pronto",
  entregue: "Entregue",
};

const ORDEM_STATUS: StatusServico[] = ["aguardando", "em_andamento", "aguardando_peca", "pronto", "entregue"];

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Painel() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    dashboardService
      .obter()
      .then(setDados)
      .catch((err) => setErro(getApiErrorMessage(err, "Não foi possível carregar o painel.")))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="pt-10 text-center text-muted">Carregando...</p>;
  if (erro || !dados) return <p className="pt-10 text-center text-destructive">{erro}</p>;

  const totalAtivos = ORDEM_STATUS.filter((s) => s !== "entregue").reduce(
    (soma, s) => soma + dados.contagemPorStatus[s],
    0
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="font-display text-xl font-medium tracking-tight text-ink">Painel</h1>

      {/* Números diretos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-semibold text-ink">{totalAtivos}</p>
          <p className="text-xs text-muted">Serviços ativos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-semibold text-ink">{dados.contagemPorStatus.aguardando_peca}</p>
          <p className="text-xs text-muted">Aguardando peça</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-semibold text-ink">{dados.clientesAtendidos}</p>
          <p className="text-xs text-muted">Clientes atendidos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-semibold text-ink">{formatarMoeda(dados.faturamentoMes)}</p>
          <p className="text-xs text-muted">Faturado no mês</p>
        </div>
      </div>

      {/* Distribuição por status */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-ink-soft">Por status</p>
        <div className="flex flex-col gap-2">
          {ORDEM_STATUS.map((status) => {
            const total = dados.contagemPorStatus[status];
            const max = Math.max(...Object.values(dados.contagemPorStatus), 1);
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-muted">{ROTULOS_STATUS[status]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full rounded-full bg-pine" style={{ width: `${(total / max) * 100}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-muted">{total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap de atividade */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-ink-soft">Atividade no último ano</p>
        <Heatmap dias={dados.heatmap} />
      </div>

      {/* Serviços parados — alerta gentil */}
      {dados.servicosParados.length > 0 && (
        <div className="rounded-xl border border-warn/30 bg-warn/5 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-warn">
            <AlertTriangle size={16} />
            Parados há um tempo
          </p>
          <div className="flex flex-col gap-2">
            {dados.servicosParados.map((s) => (
              <Link
                key={s.uuid}
                to={`/servicos/${s.uuid}`}
                className="flex items-center justify-between rounded-md bg-card px-3 py-2 text-sm"
              >
                <span className="text-ink">{s.titulo}</span>
                <span className="text-xs text-muted">há {s.diasParado}d</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
