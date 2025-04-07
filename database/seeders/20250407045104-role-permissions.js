"use strict";

const { ROLES } = require("../../config/appConstants");

module.exports = {
  up: async (queryInterface) => {
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN (:names)`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { names: [ROLES.ADMIN, ROLES.USER] },
      }
    );

    const permissions = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions WHERE name IN (:names)`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: {
          names: ["MANAGE_USER", "VIEW_SOPS", "VIEW_TRAININGS", "VIEW_REPORTS"],
        },
      }
    );

    const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));
    const permMap = Object.fromEntries(permissions.map((p) => [p.name, p.id]));

    const rolePermissionsData = [
      // USER: VIEW_SOPS, VIEW_TRAININGS, VIEW_REPORTS
      {
        role_id: roleMap[ROLES.USER],
        permission_id: permMap["VIEW_SOPS"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: roleMap[ROLES.USER],
        permission_id: permMap["VIEW_TRAININGS"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: roleMap[ROLES.USER],
        permission_id: permMap["VIEW_REPORTS"],
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ADMIN: MANAGE_USER
      {
        role_id: roleMap[ROLES.ADMIN],
        permission_id: permMap["MANAGE_USER"],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("role_permissions", rolePermissionsData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
