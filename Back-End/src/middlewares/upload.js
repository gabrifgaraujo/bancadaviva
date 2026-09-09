const multer = require("multer");
const AppError = require("../utils/AppError");

// Multer em memória — o buffer vai direto pro Cloudinary (signed upload),
// nunca é salvo em disco no servidor.
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "audio/mpeg", "audio/mp4", "audio/webm"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!TIPOS_ACEITOS.includes(file.mimetype)) {
      return cb(new AppError("Tipo de arquivo não aceito.", 400));
    }
    cb(null, true);
  },
});

module.exports = upload;
