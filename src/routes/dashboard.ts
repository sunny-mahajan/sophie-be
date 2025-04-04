import { Request, RequestHandler, Response, Router } from "express";
import { sendErrorResponse, sendSuccessResponse } from "@utils/responseHandler";

const router: Router = Router();
/**
 * @swagger
 * /dashboard/authorized-access-test:
 *   get:
 *     summary: Test authorized access
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully tested authorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authorized access test successful"
 *       500:
 *         description: Authorized access test error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authorized access test error"
 */
router.get("/authorized-access-test", (async (req: Request, res: Response) => {
  try {
    return sendSuccessResponse(res, {
      message: "Authorized access test successful",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Authorized access test error";
    return sendErrorResponse(res, errorMessage);
  }
}) as unknown as RequestHandler);

export default router;
