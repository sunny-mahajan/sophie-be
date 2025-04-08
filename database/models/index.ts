import sequelize from "@lib/db";
import User from "./User";
import Role from "./Role";
import Permission from "./Permission";
import UserRole from "./UserRole";
import RolePermission from "./RolePermission";
import Invitation from "./Invitation";

import { setupAssociations } from "./associations";

setupAssociations();

export {
  sequelize,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Invitation,
};
