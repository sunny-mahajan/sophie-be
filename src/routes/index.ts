import { Router } from "express";

import dashboardRoutes from "./dashboard";

const router = Router();

import authRoutes from "./auth";
import { authenticate } from "@middlewares/authentication";
import { authorizeRoute } from "@middlewares/authorize";

router.use("/auth", authRoutes);
router.use("/dashboard", authenticate(), authorizeRoute(), dashboardRoutes);

export default router;
