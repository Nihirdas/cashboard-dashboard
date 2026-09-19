export function Rationale() {
  return (
    <div className="card rationale">
      <p>
        The suite follows the <strong>test pyramid</strong>: many fast, isolated unit
        tests; fewer integration/API tests; a thin contract layer over the UI↔API wiring;
        a small number of slow, end-to-end tests. Cost and flakiness rise as you go up, so
        most of the coverage sits at the bottom where feedback is cheapest.
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
          <strong>Contract (Playwright Test)</strong> — the UI↔API round-trip for the
          projections calculator: the on-screen assumptions leave the sliders under the
          right query names, and the response summary lands back in the right cards.
          Catches wiring drift the API tests (which never open the page) and the E2E tests
          (which don't pin the request) would each miss.
        </li>
        <li>
          <strong>E2E (Playwright Test)</strong> — only the journeys that matter in a
          browser: driving the projections calculator and asserting the numbers,
          confirming it calls the API, and navigation. Kept thin on purpose.
        </li>
      </ul>
      <p className="muted">
        Risk-based selection: the projections calculator is the flagship feature and pure
        maths, so it gets the deepest unit coverage, its own endpoint, and a dedicated
        contract layer for the round-trip; the UI is verified for key flows rather than
        re-testing the maths.
      </p>
    </div>
  );
}
