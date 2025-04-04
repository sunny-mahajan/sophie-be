"use strict";

const roleSchema = require("../schemas/roleSchema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("roles", roleSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("roles");
  },
};
