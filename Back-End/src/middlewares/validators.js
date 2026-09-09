const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// Roda depois das regras do express-validator em cada rota de escrita.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const primeira = errors.array()[0];
    return next(new AppError(primeira.msg, 400));
  }
  return next();
}

module.exports = { validate };
