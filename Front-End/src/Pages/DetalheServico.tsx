import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Camera, Check, Trash2, Plus, X, Sparkles, Pencil } from "lucide-react";
import { servicoService } from "../services/servicoService";
import { progressoService } from "../services/progressoService";
import { iaService } from "../services/iaService";
import type { ServicoDetalhado, StatusServico, ItemChecklist, RegistroProgresso } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ActionButton } from "../components/ui/ActionButton";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getApiErrorMessage } from "../utils/apiError";
import { relativeTime } from "../utils/format";
import { clsx } from "../lib-clsx";

const STATUS_OPCOES: StatusServico[] = ["aguardando", "em_andamento", "aguardando_peca", "pronto", "entregue"];

const ROTULOS_STATUS: Record<StatusServico, string> = {
  aguardando: "Aguardando",
  em_andamento: "Em andamento",
  aguardando_peca: "Aguardando peça",
  pronto: "Pronto",
  entregue: "Entregue",
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DetalheServico() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [servico, setServico] = useState<ServicoDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [novaNota, setNovaNota] = useState("");
  const [novoItemChecklist, setNovoItemChecklist] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [editandoValor, setEditandoValor] = useState(false);
  const [valorEdicao, setValorEdicao] = useState("");
  const [registroEditando, setRegistroEditando] = useState<string | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [confirmandoExclusaoRegistro, setConfirmandoExclusaoRegistro] = useState<string | null>(null);
  const [resumoIa, setResumoIa] = useState("");
  const [gerandoResumo, setGerandoResumo] = useState(false);

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  async function carregar() {
    if (!uuid) return;
    try {
      const dados = await servicoService.detalhar(uuid);
      setServico(dados);
    } catch (err) {
      setErro(getApiErrorMessage(err, "Serviço não encontrado."));
    } finally {
      setCarregando(false);
    }
  }

  async function mudarStatus(status: StatusServico) {
    if (!servico) return;
    const atualizado = await servicoService.atualizar(servico.uuid, { status });
    setServico({ ...servico, ...atualizado });
  }

  async function alternarItemChecklist(index: number) {
    if (!servico) return;
    const checklist = servico.checklist.map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    const atualizado = await servicoService.atualizar(servico.uuid, { checklist });
    setServico({ ...servico, checklist: atualizado.checklist });
  }

  async function removerItemChecklist(index: number) {
    if (!servico) return;
    const checklist = servico.checklist.filter((_, i) => i !== index);
    const atualizado = await servicoService.atualizar(servico.uuid, { checklist });
    setServico({ ...servico, checklist: atualizado.checklist });
  }

  async function adicionarItemChecklist() {
    if (!servico || !novoItemChecklist.trim()) return;
    const checklist: ItemChecklist[] = [...servico.checklist, { label: novoItemChecklist.trim(), done: false }];
    const atualizado = await servicoService.atualizar(servico.uuid, { checklist });
    setServico({ ...servico, checklist: atualizado.checklist });
    setNovoItemChecklist("");
  }

  function abrirEdicaoValor() {
    if (!servico) return;
    setValorEdicao(servico.valor !== null ? String(servico.valor) : "");
    setEditandoValor(true);
  }

  async function salvarValor() {
    if (!servico) return;
    const numerico = valorEdicao.trim() ? Number(valorEdicao.replace(",", ".")) : null;
    const atualizado = await servicoService.atualizar(servico.uuid, { valor: numerico });
    setServico({ ...servico, valor: atualizado.valor });
    setEditandoValor(false);
  }

  async function registrarNota() {
    if (!servico || !novaNota.trim()) return;
    const registro = await progressoService.adicionarNota(servico.uuid, novaNota.trim());
    setServico({ ...servico, ultimaNota: novaNota.trim(), registros: [registro, ...servico.registros] });
    setNovaNota("");
  }

  async function registrarFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!servico || !arquivo) return;
    setEnviandoFoto(true);
    try {
      await progressoService.adicionarArquivo(servico.uuid, "foto", arquivo);
      const atualizado = await servicoService.detalhar(servico.uuid);
      setServico(atualizado);
    } catch (err) {
      setErro(getApiErrorMessage(err, "Não foi possível enviar a foto."));
    } finally {
      setEnviandoFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function iniciarEdicaoRegistro(registro: RegistroProgresso) {
    setRegistroEditando(registro.uuid);
    setTextoEdicao(registro.texto || "");
  }

  async function salvarEdicaoRegistro(uuidRegistro: string) {
    if (!servico) return;
    const atualizado = await progressoService.atualizar(servico.uuid, uuidRegistro, textoEdicao.trim());
    setServico({
      ...servico,
      registros: servico.registros.map((r) => (r.uuid === uuidRegistro ? atualizado : r)),
    });
    setRegistroEditando(null);
  }

  async function excluirRegistro(uuidRegistro: string) {
    if (!servico) return;
    if (confirmandoExclusaoRegistro !== uuidRegistro) {
      setConfirmandoExclusaoRegistro(uuidRegistro);
      return;
    }
    await progressoService.remover(servico.uuid, uuidRegistro);
    setServico({ ...servico, registros: servico.registros.filter((r) => r.uuid !== uuidRegistro) });
    setConfirmandoExclusaoRegistro(null);
  }

  async function resumirComIa() {
    if (!servico) return;
    setErro("");
    setGerandoResumo(true);
    try {
      const resumo = await iaService.resumirHistorico(servico.uuid);
      setResumoIa(resumo);
    } catch (err) {
      setErro(getApiErrorMessage(err, "Não foi possível gerar o resumo agora."));
    } finally {
      setGerandoResumo(false);
    }
  }

  async function excluir() {
    if (!servico) return;
    if (!confirmandoExclusao) {
      setConfirmandoExclusao(true);
      return;
    }
    await servicoService.remover(servico.uuid);
    navigate("/");
  }

  if (carregando) return <p className="pt-10 text-center text-muted">Carregando...</p>;
  if (erro || !servico) return <p className="pt-10 text-center text-destructive">{erro || "Serviço não encontrado."}</p>;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Link to="/" className="flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} />
        Voltar pra bancada
      </Link>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {servico.fotoCapaUrl && <img src={servico.fotoCapaUrl} alt="" className="h-48 w-full object-cover" />}
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={servico.status} />
            {editandoValor ? (
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={valorEdicao}
                onChange={(e) => setValorEdicao(e.target.value.replace(/[^0-9.,]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && salvarValor()}
                onBlur={salvarValor}
                className="h-8 w-24 rounded-md border border-border bg-card px-2 text-right text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-pine"
              />
            ) : (
              <button onClick={abrirEdicaoValor} className="text-sm font-medium text-muted hover:text-ink">
                {servico.valor !== null ? formatarMoeda(servico.valor) : "+ valor"}
              </button>
            )}
          </div>
          <h1 className="font-display text-xl font-medium tracking-tight text-ink">{servico.titulo}</h1>
          {servico.nomeCliente && <p className="text-sm text-muted">Cliente: {servico.nomeCliente}</p>}
          {servico.ultimaNota && (
            <p className="rounded-md bg-paper-2 p-3 text-sm text-ink-soft">
              <strong className="text-ink">Onde parei:</strong> {servico.ultimaNota}
            </p>
          )}
        </div>
      </div>

      {/* Status — uma decisão por tela, botões grandes */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPCOES.map((status) => (
            <button
              key={status}
              onClick={() => mudarStatus(status)}
              className={clsx(
                "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                servico.status === status ? "border-pine bg-pine text-primary-foreground" : "border-border text-ink-soft"
              )}
            >
              {ROTULOS_STATUS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Checklist</p>
        <div className="flex flex-col gap-2">
          {servico.checklist.map((item, index) => (
            <div key={index} className="flex h-11 items-center gap-3 rounded-md border border-border bg-card px-4">
              <button onClick={() => alternarItemChecklist(index)} className="flex flex-1 items-center gap-3 text-left">
                <span
                  className={clsx(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    item.done ? "border-ok bg-ok text-primary-foreground" : "border-border"
                  )}
                >
                  {item.done && <Check size={13} />}
                </span>
                <span className={item.done ? "text-muted line-through" : "text-ink"}>{item.label}</span>
              </button>
              <button
                onClick={() => removerItemChecklist(index)}
                aria-label="Remover item"
                className="text-muted hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Adicionar item"
            value={novoItemChecklist}
            onChange={(e) => setNovoItemChecklist(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarItemChecklist()}
          />
          <Button variant="secondary" onClick={adicionarItemChecklist} type="button">
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {/* Registrar progresso */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-ink-soft">Registrar progresso</p>
        <div className="flex gap-2">
          <Input
            placeholder="Nota rápida — o que foi feito"
            value={novaNota}
            onChange={(e) => setNovaNota(e.target.value)}
          />
          <Button onClick={registrarNota} type="button">
            Salvar
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" hidden onChange={registrarFoto} />
        <ActionButton
          icon={Camera}
          label={enviandoFoto ? "Enviando foto..." : "Tirar / anexar foto"}
          onClick={() => fileInputRef.current?.click()}
          disabled={enviandoFoto}
          type="button"
        />
      </div>

      {/* Histórico */}
      {servico.registros.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-soft">Histórico</p>
            <button
              onClick={resumirComIa}
              disabled={gerandoResumo}
              className="flex items-center gap-1 text-xs font-medium text-pine disabled:opacity-40"
            >
              <Sparkles size={14} />
              {gerandoResumo ? "Resumindo..." : "Resumir com IA"}
            </button>
          </div>

          {resumoIa && (
            <p className="mb-3 rounded-md border border-pine/25 bg-pine/5 p-3 text-sm text-ink-soft">{resumoIa}</p>
          )}

          <div className="flex flex-col gap-3">
            {servico.registros.map((registro) => (
              <div key={registro.uuid} className="rounded-md border border-border bg-card p-3">
                {registro.tipo === "foto" && registro.midiaUrl && (
                  <img src={registro.midiaUrl} alt="" className="mb-2 max-h-48 w-full rounded-md object-cover" />
                )}

                {registroEditando === registro.uuid ? (
                  <div className="flex gap-2">
                    <Input
                      value={textoEdicao}
                      onChange={(e) => setTextoEdicao(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && salvarEdicaoRegistro(registro.uuid)}
                      autoFocus
                    />
                    <Button size="sm" onClick={() => salvarEdicaoRegistro(registro.uuid)} type="button">
                      Salvar
                    </Button>
                  </div>
                ) : (
                  registro.texto && <p className="text-sm text-ink">{registro.texto}</p>
                )}

                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-muted">{relativeTime(registro.criadoEm)}</p>
                  {registroEditando !== registro.uuid && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => iniciarEdicaoRegistro(registro)}
                        aria-label="Editar registro"
                        className="text-muted hover:text-ink"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => excluirRegistro(registro.uuid)}
                        aria-label="Excluir registro"
                        className="text-muted hover:text-destructive"
                      >
                        {confirmandoExclusaoRegistro === registro.uuid ? (
                          <span className="text-xs text-destructive">confirmar</span>
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={excluir}
        className="flex h-11 items-center justify-center gap-2 rounded-md border border-destructive/30 text-sm font-medium text-destructive"
      >
        <Trash2 size={16} />
        {confirmandoExclusao ? "Toque de novo pra confirmar exclusão" : "Excluir serviço"}
      </button>
    </div>
  );
}
