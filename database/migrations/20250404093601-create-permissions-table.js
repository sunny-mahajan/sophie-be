"use strict";

const permissionSchema = require("../schemas/permissionSchema");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("permissions", permissionSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("permissions");
  },
};
