import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import rateLimit from "express-rate-limit";

import setupSwagger from "@lib/swagger";
import routes from "@routes";
import { sendErrorResponse } from "@utils/responseHandler";

import sequelize from "@lib/db";
// Load environment variables from .env file

import logger from "@lib/logger";

const app = express();
const PORT = process.env.PORT || 3000;

/*
 * setup app env dev or production
 * Rate Limited is temporally disabled due to the fact
 * that it's not working properly with the current setup.
 */
// Rate limit for the API
// const limiterConfig = createRateLimitConfig(15, 100);
// const limiter = rateLimit(limiterConfig);
// Apply rate limiter middleware to all routes
// app.use(limiter);

// Use CORS with default settings
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  sendErrorResponse(res, err.message || "Internal server error", 500);
});

// Use Swagger
setupSwagger(app);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}/`);
});
