const SCENARIOS = {
  pass: {
    id: "mcp-fs-validation-pass",
    profile: "mcp-atlas",
    scenarioYaml: "scenarios/mcp-fs-validation-pass.yaml",
    hint: "Filesystem MCP pin meets minimum — directory_tree validation passes. Score is trustworthy.",
    verdict: "PASS",
    plain: "All six harness invariants hold. Safe to trust this MCP Atlas eval score.",
    story: [
      { strong: "Pins", text: "filesystem server @2026.7.10 ≥ minimum 2025.12.18 (#34 fix)." },
      { strong: "Env", text: "Docker digest + lock file recorded in receipt." },
      { strong: "Tasks", text: "Per-task artifact paths present — not just aggregate pass rate." },
      { strong: "Verdict", text: "PASS — publish score to leaderboard." },
    ],
    gates: [
      { name: "mcp_server_pins", passed: true, detail: "all 1 pin(s) meet profile minimums" },
      { name: "patch_apply_dry_run", passed: true, detail: "git apply --check passed" },
      { name: "grading_env_fingerprint", passed: true, detail: "manifest + lock + docker digest recorded" },
      { name: "credential_preflight", passed: true, detail: "mock_mode — credentials not required" },
      { name: "receipt_completeness", passed: true, detail: "1 task(s) with artifact paths" },
      { name: "timeout_policy", passed: true, detail: "run 600s within mcp-atlas ceiling 7200s" },
    ],
    card: { tag: "pass", tagLabel: "PASS", title: "Clean harness", desc: "MCP pins + receipts OK.", meta: "6/6 gates" },
  },
  "fail-pin": {
    id: "mcp-fs-validation-fail",
    profile: "mcp-atlas",
    scenarioYaml: "scenarios/mcp-fs-validation-fail.yaml",
    hint: "filesystem @2025.11.25 breaks directory_tree MCP validation — models fail regardless of capability.",
    verdict: "FAIL",
    plain: "MCP server pin gate failed. Install script drifted from template (scaleapi/mcp-atlas#34).",
    story: [
      { strong: "Symptom", text: "directory_tree returns -32602 output validation error." },
      { strong: "Cause", text: "Docker install script still pinned @2025.11.25 while template bumped." },
      { strong: "Impact", text: "Tasks routing through filesystem_directory_tree score 0 for all models." },
      { strong: "Verdict", text: "FAIL — fix harness before comparing leaderboard runs." },
    ],
    gates: [
      { name: "mcp_server_pins", passed: false, detail: "@modelcontextprotocol/server-filesystem: 2025.11.25 < minimum 2025.12.18" },
      { name: "patch_apply_dry_run", passed: true, detail: "git apply --check passed" },
      { name: "grading_env_fingerprint", passed: true, detail: "manifest + lock + docker digest recorded" },
      { name: "credential_preflight", passed: true, detail: "mock_mode — credentials not required" },
      { name: "receipt_completeness", passed: true, detail: "1 task(s) with artifact paths" },
      { name: "timeout_policy", passed: true, detail: "run 900s within mcp-atlas ceiling 7200s" },
    ],
    card: { tag: "fail", tagLabel: "FAIL", title: "Bad MCP pin", desc: "Gate 1 fails — #34 class drift.", meta: "5/6 gates" },
  },
  "fail-receipt": {
    id: "receipt-incomplete",
    profile: "mcp-atlas",
    scenarioYaml: "scenarios/receipt-incomplete.yaml",
    hint: "Only aggregate pass rate recorded — no per-task artifact trail for audit.",
    verdict: "FAIL",
    plain: "Receipt completeness failed. Leaderboard number without task-level artifacts cannot be audited.",
    story: [
      { strong: "Published", text: "mean_coverage: 0.82 — looks fine in Slack." },
      { strong: "Missing", text: "No conversation.jsonl paths per task_id." },
      { strong: "Risk", text: "Cannot reproduce or debug failed tool calls post-hoc." },
      { strong: "Verdict", text: "FAIL gate 5 — require receipt completeness before trusting score." },
    ],
    gates: [
      { name: "mcp_server_pins", passed: true, detail: "all 1 pin(s) meet profile minimums" },
      { name: "patch_apply_dry_run", passed: true, detail: "git apply --check passed" },
      { name: "grading_env_fingerprint", passed: true, detail: "manifest + lock + docker digest recorded" },
      { name: "credential_preflight", passed: true, detail: "mock_mode — credentials not required" },
      { name: "receipt_completeness", passed: false, detail: "only aggregate score recorded — no per-task artifact paths" },
      { name: "timeout_policy", passed: true, detail: "run 300s within mcp-atlas ceiling 7200s" },
    ],
    card: { tag: "fail", tagLabel: "FAIL", title: "Thin receipt", desc: "Gate 5 fails — no audit trail.", meta: "5/6 gates" },
  },
};

