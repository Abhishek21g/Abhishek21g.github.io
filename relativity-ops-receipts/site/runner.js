let currentProfile = "stennis-ship";
let currentReceipt = null;
let stepIndex = 0;
const STEPS = ["plan", "run", "doctor", "report"];
const COMMANDS = {
  plan: (p) => `relops plan --profile examples/${p}.yaml`,
  run: () => `relops run --manifest .relops/manifest.json`,
  doctor: () => `relops doctor --receipt .relops/receipt.json`,
  report: () => `relops report --receipt .relops/receipt.json --json`,
};

async function initRunner() {
  const params = new URLSearchParams(window.location.search);
  currentProfile = params.get("profile") || "stennis-ship";
  const scenarios = await RelOps.loadScenarios();
  renderScenarioPicker(scenarios);
  document.getElementById("profileSelect").value = currentProfile;
  document.getElementById("profileSelect").addEventListener("change", async (e) => {
    currentProfile = e.target.value;
    history.replaceState({}, "", `runner.html?profile=${currentProfile}`);
    await loadScenario();
  });
  document.getElementById("runPipelineBtn").addEventListener("click", runPipeline);
  document.getElementById("downloadBtn").addEventListener("click", () => {
    if (currentReceipt) RelOps.downloadJson(`${currentProfile}-receipt.json`, currentReceipt);
  });
  await loadScenario();
}

function renderScenarioPicker(scenarios) {
  const select = document.getElementById("profileSelect");
  select.innerHTML = scenarios
    .map((s) => `<option value="${s.id}">${s.title}</option>`)
    .join("");
}

async function loadScenario() {
  stepIndex = 0;
  updatePipelineUI();
  currentReceipt = await RelOps.loadReceipt(currentProfile);
  renderMetrics(currentReceipt);
  RelOps.renderDoctorList(document.getElementById("doctorList"), currentReceipt.doctor_findings);
  renderReceiptPreview(currentReceipt);
  renderDag(currentReceipt);
  writeTerminal("Ready. Click Run pipeline or step through plan → run → doctor → report.");
}

function renderMetrics(receipt) {
  const t = receipt.timeline_summary || {};
  const c = receipt.constraints || {};
  document.getElementById("metricSlack").textContent = `${t.critical_path_slack_h ?? 0}h`;
  document.getElementById("metricTransport").textContent = t.makes_transport_window ? "PASS" : "FAIL";
  document.getElementById("metricFindings").textContent = `${c.failed || 0} fail · ${c.warned || 0} warn`;
  document.getElementById("metricGenome").textContent = receipt.genome_chain?.enabled
    ? `${receipt.genome_chain.parts_attested} parts`
    : "off";
}

function renderReceiptPreview(receipt) {
  const preview = {
    profile_id: receipt.profile_id,
    constraints: receipt.constraints,
    timeline_summary: receipt.timeline_summary,
    doctor_findings: receipt.doctor_findings,
    genome_chain: receipt.genome_chain,
  };
  document.getElementById("receiptPreview").textContent = JSON.stringify(preview, null, 2);
}

function renderDag(receipt) {
  const board = document.getElementById("dagBoard");
  const schedule = receipt.schedule || [];
  const findingsByNode = {};
  (receipt.doctor_findings || []).forEach((f) => {
    if (f.node_id) findingsByNode[f.node_id] = f.severity;
  });

  const lanes = [
    ["design_release", "Design release"],
    ["print_job", "Stargate print"],
    ["ndt_gate", "NDT gate"],
    ["flight_release", "Flight release"],
    ["integration", "Integration"],
    ["checkout", "Checkout"],
    ["transport", "Logistics"],
    ["test_stand_prep", "Test stand"],
  ];

  board.innerHTML = lanes
    .map(([type, label]) => {
      const nodes = schedule.filter((s) => s.node_type === type);
      if (!nodes.length) return "";
      return `
        <div class="dag-lane">
          <div class="dag-lane-label">${label}</div>
          <div class="dag-row">
            ${nodes
              .map((n) => {
                const sev = findingsByNode[n.node_id];
                const cls = [
                  "dag-node",
                  n.on_critical_path ? "critical" : "",
                  sev === "FAIL" ? "fail" : sev === "WARN" ? "warn" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return `<div class="${cls}">
                  <strong>${n.node_id}</strong>
                  <span>${n.scheduled_start_h.toFixed(0)}h → ${n.scheduled_end_h.toFixed(0)}h</span>
                </div>`;
              })
              .join("")}
          </div>
        </div>`;
    })
    .join("");
}

function updatePipelineUI() {
  document.querySelectorAll(".pipe-step").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i < stepIndex) el.classList.add("done");
    if (i === stepIndex) el.classList.add("active");
  });
}

function writeTerminal(text) {
  document.getElementById("terminal").textContent = text;
}

async function runPipeline() {
  writeTerminal("");
  for (let i = 0; i < STEPS.length; i++) {
    stepIndex = i;
    updatePipelineUI();
    const cmd = COMMANDS[STEPS[i]](currentProfile);
    await typeLine(`$ ${cmd}`);
    await sleep(350);
  }
  stepIndex = STEPS.length;
  updatePipelineUI();
  await typeLine("✓ receipt written to .relops/receipt.json");
}

async function typeLine(line) {
  const el = document.getElementById("terminal");
  el.textContent += (el.textContent ? "\n" : "") + line;
  await sleep(180);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

document.addEventListener("DOMContentLoaded", initRunner);
