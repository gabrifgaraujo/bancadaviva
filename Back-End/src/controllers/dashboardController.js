const { Op, QueryTypes } = require("sequelize");
const { Servico, sequelize } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const DIAS_PARA_CONSIDERAR_PARADO = 5;
const DIAS_DE_HEATMAP = 365;

// GET /dashboard
const obterDashboard = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id_usuario;
  const agora = new Date();

  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioProxMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
  const limiteParado = new Date(agora.getTime() - DIAS_PARA_CONSIDERAR_PARADO * 24 * 60 * 60 * 1000);
  const desdeHeatmap = new Date(agora.getTime() - DIAS_DE_HEATMAP * 24 * 60 * 60 * 1000);

  const [porStatusRaw, clientesAtendidos, faturamentoRaw, paradosRaw, heatmapRaw] = await Promise.all([
    Servico.findAll({
      where: { usuario_id: usuarioId, deletado_em: null },
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "total"]],
      group: ["status"],
      raw: true,
    }),
    Servico.count({
      where: { usuario_id: usuarioId, deletado_em: null, nome_cliente: { [Op.not]: null } },
      distinct: true,
      col: "nome_cliente",
    }),
    Servico.findOne({
      where: {
        usuario_id: usuarioId,
        deletado_em: null,
        status: "entregue",
        updated_at: { [Op.gte]: inicioMes, [Op.lt]: inicioProxMes },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("valor")), "total"]],
      raw: true,
    }),
    Servico.findAll({
      where: {
        usuario_id: usuarioId,
        deletado_em: null,
        status: { [Op.notIn]: ["entregue"] },
        updated_at: { [Op.lt]: limiteParado },
      },
      order: [["updated_at", "ASC"]],
      limit: 10,
    }),
    sequelize.query(
      `SELECT DATE(rp.created_at) AS dia, COUNT(*)::int AS total
       FROM registros_progresso rp
       JOIN servicos s ON s.id = rp.servico_id
       WHERE s.usuario_id = :usuarioId AND rp.deletado_em IS NULL AND rp.created_at >= :desde
       GROUP BY DATE(rp.created_at)
       ORDER BY dia ASC`,
      { replacements: { usuarioId, desde: desdeHeatmap }, type: QueryTypes.SELECT }
    ),
  ]);

  const contagemPorStatus = {
    aguardando: 0,
    em_andamento: 0,
    aguardando_peca: 0,
    pronto: 0,
    entregue: 0,
  };
  porStatusRaw.forEach((linha) => {
    contagemPorStatus[linha.status] = Number(linha.total);
  });

  const servicosParados = paradosRaw.map((s) => ({
    uuid: s.uuid,
    titulo: s.titulo,
    status: s.status,
    diasParado: Math.floor((agora.getTime() - new Date(s.updated_at).getTime()) / (24 * 60 * 60 * 1000)),
  }));

  const heatmap = heatmapRaw.map((linha) => ({
    data: linha.dia,
    total: Number(linha.total),
  }));

  return res.json({
    contagemPorStatus,
    clientesAtendidos,
    faturamentoMes: Number(faturamentoRaw?.total || 0),
    servicosParados,
    heatmap,
  });
});

module.exports = { obterDashboard };
