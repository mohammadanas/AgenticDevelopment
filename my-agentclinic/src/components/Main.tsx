import type { FC, PropsWithChildren } from "hono/jsx";

export const Main: FC<PropsWithChildren> = ({ children }) => (
  <main id="main-content" tabindex={-1}>{children}</main>
);
