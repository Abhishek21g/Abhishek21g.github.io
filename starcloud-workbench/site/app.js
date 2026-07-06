/** Precomputed receipt keys: `${platform}__${workload}` */
const RECEIPT_INDEX = {
  "starcloud-1__nanogpt-tiny": "receipts/starcloud-1__nanogpt-tiny.json",
  "starcloud-1__sar-compress": "receipts/starcloud-1__sar-compress.json",
  "starcloud-1__inference-batch": "receipts/starcloud-1__inference-batch.json",
  "starcloud-2__nanogpt-tiny": "receipts/starcloud-1__nanogpt-tiny.json",
  "starcloud-2__inference-batch": "receipts/starcloud-2__inference-batch.json",
  "starcloud-2__sar-compress": "receipts/starcloud-1__sar-compress.json",
};

const FALLBACK_RECEIPT = "receipts/starcloud-1__nanogpt-tiny.json";

const platformEl = document.getElementById("platform");
const workloadEl = document.getElementById("workload");
const runBtn = document.getElementById("run-demo");
const metricCards = document.getElementById("metric-cards");
const doctorList = document.getElementById("doctor-list");
const preview = document.getElementById("receipt-preview");
const canvas = document.getElementById("timeline-chart");

async function loadReceipt(platform, workload) {
  const key = `${platform}__${workload}`;
  const path = RECEIPT_INDEX[key] || FALLBACK_RECEIPT;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function renderMetrics(m) {
  const c = m.compute || {};
  const t = m.thermal || {};
  const d = m.downlink || {};
  const b = m.baseline || {};
  const cards = [
    ["Status", (m.status || "—").toUpperCase()],
    ["Wall time", `${(c.wall_seconds || 0).toFixed(0)} s`],
    ["Peak temp", `${(t.peak_celsius || 0).toFixed(1)} °C`],
    ["Effective MFU", (c.effective_mfu || 0).toExponential(2)],
    ["Downlink", d.recommendation || "—"],
    ["Terrestrial", `${(b.terrestrial_kwh || 0).toFixed(4)} kWh`],
  ];
  metricCards.innerHTML = cards
    .map(
      ([label, value]) =>
        `<div class="metric-card"><div class="label">${label}</div><div class="value">${value}</div></div>`
    )
    .join("");
}

function renderDoctor(rules) {
  doctorList.innerHTML = (rules || [])
    .map((r) => {
      const cls = r.pass ? (r.severity === "info" ? "info" : "pass") : r.severity;
      const mark = r.pass ? "PASS" : "FAIL";
      return `<div class="doctor-item ${cls}"><strong>${r.id}</strong> [${mark}] — ${r.message}</div>`;
    })
    .join("");
}

function drawTimeline(timeline) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (!timeline || !timeline.length) {
    ctx.fillStyle = "#8fa3bf";
    ctx.fillText("Timeline available in CLI receipt (timeline.csv)", 20, h / 2);
    return;
  }

  const sample = timeline.filter((_, i) => i % Math.max(1, Math.floor(timeline.length / 120)) === 0);
  const maxSolar = Math.max(...sample.map((s) => s.solar_w), 1);
  const maxTemp = Math.max(...sample.map((s) => s.temp_c), 1);

  const rowH = h / 3;
  const drawRow = (idx, values, maxV, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = (i / (values.length - 1 || 1)) * (w - 20) + 10;
      const y = idx * rowH + rowH - (v / maxV) * (rowH - 16) - 8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  drawRow(
    0,
    sample.map((s) => s.solar_w),
    maxSolar,
    "#f6e05e"
  );
  drawRow(
    1,
    sample.map((s) => s.temp_c),
    maxTemp,
    "#fc8181"
  );
  drawRow(
    2,
    sample.map((s) => s.battery_soc),
    1,
    "#68d391"
  );
}

async function runDemo() {
  const platform = platformEl.value;
  const workload = workloadEl.value;
  runBtn.disabled = true;
  runBtn.textContent = "Loading…";
  try {
    const receipt = await loadReceipt(platform, workload);
    renderMetrics(receipt);
    renderDoctor(receipt.doctor);
    drawTimeline(receipt.timeline);
    preview.textContent = JSON.stringify(receipt, null, 2);
  } catch (err) {
    preview.textContent = String(err);
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "Load receipt";
  }
}

runBtn.addEventListener("click", runDemo);
runDemo();
