const { Router } = require("express");
const authToken = require("../middlewares/authToken");
const dashboardController = require("../controllers/dashboardController");

const router = Router();

router.get("/", authToken, dashboardController.obterDashboard);

module.exports = router;
