#!/usr/bin/env python3
"""
Lê allure-results/*-result.json, mescla com dashboard-history.json da publicação anterior
e gera index.html + dashboard-history.json (últimos 10 dias) para GitHub Pages.
Somente biblioteca padrão.
"""
from __future__ import annotations

import argparse
import glob
import html
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path


def _load_previous(path: str | None) -> list[dict]:
    if not path or not os.path.isfile(path):
        return []
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data.get("runs", []) if isinstance(data, dict) else []
    except (json.JSONDecodeError, OSError):
        return []


def _collect_from_allure(results_dir: str) -> tuple[dict[str, int], int]:
    """Retorna contagem por status e duração aproximada da suíte (ms)."""
    counts = {"passed": 0, "failed": 0, "broken": 0, "skipped": 0, "unknown": 0}
    starts: list[int] = []
    stops: list[int] = []

    pattern = os.path.join(results_dir, "*-result.json")
    for fp in glob.glob(pattern):
        try:
            with open(fp, encoding="utf-8") as f:
                row = json.load(f)
        except (json.JSONDecodeError, OSError):
            continue
        st = (row.get("status") or "unknown").lower()
        if st in counts:
            counts[st] += 1
        else:
            counts["unknown"] += 1
        if "start" in row:
            starts.append(int(row["start"]))
        if "stop" in row:
            stops.append(int(row["stop"]))

    duration_ms = 0
    if starts and stops:
        duration_ms = max(stops) - min(starts)

    counts["total"] = sum(
        counts[k] for k in ("passed", "failed", "broken", "skipped", "unknown")
    )
    return counts, duration_ms


def _merge_runs(
    previous: list[dict],
    new_entry: dict,
    *,
    keep_days: int,
) -> list[dict]:
    by_id: dict[str, dict] = {}
    for r in previous:
        rid = str(r.get("run_id", ""))
        if rid:
            by_id[rid] = r
    rid = str(new_entry.get("run_id", ""))
    if rid:
        by_id[rid] = new_entry
    else:
        by_id[f"local-{len(by_id)}"] = new_entry

    cutoff = datetime.now(timezone.utc) - timedelta(days=keep_days)
    merged: list[dict] = []
    for r in by_id.values():
        try:
            ts = datetime.fromisoformat(
                r["recorded_at"].replace("Z", "+00:00")
            )
        except (KeyError, ValueError):
            continue
        if ts >= cutoff:
            merged.append(r)
    merged.sort(key=lambda x: x.get("recorded_at", ""), reverse=True)
    return merged


def _aggregate(runs: list[dict]) -> dict:
    if not runs:
        return {
            "executions": 0,
            "tests_total": 0,
            "tests_passed": 0,
            "avg_pass_rate": None,
            "runs_with_failures": 0,
        }
    tests_total = sum(r.get("stats", {}).get("total", 0) for r in runs)
    tests_passed = sum(r.get("stats", {}).get("passed", 0) for r in runs)
    fails = 0
    for r in runs:
        s = r.get("stats", {})
        if s.get("failed", 0) + s.get("broken", 0) > 0:
            fails += 1
    avg = (tests_passed / tests_total * 100.0) if tests_total else None
    return {
        "executions": len(runs),
        "tests_total": tests_total,
        "tests_passed": tests_passed,
        "avg_pass_rate": round(avg, 1) if avg is not None else None,
        "runs_with_failures": fails,
    }


