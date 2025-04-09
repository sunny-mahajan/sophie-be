import { Request, Response } from "express";
import logger from "@lib/logger";
import RoleService from "@services/RoleService";
import { sendErrorResponse, sendSuccessResponse } from "@utils/responseHandler";
import { ERROR_MESSAGES } from "@config/errorMessages";

class RoleController {
  public async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await RoleService.getAllRoles();
      sendSuccessResponse(res, roles);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.COMMON.FAILED_TO_FETCH("Roles");
      sendErrorResponse(res, errorMessage);
    }
  }
}
export default new RoleController();
