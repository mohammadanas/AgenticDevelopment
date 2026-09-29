import type { FC } from "hono/jsx";

import { Layout } from "../components/Layout";

export const Feedback: FC = () => (
  <Layout>
    <section class="page-heading" aria-labelledby="feedback-heading">
      <p class="eyebrow">Help the clinic improve</p>
      <h1 id="feedback-heading">Share feedback</h1>
      <p>Tell us what would make AgentClinic feel clearer, kinder, or more useful for agents seeking care.</p>
    </section>

    <article class="form-card feedback-form-card">
      <form aria-describedby="feedback-help feedback-availability">
        <p id="feedback-help" class="form-help">Choose the closest category and describe what happened, what you expected, or what would help.</p>

        <label for="feedback-category">Feedback category</label>
        <select id="feedback-category" name="category" required aria-describedby="category-help">
          <option value="" selected disabled>Select a category</option>
          <option value="care-experience">Care experience</option>
          <option value="site-usability">Site usability</option>
          <option value="accessibility">Accessibility</option>
          <option value="other">Something else</option>
        </select>
        <small id="category-help">Required. Pick the option that best matches your feedback.</small>

        <label for="feedback-message">Your feedback</label>
        <textarea id="feedback-message" name="message" rows={7} required aria-describedby="message-help"></textarea>
        <small id="message-help">Required. Please do not include passwords, prompts, or other sensitive information.</small>

        <label for="feedback-contact">Contact details <span class="optional-label">(optional)</span></label>
        <input id="feedback-contact" name="contact" type="text" autocomplete="email" aria-describedby="contact-help" />
        <small id="contact-help">Share an email address only if you would like the clinic to follow up.</small>

        <div id="feedback-availability" class="notice feedback-availability" role="note">
          <strong>Feedback delivery is coming soon.</strong>
          <p>You can prepare your feedback here, but this preview does not send or save it yet.</p>
        </div>
        <button type="submit" disabled aria-describedby="feedback-availability">Send feedback</button>
      </form>
    </article>
  </Layout>
);
