import bcrypt from "bcrypt";
import joi from "joi";
import jwt from "jsonwebtoken";
import { Transaction } from "sequelize";
import { ERROR_MESSAGES } from "../config/errorMessages";
import { Invitation, User } from "@models";
import UserService from "@services/UserService";
import UserRepository from "@repositories/UserRepository";
import sequelize from "@lib/db";
import { AuthUser, InvitedUserType } from "types/types";
import { sendSuccessResponse } from "@utils/responseHandler";
import { generateJwtToken } from "@utils/jwt";
import InvitationRepository from "@repositories/InvitationRepository";
import { sendInvitationEmail, sendWelcomeEmail } from "@utils/nodeMailer";
import { getHashedPassword } from "@utils/helpers";
import UserRoleRepository from "@repositories/UserRoleRepository";
import RoleRepository from "@repositories/RoleRepository";

const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/;

const SIGNUP_PAYLOAD_SCHEMA = joi.object({
  token: joi.string().required(),
  email: joi.string().email().min(1).max(255).required(),
  first_name: joi.string().min(1).max(255).required(),
  last_name: joi.string().min(1).max(255).required(),
  phones: joi
    .array()
    .items(joi.string().pattern(PHONE_PATTERN).required())
    .min(1)
    .max(2)
    .required(),
  password: joi.string().min(8).max(24).required(),
  address: joi.string().min(1).max(255).required(),
  city: joi.string().min(1).max(255).required(),
  state: joi.string().min(1).max(255).required(),
  zip: joi
    .string()
    .pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
    .required(),
  logo: joi.string(),
  title: joi.string(),
  orgName: joi.string(),
});
const INVITE_PAYLOAD_SCHEMA = joi.object({
  parentUserId: joi.number().required(), // Not sent by FE, added in payload later in BE
  parentUserRole: joi.string().required(), // Not sent by FE, added in payload later in BE
  email: joi.string().email().min(1).max(255).required(),
  first_name: joi.string().min(1).max(255).required(),
  last_name: joi.string().min(1).max(255).required(),
  phones: joi
    .array()
    .items(joi.string().pattern(PHONE_PATTERN).required())
    .min(1)
    .max(2)
    .required(),
  address: joi.string().min(1).max(255).required(),
  city: joi.string().min(1).max(255).required(),
  state: joi.string().min(1).max(255).required(),
  zip: joi
    .string()
    .pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
    .required(),
});

interface TokenPayload {
  id: number;
  userId?: number;
  email: string;
  role?: string;
  associatedUserId?: number;
  parentEntityId?: number | null;
  parentEntityType?: string | null;
}

class AuthService {
  constructor() {}

  public async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ) {
    // Start transaction
    let transaction: Transaction | null = await sequelize.transaction();

    try {
      const user = await UserService.getUserWithRolesAndPermissions(email);

      if (
        !user ||
        !user.passwordHash ||
        !(await bcrypt.compare(password, user.passwordHash))
      ) {
        throw new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED);
      }

      // Exclude sensitive information from token payload
      const { passwordHash, ...sanitizedUser } = user;

      // Token logic
      const refreshToken = this.generateRefreshToken(user.id);
      await UserRepository.updateRefreshToken(user.id, refreshToken, {
        transaction,
      });

      const accessToken = this.generateAccessToken(sanitizedUser, rememberMe);

      await transaction.commit();
      return {
        accessToken,
        refreshToken,
        user: sanitizedUser,
        loginTime: Date(),
        expiresIn: rememberMe
          ? process.env.JWT_LONG_EXPIRATION || "30d"
          : process.env.JWT_EXPIRATION || "24h",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Generate a new access token
   */
  private generateAccessToken(
    payload: TokenPayload,
    longExpiry: boolean = false
  ): string {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION ?? "24h",
    });
  }

  /**
   * Generate a new refresh token
   */
  private generateRefreshToken(userId: number): string {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? "7d",
    });
  }

  public async inviteUsers(
    invitedUsers: InvitedUserType[],
    authUser: AuthUser
  ) {
    // Start transaction
    let transaction: Transaction | undefined = await sequelize.transaction();

    // Check for existing users
    const emailList = invitedUsers.map((user) => user.email);

    // Use Promise.all with map to handle asynchronous operations
    const existingUsers = (
      await Promise.all(
        emailList.map(async (email) => {
          const existingUser = await UserRepository.getUserByEmail(email);
          return existingUser ? email : null;
        })
      )
    ).filter((email) => email !== null);

    // Filter out null values to get only existing emails
    const existingEmails = existingUsers.filter((email) => email !== null);

    if (existingEmails.length > 0) {
      throw new Error(
        `The following email addresses are already associated with existing accounts: ${existingEmails.join(
          ", "
        )}`
      );
    }
    try {
      transaction = await sequelize.transaction();

      // Generate JWT tokens and save invitation information
      const invitationPromises = invitedUsers.map(async (user) => {
        user.email = user.email?.toLowerCase();
        const token = generateJwtToken(user.email);

        await InvitationRepository.saveInvitation(
          { ...user, token },
          authUser,
          {
            transaction,
          }
        );
        await sendInvitationEmail(user.email, token);
      });

      // Wait for all invitations to be sent
      await Promise.all(invitationPromises);

      transaction?.commit();
    } catch (error: any) {
      transaction?.rollback();

      throw new Error(
        error?.message ||
          `We’re experiencing some technical issues at the moment. Please try again shortly or contact support if the problem persists.`
      );
    }
  }
  public async getInvitationDetails(token: string): Promise<Invitation> {
    return InvitationRepository.getInvitationDetails(token);
  }

  public async signUpThroughInvitation(params: any): Promise<any> {
    let transaction: Transaction | undefined;

    try {
      const invitation: Invitation =
        await InvitationRepository.getInvitationDetails(params.token);

      const { token, password, ...rest } = params;

      const { role, email } = invitation;

      const passwordHash = await getHashedPassword(password);

      transaction = await sequelize.transaction();

      const user = await UserRepository.create({
        ...rest,
        passwordHash,
      });

      // Get role id
      const roles = await RoleRepository.getRolesByNames([role]);
      const roleIds = roles.map((role) => role.id);

      await UserRoleRepository.assignRolesToUser(user.id, roleIds);

      InvitationRepository.markInvitationAsCompleted(token);

      await transaction?.commit();

      await sendWelcomeEmail(email, user.fullName);

      return await this.login(email, password, false);
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}

export default new AuthService();
