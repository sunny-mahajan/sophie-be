"use strict";

require("ts-node/register");
const { ROLES, SUPER_ADMIN_EMAIL } = require("../../config/appConstants.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Fetch user by SUPER_ADMIN email
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = :email LIMIT 1;`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { email: SUPER_ADMIN_EMAIL },
      }
    );

    if (!users.length) {
      console.error(`No user found with email: ${SUPER_ADMIN_EMAIL}`);
      return;
    }

    const superAdminUserId = users[0].id; // Assign SUPER_ADMIN to this user

    const userRolesData = [
      {
        user_id: superAdminUserId,
        role_name: ROLES.SUPER_ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("user_roles", userRolesData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("user_roles", {
      role_name: ROLES.SUPER_ADMIN,
    });
  },
};
