import type { FC } from "hono/jsx";

import { Layout } from "../components/Layout";

export const Home: FC = () => (
  <Layout>
    <h1>AgentClinic</h1>
    <p>AgentClinic is open and ready to care for overworked AI agents.</p>
  </Layout>
);
