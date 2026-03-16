declare namespace Cloudflare {
  interface Env {
    MONGO_URI: string;
    DB_NAME: string;
    COLLECTION_NAME: string;
  }
}

interface Env extends Cloudflare.Env {}

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}

declare module "cloudflare:node" {
  import { Server } from "node:http";

  export function httpServerHandler(
    server: Server,
  ): {
    fetch(request: Request): Response | Promise<Response>;
  };

  export function httpServerHandler(
    options: { port: number },
  ): {
    fetch(request: Request): Response | Promise<Response>;
  };
}
