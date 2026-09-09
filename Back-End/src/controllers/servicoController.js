const { Op } = require("sequelize");
const { Servico, RegistroProgresso } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

function serializarServico(servico) {
  return {
    uuid: servico.uuid,
    titulo: servico.titulo,
    nomeCliente: servico.nome_cliente,
    contatoCliente: servico.contato_cliente,
    categoria: servico.categoria,
    status: servico.status,
    fotoCapaUrl: servico.foto_capa_url,
    checklist: servico.checklist,
    ultimaNota: servico.ultima_nota,
    criadoEm: servico.createdAt,
    atualizadoEm: servico.updatedAt,
  };
}

function serializarRegistro(registro) {
  return {
    uuid: registro.uuid,
    tipo: registro.tipo,
    midiaUrl: registro.midia_url,
    texto: registro.texto,
    criadoEm: registro.createdAt,
  };
}

// GET /servicos?status=&categoria=
const listar = asyncHandler(async (req, res) => {
  const { status, categoria } = req.query;

  const where = { usuario_id: req.user.id_usuario, deletado_em: null };
  if (status) where.status = status;
  if (categoria) where.categoria = categoria;

  const servicos = await Servico.findAll({ where, order: [["updated_at", "DESC"]] });
  return res.json(servicos.map(serializarServico));
});

// POST /servicos
const criar = asyncHandler(async (req, res) => {
  const { titulo, nomeCliente, contatoCliente, categoria, fotoCapaUrl } = req.body;

  const servico = await Servico.create({
    titulo,
    nome_cliente: nomeCliente,
    contato_cliente: contatoCliente,
    categoria,
    foto_capa_url: fotoCapaUrl,
    usuario_id: req.user.id_usuario,
  });

  return res.status(201).json(serializarServico(servico));
});

// GET /servicos/:uuid
const detalhar = asyncHandler(async (req, res) => {
  const servico = await Servico.findOne({
    where: { uuid: req.params.uuid, usuario_id: req.user.id_usuario, deletado_em: null },
  });
  if (!servico) throw new AppError("Serviço não encontrado.", 404);

  const registros = await RegistroProgresso.findAll({
    where: { servico_id: servico.id },
    order: [["created_at", "DESC"]],
    limit: 30,
  });

  return res.json({ ...serializarServico(servico), registros: registros.map(serializarRegistro) });
});

// PATCH /servicos/:uuid
const atualizar = asyncHandler(async (req, res) => {
  const servico = await Servico.findOne({
    where: { uuid: req.params.uuid, usuario_id: req.user.id_usuario, deletado_em: null },
  });
  if (!servico) throw new AppError("Serviço não encontrado.", 404);

  const { titulo, nomeCliente, contatoCliente, categoria, status, fotoCapaUrl, checklist, ultimaNota } = req.body;

  if (titulo !== undefined) servico.titulo = titulo;
  if (nomeCliente !== undefined) servico.nome_cliente = nomeCliente;
  if (contatoCliente !== undefined) servico.contato_cliente = contatoCliente;
  if (categoria !== undefined) servico.categoria = categoria;
  if (status !== undefined) servico.status = status;
  if (fotoCapaUrl !== undefined) servico.foto_capa_url = fotoCapaUrl;
  if (checklist !== undefined) servico.checklist = checklist;
  if (ultimaNota !== undefined) servico.ultima_nota = ultimaNota;

  await servico.save();
  return res.json(serializarServico(servico));
});

// DELETE /servicos/:uuid — soft delete, nunca hard delete.
const remover = asyncHandler(async (req, res) => {
  const servico = await Servico.findOne({
    where: { uuid: req.params.uuid, usuario_id: req.user.id_usuario, deletado_em: null },
  });
  if (!servico) throw new AppError("Serviço não encontrado.", 404);

  servico.deletado_em = new Date();
  servico.deletado_por = String(req.user.id_usuario);
  await servico.save();

  return res.status(204).send();
});

module.exports = { listar, criar, detalhar, atualizar, remover, serializarServico };