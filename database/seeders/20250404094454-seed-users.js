"use strict";

require("ts-node/register");
const { SUPER_ADMIN_EMAIL } = require("../../config/appConstants.ts");
const { getHashedPassword } = require("../../utils/helpers.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const users = [
      {
        first_name: "Super",
        last_name: "Admin",
        email: SUPER_ADMIN_EMAIL,
        password: "$up3r@dm1n",
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async ({ password, ...rest }) => ({
        ...rest,
        password_hash: await getHashedPassword(password),
        street_address: "",
        is_active: true,
        status: "active",
        last_login: null,
        deleted_at: null,
        city: "",
        state: "",
        zip: "",
        phone: "",
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    await queryInterface.bulkInsert("users", hashedUsers);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", {
      email: [SUPER_ADMIN_EMAIL],
    });
  },
};
