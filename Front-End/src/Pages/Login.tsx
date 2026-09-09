import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

type Modo = "login" | "cadastro" | "esqueci" | "reset";

export function Login() {
  const [modo, setModo] = useState<Modo>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const { token, usuario } = await authService.login(email, senha);
      login(token, usuario);
      navigate("/");
    } catch (err) {
      setErro(getApiErrorMessage(err, "Email ou senha inválidos."));
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const { token, usuario } = await authService.register(nome, email, senha);
      login(token, usuario);
      navigate("/");
    } catch (err) {
      setErro(getApiErrorMessage(err, "Não foi possível criar a conta."));
    } finally {
      setCarregando(false);
    }
  }

  async function handleEsqueciSenha(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await authService.forgotPassword(email);
      setMensagem("Se o email existir, enviamos um código de 6 dígitos.");
      setModo("reset");
    } catch (err) {
      setErro(getApiErrorMessage(err));
    } finally {
      setCarregando(false);
    }
  }

  async function handleResetSenha(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await authService.resetPassword(email, codigo, novaSenha);
      setMensagem("Senha atualizada! Faça login.");
      setModo("login");
    } catch (err) {
      setErro(getApiErrorMessage(err, "Código inválido ou expirado."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-md bg-pine text-base font-semibold text-primary-foreground">
            B
          </span>
          <div>
            <h1 className="font-display text-xl font-medium leading-tight text-ink">BancadaViva</h1>
            <p className="text-sm text-muted">Onde eu parei? Em um clique.</p>
          </div>
        </div>

        {erro && (
          <p className="mb-4 rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {erro}
          </p>
        )}
        {mensagem && (
          <p className="mb-4 rounded-md border border-ok/25 bg-ok/10 px-3 py-2 text-sm text-ok">{mensagem}</p>
        )}

        {modo === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            <Button type="submit" size="lg" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
            <div className="flex justify-between text-sm">
              <button type="button" className="text-pine hover:underline" onClick={() => setModo("cadastro")}>
                Criar conta
              </button>
              <button type="button" className="text-muted hover:underline" onClick={() => setModo("esqueci")}>
                Esqueci a senha
              </button>
            </div>
          </form>
        )}

        {modo === "cadastro" && (
          <form onSubmit={handleCadastro} className="flex flex-col gap-4">
            <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              label="Senha"
              type="password"
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Button type="submit" size="lg" disabled={carregando}>
              {carregando ? "Criando..." : "Criar conta"}
            </Button>
            <button type="button" className="text-sm text-pine hover:underline" onClick={() => setModo("login")}>
              Já tenho conta
            </button>
          </form>
        )}

        {modo === "esqueci" && (
          <form onSubmit={handleEsqueciSenha} className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" size="lg" disabled={carregando}>
              {carregando ? "Enviando..." : "Enviar código"}
            </Button>
            <button type="button" className="text-sm text-pine hover:underline" onClick={() => setModo("login")}>
              Voltar
            </button>
          </form>
        )}

        {modo === "reset" && (
          <form onSubmit={handleResetSenha} className="flex flex-col gap-4">
            <Input
              label="Código (6 dígitos)"
              value={codigo}
              maxLength={6}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <Input
              label="Nova senha"
              type="password"
              minLength={6}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
            <Button type="submit" size="lg" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
