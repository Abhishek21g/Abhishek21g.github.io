/**
 * FPO++ Training Workbench — interactive site demo
 */

const PAPER_TARGET = 37;
const PAPER_BUDGET = 2000;

const RUN_META = {
  cliff: {
    key: "cliff",
    label: "g1-cliff-synthetic",
    match: "cliff",
    caption: "Cliff detected at iter ~4100 — reward −67% from peak",
    terminalCmd: "fpo-workbench doctor out/receipts/g1-cliff —json",
    series: () => generateCliffSeries(5000),
    cliffIter: 4099,
  },
  healthy: {
    key: "healthy",
    label: "g1-healthy-synthetic",
    match: "healthy",
    caption: "No cliff — peak 36.0 near paper target, stopped at tuned 2k budget",
    terminalCmd: "fpo-workbench doctor out/receipts/g1-healthy —json",
    series: () => generateHealthySeries(2000),
    cliffIter: null,
  },
};

let activeRun = "cliff";
let demoPayload = null;

function generateCliffSeries(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    let r;
    if (i < 1500) r = 15 + i * 0.012;
    else if (i < 2500) r = 33 + (i - 1500) * 0.002;
    else if (i < 4000) r = 35 + (i - 2500) * 0.001;
    else r = 12 + (i - 4000) * 0.001;
    pts.push({ x: i, y: r });
  }
  return pts;
}

function generateHealthySeries(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: i, y: Math.min(36.5, 8 + i * 0.014) });
  }
  return pts;
}

function mergeDemoData(payload) {
  if (!payload?.runs) return;
  demoPayload = payload;
  for (const entry of payload.runs) {
    const id = entry.summary?.input_log_dir || entry.doctor?.run_id || "";
    const key = id.includes("cliff") ? "cliff" : id.includes("healthy") ? "healthy" : null;
    if (!key) continue;
    RUN_META[key].doctor = entry.doctor;
    RUN_META[key].summary = entry.summary;
    RUN_META[key].receiptDir = entry.receipt_dir;
    if (entry.summary?.reward_series_length) {
      RUN_META[key].iters = entry.summary.reward_series_length;
    }
    if (entry.doctor?.baseline_grade?.message) {
      RUN_META[key].baseline = entry.doctor.baseline_grade.message;
    }
    const cliffSignal = entry.doctor?.signals?.find((s) => s.signal === "reward_cliff");
    if (cliffSignal?.details?.cliff_iteration != null) {
      RUN_META[key].cliffIter = cliffSignal.details.cliff_iteration;
    }
  }
}

function getRun(key) {
  const meta = RUN_META[key];
  const doctor = meta.doctor || { overall_status: key === "healthy" ? "healthy" : "unhealthy", signals: [] };
  return {
    ...meta,
    iters: meta.iters || (key === "cliff" ? 5000 : 2000),
    envs: 4096,
    status: doctor.overall_status,
    baseline: meta.baseline || doctor.baseline_grade?.message || "",
    doctor,
  };
}

