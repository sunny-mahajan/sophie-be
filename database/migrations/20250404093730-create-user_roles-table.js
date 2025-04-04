"use strict";

const userRoleSchema = require("../schemas/userRoleSchema");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("user_roles", userRoleSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("user_roles");
  },
};
