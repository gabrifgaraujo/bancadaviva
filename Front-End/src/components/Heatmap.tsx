import type { DiaHeatmap } from "../types";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function corPorIntensidade(total: number): string {
  if (total === 0) return "bg-paper-2";
  if (total <= 2) return "bg-pine/25";
  if (total <= 5) return "bg-pine/55";
  if (total <= 9) return "bg-pine/80";
  return "bg-pine";
}

function formatarChave(data: Date): string {
  return data.toISOString().slice(0, 10);
}

// Grid estilo GitHub: 53 semanas x 7 dias, terminando hoje.
// Só usa dado que já temos (created_at dos registros) — nada de infra nova.
export function Heatmap({ dias }: { dias: DiaHeatmap[] }) {
  const porData = new Map(dias.map((d) => [d.data, d.total]));

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicio = new Date(hoje);
  inicio.setDate(inicio.getDate() - 370);
  inicio.setDate(inicio.getDate() - inicio.getDay()); // volta pro domingo anterior

  const semanas: { data: Date; total: number }[][] = [];
  const cursor = new Date(inicio);

  while (cursor <= hoje) {
    const semana: { data: Date; total: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const chave = formatarChave(cursor);
      semana.push({ data: new Date(cursor), total: porData.get(chave) || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    semanas.push(semana);
  }

  let mesAnterior = -1;
  const rotulosMes = semanas.map((semana) => {
    const mes = semana[0].data.getMonth();
    const mostrar = mes !== mesAnterior;
    mesAnterior = mes;
    return mostrar ? MESES[mes] : "";
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1 pl-6 text-[10px] text-muted">
          {rotulosMes.map((rotulo, i) => (
            <span key={i} className="w-3">
              {rotulo}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pr-1 text-[10px] text-muted">
            {DIAS_SEMANA.map((d, i) => (
              <span key={i} className="flex h-3 items-center">
                {i % 2 === 1 ? d : ""}
              </span>
            ))}
          </div>
          {semanas.map((semana, i) => (
            <div key={i} className="flex flex-col gap-1">
              {semana.map((dia, j) => (
                <div
                  key={j}
                  title={`${dia.data.toLocaleDateString("pt-BR")}: ${dia.total} registro(s)`}
                  className={`size-3 rounded-sm ${dia.data > hoje ? "opacity-0" : corPorIntensidade(dia.total)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
