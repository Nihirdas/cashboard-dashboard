import { useEffect, useState } from "react";
import type { History } from "./types";
import { Pyramid } from "./components/Pyramid";
import { Trends } from "./components/Trends";
import { Specs } from "./components/Specs";
import { Rationale } from "./components/Rationale";
import { RecentRuns } from "./components/RecentRuns";

const QA_RUN_URL = "https://github.com/Nihirdas/cashboard-qa/actions/workflows/tests.yml";

export default function App() {
  const [history, setHistory] = useState<History | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/history.json`)
      .then((r) => r.json())
      .then((h: History) => setHistory(h))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="wrap">
        <p className="state">Couldn&apos;t load test history.</p>
      </div>
    );
  }
  if (!history) {
    return (
      <div className="wrap">
        <p className="state">Loading…</p>
      </div>
    );
  }

  const latest = history.runs[history.runs.length - 1];
  const total =
    history.layers.unit.count + history.layers.api.count + history.layers.e2e.count;
  const prodOk =
    history.production.status === "ok" &&
    history.production.passed === history.production.total;

  return (
    <div className="wrap">
      <header className="header-row">
        <div>
          <h1>Cashboard · Test Dashboard</h1>
          <p>
            Automated test health for the Cashboard finance app — unit, API and
            end-to-end.
          </p>
          <p className="updated">
            Updated {new Date(history.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="header-actions">
          <a className="btn" href={QA_RUN_URL} target="_blank" rel="noreferrer">
            Run tests ↗
          </a>
          <span className="btn-note">
            Launches on GitHub Actions; new results appear here automatically.
          </span>
        </div>
      </header>

      <div className="stat-row" style={{ marginTop: 24 }}>
        <div className="card stat">
          <div className="label">Total tests</div>
          <div className="value">{total}</div>
          <div className="sub">unit + API + E2E</div>
        </div>
        <div className="card stat">
          <div className="label">Latest run</div>
          <div className="value">
            {latest.passed}/{latest.total}
          </div>
          <div className="sub">
            {latest.failed === 0 ? "all passing" : `${latest.failed} failing`}
          </div>
        </div>
        <div className="card stat">
          <div className="label">Suite duration</div>
          <div className="value">{(latest.durationMs / 1000).toFixed(1)}s</div>
          <div className="sub">API + E2E</div>
        </div>
        <div className="card stat">
          <div className="label">Production</div>
          <div className="value" style={{ fontSize: "1.05rem", marginTop: 12 }}>
            <span className={`pill ${prodOk ? "ok" : "bad"}`}>
              <span className="dot" />
              {prodOk ? "Healthy" : "Failing"}
            </span>
          </div>
          <div className="sub">live API smoke</div>
        </div>
      </div>

      <h2>The test pyramid</h2>
      <Pyramid layers={history.layers} />

      <h2>Trends</h2>
      <Trends runs={history.runs} />

      <h2>Recent runs</h2>
      <RecentRuns runs={history.runs} />

      <h2>By spec</h2>
      <Specs specs={history.specs} />

      <h2>Test design rationale</h2>
      <Rationale />

      <footer>
        Built from CI runs of the Cashboard test suites. Source:{" "}
        <a href="https://github.com/Nihirdas/cashboard">github.com/Nihirdas/cashboard</a>
      </footer>
    </div>
  );
}
