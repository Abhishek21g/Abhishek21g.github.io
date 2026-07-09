# Rollout Receipt Chain — intellect-2-overflow-risk

- **Run ID:** `demo-fail`
- **Verdict:** **FAIL**
- **Trainer policy:** v1200 `sha256:honest-policy-v1200`
- **Unsafe rollouts:** 1 / 1

## Chain links

### ✗ r-overflow-001 (worker `worker-sf-03`)

- Policy claimed v1199, lag=1
- Binding: ok
- TOPLOC: consistent
- Overflow tokens: 1
- Masked NaN tokens: 1
- Reasons:
  - 1 token(s) overflow importance ratio without cap
  - 1 masked token(s) still produce NaN

## Context

Prime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.
