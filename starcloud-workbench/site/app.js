const RECEIPTS = {
  "starcloud-1__nanogpt-tiny": "data/starcloud-1__nanogpt-tiny.json",
  "starcloud-1__inference-batch": "data/starcloud-1__inference-batch.json",
  "starcloud-1__sar-compress": "data/starcloud-1__sar-compress.json",
  "starcloud-2__nanogpt-tiny": "data/starcloud-2__nanogpt-tiny.json",
  "starcloud-2__inference-batch": "data/starcloud-2__inference-batch.json",
  "starcloud-2__sar-compress": "data/starcloud-2__sar-compress.json",
};

let currentReceipt = null;
let activeTab = "summary";

let platformEl;
let workloadEl;
let runBtn;
let demoMetrics;
let doctorList;
let preview;
let timelineSvg;
let demoStatus;
let demoLabel;
let demoCommand;
let demoError;
let tabs;

function fmtNum(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}G`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) < 0.01 && n !== 0) return n.toExponential(2);
  return Number(n).toFixed(digits);
}

async function loadReceipt(platform, workload) {
  const key = `${platform}__${workload}`;
  const path = RECEIPTS[key];
  if (!path) throw new Error(`No receipt mapped for ${key}`);
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

function setError(message) {
  if (demoError) {
    demoError.hidden = !message;
    demoError.textContent = message || "";
  }
  if (preview && message) preview.textContent = message;
}

function renderMetrics(receipt) {
  if (!demoMetrics) return;
  const c = receipt.compute || {};
  const t = receipt.thermal || {};
  const p = receipt.power || {};
  const d = receipt.downlink || {};
  const cards = [
    ["Peak temp", `${fmtNum(t.peak_celsius)}°C`],
    ["Wall time", `${fmtNum(c.wall_seconds, 0)} s`],
    ["Throttle", `${fmtNum((p.throttle_fraction || 0) * 100, 1)}%`],
  ];
  if (d.bytes_saved > 0) {
    cards[2] = ["Bytes saved", fmtNum(d.bytes_saved, 2)];
  }
  demoMetrics.innerHTML = cards
    .map(
      ([label, value]) =>
        `<article><span>${label}</span><strong>${value}</strong></article>`
    )
    .join("");
}

function renderDoctor(rules) {
  if (!doctorList) return;
  const items = rules || [];
  doctorList.innerHTML = items.length
    ? items
        .map((r) => {
          const cls = r.pass ? (r.severity === "info" ? "info" : "pass") : r.severity;
          const mark = r.pass ? "PASS" : "FAIL";
          return `<div class="doctor-item ${cls}"><strong>${r.id} · ${mark}</strong>${r.message}</div>`;
        })
        .join("")
    : '<div class="doctor-item warn"><strong>No rules</strong>Receipt has no doctor output.</div>';
}

function pathFromSeries(values, maxV, yBase, yRange) {
  if (!values.length) return "";
  const step = 580 / Math.max(values.length - 1, 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = yBase - (v / maxV) * yRange;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function renderTimeline(timeline) {
  if (!timelineSvg) return;
  if (!timeline || !timeline.length) {
    timelineSvg.innerHTML =
      '<text x="20" y="90" fill="#5f6b7a" font-size="14" font-family="Inter, sans-serif">No timeline data in receipt</text>';
    return;
  }

  const sample = timeline.filter(
    (_, i) => i % Math.max(1, Math.floor(timeline.length / 120)) === 0
  );
  const solar = sample.map((s) => s.solar_w || 0);
  const temp = sample.map((s) => s.temp_c || 0);
  const soc = sample.map((s) => s.battery_soc || 0);

  const maxSolar = Math.max(...solar, 1);
  const maxTemp = Math.max(...temp, 1);
  const minTemp = Math.min(...temp, 0);

  const solarPath = pathFromSeries(solar, maxSolar, 150, 90);
  const tempPath = pathFromSeries(
    temp.map((v) => v - minTemp),
    Math.max(maxTemp - minTemp, 1),
    120,
    70
  );
  const socPath = pathFromSeries(soc, 1, 170, 50);

  timelineSvg.innerHTML = `
    <path class="grid-line" d="M0 44H580M0 92H580M0 140H580" />
    <path class="solar-fill" d="${solarPath} L580 180 L0 180 Z" />
    <path class="solar-line" d="${solarPath}" />
    <path class="temp-line" d="${tempPath}" />
    <path class="soc-line" d="${socPath}" />
  `;
}

function renderPreview(receipt) {
  if (!preview) return;
  if (activeTab === "json") {
    preview.textContent = JSON.stringify(receipt, null, 2);
    return;
  }
  const c = receipt.compute || {};
  const t = receipt.thermal || {};
  const d = receipt.downlink || {};
  const b = receipt.baseline || {};
  preview.textContent = JSON.stringify(
    {
      run_id: receipt.run_id,
      platform: receipt.platform,
      workload: receipt.workload,
      status: receipt.status,
      compute: c,
      thermal: t,
      downlink: {
        recommendation: d.recommendation,
        bytes_saved: d.bytes_saved,
        t_down_raw_s: d.t_down_raw_s,
        t_proc_s: d.t_proc_s,
        t_down_proc_s: d.t_down_proc_s,
      },
      baseline: b,
    },
    null,
    2
  );
}

function updateChrome(receipt) {
  if (demoLabel) demoLabel.textContent = `${receipt.workload} · ${receipt.platform}`;
  if (demoStatus) {
    demoStatus.textContent = receipt.status || "unknown";
    demoStatus.className = `badge ${receipt.status === "pass" ? "pass" : "fail"}`;
  }
  if (demoCommand) {
    demoCommand.textContent = `orbital-compute run --plan out/plans/${receipt.plan_id}.json --seed ${receipt.seed}`;
  }
}

async function runDemo() {
  if (!platformEl || !workloadEl) return;
  const platform = platformEl.value;
  const workload = workloadEl.value;
  if (runBtn) {
    runBtn.disabled = true;
    runBtn.textContent = "Loading…";
  }
  setError("");
  try {
    const receipt = await loadReceipt(platform, workload);
    currentReceipt = receipt;
    updateChrome(receipt);
    renderMetrics(receipt);
    renderDoctor(receipt.doctor);
    renderTimeline(receipt.timeline);
    renderPreview(receipt);
  } catch (err) {
    setError(String(err));
  } finally {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.textContent = "Load receipt";
    }
  }
}

function initDemo() {
  platformEl = document.getElementById("platform");
  workloadEl = document.getElementById("workload");
  runBtn = document.getElementById("run-demo");
  demoMetrics = document.getElementById("demo-metrics");
  doctorList = document.getElementById("doctor-list");
  preview = document.getElementById("receipt-preview");
  timelineSvg = document.getElementById("timeline-svg");
  demoStatus = document.getElementById("demo-status");
  demoLabel = document.getElementById("demo-label");
  demoCommand = document.getElementById("demo-command");
  demoError = document.getElementById("demo-error");
  tabs = document.querySelectorAll(".tab");

  if (!platformEl || !workloadEl || !demoMetrics || !doctorList || !preview || !timelineSvg) {
    setError("Demo UI failed to initialize. Hard-refresh the page (Cmd+Shift+R).");
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab || "summary";
      if (currentReceipt) renderPreview(currentReceipt);
    });
  });

  if (runBtn) runBtn.addEventListener("click", runDemo);
  platformEl.addEventListener("change", runDemo);
  workloadEl.addEventListener("change", runDemo);

  runDemo();
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
