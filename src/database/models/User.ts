import { DataTypes, Model } from "sequelize";
import sequelize from "@lib/db";

const userSchema = require("../schemas/userSchema");

class User extends Model {
  declare id: number;
  declare email: string;
  declare password_hash: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare city: string;
  declare state: string;
  declare phone: string;
  declare refreshToken: string;
  declare secondaryPhone: string;
  declare isActive: boolean;
  declare status: string;
  declare lastLogin: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare address: string;
  declare zip: string;
  declare UserRole?: any;
}

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
