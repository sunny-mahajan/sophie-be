import { Model } from "sequelize";
import sequelize from "@lib/db";
import { COMMON_MODEL_OPTIONS } from "@config/appConstants";

const invitationSchema = require("../schemas/invitationSchema");

class Invitation extends Model {
  declare id: number;
  declare email: string;
  declare role: string;
  declare token: string;
  declare invited_by: number;
  declare invited_user: number;
  declare status: string;
  declare expires_at: Date;
  declare completed_at: Date;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date;
}

Invitation.init(invitationSchema, {
  sequelize,
  ...COMMON_MODEL_OPTIONS,
});

export default Invitation;
