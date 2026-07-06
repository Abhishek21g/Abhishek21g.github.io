# Catalog Ground Truth

**The problem datarepo does not solve:** catalogs are defined in Python and rendered as static sites — but nobody checks whether declared schemas still match what's on disk. When they drift, `datarepo` still "works" by null-filling and casting.

**Live demo:** https://enaguthi.com/catalog-ground-truth/site/

Third-party tool inspired by [neuralinkcorp/datarepo](https://github.com/neuralinkcorp/datarepo). Not affiliated.

## What it catches

| Finding | Why it hurts |
|---------|----------------|
| Column declared but missing in Delta | Silent null-fill in research joins |
| Column in storage but not in catalog | Invisible data — never queried |
| Type mismatch | Wrong casts without anyone noticing |
| Empty partition | Opaque polars errors ([datarepo#41](https://github.com/neuralinkcorp/datarepo/issues/41)) |

## Quick start

```bash
# Seed intentional drift fixtures (local Delta tables)
PYTHONPATH=src python scripts/seed_fixtures.py

# Audit example neural implant catalog
PYTHONPATH=src:../upstream/datarepo/src python audit.py audit examples/neural_implant_catalog.py

# JSON report for CI / dashboard
PYTHONPATH=src:../upstream/datarepo/src python audit.py audit examples/neural_implant_catalog.py -o report.json
```

## Example output

```
catalog-ground-truth: neural_implant_catalog
  tables=4 ok=1 warn=1 error=2

[ERROR] electrode_map
  ! Column 'impedance_ohms' is declared in the catalog but absent from Delta metadata

[ERROR] raw_waveforms
  ! Partition [implant_id=5956, session_date=2024-04-06] has zero files
```

## Tests

```bash
PYTHONPATH=src:../upstream/datarepo/src pytest tests/ -q
```

## Relation to upstream PRs

Independent product. Pairs naturally with schema versioning (#42) and partition batching (#49) but solves a different problem: **trust** in catalog-as-code.
