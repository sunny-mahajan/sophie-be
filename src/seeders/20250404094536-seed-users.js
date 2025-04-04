"use strict";

require("ts-node/register");
const { getHashedPassword } = require("../utils/helpers.ts");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const superAdminEmail = "superadmin@sophie.com";
    const passwordHash = await getHashedPassword("$up3r@dm1n");
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Super",
        last_name: "Admin",
        email: superAdminEmail,
        password_hash: passwordHash,
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
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: superAdminEmail,
    });
  },
};
