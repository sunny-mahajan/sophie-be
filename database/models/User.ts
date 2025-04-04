import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "@lib/db";

const userSchema = require("../schemas/userSchema");

class User extends Model<
  InferAttributes<User>, // Infers attributes from schema
  InferCreationAttributes<User> // For creation (optional fields)
> {}

User.init(userSchema, {
  sequelize,
  tableName: "users",
  paranoid: true,
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
});

export default User;
