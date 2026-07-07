let scenario = null;
let activeProfile = "healthy";
let lastReceipt = null;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function logTerminal(line, cls = "") {
  const el = document.getElementById("terminal-log");
  if (!el) return;
  const row = document.createElement("div");
  row.className = `terminal-line ${cls}`;
  row.textContent = line;
  el.appendChild(row);
  el.scrollTop = el.scrollHeight;
}

function clearTerminal() {
  const el = document.getElementById("terminal-log");
  if (el) el.innerHTML = "";
}

function statusBadge(status) {
  const cls = { ok: "ok", pass: "pass", fail: "fail", warn: "warn", skipped: "skipped" }[status] || "";
  return `<span class="badge ${cls}">${status}</span>`;
}

function stepDetail(step) {
  if (step.indexing) return `${step.indexing.processed} processed · ${step.indexing.failed} failed`;
  if (step.search) return `${step.search.match_count} matches`;
  if (step.probes) return step.probes.overall;
  if (step.image_paths) return `${step.image_paths.length} image path(s)`;
  if (step.document_count != null) return `${step.document_count} doc(s)`;
  if (step.message) return step.message;
  if (step.error) return step.error;
  return "—";
}

function renderPipeline(indexStep) {
  const idx = indexStep?.indexing;
  const bar = document.getElementById("pipeline-bar");
  const ragLabel = document.getElementById("rag-ready-label");
  if (!idx) {
    document.getElementById("st-processed").textContent = "—";
    document.getElementById("st-failed").textContent = "—";
    document.getElementById("st-inflight").textContent = "—";
    document.getElementById("st-ratio").textContent = "—";
    ragLabel.textContent = "RAG ready: —";
    bar.innerHTML = "";
    return;
  }
  document.getElementById("st-processed").textContent = idx.processed;
  document.getElementById("st-failed").textContent = idx.failed;
  document.getElementById("st-inflight").textContent = idx.in_flight;
  document.getElementById("st-ratio").textContent = `${Math.round((idx.rag_ready_ratio || 0) * 100)}%`;
  ragLabel.textContent = `RAG ready: ${idx.rag_ready ? "yes" : "no"}`;
  const total = Math.max(idx.total_sampled || 1, idx.processed + idx.failed + idx.in_flight);
  const pW = (idx.processed / total) * 100;
  const fW = (idx.failed / total) * 100;
  const iW = (idx.in_flight / total) * 100;
  bar.innerHTML = `
    <div class="seg-processed" style="width:${pW}%"></div>
    <div class="seg-failed" style="width:${fW}%"></div>
    <div class="seg-inflight" style="width:${iW}%"></div>
  `;
}

function renderFindings(findings) {
  const list = document.getElementById("findings-list");
  const count = document.getElementById("findings-count");
  count.textContent = `${findings.finding_count} finding${findings.finding_count === 1 ? "" : "s"}`;
  if (!findings.findings?.length) {
    list.innerHTML = `<p class="findings-empty">No doctor findings — pipeline healthy.</p>`;
    return;
  }
  list.innerHTML = findings.findings
    .map(
      (f) => `
      <div class="finding-item ${f.severity}">
        <strong>${f.code}</strong> — ${f.message}
        ${f.action ? `<span class="finding-action">→ ${f.action}</span>` : ""}
      </div>`
    )
    .join("");
}

