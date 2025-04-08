"use strict";

const invitationSchema = require("../schemas/invitationSchema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("invitations", invitationSchema);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("invitations");
  },
};
