const jwt = require("jsonwebtoken");

// Único middleware de auth do projeto — importado em todas as rotas
// que exigem login. Popula req.user com { id_usuario }.
function authToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Token não informado." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id_usuario: payload.id_usuario };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = authToken;
