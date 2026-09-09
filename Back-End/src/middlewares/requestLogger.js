const morgan = require("morgan");
const logger = require("../config/logger");

const requestLogger = morgan("tiny", {
  stream: { write: (message) => logger.info(message.trim()) },
});

module.exports = requestLogger;
