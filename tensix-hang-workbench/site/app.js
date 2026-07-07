const BASE = document.querySelector('meta[name="base-path"]')?.content || "";

async function loadJson(path) {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

function severityClass(level) {
  return level === "critical" ? "critical" : level === "high" ? "high" : "info";
}

function renderDoctor(doctor, manifest) {
  const statusEl = document.getElementById("doctor-status");
  const rootEl = document.getElementById("root-blocker");
  const findingsEl = document.getElementById("findings");
  const recsEl = document.getElementById("recommendations");
  const metaEl = document.getElementById("run-meta");

  statusEl.textContent = doctor.status;
  statusEl.className = doctor.status === "fail" ? "status-fail" : "status-pass";

  metaEl.textContent = `${manifest.scenario} · ${manifest.core_count} cores sampled · ${manifest.triage_patterns} triage patterns`;

  if (doctor.root_blocker) {
    const rb = doctor.root_blocker;
    rootEl.innerHTML = `
      <h3>${rb.kind} @ ${rb.location}</h3>
      <p><strong>${rb.affected_cores}</strong> cores · confidence <strong>${Math.round(rb.confidence * 100)}%</strong></p>
      <p>${rb.summary}</p>
    `;
  } else {
    rootEl.innerHTML = "<p>No dominant root blocker identified.</p>";
  }

  findingsEl.innerHTML = doctor.findings
    .map(
      (f) => `
      <div class="finding">
        <div class="severity ${severityClass(f.severity)}">${f.severity}</div>
        <div><strong>${f.code}</strong> — ${f.message}</div>
        <div style="color:var(--muted);font-size:0.88rem;margin-top:4px">${f.evidence}</div>
      </div>`
    )
    .join("");

  recsEl.innerHTML = doctor.recommendations.map((r) => `<li>${r}</li>`).join("");
}

function renderGraph(graph) {
  const edgesEl = document.getElementById("graph-edges");
  edgesEl.innerHTML = graph.edges
    .map(
      (edge) => `
      <div class="edge">
        <strong>${edge.relation}</strong>:
        <code>${shortId(edge.source)}</code> → <code>${shortId(edge.target)}</code>
        <div>${edge.evidence}</div>
      </div>`
    )
    .join("");
}

function shortId(id) {
  return id.replace(/^triage:/, "").replace(/^op:/, "").replace(/^watcher:/, "");
}

async function runDemo() {
  const btn = document.getElementById("run-demo");
  btn.disabled = true;
  btn.textContent = "Running demo…";
  try {
    const [manifest, doctor, graph] = await Promise.all([
      loadJson("data/demo-manifest.json"),
      loadJson("data/demo-doctor.json"),
      loadJson("data/demo-graph.json"),
    ]);
    document.getElementById("results").classList.remove("hidden");
    renderDoctor(doctor, manifest);
    renderGraph(graph);
    btn.textContent = "Demo loaded";
  } catch (error) {
    btn.textContent = "Demo failed";
    console.error(error);
  }
}

document.getElementById("run-demo")?.addEventListener("click", runDemo);

// Auto-run on load for hiring-manager 60s path
runDemo();
