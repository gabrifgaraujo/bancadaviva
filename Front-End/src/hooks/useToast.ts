import { useState, useCallback } from "react";

interface Toast {
  id: number;
  mensagem: string;
  tipo: "sucesso" | "erro";
}

let proximoId = 1;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrarToast = useCallback((mensagem: string, tipo: Toast["tipo"] = "sucesso") => {
    const id = proximoId++;
    setToasts((atual) => [...atual, { id, mensagem, tipo }]);
    setTimeout(() => {
      setToasts((atual) => atual.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, mostrarToast };
}
