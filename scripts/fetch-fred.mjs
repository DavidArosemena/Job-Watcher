// Downloads the latest economic data from FRED and saves it to public/macro.json.
// This runs automatically before every build (see "prebuild" in package.json),
// so each deploy ships with fresh numbers. No API key is needed.

import { writeFile, mkdir } from "node:fs/promises";

const OUTPUT_PATH = new URL("../public/macro.json", import.meta.url);

const INDICATORS = {
  unemployment_rate: "UNRATE",
  cpi: "CPIAUCSL",
  federal_funds_rate: "FEDFUNDS",
  labor_force_participation: "CIVPART",
};

const SECTORS = ["PAYEMS", "USCONS", "USPBS"];
const TREND_MONTHS = 6;

async function fetchSeries(id, attempts = 3) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseCsv(await res.text());
    } catch (err) {
      if (i === attempts) throw new Error(`Could not download ${id}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000 * i));
    }
  }
}

// FRED CSVs look like "observation_date,UNRATE" then "2026-08-01,4.3".
// Missing values show up as "." so those rows are skipped.
export function parseCsv(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(",");
      return { date, value: Number(raw) };
    })
    .filter((row) => row.date && Number.isFinite(row.value));
}

export function latestWithChange(rows) {
  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  return {
    value: last.value,
    date: last.date,
    previous: prev ? prev.value : null,
  };
}

export function monthlyGrowth(rows, months) {
  const recent = rows.slice(-(months + 1));
  const points = [];
  for (let i = 1; i < recent.length; i++) {
    const growth = ((recent[i].value - recent[i - 1].value) / recent[i - 1].value) * 100;
    points.push({
      date: recent[i].date,
      month: new Date(`${recent[i].date}T00:00:00Z`).toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      value: Number(growth.toFixed(3)),
    });
  }
  return points;
}

async function main() {
  const indicators = {};
  for (const [key, id] of Object.entries(INDICATORS)) {
    indicators[key] = { series: id, ...latestWithChange(await fetchSeries(id)) };
  }

  const sector_growth = {};
  for (const id of SECTORS) {
    sector_growth[id] = monthlyGrowth(await fetchSeries(id), TREND_MONTHS);
  }

  const data = {
    source: "FRED, Federal Reserve Bank of St. Louis",
    fetched_at: new Date().toISOString(),
    indicators,
    sector_growth,
  };

  await mkdir(new URL("../public/", import.meta.url), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log("Saved real FRED data to public/macro.json");
}

// Only run when called directly, so the helper functions can be tested.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    // Don't break the deploy if FRED is down. The site will show its demo values
    // and clearly label them as demo data.
    console.warn(`Warning: ${err.message}. The site will fall back to demo data.`);
  });
}
