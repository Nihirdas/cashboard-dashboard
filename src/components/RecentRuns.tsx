import type { RunRecord } from "../types";

const RUN_URL = "https://github.com/Nihirdas/cashboard-dashboard/actions/runs/";

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TRIGGER_LABEL: Record<string, string> = {
  push: "Push",
  pull_request: "Pull request",
  workflow_dispatch: "Manual",
  schedule: "Scheduled",
  local: "Local",
};

export function RecentRuns({ runs }: { runs: RunRecord[] }) {
  const recent = [...runs].reverse().slice(0, 12);
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>Trigger</th>
            <th style={{ textAlign: "right" }}>Result</th>
            <th style={{ textAlign: "right" }}>Duration</th>
            <th style={{ textAlign: "right" }}>Run</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r) => {
            const ok = r.failed === 0;
            const isCi = /^\d+$/.test(r.id);
            return (
              <tr key={`${r.id}-${r.timestamp}`}>
                <td>{when(r.timestamp)}</td>
                <td>{TRIGGER_LABEL[r.trigger] ?? r.trigger}</td>
                <td
                  style={{ textAlign: "right", color: ok ? "var(--ok)" : "var(--bad)" }}
                >
                  {r.passed}/{r.total}
                </td>
                <td style={{ textAlign: "right" }}>
                  {(r.durationMs / 1000).toFixed(1)}s
                </td>
                <td style={{ textAlign: "right" }}>
                  {isCi ? (
                    <a href={RUN_URL + r.id} target="_blank" rel="noreferrer">
                      logs ↗
                    </a>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
