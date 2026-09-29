import { serve } from "@hono/node-server";

import { createApp } from "./app";
import { createDatabase } from "./db/database";
import { migrate } from "./db/migrate";
import { seed } from "./db/seed";

const database = createDatabase();
migrate(database);
seed(database);

const app = createApp(database);
const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`AgentClinic is running at http://localhost:${info.port}`);
});
