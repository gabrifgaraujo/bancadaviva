const AppError = require("../utils/AppError");
const logger = require("../config/logger");

// Middleware global de erro — precisa ser o último registrado no app.js.
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err.stack || err.message);
  return res.status(500).json({ error: "Erro interno." });
}

module.exports = errorHandler;
