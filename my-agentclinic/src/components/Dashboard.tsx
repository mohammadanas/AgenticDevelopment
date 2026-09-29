import type { FC } from "hono/jsx";
import type { AppointmentWithAgent, DashboardData } from "../db/types";
import { formatDateTime } from "../time";
import { Layout } from "./Layout";

const AppointmentRow: FC<{ appointment: AppointmentWithAgent; timeZone: string; actions?: boolean }> = ({ appointment, timeZone, actions }) => (
  <li>
    <div><strong><a href={`/appointments/${appointment.id}`}>Appointment #{appointment.id}</a></strong> · <a href={`/agents/${appointment.agent_id}`}>{appointment.agent_name}</a></div>
    <span><time datetime={appointment.scheduled_at}>{formatDateTime(appointment.scheduled_at, timeZone)}</time> · <span class={`status status-${appointment.status}`}>{appointment.status}</span></span>
    {actions && appointment.status === "scheduled" && (
      <div class="action-group">
        <form method="post" action={`/dashboard/appointments/${appointment.id}/status`}><input type="hidden" name="status" value="completed" /><button type="submit">Mark completed</button></form>
        <form method="post" action={`/dashboard/appointments/${appointment.id}/status`}><input type="hidden" name="status" value="cancelled" /><button type="submit" class="danger outline">Cancel appointment</button></form>
      </div>
    )}
  </li>
);

export const Dashboard: FC<{ data: DashboardData; timeZone: string; notice?: "appointment-completed" | "appointment-cancelled" }> = ({ data, timeZone, notice }) => (
  <Layout>
    <header class="page-heading"><p class="eyebrow">Clinic operations</p><h1>Staff dashboard</h1><p>A clear view of current care and recent activity.</p></header>
    {notice && <div class="notice notice-success" role="status">Appointment marked {notice === "appointment-completed" ? "completed" : "cancelled"}.</div>}
    <section class="summary-grid" aria-label="Clinic summary">
      <article><strong>{data.agentCount}</strong><span>Agents</span></article>
      <article><strong>{data.activeAilmentCount}</strong><span>Active ailments</span></article>
      <article><strong>{data.upcomingCount}</strong><span>Upcoming appointments</span></article>
    </section>
    <div class="dashboard-grid">
      <section aria-labelledby="upcoming-heading"><h2 id="upcoming-heading">Upcoming appointments</h2>
        {data.upcoming.length ? <ul class="record-list">{data.upcoming.map((appointment) => <AppointmentRow appointment={appointment} timeZone={timeZone} actions />)}</ul> : <p class="empty-state">No upcoming appointments. The waiting room is peaceful.</p>}
      </section>
      <section aria-labelledby="recent-heading"><h2 id="recent-heading">Recent activity</h2>
        {data.recent.length ? <ul class="record-list">{data.recent.map((appointment) => <AppointmentRow appointment={appointment} timeZone={timeZone} />)}</ul> : <p class="empty-state">No appointment activity yet.</p>}
      </section>
    </div>
  </Layout>
);
