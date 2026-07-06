async function loadReceiptPreview() {
  const res = await fetch("data/receipt.json");
  if (!res.ok) return;
  const data = await res.json();

  const stepsEl = document.getElementById("step-preview");
  const metricsEl = document.getElementById("metrics-preview");
  const toolbar = document.querySelector(".preview-toolbar");
  if (!stepsEl || !metricsEl) return;

  stepsEl.innerHTML = data.steps
    .map(
      (step) => `
      <div class="step-card">
        <div>
          <div class="name">${step.step}</div>
          <div class="meta">${step.duration_ms ?? 0} ms</div>
        </div>
        <div class="meta">${step.message || step.chunk_preview || step.file_id || ""}</div>
        <div class="status ${step.status}">${step.status}</div>
      </div>`
    )
    .join("");

  metricsEl.innerHTML = `
    <div class="metric"><span>Overall</span><strong>${data.summary.overall}</strong></div>
    <div class="metric"><span>Roundtrip</span><strong>${data.summary.roundtrip_verified ? "verified" : "no"}</strong></div>
    <div class="metric"><span>Paths resolved</span><strong>${data.summary.paths_resolved}</strong></div>
  `;

  if (toolbar) {
    toolbar.textContent = `${data.mode} · ${data.workflow} · SDK ${data.sdk_version}`;
  }
}

loadReceiptPreview();
