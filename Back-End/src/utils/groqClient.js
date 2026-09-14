const AppError = require("./AppError");
const logger = require("../config/logger");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Cliente mínimo da Groq — API compatível com o formato OpenAI de chat.
// Sem SDK extra: Node 20 já tem fetch nativo.
async function chamarGroq({ mensagens, modelo = "openai/gpt-oss-20b", temperatura = 0.4, maxTokens = 300 }) {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError("Recurso de IA não configurado no servidor.", 503);
  }

  let resposta;
  try {
    resposta = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: mensagens,
        temperature: temperatura,
        max_tokens: maxTokens,
      }),
    });
  } catch {
    throw new AppError("Não foi possível falar com o serviço de IA agora.", 502);
  }

  if (resposta.status === 429) {
    throw new AppError("Limite de uso de IA atingido no momento. Tenta de novo em instantes.", 429);
  }

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    logger.error(`Groq respondeu ${resposta.status}: ${corpo}`);
    throw new AppError("Não foi possível falar com o serviço de IA agora.", 502);
  }

  const dados = await resposta.json();
  const texto = dados?.choices?.[0]?.message?.content;
  if (!texto) throw new AppError("A IA não retornou uma resposta válida.", 502);

  return texto.trim();
}

module.exports = { chamarGroq };