function drawChart(canvas, series, cliffIter, compact = false) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 480;
  const h = canvas.clientHeight || (compact ? 160 : 280);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pad = compact
    ? { t: 12, r: 12, b: 24, l: 36 }
    : { t: 16, r: 20, b: 36, l: 48 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;

  const maxX = series[series.length - 1].x;
  const maxY = 42;
  const minY = 0;

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "#e8edf2";
  ctx.lineWidth = 1;
  for (let gy = 0; gy <= 4; gy++) {
    const y = pad.t + (plotH * gy) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l + plotW, y);
    ctx.stroke();
  }

  const xScale = (x) => pad.l + (x / maxX) * plotW;
  const yScale = (y) => pad.t + plotH - ((y - minY) / (maxY - minY)) * plotH;

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xScale(PAPER_BUDGET), pad.t);
  ctx.lineTo(xScale(PAPER_BUDGET), pad.t + plotH);
  ctx.stroke();

  ctx.strokeStyle = "#16a34a";
  ctx.beginPath();
  ctx.moveTo(pad.l, yScale(PAPER_TARGET));
  ctx.lineTo(pad.l + plotW, yScale(PAPER_TARGET));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = compact ? 2 : 2.5;
  ctx.beginPath();
  series.forEach((p, i) => {
    const px = xScale(p.x);
    const py = yScale(p.y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  if (cliffIter != null) {
    const pt = series[cliffIter] || series[series.length - 1];
    const cx = xScale(cliffIter);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(cx, yScale(pt.y), compact ? 4 : 6, 0, Math.PI * 2);
    ctx.fill();
    if (!compact) {
      ctx.font = "11px IBM Plex Mono, monospace";
      ctx.fillText("cliff", cx + 8, yScale(pt.y) - 8);
    }
  }

  ctx.fillStyle = "#5c6773";
  ctx.font = `${compact ? 9 : 11}px IBM Plex Mono, monospace`;
  ctx.fillText("0", pad.l - 4, pad.t + plotH + 14);
  ctx.fillText(String(maxX), pad.l + plotW - 28, pad.t + plotH + 14);
  if (!compact) {
    ctx.fillText("37", 8, yScale(PAPER_TARGET) + 4);
  }
}

function renderSignals(run) {
  const list = document.getElementById("signal-list");
  list.innerHTML = run.doctor.signals
    .map((s) => {
      const icon = s.status === "pass" ? "✓" : s.status === "fail" ? "✗" : "!";
      return `<li class="signal-item">
        <span class="signal-icon ${s.status}">${icon}</span>
        <div class="signal-body">
          <strong>${s.signal}</strong>
          <span>${s.message}</span>
        </div>
      </li>`;
    })
    .join("");
}

function setRun(key) {
  activeRun = key;
  const run = getRun(key);

  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.run === key ? "true" : "false");
  });

  const badge = document.getElementById("doctor-badge");
  badge.textContent = run.status;
  badge.className = `badge ${run.status}`;

  document.getElementById("baseline-line").textContent = run.baseline;
  document.getElementById("chart-meta").textContent = `${run.iters} iters · ${run.envs} envs`;

  const heroBadge = document.getElementById("hero-badge");
  heroBadge.textContent = run.status;
  heroBadge.className = `badge ${run.status === "healthy" ? "pass" : "fail"}`;

  document.getElementById("hero-run-label").textContent = run.label;
  document.getElementById("hero-caption").textContent = run.caption;
  document.querySelector(".hero-panel .terminal code").textContent = run.terminalCmd;

  const dot = document.getElementById("hero-status-dot");
  dot.className = `status-dot ${run.status === "healthy" ? "ok" : "warn"}`;

  const series = run.series();
  drawChart(document.getElementById("main-chart"), series, run.cliffIter, false);
  drawChart(document.getElementById("hero-chart"), series, run.cliffIter, true);
  renderSignals(run);
}

function downloadReceipt() {
  const run = getRun(activeRun);
  const payload = {
    workbench: "fpo-workbench",
    version: "0.1.0",
    exported_at: new Date().toISOString(),
    run: run.label,
    receipt_dir: run.receiptDir,
    doctor: run.doctor,
    summary: run.summary || {
      experiment_name: "g1_flat_flow",
      baseline: { task_id: "Isaac-Velocity-Flat-G1-v0", target_return: PAPER_TARGET, max_iterations: PAPER_BUDGET },
      reward_series_length: run.iters,
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `fpo-receipt-${run.label}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

document.querySelectorAll(".toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => setRun(btn.dataset.run));
});

document.getElementById("download-receipt").addEventListener("click", downloadReceipt);
window.addEventListener("resize", () => setRun(activeRun));

fetch("./data/demo.json")
  .then((r) => r.json())
  .then(mergeDemoData)
  .catch(() => {})
  .finally(() => setRun("cliff"));
