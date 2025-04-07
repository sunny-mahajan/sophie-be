import { Model, NonAttribute } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";
import { Role } from "@models";

const userSchema = require("../schemas/userSchema");

class User extends Model {
  declare id: number;
  declare email: string;
  declare password_hash: string;
  declare first_name: string;
  declare last_name: string;
  declare street_address: string;
  declare city: string;
  declare state: string;
  declare zip: number;
  declare phone: string;
  declare refresh_token: string;
  declare is_active: boolean;
  declare status: string;
  declare last_login: Date;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date;

  // Associations
  declare roles: NonAttribute<Role[]>;
}

User.init(userSchema, {
  sequelize,
  ...COMMON_MODEL_OPTIONS,
});

export default User;
