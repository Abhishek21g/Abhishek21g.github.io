let data = null;
let active = null;

const SCENARIO_LABELS = {
  spike_bins_probe: "Spike bins",
  electrode_map_drift: "Electrode map",
  empty_partition_probe: "Raw waveforms",
};

const SCENARIO_LEADS = {
  spike_bins_probe: "Healthy control — declared schema matches Delta storage for this implant/session slice.",
  electrode_map_drift: "Catalog declares impedance_ohms; storage dropped the column. Reads null-fill silently.",
  empty_partition_probe: "Partition exists in the catalog but has zero parquet files — query-time failure.",
};

async function init() {
  const res = await fetch("data/scenarios.json");
  data = await res.json();
  document.getElementById("thesis").textContent = data.thesis;
  renderSummary();
  renderNav();
  const preferred =
    data.scenarios.find((s) => s.plan.audit_status === "error") || data.scenarios[0];
  selectScenario(preferred);
}

function renderSummary() {
  const el = document.getElementById("summary");
  const ok = data.scenarios.filter((s) => s.plan.audit_status === "ok").length;
  const err = data.scenarios.filter((s) => s.plan.audit_status === "error").length;
  el.innerHTML = `
    <div><strong>${data.scenarios.length}</strong><span>scenarios</span></div>
    <div><strong>${ok}</strong><span>pass</span></div>
    <div><strong>${err}</strong><span>drift</span></div>
  `;
}

function renderNav() {
  const nav = document.getElementById("scenario-nav");
  nav.innerHTML = "";
  for (const scenario of data.scenarios) {
    const btn = document.createElement("button");
    btn.className = "table-btn";
    btn.dataset.id = scenario.id;
    const status = scenario.plan.audit_status;
    const label = SCENARIO_LABELS[scenario.id] || scenario.id;
    btn.innerHTML = `<span>${label}</span><span class="badge ${status}">${status}</span>`;
    btn.addEventListener("click", () => selectScenario(scenario));
    nav.appendChild(btn);
  }
}

function selectScenario(scenario) {
  active = scenario;
  document.querySelectorAll(".table-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === scenario.id);
  });

  const label = SCENARIO_LABELS[scenario.id] || scenario.plan.table;
  document.getElementById("scenario-title").textContent = label;
  document.getElementById("scenario-uri").textContent =
    `${scenario.plan.catalog_uri} · ${scenario.plan.partition_label}`;
  document.getElementById("scenario-lead").textContent =
    SCENARIO_LEADS[scenario.id] || "";

  const chip = document.getElementById("scenario-status");
  chip.textContent = scenario.plan.audit_status;
  chip.className = `status-chip badge ${scenario.plan.audit_status}`;

  renderMetrics(scenario);
  renderList("findings", scenario.doctor, (f) => ({
    className: f.severity === "critical" ? "error" : f.severity,
    html: `<strong>${f.code}</strong> — ${f.message}<br><span class="finding-hint">→ ${f.suggestion}</span>`,
  }));
  renderList("audit-findings", scenario.plan.audit_findings || [], (f) => ({
    className: f.severity,
    html: f.message,
  }));

  const risks = (scenario.plan.risks || []).filter(
    (r) => !/mock mode/i.test(r)
  );
  renderList("risks", risks.map((r) => ({ severity: "warn", message: r })), (f) => ({
    className: "warn",
    html: f.message,
  }));
  document.getElementById("risks-panel").style.display =
    risks.length ? "block" : "none";
}

function renderMetrics(scenario) {
  const io = scenario.plan.io || {};
  const el = document.getElementById("metrics");
  el.innerHTML = `
    <div class="metric"><span>Parquet files</span><strong>${io.file_count ?? "—"}</strong></div>
    <div class="metric"><span>Data size</span><strong>${formatBytes(io.total_bytes)}</strong></div>
    <div class="metric"><span>Peak memory</span><strong>${formatBytes(io.peak_unbatched_bytes)}</strong></div>
    <div class="metric"><span>Batching</span><strong>${io.recommend_batching ? "advised" : "not needed"}</strong></div>
  `;
}

function formatBytes(n) {
  if (n == null || n === "—") return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function renderList(id, items, mapFn) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "ok";
    li.textContent = "No issues detected.";
    list.appendChild(li);
    return;
  }
  for (const item of items) {
    const mapped = mapFn(item);
    const li = document.createElement("li");
    li.className = mapped.className;
    li.innerHTML = mapped.html;
    list.appendChild(li);
  }
}

init();
