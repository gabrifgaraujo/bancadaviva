import { Plus, LogOut, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

const TEMA_KEY = "bancadaviva-theme";

export function Nav() {
  const { user, logout } = useAuth();
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem(TEMA_KEY) === "dark";
    document.documentElement.classList.toggle("dark", salvo);
    setEscuro(salvo);
  }, []);

  function alternarTema() {
    const novo = !escuro;
    document.documentElement.classList.toggle("dark", novo);
    localStorage.setItem(TEMA_KEY, novo ? "dark" : "light");
    setEscuro(novo);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-pine text-sm font-semibold text-primary-foreground">
            B
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-ink">BancadaViva</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"} onClick={alternarTema}>
            {escuro ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link to="/servicos/novo">
            <Button variant="ghost" size="icon" aria-label="Novo serviço">
              <Plus size={20} />
            </Button>
          </Link>
          {user && (
            <Button variant="ghost" size="icon" aria-label="Sair" onClick={logout}>
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
