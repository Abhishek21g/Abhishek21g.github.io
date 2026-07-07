const KEYS = ["libcublas", "cudnn", "tensorrt", "cuda_cudart", "l4t", "jetpack"];

function kvHtml(probe, other) {
  const closure = probe.closure || {};
  const otherClosure = other?.closure || {};
  return KEYS.map((key) => {
    const val = closure[key] ?? "—";
    const otherVal = otherClosure[key];
    const drift = other && val !== otherVal;
    const cls = drift ? "drift" : "";
    return `<div class="${cls}"><span>${key}</span><code>${val}</code></div>`;
  }).join("");
}

function slaPct(latency, sla = 30) {
  const p95 = latency?.p95_ms ?? 0;
  return Math.min(200, (p95 / sla) * 100);
}

async function init() {
  const [golden, field] = await Promise.all([
    fetch("data/ci_golden.json").then((r) => r.json()),
    fetch("data/field_blocked.json").then((r) => r.json()),
  ]);

  document.getElementById("golden-node").textContent = golden.node_id;
  document.getElementById("field-node").textContent = field.node_id;
  document.getElementById("golden-kv").innerHTML = kvHtml(golden, field);
  document.getElementById("field-kv").innerHTML = kvHtml(field, golden);

  const gLat = golden.latency?.p95_ms ?? 0;
  const fLat = field.latency?.p95_ms ?? 0;
  document.getElementById("golden-lat").textContent = `${gLat} ms`;
  document.getElementById("field-lat").textContent = `${fLat} ms`;
  document.getElementById("golden-sla").style.setProperty("--pct", slaPct(golden.latency));
  document.getElementById("field-sla").style.setProperty("--pct", slaPct(field.latency));

  const pill = document.getElementById("verdict-pill");
  const banner = document.getElementById("verdict-banner");
  if (field.verdict === "block") {
    pill.className = "pill block";
    pill.textContent = "BLOCK";
    banner.className = "verdict-banner block";
    banner.textContent =
      "OTA blocked — libcublas closure drift + p95 SLA miss. Reconcile flake inputs before promoting perception.";
    document.getElementById("drift-summary").textContent =
      "libcublas drifted to CUDA 11.4 stub after nixpkgs bump";
  }
}

init().catch(console.error);
