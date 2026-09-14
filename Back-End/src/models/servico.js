"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Servico extends Model {
    static associate(models) {
      Servico.belongsTo(models.Usuario, { foreignKey: "usuario_id", as: "usuario" });
      Servico.hasMany(models.RegistroProgresso, { foreignKey: "servico_id", as: "registros" });
    }
  }

  Servico.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      titulo: { type: DataTypes.STRING, allowNull: false },
      nome_cliente: { type: DataTypes.STRING, allowNull: true },
      contato_cliente: { type: DataTypes.STRING, allowNull: true },
      categoria: {
        type: DataTypes.ENUM("ventilador", "eletrodomestico", "informatica", "outro"),
        allowNull: false,
        defaultValue: "outro",
      },
      status: {
        type: DataTypes.ENUM("aguardando", "em_andamento", "aguardando_peca", "pronto", "entregue"),
        allowNull: false,
        defaultValue: "aguardando",
      },
      foto_capa_url: { type: DataTypes.STRING, allowNull: true },
      checklist: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      ultima_nota: { type: DataTypes.TEXT, allowNull: true },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      usuario_id: { type: DataTypes.INTEGER, allowNull: false },
      deletado_em: { type: DataTypes.DATE, allowNull: true },
      deletado_por: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Servico",
      tableName: "servicos",
      underscored: true,
    }
  );

  return Servico;
};
