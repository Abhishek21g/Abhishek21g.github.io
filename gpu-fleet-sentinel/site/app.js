async function loadReceipt() {
  const panel = document.getElementById("receipt-panel");
  if (!panel) return;
  try {
    const res = await fetch("./sample_receipt.json");
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const findings = data.findings || [];
    const header = `verdict: ${data.healthy ? "HEALTHY" : "DEGRADED"}  ·  run ${data.run_id}  ·  ${findings.length} findings\n`;
    if (!findings.length) {
      panel.textContent = header + "\nNo anomalies.";
      return;
    }
    panel.innerHTML = "";
    const pre = document.createElement("div");
    pre.textContent = header;
    pre.style.marginBottom = "0.75rem";
    pre.style.color = "var(--muted)";
    panel.appendChild(pre);
    for (const f of findings) {
      const row = document.createElement("div");
      row.className = "finding-row";
      const sev = document.createElement("span");
      sev.className = `sev-${f.severity}`;
      sev.textContent = f.severity.toUpperCase();
      const body = document.createElement("span");
      body.textContent = `${f.code} · ${f.node} / ${f.gpu_id} — ${f.message}`;
      row.append(sev, body);
      panel.appendChild(row);
    }
  } catch (err) {
    panel.textContent = `Could not load sample_receipt.json (${err}). Open report.html instead.`;
  }
}

loadReceipt();
