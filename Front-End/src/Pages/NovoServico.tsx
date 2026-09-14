import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Fan, Zap, Laptop, Wrench, Sparkles, X } from "lucide-react";
import { servicoService } from "../services/servicoService";
import { iaService } from "../services/iaService";
import type { CategoriaServico, ItemChecklist } from "../types";
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

const CHECKLIST_PADRAO: ItemChecklist[] = [
  { label: "Diagnosticar", done: false },
  { label: "Reparar", done: false },
  { label: "Testar", done: false },
];

// Fluxo de poucos toques: título, categoria (ícone), checklist já vem pronto, salvar.
export function NovoServico() {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaServico>("outro");
  const [nomeCliente, setNomeCliente] = useState("");
  const [valor, setValor] = useState("");
  const [checklist, setChecklist] = useState<ItemChecklist[]>(CHECKLIST_PADRAO);
  const [gerandoIa, setGerandoIa] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  function removerItemChecklist(index: number) {
    setChecklist((atual) => atual.filter((_, i) => i !== index));
  }

  async function sugerirComIa() {
    if (!titulo.trim()) return;
    setErro("");
    setGerandoIa(true);
    try {
      const itens = await iaService.sugerirChecklist(titulo.trim(), categoria);
      setChecklist(itens.map((label) => ({ label, done: false })));
    } catch (err) {
      setErro(getApiErrorMessage(err, "Não foi possível gerar sugestões agora."));
    } finally {
      setGerandoIa(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const servico = await servicoService.criar({
        titulo,
        categoria,
        nomeCliente: nomeCliente || undefined,
        checklist,
        valor: valor ? Number(valor) : undefined,
      });
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
          {CATEGORIAS.map(({ valor: valorCategoria, rotulo, Icone }) => (
            <button
              key={valorCategoria}
              type="button"
              onClick={() => setCategoria(valorCategoria)}
              className={clsx(
                "flex flex-col items-center gap-1.5 rounded-md border p-3 transition-colors",
                categoria === valorCategoria ? "border-pine bg-pine/10" : "border-border bg-card"
              )}
            >
              <Icone size={22} className={categoria === valorCategoria ? "text-pine" : "text-muted"} />
              <span className="text-xs text-ink-soft">{rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Cliente (opcional)"
          placeholder="Nome do cliente"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
        />
        <Input
          label="Valor (opcional)"
          placeholder="0,00"
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ""))}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink-soft">Checklist</p>
          <button
            type="button"
            onClick={sugerirComIa}
            disabled={!titulo.trim() || gerandoIa}
            className="flex items-center gap-1 text-xs font-medium text-pine disabled:opacity-40"
          >
            <Sparkles size={14} />
            {gerandoIa ? "Gerando..." : "Sugerir com IA"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {checklist.map((item, index) => (
            <div key={index} className="flex h-11 items-center justify-between rounded-md border border-border bg-card px-4">
              <span className="text-sm text-ink">{item.label}</span>
              <button
                type="button"
                onClick={() => removerItemChecklist(index)}
                aria-label="Remover item"
                className="text-muted hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {checklist.length === 0 && <p className="text-xs text-muted">Nenhum item — tudo bem, dá pra adicionar depois.</p>}
        </div>
      </div>

      <Button type="submit" size="xl" disabled={!titulo || salvando}>
        {salvando ? "Salvando..." : "Salvar serviço"}
      </Button>
    </form>
  );
}
