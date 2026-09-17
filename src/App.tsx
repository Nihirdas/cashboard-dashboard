import { useCallback, useEffect, useState } from "react";
import type { History } from "./types";
import { useHashRoute } from "./router";
import { Overview } from "./pages/Overview";
import { TestCases } from "./pages/TestCases";
import { Dashboard } from "./pages/Dashboard";
import { LiveRun } from "./pages/LiveRun";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "tests", label: "Test cases" },
  { id: "dashboard", label: "Dashboard" },
  { id: "live", label: "Live run" },
] as const;

export default function App() {
  const route = useHashRoute();
  const [history, setHistory] = useState<History | null>(null);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.BASE_URL}data/history.json?t=${Date.now()}`,
      );
      setHistory(await res.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const active = TABS.some((t) => t.id === route) ? route : "overview";

  return (
    <div className="wrap">
      <header>
        <h1>Cashboard · Test Dashboard</h1>
        <p>
          Automated test health for the Cashboard finance app — unit, API and end-to-end.
        </p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <a
            key={t.id}
            href={`#/${t.id}`}
            className={`tab ${active === t.id ? "active" : ""}`}
          >
            {t.label}
          </a>
        ))}
      </nav>

      <main>
        {!history ? (
          <p className="state">{error ? "Couldn’t load test history." : "Loading…"}</p>
        ) : active === "overview" ? (
          <Overview history={history} />
        ) : active === "tests" ? (
          <TestCases />
        ) : active === "dashboard" ? (
          <Dashboard history={history} />
        ) : (
          <LiveRun history={history} reload={reload} />
        )}
      </main>

      <footer>
        Built from CI runs of the Cashboard test suites. Source:{" "}
        <a href="https://github.com/Nihirdas/cashboard">github.com/Nihirdas/cashboard</a>
      </footer>
    </div>
  );
}
