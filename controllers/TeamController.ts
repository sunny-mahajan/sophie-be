import logger from "@lib/logger";
import TeamService from "@services/TeamService";
import { sendErrorResponse, sendSuccessResponse } from "@utils/responseHandler";
import { Request, Response } from "express";

class TeamController {
  public async getTeamList(req: Request, res: Response) {
    try {
      const authUser = req.user;
      const filter = {
        status: req.query.status as string,
        name: req.query.name as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        excludeUserId: authUser?.id,
      };

      const result = await TeamService.getTeamList(filter);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.log(`error: `, error);
      sendErrorResponse(res, "Failed to fetch team list");
    }
  }
}

export default new TeamController();
