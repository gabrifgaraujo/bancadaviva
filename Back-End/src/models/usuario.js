"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Servico, { foreignKey: "usuario_id", as: "servicos" });
    }
  }

  Usuario.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      nome: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      senha_hash: { type: DataTypes.STRING, allowNull: false },
      codigo_recuperacao: { type: DataTypes.STRING(6), allowNull: true },
      codigo_recuperacao_expira: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      underscored: true,
    }
  );

  return Usuario;
};
