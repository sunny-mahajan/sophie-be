import { Response, NextFunction } from "express";
import { baseRouteAccess } from "@config/routePermissions";
import { AuthenticatedRequest } from "./authentication";
import { HttpStatus } from "@config/HttpStatus";
import { ENTITY_TYPE } from "@config/appConstants";

/**
 * Middleware to authorize routes based on user roles.
 *
 * This middleware checks if the user is authenticated and if they have the
 * appropriate role to access the requested route. If the user is not
 * authenticated or does not have the required role, an appropriate error
 * response is returned.
 *
 * @returns A middleware function for route authorization.
 */
export const authorizeRoute = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: "User not authenticated",
        });
        return;
      }

      // Extract base route (e.g., 'dashboard' from '/api/v1/dashboard/key-metrics')
      const baseRoute = `/${req.baseUrl.split("/").pop()}`;

      // Get allowed roles for the base route
      const allowedRoles = baseRouteAccess[baseRoute];

      // If no role configuration is found for the route, deny access
      if (!allowedRoles) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: `No role configuration found for route ${baseRoute}`,
        });
        return;
      }

      // Check if user's role is authorized for the route
      if (!allowedRoles.includes(req.user.role as ENTITY_TYPE)) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: `User role ${req.user.role} is not authorized to access this route`,
        });
        return;
      }

      // User is authorized, proceed to the next middleware
      next();
    } catch (error) {
      // Handle any unexpected errors
      next(error);
    }
  };
};
