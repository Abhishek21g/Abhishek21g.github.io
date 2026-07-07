/** Browser port of grok_collections_kit mock engine + doctor rules. */
const RECEIPT_VERSION = "1.0";

function runMockScenario(scenario, profile) {
  const steps = [];
  const state = { probes: null, indexing: null, search: null, multimodal_paths: [], documents_uploaded: 0 };

  for (const stepDef of scenario.steps) {
    const action = stepDef.action;
    const optional = Boolean(stepDef.optional);
    const t0 = performance.now();
    const duration = () => Math.round(performance.now() - t0 + 12 + Math.random() * 40);

    try {
      if (action === "probe_channels") {
        state.probes = profile.probes;
        const status = ["healthy", "warn"].includes(profile.probes.overall) ? "ok" : "fail";
        steps.push({ id: stepDef.id || action, action, status, duration_ms: duration(), probes: state.probes });
      } else if (action === "create_collection") {
        steps.push({
          id: stepDef.id || action,
          action,
          status: "ok",
          duration_ms: duration(),
          collection_id: "mock-collection-001",
          embedding_model: stepDef.embedding_model || "grok-embedding-small",
        });
      } else if (action === "upload_documents") {
        const docs = stepDef.documents || [{ name: "doc.txt" }];
        state.documents_uploaded = docs.length;
        steps.push({ id: stepDef.id || action, action, status: "ok", duration_ms: duration(), document_count: docs.length });
      } else if (action === "wait_indexing") {
        state.indexing = profile.indexing;
        const status = profile.indexing.rag_ready || profile.indexing.in_flight ? "ok" : "warn";
        steps.push({ id: stepDef.id || action, action, status, duration_ms: duration(), indexing: state.indexing });
      } else if (action === "search") {
        state.search = profile.search;
        const status = profile.search.status === "ok" ? "ok" : "fail";
        steps.push({ id: stepDef.id || action, action, status, duration_ms: duration(), search: state.search });
      } else if (action === "resolve_multimodal") {
        const paths = profile.multimodal_paths || [];
        state.multimodal_paths = paths;
        const status = paths.length ? "ok" : "warn";
        steps.push({ id: stepDef.id || action, action, status, duration_ms: duration(), image_paths: paths });
      } else if (action === "chat_ready") {
        const ready = Boolean(state.multimodal_paths.length || state.search?.match_count);
        const status = ready || optional ? (ready ? "ok" : "skipped") : "skipped";
        steps.push({ id: stepDef.id || action, action, status, duration_ms: duration(), message: "vision chat inputs validated" });
      } else {
        steps.push({ id: stepDef.id || action, action, status: "fail", duration_ms: duration(), error: `unknown action ${action}` });
      }
    } catch (err) {
      steps.push({ id: stepDef.id || action, action, status: optional ? "skipped" : "fail", duration_ms: duration(), error: String(err) });
    }
  }

  return { steps, state };
}

function finding(severity, code, message, action = null) {
  return { severity, code, message, action };
}

