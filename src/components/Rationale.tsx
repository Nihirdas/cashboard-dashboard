export function Rationale() {
  return (
    <div className="card rationale">
      <p>
        The suite follows the <strong>test pyramid</strong>: many fast, isolated unit
        tests; fewer integration/API tests; a small number of slow, end-to-end tests. Cost
        and flakiness rise as you go up, so most of the coverage sits at the bottom where
        feedback is cheapest.
      </p>
      <ul>
        <li>
          <strong>Unit (Vitest)</strong> — the finance maths in isolation: compound-growth
          projections, portfolio and net-worth aggregation, currency and percentage
          formatting. Golden values plus edge cases (0% and negative returns, zero
          contributions, rounding).
        </li>
        <li>
          <strong>API (Playwright APIRequestContext)</strong> — every JSON endpoint:
          status codes, response shape, query validation (400s), filters, and
          cross-endpoint consistency. The broad black-box layer, because it is fast and
          exercises real HTTP.
        </li>
        <li>
          <strong>E2E (Playwright Test)</strong> — only the journeys that matter in a
          browser: driving the projections calculator and asserting the numbers,
          confirming it calls the API, and navigation. Kept thin on purpose.
        </li>
      </ul>
      <p className="muted">
        Risk-based selection: the projections calculator is the flagship feature and pure
        maths, so it gets the deepest unit coverage and its own endpoint; read-only data
        endpoints get contract checks; the UI is verified for wiring and key flows rather
        than re-testing the maths.
      </p>
    </div>
  );
}
