import { createServer } from "node:http";

import { httpServerHandler } from "cloudflare:node";
import { createApp } from "./app.js";

const server = createServer(createApp());

export default httpServerHandler(server);