def _render_html(runs: list[dict], agg: dict, *, allure_path: str) -> str:
    rows = []
    for r in runs:
        s = r.get("stats", {})
        run_url = html.escape(r.get("run_url") or "#", quote=True)
        rid = html.escape(str(r.get("run_id", "")))
        when = html.escape(r.get("recorded_at", "")[:19].replace("T", " "))
        rows.append(
            "<tr>"
            f"<td>{when}</td>"
            f"<td><a href=\"{run_url}\" target=\"_blank\" rel=\"noopener\">#{rid}</a></td>"
            f"<td>{s.get('passed', 0)}</td>"
            f"<td>{s.get('failed', 0)}</td>"
            f"<td>{s.get('broken', 0)}</td>"
            f"<td>{s.get('skipped', 0)}</td>"
            f"<td>{s.get('total', 0)}</td>"
            f"<td>{s.get('duration_ms', 0) // 1000}s</td>"
            "</tr>"
        )

    rate = agg["avg_pass_rate"]
    rate_txt = f"{rate}%" if rate is not None else "—"

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Painel — histórico de execuções</title>
  <style>
    :root {{
      --bg: #0f1419;
      --card: #1a2332;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --ok: #3ecf8e;
      --bad: #f87171;
      --link: #7cb7ff;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      margin: 0; padding: 1.5rem;
      background: var(--bg); color: var(--text);
      line-height: 1.5;
    }}
    h1 {{ font-size: 1.35rem; font-weight: 600; margin: 0 0 0.25rem; }}
    .sub {{ color: var(--muted); font-size: 0.9rem; margin-bottom: 1.25rem; }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }}
    .card {{
      background: var(--card);
      border-radius: 10px;
      padding: 1rem;
    }}
    .card .k {{ font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }}
    .card .v {{ font-size: 1.4rem; font-weight: 600; margin-top: 0.2rem; }}
    .actions {{ margin-bottom: 1rem; }}
    .actions a {{
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--link);
      color: var(--bg);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
    }}
    .actions a:hover {{ filter: brightness(1.08); }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      background: var(--card);
      border-radius: 10px;
      overflow: hidden;
    }}
    th, td {{ padding: 0.65rem 0.75rem; text-align: left; }}
    th {{ background: #243044; color: var(--muted); font-weight: 600; font-size: 0.72rem; text-transform: uppercase; }}
    tr:nth-child(even) {{ background: rgba(0,0,0,0.12); }}
    td a {{ color: var(--link); }}
    .ok {{ color: var(--ok); }}
    .bad {{ color: var(--bad); }}
  </style>
</head>
<body>
  <h1>Painel de execuções</h1>
  <p class="sub">Últimos 10 dias · dados agregados dos JSON do Allure em cada run</p>
  <div class="actions">
    <a href="{html.escape(allure_path, quote=True)}">Abrir relatório Allure desta publicação</a>
  </div>
  <div class="grid">
    <div class="card"><div class="k">Execuções no período</div><div class="v">{agg["executions"]}</div></div>
    <div class="card"><div class="k">Testes executados (soma)</div><div class="v">{agg["tests_total"]}</div></div>
    <div class="card"><div class="k">Taxa média de sucesso</div><div class="v">{html.escape(rate_txt)}</div></div>
    <div class="card"><div class="k">Runs com falha/broken</div><div class="v bad">{agg["runs_with_failures"]}</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Data (UTC)</th><th>Workflow</th><th>Passed</th><th>Failed</th><th>Broken</th><th>Skipped</th><th>Total</th><th>Duração</th>
      </tr>
    </thead>
    <tbody>
      {''.join(rows) if rows else '<tr><td colspan="8">Nenhuma execução no período.</td></tr>'}
    </tbody>
  </table>
</body>
</html>
"""


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--allure-results", default="allure-results")
    p.add_argument("--previous-history", default=None)
    p.add_argument("--out-dir", default="publish-site")
    p.add_argument("--keep-days", type=int, default=10)
    p.add_argument("--allure-href", default="allure/index.html")
    args = p.parse_args()

    run_id = os.environ.get("GITHUB_RUN_ID", "")
    server = os.environ.get("GITHUB_SERVER_URL", "").rstrip("/")
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    run_url = f"{server}/{repo}/actions/runs/{run_id}" if (server and repo and run_id) else ""

    stats, duration_ms = _collect_from_allure(args.allure_results)
    stats = dict(stats)
    stats["duration_ms"] = duration_ms

    recorded_at = datetime.now(timezone.utc).isoformat()
    new_entry = {
        "run_id": run_id or "local",
        "run_url": run_url,
        "recorded_at": recorded_at,
        "stats": stats,
    }

    previous = _load_previous(args.previous_history)
    runs = _merge_runs(previous, new_entry, keep_days=args.keep_days)
    agg = _aggregate(runs)

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)

    history_path = out / "dashboard-history.json"
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump({"runs": runs, "updated_at": recorded_at}, f, indent=2)

    html_out = _render_html(runs, agg, allure_path=args.allure_href)
    with open(out / "index.html", "w", encoding="utf-8") as f:
        f.write(html_out)

    print(f"[build_dashboard] {len(runs)} run(s) nos últimos {args.keep_days} dias → {out}")


if __name__ == "__main__":
    main()
