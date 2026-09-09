"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("registros_progresso", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
      tipo: { type: Sequelize.ENUM("foto", "audio", "nota"), allowNull: false },
      midia_url: { type: Sequelize.STRING, allowNull: true },
      texto: { type: Sequelize.TEXT, allowNull: true },
      servico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "servicos", key: "id" },
        onDelete: "CASCADE",
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex("registros_progresso", ["servico_id"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("registros_progresso");
  },
};
