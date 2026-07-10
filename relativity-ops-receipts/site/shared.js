const RECEIPTS = {
  "stennis-ship": "data/stennis-ship.json",
  "powder-to-pad-compiler": "data/powder-to-pad-compiler.json",
};

const NODE_TYPE_LABELS = {
  design_release: "Design",
  print_job: "Print",
  ndt_gate: "NDT",
  flight_release: "Release",
  integration: "Mate",
  checkout: "Checkout",
  transport: "Move",
  test_stand_prep: "Stand",
};

let analyticsCache = null;
let scenariosCache = null;

function initTheme() {
  const saved = localStorage.getItem("relops-theme") || "dark";
  document.documentElement.dataset.theme = saved;
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.textContent = saved === "dark" ? "☀" : "☾";
    btn.setAttribute(
      "aria-label",
      saved === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("relops-theme", next);
      document.querySelectorAll(".theme-toggle").forEach((el) => {
        el.textContent = next === "dark" ? "☀" : "☾";
      });
      window.dispatchEvent(new CustomEvent("relops-theme-change"));
    });
  });
}

function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
}

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

async function loadReceipt(id) {
  return loadJson(RECEIPTS[id]);
}

async function loadAnalytics() {
  if (!analyticsCache) analyticsCache = await loadJson("data/analytics.json");
  return analyticsCache;
}

async function loadScenarios() {
  if (!scenariosCache) scenariosCache = await loadJson("data/scenarios.json");
  return scenariosCache;
}

function chartColors() {
  const dark = document.documentElement.dataset.theme !== "light";
  return {
    text: dark ? "#8b97ab" : "#5c6670",
    grid: dark ? "rgba(255,255,255,0.06)" : "rgba(15,20,25,0.08)",
    good: "#34d399",
    warn: "#fbbf24",
    bad: "#f87171",
    accent: "#f97316",
    cyan: "#2dd4bf",
  };
}

function scoreColor(score, colors) {
  if (score >= 85) return colors.good;
  if (score >= 60) return colors.warn;
  return colors.bad;
}

function renderDoctorList(el, findings) {
  if (!findings?.length) {
    el.innerHTML =
      '<div class="doctor-item OK"><strong>ALL CLEAR</strong>Every doctor rule passed on this profile.</div>';
    return;
  }
  el.innerHTML = findings
    .map(
      (f) =>
        `<div class="doctor-item ${f.severity}"><strong>${f.rule_id} · ${f.severity}</strong>${f.message}</div>`
    )
    .join("");
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  markActiveNav();
});

window.RelOps = {
  RECEIPTS,
  NODE_TYPE_LABELS,
  loadReceipt,
  loadAnalytics,
  loadScenarios,
  chartColors,
  scoreColor,
  renderDoctorList,
  downloadJson,
};
