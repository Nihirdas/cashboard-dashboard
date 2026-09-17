import { useState } from "react";
import { catalog, type CatalogKey } from "../data/catalog";

export function TestCases() {
  const [key, setKey] = useState<CatalogKey>("ui");
  const active = catalog.find((c) => c.key === key)!;

  return (
    <>
      <div className="subtabs">
        {catalog.map((c) => {
          const n = c.groups.reduce(
            (s, g) => s + g.tests.reduce((a, t) => a + (t.cases ?? 1), 0),
            0,
          );
          return (
            <button
              key={c.key}
              className={`subtab ${key === c.key ? "active" : ""}`}
              onClick={() => setKey(c.key)}
            >
              {c.label}
              <span className="subtab-count">{n}</span>
            </button>
          );
        })}
      </div>

      <p className="muted small layer-blurb">
        {active.blurb}{" "}
        <span className="dim">
          · {active.tool} · {active.where}
        </span>
      </p>

      {active.groups.map((g, i) => (
        <div className="card catalog-group" key={`${g.spec}-${i}`}>
          <div className="catalog-head">
            <span className="catalog-subject">{g.subject}</span>
            <span className="catalog-spec">{g.spec}</span>
          </div>
          <ul className="catalog-list">
            {g.tests.map((t, j) => (
              <li key={j}>
                <div className="catalog-name">
                  {t.name}
                  {t.cases ? <span className="cases-badge">{t.cases} cases</span> : null}
                </div>
                <div className="catalog-desc">{t.desc}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
