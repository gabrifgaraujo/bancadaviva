const { Router } = require("express");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validators");
const { authLimiter } = require("../middlewares/rateLimiter");
const authToken = require("../middlewares/authToken");
const authController = require("../controllers/authController");

const router = Router();

router.post(
  "/register",
  authLimiter,
  [
    body("nome").trim().notEmpty().withMessage("Nome é obrigatório."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isLength({ min: 6 }).withMessage("Senha precisa ter no mínimo 6 caracteres."),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  authLimiter,
  [body("email").isEmail().withMessage("Email inválido."), body("senha").notEmpty().withMessage("Senha é obrigatória.")],
  validate,
  authController.login
);

router.get("/me", authToken, authController.me);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Email inválido.")],
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  [
    body("email").isEmail().withMessage("Email inválido."),
    body("codigo").isLength({ min: 6, max: 6 }).withMessage("Código inválido."),
    body("novaSenha").isLength({ min: 6 }).withMessage("Senha precisa ter no mínimo 6 caracteres."),
  ],
  validate,
  authController.resetPassword
);

module.exports = router;