function renderReceipt(receipt) {
  const { manifest, summary, steps, findings, markdown } = receipt;
  lastReceipt = receipt;

  const pulse = document.getElementById("status-pulse");
  const statusLabel = document.getElementById("status-label");
  pulse.className = "pulse";
  if (summary.overall === "pass") {
    statusLabel.textContent = "contract passed";
  } else {
    pulse.classList.add(summary.doctor_overall === "warn" ? "warn" : "fail");
    statusLabel.textContent = `contract failed · doctor ${findings.overall}`;
  }

  document.getElementById("demo-meta").textContent =
    `${manifest.scenario} · profile ${manifest.fixture_profile} · compiled just now`;
  document.getElementById("demo-run-meta").textContent = manifest.run_id;

  const totalMs = steps.reduce((s, st) => s + (st.duration_ms || 0), 0);
  document.getElementById("summary-cards").innerHTML = `
    <div class="card"><div class="label">Overall</div><div class="value">${summary.overall}</div></div>
    <div class="card"><div class="label">Doctor</div><div class="value">${findings.overall}</div></div>
    <div class="card"><div class="label">Steps</div><div class="value">${steps.length}</div></div>
    <div class="card"><div class="label">Findings</div><div class="value">${findings.finding_count}</div></div>
    <div class="card"><div class="label">Duration</div><div class="value">${Math.round(totalMs)} ms</div></div>
  `;

  const indexStep = steps.find((s) => s.action === "wait_indexing");
  renderPipeline(indexStep);

  const tbody = document.getElementById("step-rows");
  tbody.innerHTML = steps
    .map(
      (s, i) => `
    <tr data-idx="${i}">
      <td><code>${s.id}</code></td>
      <td>${s.action}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${s.duration_ms ?? "—"} ms</td>
      <td class="detail-cell" title="${stepDetail(s)}">${stepDetail(s)}</td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      tbody.querySelectorAll("tr").forEach((r) => r.classList.remove("selected"));
      row.classList.add("selected");
      showStepDetail(Number(row.dataset.idx));
    });
  });

  renderFindings(findings);

  document.getElementById("summary-view").textContent = JSON.stringify(summary, null, 2);
  document.getElementById("steps-view").textContent = JSON.stringify(steps, null, 2);
  document.getElementById("findings-view").textContent = JSON.stringify(findings, null, 2);
  document.getElementById("markdown-view").textContent = markdown;
  showView("summary");
}

function showStepDetail(idx) {
  if (!lastReceipt) return;
  document.getElementById("detail-view").textContent = JSON.stringify(lastReceipt.steps[idx], null, 2);
  showView("detail");
}

function showView(tabName) {
  const views = {
    summary: "summary-view",
    steps: "steps-view",
    findings: "findings-view",
    markdown: "markdown-view",
    detail: "detail-view",
  };
  Object.entries(views).forEach(([name, id]) => {
    document.getElementById(id).classList.toggle("hidden", name !== tabName);
  });
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tabName);
  });
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.tab));
  });
}

function setupProfiles() {
  document.querySelectorAll(".profile-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeProfile = btn.dataset.profile;
      document.querySelectorAll(".profile-btn").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      const label = scenario.profiles[activeProfile].label;
      document.getElementById("try-status").textContent = `Selected profile: ${label}`;
    });
  });
}

async function runPipeline() {
  const btn = document.getElementById("run-pipeline");
  const btnDoc = document.getElementById("run-doctor");
  btn.disabled = true;
  btnDoc.disabled = true;

  clearTerminal();
  const profile = scenario.profiles[activeProfile];
  logTerminal(`$ grok-collections plan scenarios/offline-rag-contract.yaml`, "cmd");
  await sleep(280);
  logTerminal(`Scenario: offline-rag-contract · profile: ${activeProfile}`, "ok");
  logTerminal(`Steps: probe → create → upload → index → search → multimodal → chat`);
  await sleep(320);
  logTerminal(`$ grok-collections run scenarios/offline-rag-contract.yaml --mock`, "cmd");
  await sleep(350);
  for (const step of scenario.steps) {
    logTerminal(`  [${step.id}] ${step.action}…`);
    await sleep(120);
  }

  const receipt = GrokKitEngine.runReceipt(scenario, activeProfile);
  logTerminal(`Wrote out/receipts/${receipt.manifest.run_id}/`, "ok");
  if (receipt.summary.overall === "pass") {
    logTerminal("✓ contract passed", "ok");
  } else {
    logTerminal(`✗ contract failed — doctor: ${receipt.findings.overall}`, "fail");
  }

  renderReceipt(receipt);
  document.getElementById("try-status").textContent =
    `${profile.label}: ${receipt.summary.overall} (${receipt.findings.finding_count} doctor findings)`;

  btn.disabled = false;
  btnDoc.disabled = false;
}

async function runDoctorOnly() {
  if (!lastReceipt) {
    document.getElementById("try-status").textContent = "Run the pipeline first.";
    return;
  }
  clearTerminal();
  logTerminal("$ grok-collections doctor out/receipts/latest/", "cmd");
  await sleep(400);
  for (const f of lastReceipt.findings.findings) {
    logTerminal(`  [${f.severity}] ${f.code}: ${f.message}`, f.severity === "warn" ? "warn" : f.severity === "critical" ? "fail" : "");
    await sleep(100);
  }
  if (!lastReceipt.findings.findings.length) {
    logTerminal("Doctor: healthy (0 findings)", "ok");
  } else {
    logTerminal(`Doctor: ${lastReceipt.findings.overall} (${lastReceipt.findings.finding_count} findings)`, "warn");
  }
  renderFindings(lastReceipt.findings);
  showView("findings");
  document.getElementById("try-status").textContent = `Doctor re-run on ${lastReceipt.manifest.run_id}`;
}

async function init() {
  setupTabs();
  setupProfiles();

  const res = await fetch("demo-scenario.json");
  if (!res.ok) throw new Error(`Could not load demo scenario (HTTP ${res.status})`);
  scenario = await res.json();

  if (typeof GrokKitEngine === "undefined") {
    throw new Error("demo-engine.js failed to load");
  }

  document.getElementById("run-pipeline").addEventListener("click", runPipeline);
  document.getElementById("run-doctor").addEventListener("click", runDoctorOnly);
}

init().catch((err) => {
  const msg = `Error: ${err.message}`;
  document.getElementById("try-status").textContent = msg;
  document.getElementById("try-status").style.color = "#cf222e";
  logTerminal(msg, "fail");
});
