# Neural Data Catalog Workbench

**Plan → run → doctor → report** for [datarepo](https://github.com/neuralinkcorp/datarepo)-style neural data catalogs.

Researchers define tables in Python and ship static catalog sites — but nothing preflights whether declared schemas, partition keys, and URIs still match Delta storage before a notebook or pipeline runs. Silent `_normalize_df` null-fills make drift look like success.

This workbench is the **product track** (catalog trust). It is independent of upstream PRs [#54](https://github.com/neuralinkcorp/datarepo/pull/54) / [#55](https://github.com/neuralinkcorp/datarepo/pull/55).

**Live demo:** https://enaguthi.com/neural-catalog-workbench/site/

## Quick start

```bash
git clone https://github.com/Abhishek21g/neural-catalog-workbench
cd neural-catalog-workbench
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pip install -e ../upstream/datarepo   # or: pip install -e ".[datarepo]"

neural-catalog plan examples/query_spike_bins.yaml
neural-catalog run examples/query_electrode_map.yaml --mock
neural-catalog doctor examples/query_electrode_map.yaml --mock
neural-catalog report out/receipts/latest/
```

Receipts land in `out/receipts/<run-id>/` with `manifest.json`, `plan.json`, `summary.json`, and `receipt.json`.

## CLI

| Command | Purpose |
|---------|---------|
| `plan` | Preflight: schema audit, partition file count, memory estimate, risks |
| `run` | Execute partition query against bundled Delta fixtures (`--mock`) |
| `doctor` | Diagnose query spec or completed receipt |
| `report` | Markdown + JSON receipt export |

## Bundled scenarios

| Query | What it demonstrates |
|-------|---------------------|
| `query_spike_bins.yaml` | Healthy catalog ↔ storage alignment |
| `query_electrode_map.yaml` | Declared column missing in Delta (silent null-fill) |
| `query_empty_partition.yaml` | Zero-file partition (datarepo#41 pain) |

## Tests

```bash
pytest   # 27 tests
```

## Problem canvas

See `../agent/COMPANY_PROBLEM_CANVAS.md` in the Neuralink workspace for research citations and PR ≠ product thesis.

## License

MIT
