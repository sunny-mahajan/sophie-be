"use strict";

require("ts-node/register");
const { ROLES } = require("../../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const rolesData = Object.values(ROLES).map((role) => ({
      name: role,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("roles", rolesData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
