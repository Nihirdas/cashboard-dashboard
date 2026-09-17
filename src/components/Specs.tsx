import type { SpecStat } from "../types";

export function Specs({ specs }: { specs: SpecStat[] }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Layer</th>
            <th style={{ textAlign: "right" }}>Tests</th>
            <th style={{ textAlign: "right" }}>Passing</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((s, i) => (
            <tr key={`${s.layer}-${s.spec}-${i}`}>
              <td>{s.spec}</td>
              <td>
                <span className={`layer-tag ${s.layer}`}>{s.layer.toUpperCase()}</span>
              </td>
              <td style={{ textAlign: "right" }}>{s.tests}</td>
              <td
                style={{
                  textAlign: "right",
                  color: s.passed === s.tests ? "var(--ok)" : "var(--bad)",
                }}
              >
                {s.passed}/{s.tests}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
