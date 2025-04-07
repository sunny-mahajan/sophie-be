"use strict";

require("ts-node/register");
const { SUPER_ADMIN_EMAIL } = require("../../config/appConstants.ts");
const { ROLES } = require("../../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const emails = [SUPER_ADMIN_EMAIL, "admin@sophie.com", "user@sophie.com"];

    // Fetch user ids
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (:emails);`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { emails },
      }
    );

    const emailToUserId = users.reduce((acc, { id, email }) => {
      acc[email] = id;
      return acc;
    }, {});

    // Fetch role ids
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN (:roleNames);`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: {
          roleNames: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
        },
      }
    );

    const roleNameToId = roles.reduce((acc, { id, name }) => {
      acc[name] = id;
      return acc;
    }, {});

    const now = new Date();

    const userRolesData = [
      {
        user_id: emailToUserId[SUPER_ADMIN_EMAIL],
        role_id: roleNameToId[ROLES.SUPER_ADMIN],
        created_at: now,
        updated_at: now,
      },
      {
        user_id: emailToUserId["admin@sophie.com"],
        role_id: roleNameToId[ROLES.ADMIN],
        created_at: now,
        updated_at: now,
      },
      {
        user_id: emailToUserId["user@sophie.com"],
        role_id: roleNameToId[ROLES.USER],
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("user_roles", userRolesData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("user_roles", null, {
      where: {
        user_id: {
          [queryInterface.sequelize.Op.in]: queryInterface.sequelize.literal(
            `(SELECT id FROM users WHERE email IN ('superadmin@sophie.com', 'admin@sophie.com', 'user@sophie.com'))`
          ),
        },
      },
    });
  },
};
