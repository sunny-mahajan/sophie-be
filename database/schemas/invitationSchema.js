const { DataTypes } = require("sequelize");

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  invitedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "invited_by",
  },
  invitedUser: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "invited_user",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  expiresAt: {
    type: DataTypes.DATE,
    field: "expires_at",
  },
  completedAt: {
    type: DataTypes.DATE,
    field: "completed_at",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    field: "updated_at",
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "deleted_at",
  },
};
