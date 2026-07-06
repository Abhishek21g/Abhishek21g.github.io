let dashboard = null;
let selectedId = null;

function pill(text, kind) {
  return `<span class="pill ${kind}">${text}</span>`;
}

function renderBanner(data) {
  const el = document.getElementById("status-banner");
  if (!el) return;
  el.className = `status-banner ${data.overall}`;
  document.getElementById("banner-title").textContent = data.overall === "healthy"
    ? "Collections fleet is search-ready"
    : "Collections need attention before RAG";
  document.getElementById("banner-sub").textContent = data.tagline;
  document.getElementById("banner-pill").innerHTML = pill(data.overall, data.overall);
  document.getElementById("banner-meta").textContent =
    `${data.mode} · SDK ${data.sdk_version} · ${new Date(data.generated_at).toLocaleString()}`;
}

function renderStats(data) {
  const fleet = data.fleet;
  document.getElementById("stat-collections").textContent = fleet.collection_count;
  document.getElementById("stat-rag-ready").textContent = fleet.rag_ready_collections;
  document.getElementById("stat-failed").textContent = fleet.totals.failed;
  document.getElementById("stat-inflight").textContent = fleet.totals.in_flight;
}

function renderProbes(data) {
  const rows = data.probes.probes.map((p) => `
    <div class="probe-row">
      <div><strong>${p.channel}</strong> · <span class="mono">${p.check}</span></div>
      <div class="mono">${p.detail || p.error || "—"}</div>
      <div>${p.latency_ms} ms</div>
      <div>${pill(p.status, p.status)}</div>
    </div>
  `).join("");
  document.getElementById("probe-rows").innerHTML = rows;
}

function renderFleet(data) {
  const collections = data.fleet.collections;
  if (!selectedId && collections.length) selectedId = collections.find((c) => c.health !== "healthy")?.collection_id || collections[0].collection_id;

  document.getElementById("fleet-rows").innerHTML = collections.map((c) => `
    <div class="fleet-row ${c.collection_id === selectedId ? "selected" : ""}" data-id="${c.collection_id}">
      <div><strong>${c.name}</strong><div class="mono">${c.collection_id}</div></div>
      <div>${c.documents_count} docs · ${c.embedding_model}</div>
      <div>${c.indexing.processed} processed</div>
      <div>${pill(c.health, c.health)} ${c.rag_ready ? pill("rag ready", "ok") : ""}</div>
    </div>
  `).join("");

  document.querySelectorAll(".fleet-row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedId = row.dataset.id;
      renderFleet(data);
      renderDetail(data);
    });
  });

  renderDetail(data);
}

function renderDetail(data) {
  const col = data.fleet.collections.find((c) => c.collection_id === selectedId);
  if (!col) return;

  document.getElementById("detail-name").textContent = col.name;
  document.getElementById("detail-meta").innerHTML =
    `${col.documents_count} documents · ${pill(col.health, col.health)} · RAG ${col.rag_ready ? "ready" : "not ready"}`;

  document.getElementById("pipeline").innerHTML = col.indexing.pipeline.map((s) => `
    <div class="pipe-stage">
      <span>${s.stage}</span>
      <strong>${s.count}</strong>
    </div>
  `).join("");

  const findings = col.findings.length ? col.findings : [{ severity: "ok", code: "healthy", message: "No indexing issues detected in sample." }];
  document.getElementById("findings").innerHTML = findings.map((f) => `
    <div class="finding ${f.severity}">
      <strong>${f.code}</strong> — ${f.message}
      ${f.action ? `<div class="mono" style="margin-top:0.35rem;color:var(--muted)">→ ${f.action}</div>` : ""}
    </div>
  `).join("");

  const failed = col.indexing.failed_documents;
  document.getElementById("failures").innerHTML = failed.length
    ? `<table><thead><tr><th>Document</th><th>Error</th></tr></thead><tbody>${
        failed.map((d) => `<tr><td class="mono">${d.name}</td><td>${d.error}</td></tr>`).join("")
      }</tbody></table>`
    : "<p class='section-lead'>No failed documents in sample.</p>";

  const smoke = col.search_smoke;
  document.getElementById("search-smoke").innerHTML = smoke
    ? `${pill(smoke.status, smoke.status)} ${smoke.latency_ms} ms · ${smoke.match_count} matches`
    : "Search smoke not run (no processed documents)";
}

function renderGlobalFindings(data) {
  const findings = data.fleet.findings;
  document.getElementById("global-findings").innerHTML = findings.length
    ? findings.map((f) => `
        <div class="finding ${f.severity}">
          <strong>${f.code}</strong> — ${f.message}
          ${f.action ? `<div class="mono" style="margin-top:0.35rem;color:var(--muted)">→ ${f.action}</div>` : ""}
        </div>
      `).join("")
    : "<p class='section-lead'>No fleet-wide blockers detected.</p>";
}

async function loadDashboard() {
  const res = await fetch("data/dashboard.json");
  dashboard = await res.json();
  renderBanner(dashboard);
  renderStats(dashboard);
  renderProbes(dashboard);
  renderFleet(dashboard);
  renderGlobalFindings(dashboard);
}

loadDashboard();
