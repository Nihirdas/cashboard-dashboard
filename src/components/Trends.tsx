import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RunRecord } from "../types";

const tooltipStyle = {
  background: "#1b1b1f",
  border: "1px solid #26262c",
  borderRadius: 8,
  fontSize: 12,
  color: "#e8e8ec",
};

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function Trends({ runs }: { runs: RunRecord[] }) {
  const data = runs.map((r) => ({
    label: fmtTime(r.timestamp),
    passRate: r.total ? Math.round((r.passed / r.total) * 100) : 0,
    duration: Math.round(r.durationMs / 100) / 10,
  }));

  return (
    <div className="grid-2">
      <div className="card">
        <p className="chart-title">Pass rate over runs</p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="pr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#26262c" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8b93a1", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#8b93a1", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                unit="%"
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}%`, "pass rate"]}
              />
              <Area
                type="monotone"
                dataKey="passRate"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#pr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <p className="chart-title">Suite duration (s)</p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#26262c" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8b93a1", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={{ fill: "#8b93a1", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={34}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}s`, "duration"]}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
