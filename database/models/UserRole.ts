import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const UserRoleSchema = require("../schemas/userRoleSchema");

class UserRole extends Model {
    declare id: number;
    declare user_id: number;
    declare role_id: number;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;
}

UserRole.init(UserRoleSchema, {
    sequelize,
    ...COMMON_MODEL_OPTIONS,
});

export default UserRole;
