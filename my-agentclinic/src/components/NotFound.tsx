import type { FC } from "hono/jsx";

import { Layout } from "./Layout";

export const NotFound: FC = () => (
  <Layout>
    <article class="not-found">
      <p class="eyebrow">404 · Record not found</p>
      <h1>This agent has left the waiting room.</h1>
      <p>We could not find that agent record. Check the address or return to the patient directory.</p>
      <a href="/agents" role="button">View all agents</a>
    </article>
  </Layout>
);
