import type { History, LayerKey } from "../types";

const ORDER: { key: LayerKey; name: string }[] = [
  { key: "e2e", name: "E2E" },
  { key: "api", name: "API" },
  { key: "unit", name: "Unit" },
];

export function Pyramid({ layers }: { layers: History["layers"] }) {
  const max = Math.max(layers.unit.count, layers.api.count, layers.e2e.count);
  const total = layers.unit.count + layers.api.count + layers.e2e.count;

  return (
    <div className="card">
      <div className="pyramid">
        {ORDER.map(({ key, name }) => {
          const layer = layers[key];
          const width = 42 + (layer.count / max) * 58; // 42%..100% by count
          return (
            <div
              key={key}
              className={`tier ${key}`}
              style={{ width: `${width}%` }}
              title={`${layer.count} ${name} tests · ${layer.tool}`}
            >
              <span className="tier-name">{name}</span>
              <span className="tier-count">{layer.count}</span>
            </div>
          );
        })}
      </div>
      <p className="pyramid-note">
        Wide base of unit tests (Vitest), a substantial API layer (Playwright
        APIRequestContext), a thin cap of end-to-end tests (Playwright) — {total}{" "}
        automated tests in all.
      </p>
    </div>
  );
}
