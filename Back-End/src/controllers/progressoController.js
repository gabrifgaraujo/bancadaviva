const { RegistroProgresso } = require("../models");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { buscarServicoDoUsuario } = require("../utils/buscarServicoDoUsuario");

function serializarRegistro(registro) {
  return {
    uuid: registro.uuid,
    tipo: registro.tipo,
    midiaUrl: registro.midia_url,
    texto: registro.texto,
    criadoEm: registro.createdAt,
  };
}

function uploadParaCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "bancadaviva" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function buscarRegistroDoServico(req) {
  const servico = await buscarServicoDoUsuario(req);
  const registro = await RegistroProgresso.findOne({
    where: { uuid: req.params.uuidRegistro, servico_id: servico.id, deletado_em: null },
  });
  if (!registro) throw new AppError("Registro não encontrado.", 404);
  return { servico, registro };
}

// GET /servicos/:uuidServico/progresso
const listar = asyncHandler(async (req, res) => {
  const servico = await buscarServicoDoUsuario(req);

  const registros = await RegistroProgresso.findAll({
    where: { servico_id: servico.id, deletado_em: null },
    order: [["created_at", "DESC"]],
  });

  return res.json(registros.map(serializarRegistro));
});

// POST /servicos/:uuidServico/progresso
// multipart/form-data com campo "arquivo" (foto/áudio) OU json { tipo: "nota", texto }
const criar = asyncHandler(async (req, res) => {
  const servico = await buscarServicoDoUsuario(req);
  const { tipo, texto } = req.body;

  if (!["foto", "audio", "nota"].includes(tipo)) {
    throw new AppError("Tipo de registro inválido.", 400);
  }

  let midia_url = null;

  if (tipo === "foto" || tipo === "audio") {
    if (!req.file) throw new AppError("Arquivo obrigatório para esse tipo de registro.", 400);
    const resourceType = tipo === "foto" ? "image" : "video"; // Cloudinary trata áudio como "video"
    const resultado = await uploadParaCloudinary(req.file.buffer, resourceType);
    midia_url = resultado.secure_url;
  }

  if (tipo === "nota" && !texto) {
    throw new AppError("Texto obrigatório para uma nota.", 400);
  }

  const registro = await RegistroProgresso.create({
    tipo,
    midia_url,
    texto: texto || null,
    servico_id: servico.id,
  });

  // "Onde eu parei" — o resumo do progresso mais recente fica em destaque no board.
  const resumo = tipo === "nota" ? texto : tipo === "foto" ? "Foto adicionada" : "Áudio adicionado";
  servico.ultima_nota = resumo;
  if (tipo === "foto" && !servico.foto_capa_url) servico.foto_capa_url = midia_url;
  await servico.save();

  return res.status(201).json(serializarRegistro(registro));
});

// PATCH /servicos/:uuidServico/progresso/:uuidRegistro — só o texto/legenda é editável.
const atualizar = asyncHandler(async (req, res) => {
  const { registro } = await buscarRegistroDoServico(req);
  const { texto } = req.body;

  if (registro.tipo === "nota" && (!texto || !texto.trim())) {
    throw new AppError("Nota não pode ficar vazia.", 400);
  }

  registro.texto = texto ?? null;
  await registro.save();

  return res.json(serializarRegistro(registro));
});

// DELETE /servicos/:uuidServico/progresso/:uuidRegistro — soft delete.
const remover = asyncHandler(async (req, res) => {
  const { registro } = await buscarRegistroDoServico(req);

  registro.deletado_em = new Date();
  registro.deletado_por = String(req.user.id_usuario);
  await registro.save();

  return res.status(204).send();
});

module.exports = { listar, criar, atualizar, remover };
