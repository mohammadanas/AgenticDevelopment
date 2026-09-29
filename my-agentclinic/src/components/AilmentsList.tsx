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
          <h3>Recommended therapies</h3>
          {ailment.therapies?.length ? <ul>{ailment.therapies.map((therapy) => <li key={therapy.id}><a href={`/therapies#therapy-${therapy.id}`}>{therapy.name}</a></li>)}</ul> : <p class="empty-state">No therapies are currently recommended.</p>}
        </article>
      ))}
    </div>
  </Layout>
);
