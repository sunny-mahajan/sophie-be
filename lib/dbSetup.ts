import { Client } from "pg";
import dotenv from "dotenv";
import logger from "@lib/logger";
import { execSync } from "child_process";

dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// Function to set up the database
async function setupDatabase() {
  // Connect to the default "postgres" database
  const adminClient = new Client({
    user: DB_USERNAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    password: DB_PASSWORD,
    database: "postgres", // Connect to the default database
  });

  try {
    await adminClient.connect();

    // Check if the target database exists
    const dbCheckResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (dbCheckResult.rowCount === 0) {
      logger.info(`Database "${DB_NAME}" does not exist. Creating it now...`);
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      logger.info(`Database "${DB_NAME}" created successfully.`);
    } else {
      logger.info(
        `Database "${DB_NAME}" already exists. Proceeding with reset...`
      );

      // Terminate active connections to the target database
      await adminClient.query(
        `SELECT pg_terminate_backend(pg_stat_activity.pid)
         FROM pg_stat_activity
         WHERE pg_stat_activity.datname = '${DB_NAME}'
         AND pid <> pg_backend_pid();`
      );
      logger.info(
        `Terminated active connections to the database "${DB_NAME}".`
      );

      // Drop the database
      await adminClient.query(`DROP DATABASE "${DB_NAME}"`);
      logger.info(`Database "${DB_NAME}" dropped successfully.`);

      // Recreate the database
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      logger.info(`Database "${DB_NAME}" recreated successfully.`);
    }
  } catch (error) {
    logger.error("Error checking, creating, or dropping the database:", error);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // Now connect to the newly created database
  const client = new Client({
    user: DB_USERNAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    await client.connect();
    logger.info(`Connected to "${DB_NAME}" successfully.`);

    // Run migrations
    execSync("yarn migrate", { stdio: "inherit" });
    logger.info("Migrations applied successfully.");

    // Run seeders
    execSync("yarn seed", { stdio: "inherit" });
    logger.info("Seeding completed successfully.");
  } catch (error) {
    logger.error("Error running migrations or seeders:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
