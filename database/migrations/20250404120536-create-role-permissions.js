"use strict";

const rolePermissionSchema = require("../schemas/rolePermissionSchema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("role_permissions", rolePermissionSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("role_permissions");
  },
};
