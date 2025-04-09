import { Router } from "express";
import TeamController from "@controllers/TeamController";

const router = Router();

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get a list of team members
 *     tags:
 *       - Team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Filter by user's full name (first or last)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of team members retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/", TeamController.getTeamList);

export default router;
