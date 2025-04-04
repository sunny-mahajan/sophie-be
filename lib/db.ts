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
  define: {
    underscored: true,
  },
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
