async function load() {
  const bannerTitle = document.getElementById("banner-title");
  const bannerPill = document.getElementById("banner-pill");
  try {
    const res = await fetch("data/demo-bundle.json");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} loading demo-bundle.json`);
    }
    const data = await res.json();
    const summary = data.summary;
    const findings = data.findings || { findings: [] };

    bannerTitle.textContent =
      summary.overall === "pass" ? "Pipeline contract passed" : "Pipeline contract failed";
    bannerPill.innerHTML =
      `<span class="pill ${summary.overall}">${summary.overall}</span>`;
    document.getElementById("banner-meta").textContent =
      `${data.manifest.scenario} · ${data.manifest.mode} · doctor: ${findings.overall || "n/a"}`;

    document.getElementById("stat-steps").textContent = data.steps.length;
    document.getElementById("stat-findings").textContent = findings.finding_count ?? 0;
    document.getElementById("stat-mode").textContent = data.manifest.mode;
    document.getElementById("stat-doctor").textContent = findings.overall || "—";

    document.getElementById("steps-table").innerHTML = data.steps.map((s) => `
      <tr><td><code>${s.id}</code></td><td>${s.action}</td><td>${s.status}</td><td>${s.duration_ms} ms</td></tr>
    `).join("");

    document.getElementById("findings").innerHTML = (findings.findings || []).length
      ? findings.findings.map((f) => `
          <div class="finding ${f.severity}"><strong>${f.code}</strong> — ${f.message}</div>
        `).join("")
      : "<p class='lead'>No doctor findings — mock pipeline healthy.</p>";

    document.getElementById("cli-block").textContent = `git clone https://github.com/Abhishek21g/grok-collections-reliability-kit.git
cd grok-collections-reliability-kit && uv sync
uv run grok-collections plan scenarios/offline-rag-contract.yaml
uv run grok-collections run  scenarios/offline-rag-contract.yaml --mock
uv run grok-collections doctor out/receipts/latest/
uv run grok-collections report out/receipts/latest/`;
  } catch (err) {
    bannerTitle.textContent = "Demo data failed to load";
    bannerPill.innerHTML = `<span class="pill fail">error</span>`;
    document.getElementById("banner-meta").textContent = String(err);
    document.getElementById("findings").innerHTML =
      `<p class="lead">Could not load <code>data/demo-bundle.json</code>. If you cloned the repo, run <code>uv run grok-collections export-demo -o site/data</code> first.</p>`;
  }
}

load();
