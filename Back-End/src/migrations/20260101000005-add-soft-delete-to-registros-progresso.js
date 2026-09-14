"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("registros_progresso", "deletado_em", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("registros_progresso", "deletado_por", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("registros_progresso", "deletado_em");
    await queryInterface.removeColumn("registros_progresso", "deletado_por");
  },
};
