import { RequestHandler, Router } from "express";

const router = Router();

import authRoutes from "./auth";
import roleRoutes from "./roles";
import teamRoutes from "./teams";
import { authenticate } from "@middlewares/authentication";
import requirePermission from "@middlewares/requirePermission";
import { PERMISSIONS } from "@config/appConstants";
import { sendSuccessResponse } from "@utils/responseHandler";

router.use("/auth", authRoutes);
router.use("/roles", authenticate(), roleRoutes);
router.use("/teams", authenticate(), teamRoutes);

/**
 * @swagger
 * /sops:
 *   get:
 *     summary: Retrieve a list of SOPs
 *     tags: [SOPs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved SOPs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "SOP Name"
 *                   description:
 *                     type: string
 *                     example: "SOP Description"
 *       500:
 *         description: Error retrieving SOPs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving SOPs"
 */ router.get(
  "/sops",
  authenticate(),
  requirePermission(PERMISSIONS.VIEW_SOPS),
  (req, res) => {
    sendSuccessResponse(res, { message: "Permission Passed" });
  }
);

/**
 * @swagger
 * /trainings:
 *   get:
 *     summary: Retrieve a list of trainings
 *     tags: [Trainings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved trainings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Training Name"
 *                   description:
 *                     type: string
 *                     example: "Training Description"
 *       500:
 *         description: Error retrieving trainings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving trainings"
 */
router.get(
  "/trainings",
  authenticate(),
  requirePermission(PERMISSIONS.VIEW_TRAININGS),
  (req, res) => {
    sendSuccessResponse(res, { message: "Permission Passed" });
  }
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */ router.patch(
  "/users/:id",
  authenticate(),
  requirePermission(PERMISSIONS.MANAGE_USER.EDIT_USER),
  (req, res) => {
    sendSuccessResponse(res, { message: "Permission Passed" });
  }
);

export default router;
