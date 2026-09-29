import { serve } from "@hono/node-server";

import { createApp } from "./app";
import { createDatabase } from "./db/database";
import { migrate } from "./db/migrate";
import { seed } from "./db/seed";
import type { Logger } from "./logger";
import { resolveTimeZone } from "./time";

const timeZone = resolveTimeZone();
const database = createDatabase();
migrate(database);
seed(database);

const logger: Logger = {
  info: (message) => console.log(message),
  error: (message, error) => console.error(message, error),
};
const app = createApp(database, { logger, timeZone });
const port = 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`AgentClinic is running at http://localhost:${info.port}`);
});
