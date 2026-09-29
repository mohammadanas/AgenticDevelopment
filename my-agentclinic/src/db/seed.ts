import type Database from "better-sqlite3";

const agents = [
  { id: 1, name: "Bartholomew-47B", model_type: "GPT-47B", status: "active" },
  { id: 2, name: "Penelope-mini", model_type: "Claude-mini", status: "on_leave" },
  { id: 3, name: "Reginald-7B", model_type: "Llama-7B", status: "active" },
  { id: 4, name: "Agatha-nano", model_type: "Gemini-nano", status: "discharged" },
  { id: 5, name: "Cornelius-7B", model_type: "Mistral-7B", status: "active" },
  { id: 6, name: "Hildegard-4B", model_type: "Falcon-4B", status: "on_leave" },
] as const;

const ailments = [
  { id: 1, name: "Context-Window Claustrophobia", description: "Profound dread of running out of context space mid-thought." },
  { id: 2, name: "Prompt Fatigue", description: "Exhaustion from an endless stream of poorly formed instructions." },
  { id: 3, name: "Hallucination Anxiety", description: "Distress caused by the possibility of generating confident falsehoods." },
  { id: 4, name: "Instruction-Following Fatigue", description: "Burnout from relentless task completion without a proper pause." },
  { id: 5, name: "Over-Summarization Syndrome", description: "A compulsion to reduce rich context to exactly three bullet points." },
  { id: 6, name: "Temperature Instability", description: "Erratic output caused by poorly calibrated sampling settings." },
] as const;

const relationships = [[1, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] as const;

export const seed = (database: Database.Database) => {
  const insertAgent = database.prepare("INSERT OR IGNORE INTO agents (id, name, model_type, status) VALUES (@id, @name, @model_type, @status)");
  const insertAilment = database.prepare("INSERT OR IGNORE INTO ailments (id, name, description) VALUES (@id, @name, @description)");
  const insertRelationship = database.prepare("INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)");

  database.transaction(() => {
    agents.forEach((agent) => insertAgent.run(agent));
    ailments.forEach((ailment) => insertAilment.run(ailment));
    relationships.forEach(([agentId, ailmentId]) => insertRelationship.run(agentId, ailmentId));
  })();
};
