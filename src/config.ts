import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  mongoUri: string;
  dbName: string;
  collectionName: string;
  port: number;
}

function readRequiredEnv(name: "MONGO_URI" | "DB_NAME" | "COLLECTION_NAME"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadConfig(): AppConfig {
  const portValue = process.env.PORT?.trim();
  const port = portValue ? Number(portValue) : 3000;

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer when provided");
  }

  return {
    mongoUri: readRequiredEnv("MONGO_URI"),
    dbName: readRequiredEnv("DB_NAME"),
    collectionName: readRequiredEnv("COLLECTION_NAME"),
    port,
  };
}
