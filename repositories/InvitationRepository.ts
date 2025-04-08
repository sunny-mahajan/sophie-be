import { AuthUser } from "types/types";
import { Transaction } from "sequelize";
import { dumpModelData, getExpiresAtTime } from "@utils/helpers";
import { Invitation } from "@models";

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
            expires_at: expiresAt,
            token,
            role,
            invited_by: user.id,
            updated_at: new Date(),
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
            expires_at: expiresAt,
            invited_by: user.id,
            created_at: new Date(),
            updated_at: new Date(),
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
        where: { token },
      });

      if (!invitation) {
        throw new Error("Invitation not found.");
      }

      if (invitation.expires_at < new Date()) {
        invitation.status = "expired";
        invitation.updated_at = new Date();
        await invitation.save();

        throw new Error("Invitation expired.");
      }

      return invitation;
    } catch (error: any) {
      throw new Error(error?.message || "Unable to find invitation.");
    }
  }
}

export default new InvitationRepository();
