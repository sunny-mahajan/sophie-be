"use strict";

require("ts-node/register");
const { PERMISSIONS } = require("../../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const permissionsData = Object.values(PERMISSIONS).map((permission) => ({
      name: permission,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("permissions", permissionsData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
