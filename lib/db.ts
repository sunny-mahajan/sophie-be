import { Sequelize } from "sequelize";
import logger from "./logger";
import path from "path";

const {
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
  USE_SSH_TUNNEL,
  DB_SSH_LOCAL_PORT,
} = process.env;

const getDialect = (): "mysql" | "postgres" | "sqlite" | "mssql" => {
  const dialect = DB_DIALECT as "mysql" | "postgres" | "sqlite" | "mssql";

  if (!["mysql", "postgres", "sqlite", "mssql"].includes(dialect)) {
    throw new Error(`Invalid dialect: ${dialect}`);
  }
  return dialect;
};

const sequelize = new Sequelize({
  dialect: getDialect(),
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

testConnection();

export default sequelize;

// import logger from "@lib/logger";
// import { Sequelize, SequelizeOptions } from "sequelize-typescript";
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config();

// const useSshTunnel = (USE_SSH_TUNNEL ?? "").toLowerCase() === "true";

// // Check if the provided dialect is valid

// const config: SequelizeOptions = {
//   dialect: getDialect(),
//   host: useSshTunnel ? "127.0.0.1" : DB_HOST,
//   port: useSshTunnel ? Number(DB_SSH_LOCAL_PORT ?? 5433) : Number(DB_PORT),
//   username: DB_USERNAME,
//   password: DB_PASSWORD,
//   database: DB_NAME,
//   models: [path.join(__dirname, "..", "models")],
//   // eslint-disable-next-line no-console
//   logging: NODE_ENV === "development" ? console.log : false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   define: {
//     timestamps: true,
//     underscored: true,
//   },
// };
// const sequelize = new Sequelize(config);
// console.log(`sequelize: `, sequelize);
// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     logger.info(
//       "Connection to the database has been established successfully."
//     );
//   } catch (error) {
//     logger.error("Unable to connect to the database:", error);
//     process.exit(1);
//   }
// };

// testConnection();

// export default sequelize;
