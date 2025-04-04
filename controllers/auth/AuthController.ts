import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ENTITY_TYPE } from "@config/appConstants";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { ApiError } from "@lib/errors/APIError";
import AuthService from "@services/AuthService";
import { validateEmail } from "@utils/helpers";
import { sendErrorResponse, sendSuccessResponse } from "@utils/responseHandler";

export const getLoginRateLimiterKey = (req: Request): string => {
  return req.body.email || req.ip;
};

export const loginRateLimiter: any = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP or user (customizable) to 5 requests per window
  message: {
    status: 429,
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: getLoginRateLimiterKey,
});

export class AuthController {
  /**
   * Logs in a user.
   *
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   */
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return sendErrorResponse(
          res,
          ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED,
          400
        );
      }

      // Call the login method on the AuthService
      const result = await AuthService.login(email, password, rememberMe);

      // Reset failed attempts to 0 after successful attempt
      if (loginRateLimiter.resetKey) {
        loginRateLimiter.resetKey(getLoginRateLimiterKey(req));
      }

      // Check if the user data is valid
      if (!result?.user?.id) {
        throw ApiError.internal("Invalid user data in login result");
      }

      try {
        const response = {
          ...result,
        };
        return sendSuccessResponse(res, response);
      } catch (error) {
        const response = {
          ...result,
        };
        return sendSuccessResponse(res, response);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      return sendErrorResponse(res, errorMessage, 401);
    }
  }
}

export default new AuthController();
