import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const permissionSchema = require("../schemas/permissionSchema");

class Permission extends Model {
    declare id: number;
    declare name: string;
    declare parent_id: number;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;
}

Permission.init(permissionSchema, {
    sequelize,
    ...COMMON_MODEL_OPTIONS,
});

export default Permission;
