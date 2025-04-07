import { Model, NonAttribute } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

import { Permission } from "@models";

const RoleSchema = require("../schemas/roleSchema");

class Role extends Model {
  declare id: number;
  declare name: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date;

  // Associations
  declare permissions: NonAttribute<Permission[]>;
}

Role.init(RoleSchema, {
  sequelize,
  ...COMMON_MODEL_OPTIONS,
});

export default Role;
