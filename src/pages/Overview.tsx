import type { History } from "../types";
import { APP_URL } from "../config";
import { Rationale } from "../components/Rationale";

export function Overview({ history }: { history: History }) {
  const { unit, api, e2e } = history.layers;
  const total = unit.count + api.count + e2e.count;

  return (
    <>
      <h2>Under test</h2>
      <div className="card">
        <p className="lead">
          <a href={APP_URL} target="_blank" rel="noreferrer">
            {APP_URL.replace("https://", "")}
          </a>{" "}
          — Cashboard, an open-source personal-finance dashboard. Its flagship is a
          net-worth <strong>projections calculator</strong>: enter a starting amount,
          monthly contribution, expected return and horizon, and it compounds the growth.
          The maths is deterministic, which makes it an ideal test target.
        </p>
        <p className="muted small">
          Stack: Next.js 16 · React 19 · TypeScript, deployed on Vercel. The calculator is
          API-driven — the page calls <code>/api/projections</code>.
        </p>
      </div>

      <h2>Test plan &amp; coverage</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>What it covers</th>
              <th>Tool</th>
              <th style={{ textAlign: "right" }}>Tests</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="layer-tag unit">UNIT</span>
              </td>
              <td>Finance maths in isolation — projections, aggregation, formatting</td>
              <td>Vitest</td>
              <td style={{ textAlign: "right" }}>{unit.count}</td>
            </tr>
            <tr>
              <td>
                <span className="layer-tag api">API</span>
              </td>
              <td>Every JSON endpoint — status, shape, validation, filters</td>
              <td>Playwright APIRequestContext</td>
              <td style={{ textAlign: "right" }}>{api.count}</td>
            </tr>
            <tr>
              <td>
                <span className="layer-tag e2e">UI</span>
              </td>
              <td>Key browser journeys — the calculator and navigation</td>
              <td>Playwright</td>
              <td style={{ textAlign: "right" }}>{e2e.count}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="muted small hint">
        {total} automated tests across the three layers — the full case-by-case list is
        under <a href="#/tests">Test cases</a>.
      </p>

      <h2>Approach</h2>
      <Rationale />

      <h2>How it runs</h2>
      <div className="card rationale">
        <ul>
          <li>
            <strong>On every push &amp; PR</strong> — the app is built and the whole suite
            runs against it in CI (hermetic and deterministic).
          </li>
          <li>
            <strong>Weekly</strong> — a live smoke hits the deployed production API to
            catch real-world breakage.
          </li>
          <li>
            Each run publishes its results here — see <a href="#/dashboard">Dashboard</a>{" "}
            for trends, or <a href="#/live">Live run</a> to launch one on demand.
          </li>
        </ul>
      </div>
    </>
  );
}
