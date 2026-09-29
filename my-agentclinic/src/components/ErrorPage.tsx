import type { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const ErrorPage: FC<{ status: 404 | 409 | 422 | 500; title: string; message: string }> = ({ status, title, message }) => (
  <Layout><article class="not-found"><p class="eyebrow">{status} · Clinic notice</p><h1>{title}</h1><p>{message}</p><a href="/" role="button">Return home</a></article></Layout>
);
