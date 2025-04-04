import bcrypt from "bcrypt";
import joi from "joi";
import jwt from "jsonwebtoken";
import { Transaction } from "sequelize";
import { ERROR_MESSAGES } from "../config/errorMessages";
import User from "../database/models/User";

const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/;

const SIGNUP_PAYLOAD_SCHEMA = joi.object({
  token: joi.string().required(),
  email: joi.string().email().min(1).max(255).required(),
  firstName: joi.string().min(1).max(255).required(),
  lastName: joi.string().min(1).max(255).required(),
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
  firstName: joi.string().min(1).max(255).required(),
  lastName: joi.string().min(1).max(255).required(),
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

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    associatedUserId: number;
    parentEntityId: number | null;
    parentEntityType: string | null;
  };
  loginTime: string;
  expiresIn: string;
}

interface TokenPayload {
  id: number;
  userId: number;
  email: string;
  role?: string;
  associatedUserId?: number;
  parentEntityId?: number | null;
  parentEntityType?: string | null;
}

interface EmailInviteType {
  email: string;
  role: string;
}

class AuthService {
  constructor() {}

  /**
   * Authenticate a user with email and password
   */
  public async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<AuthResult> {
    const sequelize = User.sequelize;
    if (!sequelize) {
      throw new Error("Sequelize instance is not available");
    }

    let transaction: Transaction | null = null;

    try {
      // Start transaction
      transaction = await sequelize.transaction();

      // Get user with role using Sequelize
      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user || !user?.password_hash) {
        throw new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED);
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED);
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        id: user.id,
        email: user.email,
        // role: user.UserRole.role,
        // associatedUserId: user.UserRole.associatedUserId,
        // parentEntityId: user.UserRole.parentEntityId,
        // parentEntityType: user.UserRole.parentEntityType,
      };

      const accessToken = this.generateAccessToken(tokenPayload, rememberMe);
      const refreshToken = this.generateRefreshToken(user.id);

      // // Update refresh token in database
      // Update refresh token in database using Sequelize
      await user.update(
        {
          refreshToken,
          updatedAt: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      // Prepare user data payload
      let userData: any = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // role: user.UserRole.role,
        // associatedUserId: user.UserRole.associatedUserId,
        // parentEntityId: user.UserRole.parentEntityId,
        // parentEntityType: user.UserRole.parentEntityType,
      };

      // Return authentication result
      return {
        accessToken,
        refreshToken,
        user: userData,
        loginTime: Date(),
        expiresIn: rememberMe
          ? process.env.JWT_LONG_EXPIRATION || "30d"
          : process.env.JWT_EXPIRATION || "24h",
      };
    } catch (error) {
      await (transaction ?? undefined)?.rollback();
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
      expiresIn: longExpiry ? "30d" : "24h",
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
      expiresIn: "7d",
    });
  }
}

export default new AuthService();
