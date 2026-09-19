import type { History, LayerKey } from "../types";

interface Tier {
  key: LayerKey;
  name: string;
  count: number;
  pct: number;
}

export function Pyramid({ layers }: { layers: History["layers"] }) {
  const total =
    layers.unit.count + layers.api.count + layers.contract.count + layers.e2e.count;
  const pct = (n: number) => Math.round((n / total) * 100);

  // Top -> bottom. Contract (the UI<->API wiring) sits just below E2E.
  const tiers: Tier[] = [
    { key: "e2e", name: "E2E", count: layers.e2e.count, pct: pct(layers.e2e.count) },
    {
      key: "contract",
      name: "Contract",
      count: layers.contract.count,
      pct: pct(layers.contract.count),
    },
    { key: "api", name: "API", count: layers.api.count, pct: pct(layers.api.count) },
    { key: "unit", name: "Unit", count: layers.unit.count, pct: pct(layers.unit.count) },
  ];

  // Truncated triangle: four equal bands, linear taper from apex to base.
  const W = 600;
  const H = 300;
  const cx = W / 2;
  const apex = 110;
  const base = 560;
  const gap = 6;
  const bandH = H / tiers.length;
  const widthAt = (y: number) => apex + (base - apex) * (y / H);

  return (
    <div className="card">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="pyramid-svg"
        role="img"
        aria-label={`Test pyramid: ${tiers
          .map((t) => `${t.name} ${t.count}`)
          .join(", ")}`}
      >
        {tiers.map((t, i) => {
          const yTop = i * bandH + (i === 0 ? 0 : gap / 2);
          const yBot = (i + 1) * bandH - (i === tiers.length - 1 ? 0 : gap / 2);
          const wTop = widthAt(yTop);
          const wBot = widthAt(yBot);
          const points = [
            [cx - wTop / 2, yTop],
            [cx + wTop / 2, yTop],
            [cx + wBot / 2, yBot],
            [cx - wBot / 2, yBot],
          ]
            .map((p) => p.join(","))
            .join(" ");
          const cy = (yTop + yBot) / 2;
          return (
            <g key={t.key}>
              <polygon points={points} className={`tri tri-${t.key}`} />
              <text textAnchor="middle">
                <tspan x={cx} y={cy - 6} className="tri-label">
                  {t.name}
                </tspan>
                <tspan x={cx} y={cy + 18} className="tri-num">
                  {t.count} <tspan className="tri-pct">· {t.pct}%</tspan>
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <p className="pyramid-note">
        Wide base of unit tests (Vitest), a substantial API layer (Playwright
        APIRequestContext), a thin contract layer checking the UI↔API wiring, and a thin
        cap of end-to-end tests (Playwright) — {total} automated tests in all.
      </p>
    </div>
  );
}
