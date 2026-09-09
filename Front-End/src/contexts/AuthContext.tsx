import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../types";
import { authService } from "../services/authService";

interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
  updateUser: (partial: Partial<Usuario>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "@bancadaviva:token";
const USER_KEY = "@bancadaviva:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<Usuario | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Revalida a sessão com o backend ao carregar o app — se o token
    // expirou, o interceptor de resposta do api.ts já redireciona pro login.
    async function revalidar() {
      if (token) {
        try {
          const { usuario } = await authService.me();
          setUser(usuario);
          localStorage.setItem(USER_KEY, JSON.stringify(usuario));
        } catch {
          logout();
        }
      }
      setLoading(false);
    }
    revalidar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(newToken: string, newUser: Usuario) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  function updateUser(partial: Partial<Usuario>) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: Boolean(token), loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
