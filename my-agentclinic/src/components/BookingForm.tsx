import type { FC } from "hono/jsx";
import type { Agent } from "../db/types";
import { Layout } from "./Layout";

export const BookingForm: FC<{ agent: Agent; value?: string; error?: string }> = ({ agent, value = "", error }) => (
  <Layout>
    <a class="back-link" href={`/agents/${agent.id}`}>← Back to agent</a>
    <article class="form-card">
      <header><p class="eyebrow">Schedule care</p><h1>Book an appointment</h1><p>Choose a future time for <strong>{agent.name}</strong>.</p></header>
      {error && <div class="notice notice-error" role="alert"><strong>Check the appointment time.</strong><p>{error}</p></div>}
      <form method="post" action={`/agents/${agent.id}/appointments`}>
        <label for="scheduled_at">Appointment date and time</label>
        <input id="scheduled_at" name="scheduled_at" type="datetime-local" required value={value} aria-invalid={error ? "true" : undefined} aria-describedby={error ? "scheduled-at-error timezone-help" : "timezone-help"} />
        {error && <small id="scheduled-at-error" class="field-error">{error}</small>}
        <small id="timezone-help">Times use the clinic's local timezone.</small>
        <button type="submit">Book appointment</button>
      </form>
    </article>
  </Layout>
);
