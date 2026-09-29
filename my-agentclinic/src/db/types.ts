export type AgentStatus = "active" | "on_leave" | "discharged";

export interface Agent {
  id: number;
  name: string;
  model_type: string;
  status: AgentStatus;
  created_at: string;
}

export interface Ailment { id: number; name: string; description: string }

export interface AgentWithAilments extends Agent { ailments: Ailment[] }
