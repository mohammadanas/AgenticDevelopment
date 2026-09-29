export type AgentStatus = "active" | "on_leave" | "discharged";

export interface Agent {
  id: number;
  name: string;
  model_type: string;
  status: AgentStatus;
  created_at: string;
}

export interface Therapy { id: number; name: string; description: string }

export interface Ailment { id: number; name: string; description: string; therapies?: Therapy[] }

export interface AgentWithAilments extends Agent { ailments: Ailment[] }

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
export interface Appointment { id: number; agent_id: number; scheduled_at: string; status: AppointmentStatus; created_at: string }
export interface AppointmentWithAgent extends Appointment { agent_name: string }
export interface DashboardData {
  agentCount: number;
  activeAilmentCount: number;
  upcomingCount: number;
  upcoming: AppointmentWithAgent[];
  recent: AppointmentWithAgent[];
}
export type TransitionResult = "updated" | "missing" | "terminal";
