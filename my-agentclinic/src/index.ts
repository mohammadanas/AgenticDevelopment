import { serve } from "@hono/node-server";

import { app } from "./app";

const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`AgentClinic is running at http://localhost:${info.port}`);
});
