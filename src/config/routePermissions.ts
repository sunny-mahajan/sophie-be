import { ROLES } from "./appConstants";

// Define base route access
export const baseRouteAccess: Record<string, string[]> = {
  "/auth": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  "/dashboard": [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
};
