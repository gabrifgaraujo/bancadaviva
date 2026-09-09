const { Router } = require("express");
const { body } = require("express-validator");
const authToken = require("../middlewares/authToken");
const upload = require("../middlewares/upload");
const { validate } = require("../middlewares/validators");
const servicoController = require("../controllers/servicoController");
const progressoController = require("../controllers/progressoController");

const router = Router();

router.use(authToken);

router.get("/", servicoController.listar);

router.post(
  "/",
  [body("titulo").trim().notEmpty().withMessage("Título é obrigatório.")],
  validate,
  servicoController.criar
);

router.get("/:uuid", servicoController.detalhar);
router.patch("/:uuid", servicoController.atualizar);
router.delete("/:uuid", servicoController.remover);

router.get("/:uuidServico/progresso", progressoController.listar);
router.post("/:uuidServico/progresso", upload.single("arquivo"), progressoController.criar);

module.exports = router;
