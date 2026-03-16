import { Collection, Document, MongoClient } from "mongodb";

import { AppConfig } from "./config.js";

let client: MongoClient | null = null;

function createClient(config: AppConfig): MongoClient {
  return new MongoClient(config.mongoUri);
}

export async function connectToDatabase(config: AppConfig): Promise<MongoClient> {
  if (client) {
    return client;
  }

  const mongoClient = createClient(config);
  await mongoClient.connect();
  client = mongoClient;

  return mongoClient;
}

export async function getCollection(config: AppConfig): Promise<Collection<Document>> {
  const mongoClient = await connectToDatabase(config);

  return mongoClient.db(config.dbName).collection(config.collectionName);
}

export async function closeDatabaseConnection(): Promise<void> {
  if (!client) {
    return;
  }

  await client.close();
  client = null;
}
