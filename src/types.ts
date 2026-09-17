export interface LayerStat {
  count: number;
  passed: number;
  tool: string;
  repo: string;
}

export interface RunRecord {
  id: string;
  timestamp: string;
  trigger: string;
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  durationMs: number;
}

export interface ProductionStatus {
  lastCheck: string;
  passed: number;
  total: number;
  status: string;
}

export type LayerKey = "unit" | "api" | "e2e";

export interface SpecStat {
  spec: string;
  layer: LayerKey;
  tests: number;
  passed: number;
}

export interface History {
  updatedAt: string;
  layers: { unit: LayerStat; api: LayerStat; e2e: LayerStat };
  production: ProductionStatus;
  specs: SpecStat[];
  runs: RunRecord[];
}
