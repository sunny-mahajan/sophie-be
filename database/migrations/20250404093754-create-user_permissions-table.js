"use strict";

const userPermissionSchema = require("../schemas/userPermissionSchema");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("user_permissions", userPermissionSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("user_permissions");
  },
};
