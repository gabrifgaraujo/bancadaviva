const { Router } = require("express");
const { generalLimiter } = require("../middlewares/rateLimiter");
const authRoutes = require("./authRoutes");
const servicoRoutes = require("./servicoRoutes");

const router = Router();

router.use(generalLimiter);

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.use("/auth", authRoutes);
router.use("/servicos", servicoRoutes);

module.exports = router;
