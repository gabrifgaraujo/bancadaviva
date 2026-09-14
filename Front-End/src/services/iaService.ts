import { api } from "./api";
import type { CategoriaServico } from "../types";

export const iaService = {
  async sugerirChecklist(titulo: string, categoria: CategoriaServico): Promise<string[]> {
    const { data } = await api.post<{ itens: string[] }>("/ia/sugerir-checklist", { titulo, categoria });
    return data.itens;
  },

  async resumirHistorico(uuidServico: string): Promise<string> {
    const { data } = await api.post<{ resumo: string }>(`/servicos/${uuidServico}/resumir-historico`);
    return data.resumo;
  },
};
