const RECEIPTS = {
  electron: {
    profile_id: "electron-leo-deploy",
    vehicle: "electron",
    passes: 3,
    service_continuity_risk: "medium",
    constraints: { total: 7, passed: 4, failed: 2, warned: 1 },
    doctor_findings: [
      {
        rule_id: "CONTACT_GAP_TOO_LONG",
        severity: "WARN",
        message: "Long gap after pass 1 with pending backlog",
        pass_index: 0,
      },
      {
        rule_id: "DOWNLINK_BACKLOG",
        severity: "FAIL",
        message: "Downlink backlog exceeds threshold after pass 2",
        pass_index: 1,
      },
      {
        rule_id: "TWIN_DIVERGENCE",
        severity: "FAIL",
        message: "ODySSy-style twin divergence on bus_power_w",
        channel_id: "bus_power_w",
        observed: 8.0,
        threshold: 5.0,
      },
    ],
    timeline_summary: {
      passes_completed: 3,
      total_downlinked_mb: 38.2,
      peak_backlog_mb: 58.7,
    },
    labels: ["DEMO", "NOT_ROCKET_LAB_OFFICIAL"],
    assumptions: ["pass_schedule_synthetic", "downlink_rate_nominal"],
  },
  iridium: {
    profile_id: "iridium-replenishment-sketch",
    vehicle: "neutron",
    service_continuity_risk: "low",
    constraints: { total: 8, passed: 7, failed: 0, warned: 1 },
    fleet_summary: {
      trials: 200,
      continuity_gap_probability_24h: 0.065,
      expected_replenishment_year: 9.25,
      internal_vs_external_ratio: 0.692,
      labels: ["ASSUMPTION", "SYNTHETIC_FLEET_MODEL"],
    },
    doctor_findings: [
      {
        rule_id: "REPLENISHMENT_RISK",
        severity: "WARN",
        message: "Fleet Monte Carlo shows elevated 24h service-gap probability",
        observed: 0.065,
        threshold: 0.05,
      },
    ],
    labels: ["DEMO", "NOT_ROCKET_LAB_OFFICIAL"],
    assumptions: ["iridium_fleet_size_public_only", "replenishment_envelopes_assumption"],
  },
};

const PROFILE_SNIPPETS = {
  electron: `profile_id: electron-leo-deploy
vehicle: electron
passes: 3 (Mahia + Wallops contacts)
twin: bus_power_w sim 92W vs telem 100W
doctor: backlog + twin divergence expected`,
  iridium: `profile_id: iridium-replenishment-sketch
fleet: 66 ops + 14 spare (public)
replenishment: Neutron campaign (ASSUMPTION)
monte_carlo: 200 trials, 15yr horizon`,
};

let currentKey = "electron";
let currentReceipt = null;

function renderReceipt(key) {
  currentKey = key;
  const base = RECEIPTS[key];
  currentReceipt = {
    run_id: "demo-site-run",
    profile_id: base.profile_id,
    generated_at: new Date().toISOString(),
    ...base,
  };

  document.getElementById("profile-preview").textContent = PROFILE_SNIPPETS[key];
  document.getElementById("receipt-json").textContent = JSON.stringify(currentReceipt, null, 2);

  const badge = document.getElementById("risk-badge");
  badge.textContent = base.service_continuity_risk;
  badge.className = `badge ${base.service_continuity_risk}`;

  const c = base.constraints;
  document.getElementById("constraints").innerHTML = `
    <div class="metric"><span class="value">${c.passed}</span><span class="label">Passed</span></div>
    <div class="metric"><span class="value">${c.failed}</span><span class="label">Failed</span></div>
    <div class="metric"><span class="value">${c.warned}</span><span class="label">Warned</span></div>
    <div class="metric"><span class="value">${c.total}</span><span class="label">Total rules</span></div>
  `;

  const findingsEl = document.getElementById("findings");
  findingsEl.innerHTML = base.doctor_findings
    .map(
      (f) =>
        `<li class="${f.severity}"><span class="rule">${f.rule_id}</span> — ${f.message}</li>`
    )
    .join("");
}

document.getElementById("profile-select").addEventListener("change", (e) => {
  renderReceipt(e.target.value);
});

document.getElementById("run-demo").addEventListener("click", () => {
  renderReceipt(document.getElementById("profile-select").value);
});

document.getElementById("download-receipt").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(currentReceipt, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentReceipt.profile_id}-receipt.json`;
  a.click();
  URL.revokeObjectURL(url);
});

renderReceipt("electron");
