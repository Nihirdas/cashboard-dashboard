import { useEffect, useRef, useState } from "react";
import type { History, RunRecord } from "../types";
import { RUN_WORKFLOW, runUrl } from "../config";

type Phase = "idle" | "running" | "done" | "timeout";

const POLL_MS = 12_000;
const TIMEOUT_MS = 10 * 60_000;
const EST_MS = 6 * 60_000; // progress easing target

export function LiveRun({
  history,
  reload,
}: {
  history: History;
  reload: () => Promise<void>;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<RunRecord | null>(null);
  const baseline = useRef<string>(history.runs.at(-1)?.id ?? "");
  const startedAt = useRef<number>(0);

  // A newer run appeared in the freshly-polled history → we're done.
  useEffect(() => {
    if (phase !== "running") return;
    const latest = history.runs.at(-1);
    if (latest && latest.id !== baseline.current) {
      setResult(latest);
      setProgress(100);
      setPhase("done");
    }
  }, [history, phase]);

  // Poll for new results + advance the progress bar while running.
  useEffect(() => {
    if (phase !== "running") return;
    const poll = setInterval(() => void reload(), POLL_MS);
    const tick = setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      if (elapsed > TIMEOUT_MS) {
        setPhase("timeout");
        return;
      }
      setProgress(Math.min(92, (elapsed / EST_MS) * 92));
    }, 500);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [phase, reload]);

  const start = () => {
    baseline.current = history.runs.at(-1)?.id ?? "";
    startedAt.current = Date.now();
    setResult(null);
    setProgress(4);
    setPhase("running");
    window.open(RUN_WORKFLOW, "_blank", "noreferrer");
  };

  const manualRuns = [...history.runs]
    .reverse()
    .filter((r) => r.trigger === "workflow_dispatch")
    .slice(0, 10);

  return (
    <>
      <div className="card runbox page-top">
        {phase === "idle" && (
          <>
            <h3 className="runbox-title">Run the full suite on demand</h3>
            <p className="muted">
              Launches the suite on GitHub Actions — it builds the app, runs the API + E2E
              tests, and publishes the result back here. Takes a few minutes; the result
              lands on this page automatically.
            </p>
            <button className="btn btn-lg" onClick={start}>
              ▶ Run tests now
            </button>
          </>
        )}

        {phase === "running" && (
          <div className="running">
            <div className="spinner" />
            <h3 className="runbox-title">Running the suite…</h3>
            <p className="muted">
              This takes a few minutes — hang tight. A GitHub Actions tab opened; click{" "}
              <strong>Run workflow</strong> there if it didn't start on its own. Results
              appear here automatically.
            </p>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {phase === "done" && result && (
          <div className="done">
            <div className={`big-check ${result.failed === 0 ? "ok" : "bad"}`}>
              {result.failed === 0 ? "✓" : "✕"}
            </div>
            <h3 className="runbox-title">
              {result.failed === 0 ? "All tests passed" : `${result.failed} failing`}
            </h3>
            <p className="muted">
              {result.passed}/{result.total} in {(result.durationMs / 1000).toFixed(1)}s.
            </p>
            <button className="btn" onClick={() => setPhase("idle")}>
              Run again
            </button>
          </div>
        )}

        {phase === "timeout" && (
          <div className="running">
            <h3 className="runbox-title">Still waiting…</h3>
            <p className="muted">
              No new result yet. Make sure you clicked <strong>Run workflow</strong> on
              GitHub. You can watch the{" "}
              <a href={RUN_WORKFLOW} target="_blank" rel="noreferrer">
                run on GitHub Actions
              </a>
              .
            </p>
            <button className="btn" onClick={() => setPhase("idle")}>
              Back
            </button>
          </div>
        )}
      </div>

      <h2>Manual run history</h2>
      {manualRuns.length ? (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th style={{ textAlign: "right" }}>Result</th>
                <th style={{ textAlign: "right" }}>Duration</th>
                <th style={{ textAlign: "right" }}>Run</th>
              </tr>
            </thead>
            <tbody>
              {manualRuns.map((r) => (
                <tr key={`${r.id}-${r.timestamp}`}>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                  <td
                    style={{
                      textAlign: "right",
                      color: r.failed === 0 ? "var(--ok)" : "var(--bad)",
                    }}
                  >
                    {r.passed}/{r.total}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {(r.durationMs / 1000).toFixed(1)}s
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {/^\d+$/.test(r.id) ? (
                      <a href={runUrl(r.id)} target="_blank" rel="noreferrer">
                        logs ↗
                      </a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted small">
          No manual runs yet — hit “Run tests now” to launch one.
        </p>
      )}
    </>
  );
}
