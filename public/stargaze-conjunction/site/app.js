function badgeClass(decision) {
  if (decision === "MISS" || decision === "MANEUVER_SUCCESS") return "miss";
  if (decision === "NO-GO") return "nogo";
  return "hold";
}

function renderReceipt(receipt) {
  const decision = receipt.decision || "—";
  const verdict = document.getElementById("verdict");
  const heroBadge = document.getElementById("heroBadge");
  verdict.textContent = decision;
  verdict.className = `verdict ${decision}`;
  if (heroBadge) {
    heroBadge.textContent = decision;
    heroBadge.className = `badge ${badgeClass(decision)}`;
  }

  document.getElementById("scenarioLabel").textContent =
    `${receipt.scenario_id || "scenario"} · run ${receipt.run_id || "?"}`;

  const counts = receipt.summary?.gate_counts || {};
  document.getElementById("counts").innerHTML = `
    <div><dt>Failed</dt><dd>${counts.FAIL || 0}</dd></div>
    <div><dt>Warned</dt><dd>${counts.WARN || 0}</dd></div>
    <div><dt>Passed</dt><dd>${counts.PASS || 0}</dd></div>
  `;

  const cdm = receipt.cdm || {};
  document.getElementById("cdmKv").innerHTML = Object.entries({
    Primary: cdm.primary,
    Secondary: cdm.secondary,
    TCA: cdm.tca,
    "Miss (km)": cdm.miss_distance_km,
    Pc: cdm.collision_probability,
    "V_rel (m/s)": cdm.relative_speed_mps,
  })
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v ?? "—"}</dd></div>`)
    .join("");

  const findings = receipt.findings || [];
  document.getElementById("findings").innerHTML = findings.length
    ? findings
        .map(
          (f) => `<div class="finding ${f.severity}">
            <strong>[${f.gate_id}] ${f.severity}</strong> → ${f.action}: ${f.message}
          </div>`
        )
        .join("")
    : "<p>No findings</p>";
}

async function loadSample() {
  const res = await fetch("./sample-receipt.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load sample receipt (${res.status})`);
  return res.json();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadSample")?.addEventListener("click", async () => {
    try {
      renderReceipt(await loadSample());
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("fileInput")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      renderReceipt(JSON.parse(await file.text()));
    } catch {
      alert("Invalid receipt JSON");
    }
  });

  loadSample().then(renderReceipt).catch(() => {});
});
