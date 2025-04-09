import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { ApiError } from "@lib/errors/APIError";
import AuthService from "@services/AuthService";
import { validateEmail } from "@utils/helpers";
import { sendErrorResponse, sendSuccessResponse } from "@utils/responseHandler";
import { InvitedUserType } from "types/types";

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

  public async inviteUsers(req: Request, res: Response) {
    try {
      const { invitedUsers }: { invitedUsers: InvitedUserType[] } = req.body;

      // Validate each email address
      const invalidEmails = invitedUsers.filter(
        (user) => !validateEmail(user.email)
      );
      if (invalidEmails.length > 0) {
        const emails = invalidEmails.map((user) => user.email);
        throw new Error(
          `Invalid email addresses detected. Please correct the following before proceeding: ${emails.join(
            ", "
          )}`
        );
      }

      // Call the service function to invite users
      await AuthService.inviteUsers(invitedUsers, req.user!);

      // Respond with a success message
      sendSuccessResponse(res, {
        message: "Invitations sent successfully",
      });
    } catch (error: any) {
      // Handle any errors that occur during the process
      const errorMessage =
        error instanceof Error ? error.message : "Send invitation failed";

      sendErrorResponse(res, errorMessage, 422);
    }
  }

  public async getInvitationDetails(req: Request, res: Response) {
    try {
      // Extract the token from the request body
      const { token } = req.query as { token: string };

      // Call the service function to get invitation object
      const invitation = await AuthService.getInvitationDetails(token);

      // Respond with a success message
      sendSuccessResponse(res, invitation);
    } catch (error: any) {
      // Handle any errors that occur during the process
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

      sendErrorResponse(res, errorMessage, 422);
    }
  }
  public async signUpThroughInvitation(req: Request, res: Response) {
    try {
      await AuthService.signUpThroughInvitation(req.body);
      sendSuccessResponse(res, {
        message: "Sign Up Successful",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

      sendErrorResponse(res, errorMessage, 500);
    }
  }
}

export default new AuthController();
