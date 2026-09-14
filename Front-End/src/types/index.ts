export type CategoriaServico = "ventilador" | "eletrodomestico" | "informatica" | "outro";

export type StatusServico = "aguardando" | "em_andamento" | "aguardando_peca" | "pronto" | "entregue";

export interface ItemChecklist {
  label: string;
  done: boolean;
}

export interface Servico {
  uuid: string;
  titulo: string;
  nomeCliente: string | null;
  contatoCliente: string | null;
  categoria: CategoriaServico;
  status: StatusServico;
  fotoCapaUrl: string | null;
  checklist: ItemChecklist[];
  ultimaNota: string | null;
  valor: number | null;
  criadoEm: string;
  atualizadoEm: string;
}

export type TipoRegistro = "foto" | "audio" | "nota";

export interface RegistroProgresso {
  uuid: string;
  tipo: TipoRegistro;
  midiaUrl: string | null;
  texto: string | null;
  criadoEm: string;
}

export interface ServicoDetalhado extends Servico {
  registros: RegistroProgresso[];
}

export interface Usuario {
  uuid: string;
  nome: string;
  email: string;
}

export interface ServicoParado {
  uuid: string;
  titulo: string;
  status: StatusServico;
  diasParado: number;
}

export interface DiaHeatmap {
  data: string; // "YYYY-MM-DD"
  total: number;
}

export interface DashboardData {
  contagemPorStatus: Record<StatusServico, number>;
  clientesAtendidos: number;
  faturamentoMes: number;
  servicosParados: ServicoParado[];
  heatmap: DiaHeatmap[];
}
