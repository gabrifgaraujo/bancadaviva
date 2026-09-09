"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("servicos", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
      titulo: { type: Sequelize.STRING, allowNull: false },
      nome_cliente: { type: Sequelize.STRING, allowNull: true },
      contato_cliente: { type: Sequelize.STRING, allowNull: true },
      categoria: {
        type: Sequelize.ENUM("ventilador", "eletrodomestico", "informatica", "outro"),
        allowNull: false,
        defaultValue: "outro",
      },
      status: {
        type: Sequelize.ENUM("aguardando", "em_andamento", "aguardando_peca", "pronto", "entregue"),
        allowNull: false,
        defaultValue: "aguardando",
      },
      foto_capa_url: { type: Sequelize.STRING, allowNull: true },
      checklist: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      ultima_nota: { type: Sequelize.TEXT, allowNull: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      deletado_em: { type: Sequelize.DATE, allowNull: true },
      deletado_por: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex("servicos", ["usuario_id"]);
    await queryInterface.addIndex("servicos", ["usuario_id", "status", "updated_at"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("servicos");
  },
};
