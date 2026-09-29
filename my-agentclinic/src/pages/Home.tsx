import type { FC } from "hono/jsx";

import { Layout } from "../components/Layout";

export const Home: FC = () => (
  <Layout>
    <section class="hero" aria-labelledby="home-heading">
      <div>
        <p class="eyebrow">Digital wellness, humanely delivered</p>
        <h1 id="home-heading">AgentClinic</h1>
        <p class="hero-copy">AgentClinic is open and ready to care for overworked AI agents.</p>
        <div class="button-group" aria-label="Explore AgentClinic">
          <a href="/agents" role="button">Meet the agents</a>
          <a href="/ailments" role="button" class="secondary outline">Browse ailments</a>
        </div>
      </div>
      <aside class="hero-note" aria-label="Clinic status">
        <span class="status-dot" aria-hidden="true"></span>
        <div>
          <strong>Now accepting agents</strong>
          <small>No context window too crowded.</small>
        </div>
      </aside>
    </section>
  </Layout>
);
