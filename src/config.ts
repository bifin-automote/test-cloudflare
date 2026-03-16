import { env } from "cloudflare:workers";

export interface WorkerBindings {
  MONGO_URI?: string;
  DB_NAME?: string;
  COLLECTION_NAME?: string;
}

export interface AppConfig {
  mongoUri: string;
  dbName: string;
  collectionName: string;
}

function readRequiredBinding(
  bindings: WorkerBindings,
  name: "MONGO_URI" | "DB_NAME" | "COLLECTION_NAME",
): string {
  const value = bindings[name]?.trim();

  if (!value) {
    throw new Error(`Missing required Worker binding: ${name}`);
  }

  return value;
}

export function loadConfig(bindings: WorkerBindings = env as WorkerBindings): AppConfig {
  return {
    mongoUri: readRequiredBinding(bindings, "MONGO_URI"),
    dbName: readRequiredBinding(bindings, "DB_NAME"),
    collectionName: readRequiredBinding(bindings, "COLLECTION_NAME"),
  };
}
