# Neural Data Partition Doctor

Validate partition fetch plans, estimate peak memory, and recommend batching for large neural datasets — built alongside [neuralinkcorp/datarepo](https://github.com/neuralinkcorp/datarepo) partition reads.

**Not affiliated with Neuralink.** Third-party tooling inspired by their open data catalog.

**Live demo:** https://enaguthi.com/neuralink-data-doctor/site/

**Upstream PRs:** [#54](https://github.com/neuralinkcorp/datarepo/pull/54) (schema versioning, #42) · [#55](https://github.com/neuralinkcorp/datarepo/pull/55) (partition batching, #49)

## CLI

```bash
python3 partition_doctor.py plan examples/small_partition.json
python3 partition_doctor.py doctor examples/large_many_files.json
python3 partition_doctor.py report examples/small_partition.json -o report.json
python3 partition_doctor.py codegen examples/large_many_files.json
python3 partition_doctor.py promote examples/large_many_files.json
```

### Commands

| Command | Purpose |
|---------|---------|
| `plan` | JSON partition plan (files, rows, memory, batching) |
| `doctor` | Human-readable health check; exit 1 with `--strict` on warnings |
| `report` | Machine-readable receipt JSON for CI / dashboards |
| `codegen` | Print ready-to-paste `fetch_df_by_partition(...)` call |
| `promote` | Outreach blurb linking PRs + demo |

### Manifest format

```json
{
  "partition": {"implant_id": 5956, "date": "2024-04-05"},
  "schema": {"implant_id": "int64", "date": "string", "value": "float32"},
  "files": [
    {"path": "implant_id=5956/date=2024-04-05/part-000.parquet", "num_rows": 50000}
  ]
}
```

## Tests

```bash
python3 -m pytest test_partition_doctor.py -q
# or without pytest:
python3 -c "import test_partition_doctor as t; t.test_plan_small_partition(); t.test_plan_large_file_count_recommends_batching(); t.test_cli_doctor_ok(); print('ok')"
```

## License

Apache-2.0
