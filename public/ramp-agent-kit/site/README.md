# Site deployment

Static files for **enaguthiabhishek.com/ramp-agent-kit/** (or any static host).

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Landing + embedded sample report |
| `sample-report.html` | Generated from offline contract run (`ALL_PASS`) |

## Regenerate sample report

```bash
cd ../kit
uv run ramp-kit all scenarios/cli-offline-contracts.yaml \
  --ramp-cli-src ../upstream/ramp-cli \
  --runs-dir ../runs
cp ../runs/*/report.html ../site/sample-report.html
```

## Deploy (example: GitHub Pages / any static host)

```bash
# rsync to your web root
rsync -av site/ user@host:~/public_html/ramp-agent-kit/
```

No build step required.
