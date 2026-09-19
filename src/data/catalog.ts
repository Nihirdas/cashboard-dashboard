// The test-case catalog — authored from the real test titles in the suites, so
// it reflects exactly what is automated. Grouped by layer (UI / Contract / API / Unit).

export type CatalogKey = "ui" | "contract" | "api" | "unit";

export interface TestEntry {
  name: string;
  desc: string;
  cases?: number; // parameterized count, when a single title covers several
}

export interface SpecGroup {
  spec: string;
  subject: string;
  tests: TestEntry[];
}

export interface CatalogLayer {
  key: CatalogKey;
  label: string;
  tool: string;
  where: string;
  blurb: string;
  groups: SpecGroup[];
}

export const catalog: CatalogLayer[] = [
  {
    key: "ui",
    label: "UI / E2E",
    tool: "Playwright Test (Chromium)",
    where: "cashboard-qa · tests/e2e",
    blurb: "A thin cap of real browser journeys — only the flows that matter end-to-end.",
    groups: [
      {
        spec: "projections.spec.ts",
        subject: "The projections calculator",
        tests: [
          {
            name: "renders API-driven cards and the chart",
            desc: "Loads /projections and asserts the three stat cards and the growth chart are visible.",
          },
          {
            name: "requests /api/projections with the current assumptions",
            desc: "Confirms the page really calls the API, passing the slider values as query params (start, years, return).",
          },
          {
            name: "return slider drives projected net worth and growth",
            desc: "At 0% growth is €0; raising the return to 12% increases the projected total.",
          },
          {
            name: "zero monthly contribution: total put in equals the starting value",
            desc: "With nothing added monthly, 'total put in' equals the starting net worth the app uses.",
          },
        ],
      },
      {
        spec: "navigation.spec.ts",
        subject: "Navigation & responsiveness",
        tests: [
          {
            name: "sidebar navigates to each page",
            desc: "Clicks the sidebar link for every page (Overview, Accounts, Transactions, Portfolio, Projections) and checks the heading.",
            cases: 5,
          },
          {
            name: "renders on a mobile viewport",
            desc: "Projections renders correctly at a 375px phone width.",
          },
        ],
      },
    ],
  },
  {
    key: "contract",
    label: "Contract",
    tool: "Playwright Test (Chromium)",
    where: "cashboard-qa · tests/contract",
    blurb:
      "The wiring between the calculator UI and its API — that the on-screen assumptions reach /api/projections under the right names, and the response lands back in the right cards.",
    groups: [
      {
        spec: "projections.spec.ts",
        subject: "Projections UI ↔ API contract",
        tests: [
          {
            name: "on-screen assumptions map exactly into the /api/projections request",
            desc: "Sets the sliders, captures the fired request and asserts exactly the five params (start, monthly, return, years, startYear), each equal to the value shown on its slider — nothing renamed, dropped or added.",
          },
          {
            name: "the API response summary maps back into the rendered cards",
            desc: "The response summary lands in the right cards: total → Projected net worth, contributed → Total you put in, growth → Growth from returns.",
          },
          {
            name: "changing an assumption re-fetches and re-renders the same round-trip",
            desc: "Moving the return slider rides the new value into a fresh request and the cards follow that response — the whole round-trip re-runs.",
          },
        ],
      },
    ],
  },
  {
    key: "api",
    label: "API",
    tool: "Playwright APIRequestContext",
    where: "cashboard-qa · tests/api",
    blurb:
      "The broad black-box middle — every JSON endpoint over real HTTP: status, shape, validation, filters, and cross-endpoint consistency.",
    groups: [
      {
        spec: "projections.spec.ts",
        subject: "GET /api/projections",
        tests: [
          {
            name: "returns a default projection with a coherent summary",
            desc: "200 with a points series; summary.growth equals total − contributed and finalYear matches the last point.",
          },
          {
            name: "golden scenarios",
            desc: "Locked exact outputs — e.g. 10k at 12%/yr for a year = 11,268; 0% return = pure contributions.",
            cases: 2,
          },
          {
            name: "points are integer-rounded and years increment by one",
            desc: "Every projected point is a whole number and the year labels step by one.",
          },
          {
            name: "400 on invalid params",
            desc: "Rejects non-numeric, fractional or out-of-range inputs (years=0/101, return=200, start=-1) with a clear error.",
            cases: 6,
          },
          {
            name: "accepts boundary params",
            desc: "The exact edges of the accepted range (years=1/100, return=±100, monthly=0) return 200.",
            cases: 5,
          },
        ],
      },
      {
        spec: "summary.spec.ts",
        subject: "GET /api/summary",
        tests: [
          {
            name: "returns the overview tiles as numbers",
            desc: "Net worth, cash, investments, P/L, spend and income are all present and numeric.",
          },
          {
            name: "net worth agrees with /api/net-worth",
            desc: "The summary's net worth matches the dedicated net-worth endpoint (cross-endpoint consistency).",
          },
        ],
      },
      {
        spec: "accounts.spec.ts",
        subject: "GET /api/accounts",
        tests: [
          {
            name: "returns accounts with totals derived from their balances",
            desc: "The bank / cash / debt totals recompute correctly from the account list.",
          },
          {
            name: "each account is well-formed",
            desc: "Every account has an id, a numeric balance and an ISO-4217 currency code.",
          },
        ],
      },
      {
        spec: "portfolio.spec.ts",
        subject: "GET /api/portfolio",
        tests: [
          {
            name: "each position carries P/L derived from price and quantity",
            desc: "Per-position market value and P/L equal quantity × price and quantity × (last − avg).",
          },
          {
            name: "totals include brokerage cash",
            desc: "Portfolio value and P/L totals fold in the uninvested cash.",
          },
        ],
      },
      {
        spec: "net-worth.spec.ts",
        subject: "GET /api/net-worth",
        tests: [
          {
            name: "history is monthly, chronological and numeric",
            desc: "Every point is first-of-month, ascending in date, with a numeric net worth.",
          },
        ],
      },
      {
        spec: "transactions.spec.ts",
        subject: "GET /api/transactions",
        tests: [
          {
            name: "returns transactions with a matching count",
            desc: "The reported count equals the number of transactions returned.",
          },
          {
            name: "filters by category",
            desc: "?category=Groceries returns only Groceries transactions.",
          },
          {
            name: "rejects a malformed month with 400",
            desc: "?month=nope is rejected with a format error.",
          },
        ],
      },
      {
        spec: "health.spec.ts",
        subject: "GET /api/health",
        tests: [
          {
            name: "returns ok with a valid timestamp",
            desc: "200 with {status: ok} and a parseable asOf timestamp.",
          },
          {
            name: "rejects an unsupported method with 405",
            desc: "POST /api/health returns 405 Method Not Allowed.",
          },
        ],
      },
    ],
  },
  {
    key: "unit",
    label: "Unit",
    tool: "Vitest",
    where: "cashboard · src/lib",
    blurb:
      "The wide base — the finance maths in isolation, fast and exhaustive: golden values plus edge cases.",
    groups: [
      {
        spec: "projections.test.ts",
        subject: "project() — compound-growth calculator",
        tests: [
          {
            name: "returns one point per year plus year zero",
            desc: "A 20-year projection yields 21 points.",
          },
          {
            name: "labels years running from startYear",
            desc: "Year labels increment from the given start year.",
          },
          {
            name: "year zero is the starting value",
            desc: "The first point equals the starting amount, untouched.",
          },
          {
            name: "compounds monthly (golden value)",
            desc: "10k at 12%/yr for one year, no contributions = 11,268 (10k × 1.01^12).",
          },
          {
            name: "0% return: total always equals what was put in",
            desc: "With no growth, the projected total equals contributions at every point.",
          },
          {
            name: "no contributions: contributed stays flat while growth accrues",
            desc: "With nothing added, contributions stay constant and the total grows above the start.",
          },
          {
            name: "monotonic and integer-rounded for non-negative inputs",
            desc: "Totals never decrease and every point is a whole number.",
          },
          {
            name: "handles a negative return",
            desc: "A negative return shrinks the balance below what was contributed, and stays finite.",
          },
          {
            name: "stays finite over a long horizon",
            desc: "A 100-year projection produces no NaN or Infinity.",
          },
        ],
      },
      {
        spec: "projections.test.ts",
        subject: "parseProjectionQuery() — the /api/projections validator",
        tests: [
          {
            name: "applies defaults for an empty query",
            desc: "Missing params fall back to sensible defaults; startYear defaults to the current year.",
          },
          {
            name: "parses a full valid query",
            desc: "A complete query maps to the right typed input.",
          },
          {
            name: "treats blank params as absent",
            desc: "Empty strings fall back to defaults rather than erroring.",
          },
          {
            name: "rejects a non-numeric value",
            desc: "return=abc is rejected with a clear message.",
          },
          {
            name: "rejects a fractional year count",
            desc: "years=1.5 must be a whole number.",
          },
          {
            name: "rejects out-of-range params",
            desc: "Values outside the allowed bounds are rejected, naming the offending field.",
            cases: 5,
          },
          {
            name: "accepts boundary params",
            desc: "The exact min/max of each range is accepted.",
            cases: 5,
          },
        ],
      },
      {
        spec: "projections.test.ts",
        subject: "projectionResult() — the API payload builder",
        tests: [
          {
            name: "summarises the final point",
            desc: "The summary's total / contributed / growth / finalYear match the last projected point.",
          },
        ],
      },
      {
        spec: "finance.test.ts",
        subject: "Portfolio & position maths",
        tests: [
          {
            name: "market value, P/L and P/L%",
            desc: "Market value, profit and percentage return compute from quantity, average and last price.",
          },
          {
            name: "guards against a zero cost basis",
            desc: "A zero-cost position returns 0% rather than dividing by zero.",
          },
          {
            name: "value, cost and P/L include brokerage cash",
            desc: "Portfolio totals fold in the uninvested cash balance.",
          },
        ],
      },
      {
        spec: "finance.test.ts",
        subject: "Account totals",
        tests: [
          {
            name: "cash is current + savings only",
            desc: "Cash total counts current and savings accounts, not credit or investment.",
          },
          {
            name: "bank total is every balance, debt included",
            desc: "The bank total sums all balances, including negative credit-card debt.",
          },
          {
            name: "debt total is negative balances only",
            desc: "Debt is the sum of the negative balances.",
          },
        ],
      },
      {
        spec: "finance.test.ts",
        subject: "Assets & net worth",
        tests: [
          {
            name: "equity is value minus liability",
            desc: "Asset equity subtracts any secured loan (e.g. a mortgage) from the value.",
          },
          {
            name: "net worth combines bank, portfolio and asset equity",
            desc: "Net worth sums bank balances, portfolio value and asset equity.",
          },
          {
            name: "net worth defaults assets to none",
            desc: "Called without assets, net worth is just bank + portfolio.",
          },
        ],
      },
      {
        spec: "finance.test.ts",
        subject: "Monthly spend & income (fixed clock)",
        tests: [
          {
            name: "spend excludes income, transfers, positives and other months",
            desc: "Only this month's outgoing, spendable transactions count toward spend.",
          },
          {
            name: "income counts only this month's income",
            desc: "Income aggregates only the current month's Income category.",
          },
          {
            name: "spend by category is grouped and sorted, biggest first",
            desc: "Spending groups by category and sorts largest-first.",
          },
          {
            name: "an empty feed yields no spend",
            desc: "No transactions means zero spend and an empty breakdown.",
          },
        ],
      },
      {
        spec: "format.test.ts",
        subject: "Currency, percent & date formatting",
        tests: [
          {
            name: "formats EUR with no decimals by default",
            desc: "1,000 → €1,000 in the en-IE locale.",
          },
          {
            name: "honours a decimal count",
            desc: "Two-decimal formatting renders €1,234.50.",
          },
          {
            name: "accepts other currencies",
            desc: "A currency code other than EUR is honoured.",
          },
          {
            name: "prefixes a plus for positive amounts",
            desc: "+€1,200 for gains.",
          },
          {
            name: "uses a real minus sign (U+2212) for negatives",
            desc: "Negative amounts use the typographic minus, not an ASCII hyphen.",
          },
          {
            name: "shows no sign for zero",
            desc: "Zero renders €0 with no sign.",
          },
          {
            name: "scales a fraction to a signed percentage",
            desc: "0.1234 → +12.3%, with the same real-minus rule.",
          },
          {
            name: "formats a date as 'DD Mon YYYY'",
            desc: "Dates render as e.g. 15 Jun 2026.",
          },
          {
            name: "formats a month as 'Mon YY'",
            desc: "Months render as e.g. Jun 26.",
          },
        ],
      },
    ],
  },
];
