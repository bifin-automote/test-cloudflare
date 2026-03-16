import test from "node:test";
import assert from "node:assert/strict";

import { Document } from "mongodb";
import { NextFunction, Request, Response } from "express";

import { createDocumentsHandler } from "../src/app.js";

test("GET /documents returns the first two documents", async () => {
  const documents: Document[] = [{ name: "first" }, { name: "second" }, { name: "third" }];
  let statusCode = 0;
  let jsonPayload: unknown;

  const response = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      jsonPayload = payload;
      return this;
    },
  } as Response;

  const handler = createDocumentsHandler(async () =>
    ({
      find: () => ({
        limit: (value: number) => {
          assert.equal(value, 2);

          return {
            toArray: async () => documents.slice(0, 2),
          };
        },
      }),
    }) as never,
  );

  await handler({} as Request, response, (() => undefined) as NextFunction);

  assert.equal(statusCode, 200);
  assert.deepEqual(jsonPayload, {
    documents: [{ name: "first" }, { name: "second" }],
  });
});

test("GET /documents returns 500 when the database call fails", async () => {
  const failure = new Error("database unavailable");
  let capturedError: unknown;
  const handler = createDocumentsHandler(async () => {
    throw failure;
  });

  await handler(
    {} as Request,
    {} as Response,
    ((error?: unknown) => {
      capturedError = error;
    }) as NextFunction,
  );

  assert.equal(capturedError, failure);
});
