# Print-to-Launch Ops Receipts

Open **plan → run → doctor → report** workbench for additive manufacturing lifecycle ops — inspired by Relativity Space's public Terrestrial Software / Factory Platform mission. **Not affiliated with Relativity Space.**

Compiles a synthetic Terran-R-style part graph (design → print → NDT → flight release → integration → stage ship) into auditable receipts with critical-path slack and doctor rules.

## Quick start

```bash
pip install -e ".[dev]"
relops plan --profile examples/stennis-ship.yaml
relops run --manifest .relops/manifest.json
relops doctor --receipt .relops/receipt.json
relops report --receipt .relops/receipt.json --json > examples/stennis-ship-receipt.json
```

## Powder-to-Pad compiler mode

```bash
relops plan --profile examples/powder-to-pad-compiler.yaml --compile-genome
relops run --manifest .relops/manifest.json --compile-genome
relops doctor --receipt .relops/receipt.json --strict
```

## Demo

https://enaguthi.com/relativity-ops-receipts/site/

## Labels

All profiles and receipts carry `DEMO`, `NOT_RELATIVITY_OFFICIAL`, and `SYNTHETIC_DAG`. Durations and part counts use public order-of-magnitude only — no proprietary Stargate parameters or ITAR data.

## Tests

```bash
pytest -q
```

## Background

Built by [Abhishek Enaguthi](https://enaguthi.com) — HPC/systems receipt discipline (Tinker Workbench, Starcloud Workbench).
