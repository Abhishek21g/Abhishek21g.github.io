window.BUNDLED = {
  "demo-pass": {
    "summary": {
      "run_id": "demo-pass",
      "passed": true,
      "unsafe_count": 0,
      "run_name": "intellect-2-honest",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "generated_at": "2026-07-09T06:49:35.740904+00:00",
      "links": 1
    },
    "chain": {
      "schema_version": "1.0",
      "generated_at": "2026-07-09T06:49:35.740904+00:00",
      "run_name": "intellect-2-honest",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "passed": true,
      "unsafe_count": 0,
      "links": [
        {
          "link_index": 0,
          "rollout_id": "r-honest-001",
          "worker_id": "worker-paris-07",
          "policy_version_claimed": 1199,
          "trainer_policy_version": 1200,
          "policy_hash_claimed": "sha256:honest-policy-v1200",
          "policy_hash_evidence": "sha256:honest-policy-v1200",
          "trainer_policy_hash": "sha256:honest-policy-v1200",
          "policy_binding_ok": true,
          "version_lag": 1,
          "max_log_ratio": 0.050000000000000044,
          "overflow_token_count": 0,
          "masked_nan_token_count": 0,
          "toploc_attestation": "toploc:consistent-v1199",
          "toploc_status": "consistent",
          "train_safe": true,
          "severity": "info",
          "reasons": [],
          "token_verdicts": [
            {
              "token_id": 101,
              "log_ratio": 0.050000000000000044,
              "ratio": 1.0512710809707642,
              "overflows": false,
              "masked_nan": false
            },
            {
              "token_id": 102,
              "log_ratio": 0.019999999999999907,
              "ratio": 1.020201325416565,
              "overflows": false,
              "masked_nan": false
            }
          ]
        }
      ]
    },
    "report": "# Rollout Receipt Chain \u2014 intellect-2-honest\n\n- **Run ID:** `demo-pass`\n- **Verdict:** **PASS**\n- **Trainer policy:** v1200 `sha256:honest-policy-v1200`\n- **Unsafe rollouts:** 0 / 1\n\n## Chain links\n\n### \u2713 r-honest-001 (worker `worker-paris-07`)\n\n- Policy claimed v1199, lag=1\n- Binding: ok\n- TOPLOC: consistent\n- Overflow tokens: 0\n- Masked NaN tokens: 0\n\n## Context\n\nPrime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.\n"
  },
  "demo-fail": {
    "summary": {
      "run_id": "demo-fail",
      "passed": false,
      "unsafe_count": 1,
      "run_name": "intellect-2-overflow-risk",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "generated_at": "2026-07-09T06:49:35.810973+00:00",
      "links": 1
    },
    "chain": {
      "schema_version": "1.0",
      "generated_at": "2026-07-09T06:49:35.810973+00:00",
      "run_name": "intellect-2-overflow-risk",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "passed": false,
      "unsafe_count": 1,
      "links": [
        {
          "link_index": 0,
          "rollout_id": "r-overflow-001",
          "worker_id": "worker-sf-03",
          "policy_version_claimed": 1199,
          "trainer_policy_version": 1200,
          "policy_hash_claimed": "sha256:honest-policy-v1200",
          "policy_hash_evidence": "sha256:honest-policy-v1200",
          "trainer_policy_hash": "sha256:honest-policy-v1200",
          "policy_binding_ok": true,
          "version_lag": 1,
          "max_log_ratio": 95.0,
          "overflow_token_count": 1,
          "masked_nan_token_count": 1,
          "toploc_attestation": "toploc:consistent-v1199",
          "toploc_status": "consistent",
          "train_safe": false,
          "severity": "error",
          "reasons": [
            "1 token(s) overflow importance ratio without cap",
            "1 masked token(s) still produce NaN"
          ],
          "token_verdicts": [
            {
              "token_id": 401,
              "log_ratio": 95.0,
              "ratio": "inf",
              "overflows": true,
              "masked_nan": true
            },
            {
              "token_id": 402,
              "log_ratio": 1.9,
              "ratio": 6.68589448928833,
              "overflows": false,
              "masked_nan": false
            }
          ]
        }
      ]
    },
    "report": "# Rollout Receipt Chain \u2014 intellect-2-overflow-risk\n\n- **Run ID:** `demo-fail`\n- **Verdict:** **FAIL**\n- **Trainer policy:** v1200 `sha256:honest-policy-v1200`\n- **Unsafe rollouts:** 1 / 1\n\n## Chain links\n\n### \u2717 r-overflow-001 (worker `worker-sf-03`)\n\n- Policy claimed v1199, lag=1\n- Binding: ok\n- TOPLOC: consistent\n- Overflow tokens: 1\n- Masked NaN tokens: 1\n- Reasons:\n  - 1 token(s) overflow importance ratio without cap\n  - 1 masked token(s) still produce NaN\n\n## Context\n\nPrime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.\n"
  },
  "demo-stale": {
    "summary": {
      "run_id": "demo-stale",
      "passed": false,
      "unsafe_count": 1,
      "run_name": "intellect-2-stale-policy",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "generated_at": "2026-07-09T06:48:55.678305+00:00",
      "links": 1
    },
    "chain": {
      "schema_version": "1.0",
      "generated_at": "2026-07-09T06:48:55.678305+00:00",
      "run_name": "intellect-2-stale-policy",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "passed": false,
      "unsafe_count": 1,
      "links": [
        {
          "link_index": 0,
          "rollout_id": "r-stale-001",
          "worker_id": "worker-lagos-12",
          "policy_version_claimed": 1180,
          "trainer_policy_version": 1200,
          "policy_hash_claimed": "sha256:stale-policy-v1180",
          "policy_hash_evidence": "sha256:stale-policy-v1180",
          "trainer_policy_hash": "sha256:honest-policy-v1200",
          "policy_binding_ok": false,
          "version_lag": 20,
          "max_log_ratio": 3.5,
          "overflow_token_count": 0,
          "masked_nan_token_count": 0,
          "toploc_attestation": "toploc:consistent-v1180",
          "toploc_status": "hash_mismatch",
          "train_safe": false,
          "severity": "error",
          "reasons": [
            "policy_hash binding failed (claimed vs evidence vs trainer)",
            "policy version lag 20 exceeds max_off_policy_lag=8",
            "TOPLOC attestation inconsistent with policy binding",
            "rollout stale by 20 trainer steps (async lag)"
          ],
          "token_verdicts": [
            {
              "token_id": 201,
              "log_ratio": 2.5,
              "ratio": 12.182494163513184,
              "overflows": false,
              "masked_nan": false
            },
            {
              "token_id": 202,
              "log_ratio": 3.5,
              "ratio": 33.11545181274414,
              "overflows": false,
              "masked_nan": false
            }
          ]
        }
      ]
    },
    "report": "# Rollout Receipt Chain \u2014 intellect-2-stale-policy\n\n- **Run ID:** `demo-stale`\n- **Verdict:** **FAIL**\n- **Trainer policy:** v1200 `sha256:honest-policy-v1200`\n- **Unsafe rollouts:** 1 / 1\n\n## Chain links\n\n### \u2717 r-stale-001 (worker `worker-lagos-12`)\n\n- Policy claimed v1180, lag=20\n- Binding: FAILED\n- TOPLOC: hash_mismatch\n- Overflow tokens: 0\n- Masked NaN tokens: 0\n- Reasons:\n  - policy_hash binding failed (claimed vs evidence vs trainer)\n  - policy version lag 20 exceeds max_off_policy_lag=8\n  - TOPLOC attestation inconsistent with policy binding\n  - rollout stale by 20 trainer steps (async lag)\n\n## Context\n\nPrime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.\n"
  },
  "demo-malicious": {
    "summary": {
      "run_id": "demo-malicious",
      "passed": false,
      "unsafe_count": 1,
      "run_name": "intellect-2-malicious-claim",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "generated_at": "2026-07-09T06:48:55.747305+00:00",
      "links": 1
    },
    "chain": {
      "schema_version": "1.0",
      "generated_at": "2026-07-09T06:48:55.747305+00:00",
      "run_name": "intellect-2-malicious-claim",
      "trainer_policy_version": 1200,
      "trainer_policy_hash": "sha256:honest-policy-v1200",
      "passed": false,
      "unsafe_count": 1,
      "links": [
        {
          "link_index": 0,
          "rollout_id": "r-malicious-001",
          "worker_id": "worker-unknown-99",
          "policy_version_claimed": 1200,
          "trainer_policy_version": 1200,
          "policy_hash_claimed": "sha256:honest-policy-v1200",
          "policy_hash_evidence": "sha256:actually-ran-v1170",
          "trainer_policy_hash": "sha256:honest-policy-v1200",
          "policy_binding_ok": false,
          "version_lag": 0,
          "max_log_ratio": 0.10000000000000009,
          "overflow_token_count": 0,
          "masked_nan_token_count": 0,
          "toploc_attestation": "toploc:consistent-v1200",
          "toploc_status": "hash_mismatch",
          "train_safe": false,
          "severity": "error",
          "reasons": [
            "policy_hash binding failed (claimed vs evidence vs trainer)",
            "TOPLOC attestation inconsistent with policy binding"
          ],
          "token_verdicts": [
            {
              "token_id": 301,
              "log_ratio": 0.10000000000000009,
              "ratio": 1.1051709651947021,
              "overflows": false,
              "masked_nan": false
            }
          ]
        }
      ]
    },
    "report": "# Rollout Receipt Chain \u2014 intellect-2-malicious-claim\n\n- **Run ID:** `demo-malicious`\n- **Verdict:** **FAIL**\n- **Trainer policy:** v1200 `sha256:honest-policy-v1200`\n- **Unsafe rollouts:** 1 / 1\n\n## Chain links\n\n### \u2717 r-malicious-001 (worker `worker-unknown-99`)\n\n- Policy claimed v1200, lag=0\n- Binding: FAILED\n- TOPLOC: hash_mismatch\n- Overflow tokens: 0\n- Masked NaN tokens: 0\n- Reasons:\n  - policy_hash binding failed (claimed vs evidence vs trainer)\n  - TOPLOC attestation inconsistent with policy binding\n\n## Context\n\nPrime opened rollouts to the world with INTELLECT-2 and TOPLOC. This chain proves what each permissionless worker actually ran before the trainer consumes rollouts.\n"
  }
};
