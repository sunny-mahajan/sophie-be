import { Model } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const invitationSchema = require("../schemas/invitationSchema");

class Invitation extends Model {
  declare id: number;
  declare email: string;
  declare role: string;
  declare token: string;
  declare invitedBy: number;
  declare invitedUser: number;
  declare status: string;
  declare expiresAt: Date;
  declare completedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Invitation.init(invitationSchema, {
  sequelize,
  ...COMMON_MODEL_OPTIONS,
});

export default Invitation;
