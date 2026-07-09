# Rollout Receipt Chain — intellect-2-stale-policy

- **Run ID:** `demo-stale`
- **Verdict:** **FAIL**
- **Trainer policy:** v1200 `sha256:honest-policy-v1200`
- **Unsafe rollouts:** 1 / 1

## Chain links

### ✗ r-stale-001 (worker `worker-lagos-12`)

- Policy claimed v1180, lag=20
- Binding: FAILED
- TOPLOC: hash_mismatch
- Overflow tokens: 0
- Masked NaN tokens: 0
- Reasons:
  - policy_hash binding failed (claimed vs evidence vs trainer)
  - policy version lag 20 exceeds max_off_policy_lag=8
  - TOPLOC attestation inconsistent with policy binding
  - rollout stale by 20 trainer steps (async lag)

## Context

Prime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.
