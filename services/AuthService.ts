import bcrypt from "bcrypt";
import joi from "joi";
import jwt from "jsonwebtoken";
import { Transaction } from "sequelize";
import { ERROR_MESSAGES } from "../config/errorMessages";
import User from "../database/models/User";
import UserService from "@services/UserService";
import UserRepository from "@repositories/UserRepository";
import sequelize from "@lib/db";

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

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
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
  userId?: number;
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

  async login(email: string, password: string, rememberMe: boolean = false) {
    // Start transaction

    let transaction: Transaction | null = await sequelize.transaction();

    try {
      const user = await UserService.getUserWithRolesAndPermissions(email);

      if (
        !user ||
        !user.password_hash ||
        !(await bcrypt.compare(password, user.password_hash))
      ) {
        throw new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED);
      }

      // Token logic
      const refreshToken = this.generateRefreshToken(user.id);
      await UserRepository.updateRefreshToken(user.id, refreshToken, {
        transaction,
      });

      const accessToken = this.generateAccessToken(user, rememberMe);

      await transaction.commit();
      return {
        accessToken,
        refreshToken,
        user: user,
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
}

export default new AuthService();
