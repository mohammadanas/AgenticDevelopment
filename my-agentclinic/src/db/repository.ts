import type Database from "better-sqlite3";

import type { Agent, AgentWithAilments, Ailment } from "./types";

export const createRepository = (database: Database.Database) => {
  const listAgents = database.prepare("SELECT id, name, model_type, status, created_at FROM agents ORDER BY name, id");
  const findAgent = database.prepare("SELECT id, name, model_type, status, created_at FROM agents WHERE id = ?");
  const listAgentAilments = database.prepare(`
    SELECT ailments.id, ailments.name, ailments.description
    FROM ailments
    INNER JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
    WHERE agent_ailments.agent_id = ?
    ORDER BY ailments.name, ailments.id
  `);
  const listAilments = database.prepare("SELECT id, name, description FROM ailments ORDER BY name, id");

  return {
    listAgents: () => listAgents.all() as Agent[],
    findAgent: (id: number): AgentWithAilments | undefined => {
      const agent = findAgent.get(id) as Agent | undefined;
      return agent ? { ...agent, ailments: listAgentAilments.all(id) as Ailment[] } : undefined;
    },
    listAilments: () => listAilments.all() as Ailment[],
  };
};
