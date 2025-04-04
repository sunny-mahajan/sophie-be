import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const userSchema = require("../schemas/userSchema");

class User extends Model<
  InferAttributes<User>, // Infers attributes from schema
  InferCreationAttributes<User> // For creation (optional fields)
> {}

User.init(userSchema, {
  sequelize,
  ...COMMON_MODEL_OPTIONS,
});

export default User;
