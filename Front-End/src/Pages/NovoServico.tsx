import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Fan, Zap, Laptop, Wrench } from "lucide-react";
import { servicoService } from "../services/servicoService";
import type { CategoriaServico } from "../types";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getApiErrorMessage } from "../utils/apiError";
import { clsx } from "../lib-clsx";

const CATEGORIAS: { valor: CategoriaServico; rotulo: string; Icone: typeof Fan }[] = [
  { valor: "ventilador", rotulo: "Ventilador", Icone: Fan },
  { valor: "eletrodomestico", rotulo: "Eletrodoméstico", Icone: Zap },
  { valor: "informatica", rotulo: "Informática", Icone: Laptop },
  { valor: "outro", rotulo: "Outro", Icone: Wrench },
];

const CHECKLIST_PADRAO = [
  { label: "Diagnosticar", done: false },
  { label: "Reparar", done: false },
  { label: "Testar", done: false },
];

// Fluxo de 3 toques: título, categoria (ícone), salvar.
export function NovoServico() {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaServico>("outro");
  const [nomeCliente, setNomeCliente] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const servico = await servicoService.criar({ titulo, categoria, nomeCliente: nomeCliente || undefined });
      // Checklist padrão — reconhecer, não digitar do zero.
      await servicoService.atualizar(servico.uuid, { checklist: CHECKLIST_PADRAO });
      navigate(`/servicos/${servico.uuid}`);
    } catch (err) {
      setErro(getApiErrorMessage(err, "Não foi possível criar o serviço."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-muted hover:text-ink">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-medium tracking-tight text-ink">Novo serviço</h1>
      </div>

      {erro && (
        <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {erro}
        </p>
      )}

      <Input
        label="O que é / de quem é"
        placeholder="Ventilador Arno - Dona Maria"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        autoFocus
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Categoria</p>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIAS.map(({ valor, rotulo, Icone }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setCategoria(valor)}
              className={clsx(
                "flex flex-col items-center gap-1.5 rounded-md border p-3 transition-colors",
                categoria === valor ? "border-pine bg-pine/10" : "border-border bg-card"
              )}
            >
              <Icone size={22} className={categoria === valor ? "text-pine" : "text-muted"} />
              <span className="text-xs text-ink-soft">{rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Cliente (opcional)"
        placeholder="Nome do cliente"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
      />

      <Button type="submit" size="xl" disabled={!titulo || salvando}>
        {salvando ? "Salvando..." : "Salvar serviço"}
      </Button>
    </form>
  );
}
