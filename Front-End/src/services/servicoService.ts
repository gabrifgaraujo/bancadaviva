import { api } from "./api";
import type { Servico, ServicoDetalhado, StatusServico, CategoriaServico, ItemChecklist } from "../types";

export interface NovoServicoPayload {
  titulo: string;
  nomeCliente?: string;
  contatoCliente?: string;
  categoria: CategoriaServico;
  fotoCapaUrl?: string;
}

export interface AtualizarServicoPayload {
  titulo?: string;
  nomeCliente?: string;
  contatoCliente?: string;
  categoria?: CategoriaServico;
  status?: StatusServico;
  fotoCapaUrl?: string;
  checklist?: ItemChecklist[];
  ultimaNota?: string;
}

export const servicoService = {
  async listar(filtros?: { status?: StatusServico; categoria?: CategoriaServico }): Promise<Servico[]> {
    const { data } = await api.get<Servico[]>("/servicos", { params: filtros });
    return data;
  },

  async criar(payload: NovoServicoPayload): Promise<Servico> {
    const { data } = await api.post<Servico>("/servicos", payload);
    return data;
  },

  async detalhar(uuid: string): Promise<ServicoDetalhado> {
    const { data } = await api.get<ServicoDetalhado>(`/servicos/${uuid}`);
    return data;
  },

  async atualizar(uuid: string, payload: AtualizarServicoPayload): Promise<Servico> {
    const { data } = await api.patch<Servico>(`/servicos/${uuid}`, payload);
    return data;
  },

  async remover(uuid: string): Promise<void> {
    await api.delete(`/servicos/${uuid}`);
  },
};
