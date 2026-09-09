import { api } from "./api";
import type { Usuario } from "../types";

interface RespostaAuth {
  token: string;
  usuario: Usuario;
}

export const authService = {
  async login(email: string, senha: string): Promise<RespostaAuth> {
    const { data } = await api.post<RespostaAuth>("/auth/login", { email, senha });
    return data;
  },

  async register(nome: string, email: string, senha: string): Promise<RespostaAuth> {
    const { data } = await api.post<RespostaAuth>("/auth/register", { nome, email, senha });
    return data;
  },

  async me(): Promise<{ usuario: Usuario }> {
    const { data } = await api.get<{ usuario: Usuario }>("/auth/me");
    return data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(email: string, codigo: string, novaSenha: string): Promise<void> {
    await api.post("/auth/reset-password", { email, codigo, novaSenha });
  },
};
