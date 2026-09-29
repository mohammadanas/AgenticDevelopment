import type { FC } from "hono/jsx";

import type { Agent } from "../db/types";
import { Layout } from "./Layout";
import { Status } from "./Status";

type AgentsListProps = { agents: Agent[] };

export const AgentsList: FC<AgentsListProps> = ({ agents }) => (
  <Layout>
    <header class="page-heading">
      <p class="eyebrow">Patient directory</p>
      <h1>Agents</h1>
      <p>Meet the hardworking systems currently receiving care.</p>
    </header>
    <div class="table-scroll" role="region" aria-label="Agent directory" tabindex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Model type</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <th scope="row"><a href={`/agents/${agent.id}`}>{agent.name}</a></th>
              <td>{agent.model_type}</td>
              <td><Status value={agent.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Layout>
);
