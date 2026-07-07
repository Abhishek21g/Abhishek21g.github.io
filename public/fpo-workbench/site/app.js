const PAPER_TARGET = 37;
const PAPER_BUDGET = 2000;

const RUN_META = {
  cliff: {
    key: "cliff",
    label: "g1-cliff-synthetic",
    match: "cliff",
    iters: 5000,
    envs: 4096,
    cliffIter: 4099,
    cliffDrop: "−67%",
    series: () => generateCliffSeries(5000),
    terminalCmd: "fpo-workbench doctor out/receipts/g1-cliff —json",
  },
  healthy: {
    key: "healthy",
    label: "g1-healthy-synthetic",
    match: "healthy",
    iters: 2000,
    envs: 4096,
    cliffIter: null,
    cliffDrop: "—",
    series: () => generateHealthySeries(2000),
    terminalCmd: "fpo-workbench doctor out/receipts/g1-healthy —json",
  },
};

let demoData = null;
let currentRun = null;
let activeTab = "summary";

let runSelectEl;
let runBtn;
let demoMetrics;
let doctorList;
let preview;
let timelineSvg;
let heroChartSvg;
let demoStatus;
let demoLabel;
let demoCommand;
let demoError;
let tabs;

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

function peakReward(series) {
  return series.reduce((best, p) => (p.y > best ? p.y : best), 0);
}

function mergeDemoData(payload) {
  if (!payload?.runs) return;
  demoData = payload;
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
      const drop = cliffSignal.details.drop_fraction;
      if (drop != null) RUN_META[key].cliffDrop = `−${(drop * 100).toFixed(0)}%`;
    } else if (key === "healthy") {
      RUN_META[key].cliffDrop = "—";
    }
    if (entry.doctor?.baseline_grade?.peak_reward != null) {
      RUN_META[key].peak = entry.doctor.baseline_grade.peak_reward;
    }
  }
}

function getRun(key) {
  const meta = RUN_META[key];
  const doctor = meta.doctor || { overall_status: key === "healthy" ? "healthy" : "unhealthy", signals: [] };
  const series = meta.series();
  return {
    ...meta,
    status: doctor.overall_status,
    baseline: meta.baseline || doctor.baseline_grade?.message || "",
    peak: meta.peak ?? peakReward(series),
    doctor,
    series,
  };
}

