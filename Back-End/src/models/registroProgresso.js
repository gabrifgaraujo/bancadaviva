"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RegistroProgresso extends Model {
    static associate(models) {
      RegistroProgresso.belongsTo(models.Servico, { foreignKey: "servico_id", as: "servico" });
    }
  }

  RegistroProgresso.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: DataTypes.ENUM("foto", "audio", "nota"),
        allowNull: false,
      },
      midia_url: { type: DataTypes.STRING, allowNull: true },
      texto: { type: DataTypes.TEXT, allowNull: true },
      servico_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "RegistroProgresso",
      tableName: "registros_progresso",
      underscored: true,
    }
  );

  return RegistroProgresso;
};
