import { Collection, Document, MongoClient } from "mongodb";

import { AppConfig } from "./config.js";

let clientPromise: Promise<MongoClient> | null = null;
let activeUri: string | null = null;

function createClient(config: AppConfig): MongoClient {
  return new MongoClient(config.mongoUri);
}

export async function connectToDatabase(config: AppConfig): Promise<MongoClient> {
  if (clientPromise && activeUri === config.mongoUri) {
    return clientPromise;
  }

  activeUri = config.mongoUri;
  clientPromise = createClient(config).connect();

  return clientPromise;
}

export async function getCollection(config: AppConfig): Promise<Collection<Document>> {
  const mongoClient = await connectToDatabase(config);

  return mongoClient.db(config.dbName).collection(config.collectionName);
}
