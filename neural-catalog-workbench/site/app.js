let data = null;
let active = null;

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
    <div><strong>${ok}</strong><span>clean</span></div>
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
    btn.innerHTML = `<span>${scenario.id}</span><span class="badge ${status}">${status}</span>`;
    btn.addEventListener("click", () => selectScenario(scenario));
    nav.appendChild(btn);
  }
}

function selectScenario(scenario) {
  active = scenario;
  document.querySelectorAll(".table-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === scenario.id);
  });

  document.getElementById("scenario-title").textContent = scenario.plan.table;
  document.getElementById("scenario-uri").textContent =
    `${scenario.plan.catalog_uri} · ${scenario.plan.partition_label}`;

  const chip = document.getElementById("scenario-status");
  chip.textContent = scenario.plan.audit_status;
  chip.className = `status-chip badge ${scenario.plan.audit_status}`;

  renderMetrics(scenario);
  renderList("findings", scenario.doctor, (f) => ({
    className: f.severity === "critical" ? "error" : f.severity,
    html: `<strong>${f.code}</strong> — ${f.message}<br><span style="color:var(--muted)">→ ${f.suggestion}</span>`,
  }));
  renderList("audit-findings", scenario.plan.audit_findings || [], (f) => ({
    className: f.severity,
    html: f.message,
  }));
  renderList("risks", (scenario.plan.risks || []).map((r) => ({ severity: "warn", message: r })), (f) => ({
    className: "warn",
    html: f.message,
  }));
}

function renderMetrics(scenario) {
  const io = scenario.plan.io || {};
  const el = document.getElementById("metrics");
  el.innerHTML = `
    <div class="metric"><span>Files</span><strong>${io.file_count ?? "—"}</strong></div>
    <div class="metric"><span>Bytes</span><strong>${io.total_bytes ?? "—"}</strong></div>
    <div class="metric"><span>Peak (est.)</span><strong>${io.peak_unbatched_bytes ?? "—"}</strong></div>
    <div class="metric"><span>Batching</span><strong>${io.recommend_batching ? "recommended" : "ok"}</strong></div>
  `;
}

function renderList(id, items, mapFn) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "ok";
    li.textContent = "No issues.";
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
