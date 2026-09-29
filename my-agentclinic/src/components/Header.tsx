import type { FC } from "hono/jsx";

export const Header: FC = () => (
  <header>
    <nav aria-label="Primary navigation">
      <a class="brand" href="/">AgentClinic</a>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/agents">Agents</a></li>
        <li><a href="/ailments">Ailments</a></li>
        <li><a href="/therapies">Therapies</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
    </nav>
  </header>
);
