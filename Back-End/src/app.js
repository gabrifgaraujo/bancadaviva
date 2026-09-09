require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { sequelize } = require("./models");
const routes = require("./routes");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./config/logger");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ error: "Rota não encontrada." }));
app.use(errorHandler); // sempre por último

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    logger.info("Conectado ao PostgreSQL");
    app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    logger.error(`Falha ao conectar ao banco: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
