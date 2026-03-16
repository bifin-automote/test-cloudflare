import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { Collection, Document } from "mongodb";

import { AppConfig } from "./config.js";
import { getCollection } from "./db.js";

export interface AppDependencies {
  getDocumentsCollection?: () => Promise<Collection<Document>>;
}

export function createDocumentsHandler(
  getDocumentsCollection: () => Promise<Collection<Document>>,
): RequestHandler {
  return async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const collection = await getDocumentsCollection();
      const documents = await collection.find({}).limit(2).toArray();

      response.status(200).json({ documents });
    } catch (error) {
      next(error);
    }
  };
}

export function createApp(config: AppConfig, dependencies: AppDependencies = {}) {
  const app = express();

  const getDocumentsCollection =
    dependencies.getDocumentsCollection ?? (() => getCollection(config));

  app.get("/documents", createDocumentsHandler(getDocumentsCollection));
  app.post("/documents", createDocumentsHandler(getDocumentsCollection));

  app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    console.error("Request failed:", error);
    response.status(500).json({ error: "Internal server error" });
  });

  return app;
}
