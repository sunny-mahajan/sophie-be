import { DataTypes, Model, NonAttribute } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";
import { Role } from "@models";
import { IUserAttributes, IUserCreateAttributes } from "types/user";

const userSchema = require("../schemas/userSchema");

class User extends Model<IUserAttributes, IUserCreateAttributes> {
  declare id: number;
  declare email: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare streetAddress: string;
  declare city: string;
  declare state: string;
  declare zip: number;
  declare phone: string;
  declare refreshToken: string;
  declare isActive: boolean;
  declare status: string;
  declare lastLogin: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

  // Virtual fields
  declare fullName: NonAttribute<string>;

  // Associations
  declare roles: NonAttribute<Role[]>;
}

User.init(
  {
    ...userSchema,
    fullName: {
      type: DataTypes.VIRTUAL,
      get(this: User) {
        return `${this.firstName} ${this.lastName}`.trim();
      },
    },
  },
  {
    sequelize,
    ...COMMON_MODEL_OPTIONS,
  }
);

export default User;
