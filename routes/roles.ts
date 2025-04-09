import { Router } from "express";
import RoleController from "@controllers/RoleController";

const router = Router();

/**
 * @swagger
 * /roles:
 *  get:
 *    tags:
 *      - Roles
 *    summary: Get all roles
 *    description: Returns a list of all available roles.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of roles
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              data:
 *                - id: 1
 *                  name: ADMIN
 *                  created_at: "2024-01-01T00:00:00Z"
 *                  updated_at: "2024-01-02T00:00:00Z"
 *      401:
 *        description: Unauthorized - Missing or invalid token
 *      500:
 *        description: Internal Server Error - Failed to fetch roles
 */
router.get("/", RoleController.getAllRoles);

export default router;
