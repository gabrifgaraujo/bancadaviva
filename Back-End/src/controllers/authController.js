const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { gerarCodigo6Digitos } = require("../utils/codigoRecuperacao");
const { enviarEmail } = require("../config/email");

function gerarToken(usuario) {
  return jwt.sign({ id_usuario: usuario.id }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

function serializarUsuario(usuario) {
  return { uuid: usuario.uuid, nome: usuario.nome, email: usuario.email };
}

const register = asyncHandler(async (req, res) => {
  const { nome, email, senha } = req.body;

  const jaExiste = await Usuario.findOne({ where: { email } });
  if (jaExiste) throw new AppError("Este email já está cadastrado.", 409);

  const senha_hash = await bcrypt.hash(senha, 10);
  const usuario = await Usuario.create({ nome, email, senha_hash });

  const token = gerarToken(usuario);
  return res.status(201).json({ token, usuario: serializarUsuario(usuario) });
});

const login = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw new AppError("Email ou senha inválidos.", 401);

  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) throw new AppError("Email ou senha inválidos.", 401);

  const token = gerarToken(usuario);
  return res.json({ token, usuario: serializarUsuario(usuario) });
});

const me = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.user.id_usuario);
  if (!usuario) throw new AppError("Usuário não encontrado.", 404);
  return res.json({ usuario: serializarUsuario(usuario) });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  // Resposta genérica mesmo se o email não existir, pra não vazar quem tem conta.
  if (!usuario) return res.json({ mensagem: "Se o email existir, enviamos um código." });

  const codigo = gerarCodigo6Digitos();
  usuario.codigo_recuperacao = codigo;
  usuario.codigo_recuperacao_expira = new Date(Date.now() + 15 * 60 * 1000);
  await usuario.save();

  await enviarEmail({
    destinatario: usuario.email,
    assunto: "Código de recuperação — BancadaViva",
    html: `<p>Seu código de recuperação é: <strong>${codigo}</strong></p><p>Válido por 15 minutos.</p>`,
  });

  return res.json({ mensagem: "Se o email existir, enviamos um código." });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, codigo, novaSenha } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario || !usuario.codigo_recuperacao) {
    throw new AppError("Código inválido ou expirado.", 400);
  }

  const expirado = !usuario.codigo_recuperacao_expira || usuario.codigo_recuperacao_expira < new Date();
  if (expirado || usuario.codigo_recuperacao !== codigo) {
    throw new AppError("Código inválido ou expirado.", 400);
  }

  usuario.senha_hash = await bcrypt.hash(novaSenha, 10);
  usuario.codigo_recuperacao = null;
  usuario.codigo_recuperacao_expira = null;
  await usuario.save();

  return res.json({ mensagem: "Senha atualizada com sucesso." });
});

module.exports = { register, login, me, forgotPassword, resetPassword };
