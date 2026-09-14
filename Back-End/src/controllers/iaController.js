const { RegistroProgresso } = require("../models");
const { chamarGroq } = require("../utils/groqClient");
const { buscarServicoDoUsuario } = require("../utils/buscarServicoDoUsuario");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const ROTULOS_CATEGORIA = {
  ventilador: "ventilador",
  eletrodomestico: "eletrodoméstico",
  informatica: "equipamento de informática",
  outro: "equipamento",
};

function extrairArrayJson(texto) {
  // A IA às vezes embrulha em ```json ... ``` mesmo pedindo pra não fazer isso.
  const limpo = texto.replace(/```json|```/g, "").trim();
  const arr = JSON.parse(limpo);
  if (!Array.isArray(arr)) throw new Error("resposta não é um array");
  return arr.filter((item) => typeof item === "string" && item.trim()).slice(0, 6);
}

// POST /ia/sugerir-checklist — não depende de um serviço já existir,
// usado na tela de criação antes de salvar.
const sugerirChecklist = asyncHandler(async (req, res) => {
  const { titulo, categoria } = req.body;
  if (!titulo || !titulo.trim()) throw new AppError("Título é obrigatório pra gerar sugestões.", 400);

  const categoriaDescricao = ROTULOS_CATEGORIA[categoria] || "equipamento";

  const texto = await chamarGroq({
    modelo: "openai/gpt-oss-20b",
    maxTokens: 200,
    mensagens: [
      {
        role: "system",
        content:
          "Você ajuda um técnico de manutenção autônomo brasileiro a montar checklists curtos de reparo. " +
          "Responda APENAS com um array JSON de 3 a 5 strings curtas (máximo 5 palavras cada), em português, " +
          "sem markdown, sem explicação, sem numeração. Cada item é um passo prático de diagnóstico/reparo.",
      },
      {
        role: "user",
        content: `Serviço: "${titulo}" (${categoriaDescricao}). Gere o checklist.`,
      },
    ],
  });

  let itens;
  try {
    itens = extrairArrayJson(texto);
  } catch {
    throw new AppError("Não foi possível gerar sugestões agora. Tenta de novo.", 502);
  }

  if (itens.length === 0) throw new AppError("Não foi possível gerar sugestões agora. Tenta de novo.", 502);

  return res.json({ itens });
});

// POST /servicos/:uuidServico/resumir-historico
const resumirHistorico = asyncHandler(async (req, res) => {
  const servico = await buscarServicoDoUsuario(req);

  const registros = await RegistroProgresso.findAll({
    where: { servico_id: servico.id, deletado_em: null },
    order: [["created_at", "ASC"]],
  });

  if (registros.length === 0) {
    throw new AppError("Ainda não há registros de progresso pra resumir.", 400);
  }

  const linhas = registros.map((r) => {
    if (r.tipo === "nota") return `- Nota: ${r.texto}`;
    if (r.tipo === "foto") return `- Foto adicionada${r.texto ? `: ${r.texto}` : ""}`;
    return `- Áudio adicionado${r.texto ? `: ${r.texto}` : ""}`;
  });

  const texto = await chamarGroq({
    modelo: "openai/gpt-oss-120b",
    maxTokens: 220,
    mensagens: [
      {
        role: "system",
        content:
          "Você resume o progresso de um reparo pra um técnico autônomo brasileiro reler depois. " +
          "Responda em português, direto, em no máximo 3 frases curtas: o que já foi feito e o que falta. " +
          "Sem saudação, sem introdução, sem markdown.",
      },
      {
        role: "user",
        content: `Serviço: "${servico.titulo}". Histórico de progresso, do mais antigo ao mais recente:\n${linhas.join("\n")}`,
      },
    ],
  });

  return res.json({ resumo: texto });
});

module.exports = { sugerirChecklist, resumirHistorico };