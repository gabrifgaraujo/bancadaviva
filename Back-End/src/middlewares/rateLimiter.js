const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde um momento." },
});

// A Groq free tier libera 30 req/min PRA CONTA INTEIRA (não por usuário) —
// esse limite é bem mais apertado que o generalLimiter de propósito, pra um
// pico de gente testando no LinkedIn não estourar a cota da conta toda.
const iaLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muita gente usando a IA agora. Tenta de novo em um minuto." },
});

module.exports = { authLimiter, generalLimiter, iaLimiter };
