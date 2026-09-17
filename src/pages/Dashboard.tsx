import type { History } from "../types";
import { Pyramid } from "../components/Pyramid";
import { Trends } from "../components/Trends";
import { Specs } from "../components/Specs";
import { RecentRuns } from "../components/RecentRuns";

export function Dashboard({ history }: { history: History }) {
  const latest = history.runs[history.runs.length - 1];
  const total =
    history.layers.unit.count + history.layers.api.count + history.layers.e2e.count;
  const prodOk =
    history.production.status === "ok" &&
    history.production.passed === history.production.total;

  return (
    <>
      <div className="stat-row page-top">
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
            {latest.failed === 0 ? "all passing" : `${latest.failed} failing`} ·{" "}
            {latest.flaky} flaky
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
    </>
  );
}
