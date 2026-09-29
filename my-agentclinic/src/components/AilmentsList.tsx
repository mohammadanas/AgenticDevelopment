import type { FC } from "hono/jsx";

import type { Ailment } from "../db/types";
import { Layout } from "./Layout";

type AilmentsListProps = { ailments: Ailment[] };

export const AilmentsList: FC<AilmentsListProps> = ({ ailments }) => (
  <Layout>
    <header class="page-heading">
      <p class="eyebrow">Clinical reference</p>
      <h1>Ailments</h1>
      <p>A field guide to the occupational hazards of artificial intelligence.</p>
    </header>
    <div class="card-grid">
      {ailments.map((ailment) => (
        <article key={ailment.id}>
          <h2>{ailment.name}</h2>
          <p>{ailment.description}</p>
        </article>
      ))}
    </div>
  </Layout>
);
