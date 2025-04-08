import { Request, RequestHandler, Response, Router } from "express";
import AuthController, {
  loginRateLimiter,
} from "@controllers/auth/AuthController";
import { authenticate } from "@middlewares/authentication";
import requirePermission from "@middlewares/requirePermission";
import { PERMISSIONS } from "@config/appConstants";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *           example:
 *             email: "users@sophie.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     parentEntityId:
 *                       type: number
 *                     parentEntityType:
 *                       type: string
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/login", loginRateLimiter, (async (
  req: Request,
  res: Response
) => {
  await AuthController.login(req, res);
}) as RequestHandler);

/**
 * @swagger
 * /auth/invite-users:
 *   post:
 *     summary: Invite new users to the platform
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitedUsers
 *             properties:
 *               invitedUsers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - email
 *                     - role
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email address of the user to invite
 *                     role:
 *                       type: string
 *                       description: Role to assign (e.g., ADMIN, USER)
 *           example:
 *             invitedUsers:
 *               - email: user1@email.com
 *                 role: ADMIN
 *               - email: user2@email.com
 *                 role: USER
 *     responses:
 *       200:
 *         description: Users invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 invitedUsers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of invited email addresses
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post(
  "/invite-users",
  authenticate(),
  requirePermission(PERMISSIONS.MANAGE_USER.INVITE_USERS),
  AuthController.inviteUsers
);

/**
 * @swagger
 * /auth/invitation-details:
 *   get:
 *     summary: Fetch invitation details
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token sent to the user via email
 *     responses:
 *       200:
 *         description: Invitation details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Invitation details
 *                   example:
 *                     email: user@email.com
 *                     invited_by: admin@email.com
 *                     expires_at: 2025-04-10T12:00:00.000Z
 *       400:
 *         description: Missing or invalid token
 *       422:
 *         description: Unprocessable entity
 *       500:
 *         description: Internal server error
 */
router.get("/invitation-details", AuthController.getInvitationDetails);

router.get("/invitation/sign-up", AuthController.signUpThroughInvitation);
export default router;
