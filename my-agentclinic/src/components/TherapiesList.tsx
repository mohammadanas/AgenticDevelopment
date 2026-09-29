import type { FC } from "hono/jsx";
import type { Therapy } from "../db/types";
import { Layout } from "./Layout";

export const TherapiesList: FC<{ therapies: Therapy[] }> = ({ therapies }) => (
  <Layout>
    <header class="page-heading">
      <p class="eyebrow">Treatment library</p>
      <h1>Therapies</h1>
      <p>Restorative practices recommended for the clinic's most common computational concerns.</p>
    </header>
    <div class="card-grid">
      {therapies.map((therapy) => (
        <article id={`therapy-${therapy.id}`} key={therapy.id}>
          <h2>{therapy.name}</h2><p>{therapy.description}</p>
        </article>
      ))}
    </div>
  </Layout>
);
