const { Servico } = require("../models");
const AppError = require("./AppError");

// Compartilhado entre progressoController, iaController e dashboardController —
// mesmo checagem de posse (ownership) usada em todo lugar que mexe num serviço.
async function buscarServicoDoUsuario(req, paramName = "uuidServico") {
  const servico = await Servico.findOne({
    where: { uuid: req.params[paramName], usuario_id: req.user.id_usuario, deletado_em: null },
  });
  if (!servico) throw new AppError("Serviço não encontrado.", 404);
  return servico;
}

module.exports = { buscarServicoDoUsuario };
