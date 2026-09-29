import type { FC } from "hono/jsx";

import type { AgentWithAilments } from "../db/types";
import { Layout } from "./Layout";
import { Status } from "./Status";

type AgentDetailProps = { agent: AgentWithAilments };

export const AgentDetail: FC<AgentDetailProps> = ({ agent }) => (
  <Layout>
    <a class="back-link" href="/agents">← Back to agents</a>
    <article class="record-card">
      <header>
        <p class="eyebrow">Agent record #{agent.id}</p>
        <h1>{agent.name}</h1>
      </header>
      <dl class="record-meta">
        <div><dt>Model type</dt><dd>{agent.model_type}</dd></div>
        <div><dt>Status</dt><dd><Status value={agent.status} /></dd></div>
      </dl>
      <section aria-labelledby="presenting-concerns">
        <h2 id="presenting-concerns">Presenting concerns</h2>
        {agent.ailments.length > 0 ? (
          <ul class="record-list">
            {agent.ailments.map((ailment) => (
              <li key={ailment.id}>
                <strong>{ailment.name}</strong>
                <span>{ailment.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p class="empty-state">No presenting concerns are currently on file. A rare clean bill of computational health.</p>
        )}
      </section>
      <footer><a href={`/agents/${agent.id}/appointments/new`} role="button">Book an appointment</a></footer>
    </article>
  </Layout>
);
