import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { UserEntity } from "./entities/userEntity.ts";
import { LeaveEntity } from "./entities/leaveEntity.ts";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Safely cast string "true" to a boolean value
  synchronize: process.env.DB_SYNCHRONIZE === "true" || true,
  entities: ["src/entities/**/*.ts"],
  logging: true,
});