const DEFAULT_MODE = "pass";

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

function gateSummary(gates) {
  const pass = gates.filter((g) => g.passed).length;
  return { pass, total: gates.length, fail: gates.length - pass };
}

function buildReceipt(scenario) {
  const { pass, total } = gateSummary(scenario.gates);
  return {
    scenario_id: scenario.id,
    harness_profile: scenario.profile,
    evaluated_at: new Date().toISOString(),
    passed: pass === total,
    gates: scenario.gates,
    overall: pass === total ? "PASS" : "FAIL",
  };
}

function renderScenario(mode) {
  const scenario = SCENARIOS[mode];
  if (!scenario) return;
  const { pass, total, fail } = gateSummary(scenario.gates);
  const pct = Math.round((pass / total) * 100);

  $("#scenarioHint").textContent = scenario.hint;
  $("#verdictWord").textContent = scenario.verdict;
  $("#verdictWord").className = "verdict-word " + (scenario.verdict === "PASS" ? "pass" : "fail");
  $("#verdictPlain").textContent = scenario.plain;
  $("#passRate").textContent = `${pass}/${total}`;
  $("#passBar").style.width = pct + "%";
  $("#instanceMeta").textContent = `${scenario.id} · ${scenario.profile}`;
  $("#countPass").textContent = pass;
  $("#countFail").textContent = fail;

  const list = $("#gateList");
  list.innerHTML = scenario.gates
    .map(
      (g) =>
        `<li class="gate-item ${g.passed ? "pass" : "fail"}"><span class="gate-name">${g.name}</span><span class="gate-status">${g.passed ? "PASS" : "FAIL"}</span><span class="gate-detail">${g.detail}</span></li>`
    )
    .join("");

  const steps = $("#storySteps");
  steps.innerHTML = scenario.story
    .map((s) => `<li><strong>${s.strong}</strong> ${s.text}</li>`)
    .join("");

  const receipt = buildReceipt(scenario);
  $("#receiptPre").textContent = JSON.stringify(receipt, null, 2);

  $("#cliRun").textContent = `scale-eval-preflight run --mock --scenario ${scenario.scenarioYaml}`;
  $("#cliDoctor").textContent = `scale-eval-preflight doctor --receipt out/receipts/${scenario.id}/ --profile profiles/${scenario.profile}.yaml --json`;
  $("#cliReport").textContent = `scale-eval-preflight report --receipt out/receipts/${scenario.id}/ --html report.html`;

  $all(".mode-tabs button").forEach((btn) => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  const grid = $("#scenarioGrid");
  grid.innerHTML = Object.entries(SCENARIOS)
    .map(([key, s]) => {
      const c = s.card;
      return `<button type="button" class="scenario-card ${c.tag}" data-mode="${key}"><span class="card-tag">${c.tagLabel}</span><h3>${c.title}</h3><p>${c.desc}</p><span class="card-meta">${c.meta}</span></button>`;
    })
    .join("");
  grid.querySelectorAll("[data-mode]").forEach((el) => {
    el.addEventListener("click", () => renderScenario(el.dataset.mode));
  });
}

function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("scale-preflight-theme");
  if (stored === "light") root.dataset.theme = "light";
  $("#themeToggle")?.addEventListener("click", () => {
    const light = root.dataset.theme === "light";
    root.dataset.theme = light ? "" : "light";
    localStorage.setItem("scale-preflight-theme", light ? "dark" : "light");
    $("#themeToggle").textContent = light ? "☀" : "☾";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderScenario(DEFAULT_MODE);
  $all(".mode-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => renderScenario(btn.dataset.mode));
  });
  $("#copyReceipt")?.addEventListener("click", () => {
    navigator.clipboard.writeText($("#receiptPre").textContent);
    $("#copyReceipt").textContent = "Copied";
    setTimeout(() => { $("#copyReceipt").textContent = "Copy"; }, 1500);
  });
});
