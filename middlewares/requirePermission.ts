import { ROLES } from "@config/appConstants";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { sendErrorResponse } from "@utils/responseHandler";
import { Request, Response, NextFunction } from "express";

const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Bypass if Full Super Admin
    if (user?.roles?.includes(ROLES.FULL_SUPER_ADMIN)) {
      return next();
    }

    if (!user || !user.permissions?.includes(requiredPermission)) {
      sendErrorResponse(res, ERROR_MESSAGES.AUTH.UNAUTHORIZED, 403);
      return;
    }

    next();
  };
};

export default requirePermission;
