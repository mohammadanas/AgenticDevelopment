import type { FC } from "hono/jsx";
import type { AppointmentWithAgent } from "../db/types";
import { formatDateTime } from "../time";
import { Layout } from "./Layout";

export const AppointmentDetail: FC<{ appointment: AppointmentWithAgent; timeZone: string }> = ({ appointment, timeZone }) => (
  <Layout>
    <article class="record-card">
      <header><p class="eyebrow">Appointment #{appointment.id}</p><h1>Appointment confirmed</h1></header>
      <dl class="record-meta">
        <div><dt>Agent</dt><dd><a href={`/agents/${appointment.agent_id}`}>{appointment.agent_name}</a></dd></div>
        <div><dt>Date and time</dt><dd><time datetime={appointment.scheduled_at}>{formatDateTime(appointment.scheduled_at, timeZone)}</time></dd></div>
        <div><dt>Status</dt><dd><span class={`status status-${appointment.status}`}>{appointment.status}</span></dd></div>
      </dl>
      <a href="/dashboard" role="button">View staff dashboard</a>
    </article>
  </Layout>
);
