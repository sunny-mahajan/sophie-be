import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define the Swagger options
const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sophie",
      version: "1.0.0",
      description: "API documentation for Sophie",
    },
    servers: [
      {
        url: `${process.env.BASE_URL}:${process.env.PORT || 3000}/api/v1`, // server URL
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: Express): void => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
