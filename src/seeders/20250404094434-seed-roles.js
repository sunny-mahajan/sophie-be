"use strict";

require("ts-node/register");
const { ROLES } = require("../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("roles", [
      {
        name: ROLES.SUPER_ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: ROLES.ADMIN, created_at: new Date(), updated_at: new Date() },
      { name: ROLES.USER, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
