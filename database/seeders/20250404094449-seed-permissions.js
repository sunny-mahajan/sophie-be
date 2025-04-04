"use strict";

require("ts-node/register");
const { PERMISSIONS } = require("../../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const permissionsData = [];
    const parentMap = {};

    // First, insert top-level permissions
    for (const [parentPermission, subPermissions] of Object.entries(
      PERMISSIONS
    )) {
      if (typeof subPermissions === "object") {
        // It's a parent permission
        const parentPermissionData = {
          name: parentPermission,
          created_at: new Date(),
          updated_at: new Date(),
        };
        const [parent] = await queryInterface.bulkInsert(
          "permissions",
          [parentPermissionData],
          { returning: true }
        );
        parentMap[parentPermission] = parent.id;

        // Insert Sub Permissions
        for (const subKey in subPermissions) {
          permissionsData.push({
            name: subPermissions[subKey],
            parent_id: parent.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      } else {
        // It's a standalone permission
        permissionsData.push({
          name: subPermissions,
          parent_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    // Insert Sub Permissions
    if (permissionsData.length > 0) {
      await queryInterface.bulkInsert("permissions", permissionsData);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
