import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const RolePermissionSchema = require("../schemas/rolePermissionSchema");

class RolePermission extends Model {
    declare id: number;
    declare role_id: number;
    declare permission_id: number;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;
}

RolePermission.init(RolePermissionSchema, {
    sequelize,
    ...COMMON_MODEL_OPTIONS,
});

export default RolePermission;
