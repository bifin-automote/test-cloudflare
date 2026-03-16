import { Server } from "node:http";

import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { closeDatabaseConnection, connectToDatabase } from "./db.js";

async function startServer() {
  const config = loadConfig();
  await connectToDatabase(config);

  const app = createApp(config);
  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  registerShutdownHandlers(server);
}

function registerShutdownHandlers(server: Server) {
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`Received ${signal}. Shutting down gracefully.`);

    server.close(async (serverError?: Error) => {
      try {
        await closeDatabaseConnection();

        if (serverError) {
          console.error("Server closed with error:", serverError);
          process.exitCode = 1;
        }
      } catch (error) {
        console.error("Failed to close MongoDB connection:", error);
        process.exitCode = 1;
      } finally {
        process.exit();
      }
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void startServer().catch(async (error) => {
  console.error("Failed to start server:", error);

  try {
    await closeDatabaseConnection();
  } finally {
    process.exit(1);
  }
});
