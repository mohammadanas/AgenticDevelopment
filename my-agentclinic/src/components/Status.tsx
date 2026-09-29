import type { FC } from "hono/jsx";

import type { AgentStatus } from "../db/types";

const labels: Record<AgentStatus, string> = {
  active: "Active",
  on_leave: "On leave",
  discharged: "Discharged",
};

type StatusProps = {
  value: AgentStatus;
};

export const Status: FC<StatusProps> = ({ value }) => (
  <span class={`status status-${value}`}>{labels[value]}</span>
);
