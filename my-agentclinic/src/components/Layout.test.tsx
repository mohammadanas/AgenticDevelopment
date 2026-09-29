import { renderToString } from "hono/jsx/dom/server";
import { describe, expect, it } from "vitest";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { Main } from "./Main";

describe("layout components", () => {
  it("renders semantic primary navigation", () => {
    const output = renderToString(<Header />);
    expect(output).toContain('<nav aria-label="Primary navigation">');
    expect(output).toContain('href="/">Home</a>');
    expect(output).toContain('href="/agents">Agents</a>');
    expect(output).toContain('href="/ailments">Ailments</a>');
    expect(output).toContain('href="/therapies">Therapies</a>');
    expect(output).toContain('href="/dashboard">Dashboard</a>');
  });

  it("renders page content inside the main landmark", () => {
    expect(renderToString(<Main><p>Page content</p></Main>)).toBe('<main id="main-content" tabindex="-1"><p>Page content</p></main>');
  });

  it("renders the AgentClinic footer", () => {
    expect(renderToString(<Footer />)).toBe("<footer><p>AgentClinic</p></footer>");
  });

  it("loads PicoCSS before project overrides and composes landmarks", () => {
    const output = renderToString(<Layout><h1>Test page</h1></Layout>);
    expect(output.indexOf("/static/pico.min.css")).toBeLessThan(output.indexOf("/static/style.css"));
    expect(output).toContain('class="skip-link" href="#main-content"');
    expect(output.match(/<header/g)).toHaveLength(1);
    expect(output.match(/<nav/g)).toHaveLength(1);
    expect(output.match(/<main/g)).toHaveLength(1);
    expect(output.match(/<footer/g)).toHaveLength(1);
  });
});
