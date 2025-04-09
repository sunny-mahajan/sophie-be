import { AuthUser } from "types/types";
import { Op, Transaction } from "sequelize";
import { dumpModelData, getExpiresAtTime } from "@utils/helpers";
import { Invitation } from "@models";
import { INVITATION_STATUS } from "@config/appConstants";

class InvitationRepository {
  public async saveInvitation(
    { email, token, role }: { email: string; token: string; role: string },
    user: AuthUser,
    options?: { transaction?: Transaction }
  ): Promise<void> {
    try {
      // Parse INVITE_JWT_EXPIRES_IN and set the expiration date
      const expiresAt = getExpiresAtTime();

      // Check for existing invitation with the same email
      const existingInvitation = await Invitation.findOne({
        where: { email },
      });

      if (existingInvitation) {
        // If an invitation already exists, update it
        await existingInvitation.update(
          {
            expiresAt: expiresAt,
            token,
            role,
            invitedBy: user.id,
            updatedAt: new Date(),
          },
          { transaction: options?.transaction }
        );
      } else {
        // Use the Invitation model to create the entry
        await Invitation.create(
          {
            email,
            role,
            token,
            expiresAt: expiresAt,
            invitedBy: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction: options?.transaction }
        );
      }
    } catch {
      throw new Error(
        "Unable to save the email invitation. Please try again later or contact support if the issue persists."
      );
    }
  }
  public async getInvitationDetails(token: string): Promise<Invitation> {
    try {
      const invitation = await Invitation.findOne({
        where: {
          token,
          status: {
            [Op.ne]: INVITATION_STATUS.COMPLETED,
          },
        },
      });

      if (!invitation) {
        throw new Error("Invitation not found.");
      }

      if (invitation.expiresAt < new Date()) {
        invitation.status = "expired";
        invitation.updatedAt = new Date();
        await invitation.save();

        throw new Error("Invitation expired.");
      }

      return invitation;
    } catch (error: any) {
      throw new Error(error?.message || "Unable to find invitation.");
    }
  }

  public async markInvitationAsCompleted(
    token: string,
    transaction?: Transaction
  ) {
    return await Invitation.update(
      {
        status: INVITATION_STATUS.COMPLETED,
        deleted_at: new Date(),
        completed_at: new Date(),
        updated_at: new Date(),
      },
      { where: { token }, transaction }
    );
  }
}

export default new InvitationRepository();
