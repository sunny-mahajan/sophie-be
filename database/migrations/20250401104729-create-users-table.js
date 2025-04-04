"use strict";

const userSchema = require("../schemas/userSchema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("users", userSchema);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
