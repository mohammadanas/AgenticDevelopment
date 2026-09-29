import { renderToString } from "hono/jsx/dom/server";
import { describe, expect, it } from "vitest";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { Main } from "./Main";

describe("layout components", () => {
  it("renders the header with a home link", () => {
    const html = renderToString(<Header />);

    expect(html).toBe('<header><a href="/">AgentClinic</a></header>');
  });

  it("renders page content inside the main landmark", () => {
    const html = renderToString(
      <Main>
        <p>Page content</p>
      </Main>,
    );

    expect(html).toBe("<main><p>Page content</p></main>");
  });

  it("renders the AgentClinic footer", () => {
    const html = renderToString(<Footer />);

    expect(html).toBe("<footer><p>AgentClinic</p></footer>");
  });

  it("composes one header, main, and footer around page content", () => {
    const html = renderToString(
      <Layout>
        <h1>Test page</h1>
      </Layout>,
    );

    expect(html).toContain('<link rel="stylesheet" href="/static/style.css"/>');
    expect(html.match(/<header/g)).toHaveLength(1);
    expect(html.match(/<main/g)).toHaveLength(1);
    expect(html.match(/<footer/g)).toHaveLength(1);
    expect(html).toContain("<main><h1>Test page</h1></main>");
  });
});
