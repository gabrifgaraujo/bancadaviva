import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { servicoService } from "../services/servicoService";
import { ServiceCard } from "../components/ServiceCard";
import type { Servico, StatusServico } from "../types";
import { getApiErrorMessage } from "../utils/apiError";
import { clsx } from "../lib-clsx";

const FILTROS: { valor: StatusServico | "todos"; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "aguardando", rotulo: "Aguardando" },
  { valor: "em_andamento", rotulo: "Em andamento" },
  { valor: "aguardando_peca", rotulo: "Aguardando peça" },
  { valor: "pronto", rotulo: "Pronto" },
  { valor: "entregue", rotulo: "Entregue" },
];

export function Board() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<StatusServico | "todos">("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await servicoService.listar();
        setServicos(dados);
      } catch (err) {
        setErro(getApiErrorMessage(err, "Não foi possível carregar os serviços."));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    return servicos.filter((s) => {
      const bateStatus = filtro === "todos" || s.status === filtro;
      const termo = busca.trim().toLowerCase();
      const bateBusca =
        !termo ||
        s.titulo.toLowerCase().includes(termo) ||
        (s.nomeCliente ?? "").toLowerCase().includes(termo) ||
        (s.ultimaNota ?? "").toLowerCase().includes(termo);
      return bateStatus && bateBusca;
    });
  }, [servicos, filtro, busca]);

  if (carregando) return <p className="pt-10 text-center text-muted">Carregando...</p>;
  if (erro) return <p className="pt-10 text-center text-destructive">{erro}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink">Bancada</h1>
        <p className="text-sm text-muted">Onde eu parei? Em um clique.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título, cliente ou nota"
          className="h-12 w-full rounded-md border border-border bg-card pl-10 pr-3.5 text-base text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-pine"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={clsx(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filtro === f.valor
                ? "border-pine bg-pine text-primary-foreground"
                : "border-border bg-card text-ink-soft"
            )}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="mt-10 text-center text-muted">
          <p className="mb-1 font-display text-lg text-ink">Nenhum serviço por aqui</p>
          <p className="text-sm">Toque no + no topo pra registrar o primeiro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtrados.map((servico) => (
            <ServiceCard key={servico.uuid} servico={servico} />
          ))}
        </div>
      )}
    </div>
  );
}