function pathFromSeries(series, maxY, yBase, yRange, width = 580) {
  if (!series.length) return "";
  const maxX = series[series.length - 1].x;
  const step = width / Math.max(series.length - 1, 1);
  return series
    .map((p, i) => {
      const x = i * step;
      const y = yBase - (p.y / maxY) * yRange;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function renderRewardChart(svg, series, cliffIter) {
  if (!svg) return;
  const maxY = 42;
  const maxX = series[series.length - 1].x;
  const rewardPath = pathFromSeries(series, maxY, 150, 90);
  const budgetX = (PAPER_BUDGET / maxX) * 580;
  const targetY = 150 - (PAPER_TARGET / maxY) * 90;

  let cliffMarker = "";
  if (cliffIter != null) {
    const pt = series[cliffIter] || series[series.length - 1];
    const cx = (cliffIter / maxX) * 580;
    const cy = 150 - (pt.y / maxY) * 90;
    cliffMarker = `<circle class="cliff-marker" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" />`;
  }

  svg.innerHTML = `
    <path class="grid-line" d="M0 44H580M0 92H580M0 140H580" />
    <line class="budget-line" x1="${budgetX.toFixed(1)}" y1="20" x2="${budgetX.toFixed(1)}" y2="160" />
    <line class="target-line" x1="0" y1="${targetY.toFixed(1)}" x2="580" y2="${targetY.toFixed(1)}" />
    <path class="reward-fill" d="${rewardPath} L580 180 L0 180 Z" />
    <path class="reward-line" d="${rewardPath}" />
    ${cliffMarker}
  `;
}

function renderHeroDoctor(signals) {
  const table = document.getElementById("hero-doctor");
  if (!table) return;
  const head = table.querySelector(".table-head");
  table.innerHTML = "";
  if (head) table.appendChild(head);
  else {
    const row = document.createElement("div");
    row.className = "table-head";
    row.setAttribute("role", "row");
    row.innerHTML = `
      <span role="columnheader">signal</span>
      <span role="columnheader">severity</span>
      <span role="columnheader">result</span>
    `;
    table.appendChild(row);
  }
  for (const s of signals) {
    const row = document.createElement("div");
    row.setAttribute("role", "row");
    const resultCls = s.status === "pass" ? "pass-cell" : "fail-cell";
    const result = s.status === "pass" ? "pass" : "fail";
    row.innerHTML = `
      <span role="cell">${s.signal}</span>
      <span role="cell">${s.status}</span>
      <span role="cell ${resultCls}">${result}</span>
    `;
    table.appendChild(row);
  }
}

function renderMetrics(container, run) {
  if (!container) return;
  const cards = [
    ["Peak reward", run.peak.toFixed(1)],
    ["Iters", String(run.iters)],
    ["Cliff drop", run.cliffDrop],
  ];
  container.innerHTML = cards
    .map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderDoctor(signals) {
  if (!doctorList) return;
  doctorList.innerHTML = (signals || [])
    .map((s) => {
      const cls = s.status === "pass" ? "pass" : s.status === "fail" ? "fail" : "warn";
      const mark = s.status === "pass" ? "PASS" : s.status === "fail" ? "FAIL" : "WARN";
      return `<div class="doctor-item ${cls}"><strong>${s.signal} · ${mark}</strong>${s.message}</div>`;
    })
    .join("");
}

function buildReceipt(run) {
  return {
    workbench: "fpo-workbench",
    version: "0.1.0",
    exported_at: new Date().toISOString(),
    run: run.label,
    receipt_dir: run.receiptDir,
    doctor: run.doctor,
    summary: run.summary || {
      experiment_name: "g1_flat_flow",
      baseline: {
        task_id: "Isaac-Velocity-Flat-G1-v0",
        target_return: PAPER_TARGET,
        max_iterations: PAPER_BUDGET,
      },
      reward_series_length: run.iters,
    },
  };
}

function renderPreview(run) {
  if (!preview) return;
  const receipt = buildReceipt(run);
  if (activeTab === "doctor") {
    preview.textContent = JSON.stringify(run.doctor, null, 2);
    return;
  }
  if (activeTab === "json") {
    preview.textContent = JSON.stringify(receipt, null, 2);
    return;
  }
  preview.textContent = JSON.stringify(
    {
      run: run.label,
      status: run.status,
      peak_reward: run.peak,
      paper_target: PAPER_TARGET,
      iters: run.iters,
      baseline_grade: run.doctor.baseline_grade,
      signals: run.doctor.signals?.map((s) => ({
        signal: s.signal,
        status: s.status,
        message: s.message,
      })),
    },
    null,
    2
  );
}

function updateChrome(run) {
  currentRun = run;

  if (demoLabel) demoLabel.textContent = run.label;
  if (demoStatus) {
    demoStatus.textContent = run.status;
    demoStatus.className = `badge ${run.status}`;
  }
  if (demoCommand) demoCommand.textContent = run.terminalCmd;

  const heroLabel = document.getElementById("hero-run-label");
  const heroBadge = document.getElementById("hero-badge");
  const heroCmd = document.getElementById("hero-command");
  const heroDot = document.getElementById("hero-status-dot");
  const baselineLine = document.getElementById("baseline-line");

  if (heroLabel) heroLabel.textContent = run.label;
  if (heroBadge) {
    heroBadge.textContent = run.status;
    heroBadge.className = `badge ${run.status}`;
  }
  if (heroCmd) heroCmd.textContent = run.terminalCmd;
  if (heroDot) {
    heroDot.className = `status-dot ${run.status === "healthy" ? "" : run.status === "unhealthy" ? "fail" : "warn"}`;
  }
  if (baselineLine) baselineLine.textContent = run.baseline;

  renderMetrics(document.getElementById("hero-metrics"), run);
  renderMetrics(demoMetrics, run);
  renderDoctor(run.doctor.signals);
  renderHeroDoctor(run.doctor.signals);
  renderRewardChart(timelineSvg, run.series, run.cliffIter);
  renderRewardChart(heroChartSvg, run.series, run.cliffIter);
  renderPreview(run);
}

function setError(message) {
  if (demoError) {
    demoError.hidden = !message;
    demoError.textContent = message || "";
  }
}

async function runDemo() {
  if (!runSelectEl) return;
  const key = runSelectEl.value;
  if (runBtn) {
    runBtn.disabled = true;
    runBtn.textContent = "Loading…";
  }
  setError("");
  try {
    const run = getRun(key);
    updateChrome(run);
  } catch (err) {
    setError(String(err));
  } finally {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.textContent = "Load receipt";
    }
  }
}

function downloadReceipt() {
  if (!currentRun) return;
  const payload = buildReceipt(currentRun);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `fpo-receipt-${currentRun.label}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function initDemo() {
  runSelectEl = document.getElementById("run-select");
  runBtn = document.getElementById("run-demo");
  demoMetrics = document.getElementById("demo-metrics");
  doctorList = document.getElementById("doctor-list");
  preview = document.getElementById("receipt-preview");
  timelineSvg = document.getElementById("timeline-svg");
  heroChartSvg = document.getElementById("hero-chart");
  demoStatus = document.getElementById("demo-status");
  demoLabel = document.getElementById("demo-label");
  demoCommand = document.getElementById("demo-command");
  demoError = document.getElementById("demo-error");
  tabs = document.querySelectorAll(".tab");

  if (!runSelectEl || !demoMetrics || !doctorList || !preview || !timelineSvg) {
    setError("Demo UI failed to initialize. Hard-refresh the page (Cmd+Shift+R).");
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab || "summary";
      if (currentRun) renderPreview(currentRun);
    });
  });

  if (runBtn) runBtn.addEventListener("click", runDemo);
  runSelectEl.addEventListener("change", runDemo);

  const dl = document.getElementById("download-receipt");
  if (dl) {
    dl.addEventListener("click", (e) => {
      e.preventDefault();
      downloadReceipt();
    });
  }

  fetch("./data/demo.json")
    .then((r) => r.json())
    .then(mergeDemoData)
    .catch(() => {})
    .finally(() => runDemo());
}

const header = document.querySelector(".site-header");
window.addEventListener(
  "scroll",
  () => {
    if (header) header.dataset.scrolled = window.scrollY > 10 ? "true" : "false";
  },
  { passive: true }
);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDemo);
} else {
  initDemo();
}
