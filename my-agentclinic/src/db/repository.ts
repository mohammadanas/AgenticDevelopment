import type Database from "better-sqlite3";

import type { Agent, AgentWithAilments, Ailment, AppointmentStatus, AppointmentWithAgent, DashboardData, Therapy, TransitionResult } from "./types";

type CountRow = { count: number };

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
  const listTherapiesForAilment = database.prepare(`
    SELECT therapies.id, therapies.name, therapies.description
    FROM therapies INNER JOIN ailment_therapies ON ailment_therapies.therapy_id = therapies.id
    WHERE ailment_therapies.ailment_id = ?
    ORDER BY ailment_therapies.display_order, therapies.id
  `);
  const listTherapies = database.prepare("SELECT id, name, description FROM therapies ORDER BY name, id");
  const insertAppointment = database.prepare("INSERT INTO appointments (agent_id, scheduled_at, status) VALUES (?, ?, 'scheduled')");
  const findAppointment = database.prepare(`
    SELECT appointments.id, appointments.agent_id, appointments.scheduled_at, appointments.status,
           appointments.created_at, agents.name AS agent_name
    FROM appointments INNER JOIN agents ON agents.id = appointments.agent_id WHERE appointments.id = ?
  `);
  const agentCount = database.prepare("SELECT COUNT(*) AS count FROM agents");
  const activeAilmentCount = database.prepare(`SELECT COUNT(DISTINCT agent_ailments.ailment_id) AS count FROM agent_ailments INNER JOIN agents ON agents.id = agent_ailments.agent_id WHERE agents.status = 'active'`);
  const upcomingCount = database.prepare("SELECT COUNT(*) AS count FROM appointments WHERE status = 'scheduled' AND julianday(scheduled_at) > julianday(?)");
  const upcomingAppointments = database.prepare(`
    SELECT appointments.id, appointments.agent_id, appointments.scheduled_at, appointments.status,
           appointments.created_at, agents.name AS agent_name
    FROM appointments INNER JOIN agents ON agents.id = appointments.agent_id
    WHERE appointments.status = 'scheduled' AND julianday(appointments.scheduled_at) > julianday(?)
    ORDER BY julianday(appointments.scheduled_at), appointments.id LIMIT 10
  `);
  const recentAppointments = database.prepare(`
    SELECT appointments.id, appointments.agent_id, appointments.scheduled_at, appointments.status,
           appointments.created_at, agents.name AS agent_name
    FROM appointments INNER JOIN agents ON agents.id = appointments.agent_id
    ORDER BY appointments.created_at DESC, appointments.id DESC LIMIT 10
  `);
  const currentStatus = database.prepare("SELECT status FROM appointments WHERE id = ?");
  const transition = database.prepare("UPDATE appointments SET status = ? WHERE id = ? AND status = 'scheduled'");

  return {
    listAgents: () => listAgents.all() as Agent[],
    findAgent: (id: number): AgentWithAilments | undefined => {
      const agent = findAgent.get(id) as Agent | undefined;
      return agent ? { ...agent, ailments: listAgentAilments.all(id) as Ailment[] } : undefined;
    },
    listAilments: (): Ailment[] => (listAilments.all() as Ailment[]).map((ailment) => ({
      ...ailment,
      therapies: listTherapiesForAilment.all(ailment.id) as Therapy[],
    })),
    listTherapies: () => listTherapies.all() as Therapy[],
    createAppointment: (agentId: number, scheduledAt: string) => Number(insertAppointment.run(agentId, scheduledAt).lastInsertRowid),
    findAppointment: (id: number) => findAppointment.get(id) as AppointmentWithAgent | undefined,
    getDashboard: (nowIso: string): DashboardData => ({
      agentCount: (agentCount.get() as CountRow).count,
      activeAilmentCount: (activeAilmentCount.get() as CountRow).count,
      upcomingCount: (upcomingCount.get(nowIso) as CountRow).count,
      upcoming: upcomingAppointments.all(nowIso) as AppointmentWithAgent[],
      recent: recentAppointments.all() as AppointmentWithAgent[],
    }),
    transitionAppointment: database.transaction((id: number, status: AppointmentStatus): TransitionResult => {
      const current = currentStatus.get(id) as { status: AppointmentStatus } | undefined;
      if (!current) return "missing";
      if (current.status !== "scheduled") return "terminal";
      return transition.run(status, id).changes === 1 ? "updated" : "terminal";
    }),
  };
};
