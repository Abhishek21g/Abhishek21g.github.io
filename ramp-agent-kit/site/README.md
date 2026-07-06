# Site

**Live:** https://enaguthi.com/ramp-agent-kit/site/

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing + interactive onboarding walkthrough |
| `sample-report.html` | Styled ALL_PASS report example |
| `styles.css` | Shared design system |
| `app.js` | Tour tabs + hero animation + copy buttons |

## Deploy

Files live in `Abhishek21g.github.io/public/ramp-agent-kit/site/` (copied on deploy).

```bash
cp site/* /path/to/Abhishek21g.github.io/public/ramp-agent-kit/site/
cd /path/to/Abhishek21g.github.io && git add public/ramp-agent-kit && git commit -m "Update ramp kit site" && git push
```

## Regenerate sample report from kit

```bash
cd ../kit
uv run ramp-kit all scenarios/cli-offline-contracts.yaml \
  --ramp-cli-src ../upstream/ramp-cli --runs-dir ../runs
# Optionally merge report.html styling into sample-report.html
```
