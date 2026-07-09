# Rollout Receipt Chain — intellect-2-malicious-claim

- **Run ID:** `demo-malicious`
- **Verdict:** **FAIL**
- **Trainer policy:** v1200 `sha256:honest-policy-v1200`
- **Unsafe rollouts:** 1 / 1

## Chain links

### ✗ r-malicious-001 (worker `worker-unknown-99`)

- Policy claimed v1200, lag=0
- Binding: FAILED
- TOPLOC: hash_mismatch
- Overflow tokens: 0
- Masked NaN tokens: 0
- Reasons:
  - policy_hash binding failed (claimed vs evidence vs trainer)
  - TOPLOC attestation inconsistent with policy binding

## Context

Prime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.
