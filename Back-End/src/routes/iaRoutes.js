const { Router } = require("express");
const { body } = require("express-validator");
const authToken = require("../middlewares/authToken");
const { validate } = require("../middlewares/validators");
const { iaLimiter } = require("../middlewares/rateLimiter");
const iaController = require("../controllers/iaController");

const router = Router();

router.use(authToken, iaLimiter);

router.post(
  "/sugerir-checklist",
  [body("titulo").trim().notEmpty().withMessage("Título é obrigatório.")],
  validate,
  iaController.sugerirChecklist
);

module.exports = router;
