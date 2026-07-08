const RECEIPTS = {
  "stenis-ship": "data/stennis-ship.json",
  "powder-to-pad-compiler": "data/powder-to-pad-compiler.json",
};

let current = null;

async function loadReceipt(key) {
  const res = await fetch(RECEIPTS[key], { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${key}`);
  return res.json();
}

function renderMetrics(r) {
  const t = r.timeline_summary || {};
  const c = r.constraints || {};
  document.getElementById("metricSlack").textContent =
    t.critical_path_slack_h != null ? `${t.critical_path_slack_h}h` : "—";
  document.getElementById("metricTransport").textContent =
    t.makes_transport_window ? "PASS" : "FAIL";
  document.getElementById("metricFindings").textContent =
    `${c.failed || 0} fail / ${c.warned || 0} warn`;
  document.getElementById("heroProfile").textContent = r.profile_id;
  document.getElementById("heroSlack").textContent = `${t.critical_path_slack_h ?? "—"}h`;
  document.getElementById("heroFindings").textContent = String(c.total ?? 0);
}

function renderDoctor(findings) {
  const el = document.getElementById("doctorList");
  if (!findings?.length) {
    el.innerHTML = '<div class="doctor-item"><strong>OK</strong>All doctor rules passed.</div>';
    return;
  }
  el.innerHTML = findings
    .map(
      (f) =>
        `<div class="doctor-item ${f.severity}"><strong>${f.rule_id} · ${f.severity}</strong>${f.message}</div>`
    )
    .join("");
}

function renderPreview(r) {
  const preview = {
    profile_id: r.profile_id,
    critical_path: r.timeline_summary?.critical_path,
    transport_end_h: r.timeline_summary?.transport_end_h,
    constraints: r.constraints,
    doctor_findings: r.doctor_findings,
    genome_chain: r.genome_chain,
    assumptions: r.assumptions,
  };
  document.getElementById("receiptPreview").textContent = JSON.stringify(preview, null, 2);
}

async function runDemo() {
  const key = document.getElementById("profileSelect").value;
  try {
    current = await loadReceipt(key);
    renderMetrics(current);
    renderDoctor(current.doctor_findings);
    renderPreview(current);
  } catch (e) {
    document.getElementById("doctorList").innerHTML =
      `<div class="doctor-item FAIL"><strong>ERROR</strong>${e.message}</div>`;
  }
}

function downloadReceipt() {
  if (!current) return;
  const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${current.profile_id}-receipt.json`;
  a.click();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("profileSelect").addEventListener("change", runDemo);
  document.getElementById("downloadBtn").addEventListener("click", downloadReceipt);
  runDemo();
});
