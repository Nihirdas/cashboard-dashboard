export const APP_URL = "https://cashboard-pi.vercel.app";
export const APP_REPO = "https://github.com/Nihirdas/cashboard";

// The Live-run button launches the dashboard's own run workflow (public repo,
// no token needed — it runs the suite and publishes back to itself).
export const RUN_WORKFLOW =
  "https://github.com/Nihirdas/cashboard-dashboard/actions/workflows/run.yml";

export const runUrl = (id: string) =>
  `https://github.com/Nihirdas/cashboard-dashboard/actions/runs/${id}`;
