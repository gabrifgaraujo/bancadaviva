import { api } from "./api";
import type { RegistroProgresso, TipoRegistro } from "../types";

export const progressoService = {
  async listar(uuidServico: string): Promise<RegistroProgresso[]> {
    const { data } = await api.get<RegistroProgresso[]>(`/servicos/${uuidServico}/progresso`);
    return data;
  },

  async adicionarNota(uuidServico: string, texto: string): Promise<RegistroProgresso> {
    const { data } = await api.post<RegistroProgresso>(`/servicos/${uuidServico}/progresso`, {
      tipo: "nota",
      texto,
    });
    return data;
  },

  async adicionarArquivo(uuidServico: string, tipo: TipoRegistro, arquivo: File): Promise<RegistroProgresso> {
    const formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("arquivo", arquivo);

    const { data } = await api.post<RegistroProgresso>(`/servicos/${uuidServico}/progresso`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async atualizar(uuidServico: string, uuidRegistro: string, texto: string): Promise<RegistroProgresso> {
    const { data } = await api.patch<RegistroProgresso>(
      `/servicos/${uuidServico}/progresso/${uuidRegistro}`,
      { texto }
    );
    return data;
  },

  async remover(uuidServico: string, uuidRegistro: string): Promise<void> {
    await api.delete(`/servicos/${uuidServico}/progresso/${uuidRegistro}`);
  },
};