function diagnoseReceipt(manifest, summary, steps) {
  const findings = [];
  const expect = manifest.expect || {};

  for (const step of steps) {
    if (step.status === "fail" && !step.optional) {
      findings.push(finding("error", "step_failed", `Step '${step.id}' (${step.action}) failed.`, "Inspect steps.json error field and SDK logs."));
    }
  }

  const probeStep = steps.find((s) => s.action === "probe_channels");
  if (probeStep?.probes) {
    const probes = probeStep.probes;
    if (!probes.management_key_configured) {
      findings.push(
        finding(
          "critical",
          "missing_management_key",
          "XAI_MANAGEMENT_KEY is not configured — Collections management APIs will fail.",
          "Export XAI_MANAGEMENT_KEY from console.x.ai."
        )
      );
    }
    for (const probe of probes.probes || []) {
      if (probe.status === "fail") {
        findings.push(
          finding(
            "error",
            "channel_probe_fail",
            `${probe.channel} channel check ${probe.check} failed.`,
            probe.error || "Verify API keys and network."
          )
        );
      }
    }
  }

  const waitStep = steps.find((s) => s.action === "wait_indexing");
  if (waitStep?.indexing) {
    const idx = waitStep.indexing;
    if (idx.failed > 0) {
      findings.push(
        finding(
          "error",
          "indexing_failed",
          `${idx.failed} document(s) failed indexing.`,
          "Inspect error_message via get_document; fix and reindex."
        )
      );
    }
    if (idx.in_flight > 0 && idx.processed === 0) {
      findings.push(
        finding(
          "warn",
          "indexing_backlog",
          `${idx.in_flight} document(s) still in the indexing pipeline.`,
          "Use batch_get_documents polling (#77) instead of per-document loops."
        )
      );
    }
    if (!idx.rag_ready && expect.rag_ready) {
      findings.push(
        finding(
          "critical",
          "rag_not_ready",
          "Collection is not RAG-ready — processed count or failures block search.",
          "Wait for indexing or fix failed documents before shipping."
        )
      );
    }
    const stuck = (idx.in_flight_documents || []).filter(
      (d) => d.minutes_since_last_indexed != null && d.minutes_since_last_indexed > 30
    );
    if (stuck.length) {
      findings.push(
        finding(
          "warn",
          "indexing_stuck",
          `${stuck.length} document(s) appear stuck in-flight (>30 min).`,
          "Reindex or check server backlog."
        )
      );
    }
  }

  const searchStep = steps.find((s) => s.action === "search");
  if (searchStep) {
    const search = searchStep.search || {};
    if (search.status === "fail" && expect.search_succeeds !== false) {
      findings.push(
        finding(
          "error",
          "search_smoke_fail",
          "Search step failed — RAG path may be broken.",
          "Verify collection_id, indexing status, and API key scopes."
        )
      );
    }
  }

  const mmStep = steps.find((s) => s.action === "resolve_multimodal");
  if (mmStep && (expect.multimodal_paths_min || 0) > 0) {
    const paths = mmStep.image_paths || [];
    if (paths.length < expect.multimodal_paths_min) {
      findings.push(
        finding(
          "warn",
          "multimodal_path_unresolved",
          "Expected multimodal image paths were not resolved from search results.",
          "Use batch_get_documents + resolve_multimodal_search_results (PR #169 helpers)."
        )
      );
    }
  }

  if (expect.indexing_processed_min != null && waitStep?.indexing) {
    if (waitStep.indexing.processed < expect.indexing_processed_min) {
      findings.push(
        finding(
          "error",
          "expectation_miss",
          `Expected at least ${expect.indexing_processed_min} processed documents.`,
          "Adjust scenario or fix indexing pipeline."
        )
      );
    }
  }

  const severityRank = { critical: 3, error: 2, warn: 1 };
  let overall = "healthy";
  if (findings.length) {
    const top = Math.max(...findings.map((f) => severityRank[f.severity] || 0));
    overall = { 3: "critical", 2: "degraded", 1: "warn" }[top] || "healthy";
  }

  return {
    overall,
    finding_count: findings.length,
    findings,
    scenario: manifest.scenario,
    run_id: manifest.run_id,
  };
}

function evaluateSummary(scenario, steps) {
  const failedSteps = steps.filter((s) => s.status === "fail" && !s.optional);
  let overall = failedSteps.length ? "fail" : "pass";
  const doctor = diagnoseReceipt(
    { scenario: scenario.name, expect: scenario.expect || {} },
    { overall },
    steps
  );
  if (["critical", "degraded"].includes(doctor.overall)) overall = "fail";
  return {
    overall,
    failed_steps: failedSteps.length,
    doctor_overall: doctor.overall,
    finding_count: doctor.finding_count,
  };
}

function renderMarkdown(manifest, summary, steps, findings) {
  const lines = [
    "# Grok Collections Reliability Report",
    "",
    `**Run:** \`${manifest.run_id}\`  `,
    `**Scenario:** ${manifest.scenario}  `,
    `**Mode:** ${manifest.mode}  `,
    `**Profile:** ${manifest.fixture_profile}  `,
    `**Overall:** ${summary.overall} (doctor: ${summary.doctor_overall})  `,
    "",
    "## Scenario",
    "",
    manifest.description,
    "",
    "## Steps",
    "",
    "| Step | Action | Status | Duration |",
    "|------|--------|--------|----------|",
  ];
  for (const step of steps) {
    lines.push(`| ${step.id || ""} | ${step.action} | ${step.status} | ${step.duration_ms ?? "—"} ms |`);
  }
  lines.push("", "## Doctor findings", "");
  if (findings.findings?.length) {
    for (const f of findings.findings) {
      lines.push(`- **${f.severity}** \`${f.code}\` — ${f.message}`);
      if (f.action) lines.push(`  - Action: ${f.action}`);
    }
  } else {
    lines.push("_No findings — pipeline healthy._");
  }
  lines.push("", "## Expectations", "", "```json", JSON.stringify(manifest.expect || {}, null, 2), "```", "", "---", "_Generated by Grok Collections Reliability Kit — not affiliated with xAI._");
  return lines.join("\n");
}

function runReceipt(scenario, profileKey) {
  const profile = scenario.profiles[profileKey];
  const runScenario = { ...scenario, fixture_profile: profileKey };
  const { steps } = runMockScenario(runScenario, profile);
  const summary = evaluateSummary(runScenario, steps);
  const runId = `demo-${profileKey}-${Date.now().toString(36)}`;
  const manifest = {
    receipt_version: RECEIPT_VERSION,
    run_id: runId,
    scenario: scenario.name,
    description: scenario.description,
    mode: "mock",
    fixture_profile: profileKey,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    expect: scenario.expect,
  };
  const findings = diagnoseReceipt(manifest, summary, steps);
  const markdown = renderMarkdown(manifest, summary, steps, findings);
  return { manifest, summary, steps, findings, markdown, profile };
}

window.GrokKitEngine = { runReceipt, diagnoseReceipt, renderMarkdown };
