let profileMode = "stennis-ship";
let charts = {};

function destroyCharts() {
  Object.values(charts).forEach((c) => c?.destroy?.());
  charts = {};
}

async function initDashboard() {
  const analytics = await RelOps.loadAnalytics();
  const scenarios = await RelOps.loadScenarios();
  renderScenarioCards(scenarios);
  bindProfileTabs();
  await refreshDashboard(analytics);
  window.addEventListener("relops-theme-change", async () => {
    const a = await RelOps.loadAnalytics();
    await refreshDashboard(a);
  });
}

function bindProfileTabs() {
  document.querySelectorAll(".mode-tab[data-profile]").forEach((tab) => {
    tab.addEventListener("click", async () => {
      profileMode = tab.dataset.profile;
      document.querySelectorAll(".mode-tab[data-profile]").forEach((t) => {
        t.classList.toggle("active", t.dataset.profile === profileMode);
      });
      const analytics = await RelOps.loadAnalytics();
      await refreshDashboard(analytics);
    });
  });
}

async function refreshDashboard(analytics) {
  const receipt = await RelOps.loadReceipt(profileMode);
  const profile = analytics.profiles[profileMode];
  const colors = RelOps.chartColors();

  document.getElementById("controlNote").textContent =
    profileMode === "stennis-ship"
      ? "Coordination stress test — intentional doctor failures on synthetic May 2026 S2 ship DAG."
      : "Powder-to-pad compiler mode — full print-genome chain attestation with zero findings.";

  destroyCharts();
  renderHealthChart(analytics, colors);
  renderRobustnessChart(analytics, colors);
  renderHeatmap(analytics, colors);
  renderTimelineChart(receipt, colors);
  renderDifficulty(analytics);
  updateHeroStats(receipt, profile);
}

function updateHeroStats(receipt, profile) {
  const t = receipt.timeline_summary || {};
  document.getElementById("dashSlack").textContent = `${t.critical_path_slack_h ?? 0}h`;
  document.getElementById("dashTransport").textContent = t.makes_transport_window ? "PASS" : "FAIL";
  document.getElementById("dashFindings").textContent = `${profile.failed}F / ${profile.warned}W`;
  document.getElementById("dashHealth").textContent = `${profile.health_score}%`;
}

function renderHealthChart(analytics, colors) {
  const ctx = document.getElementById("healthChart");
  const labels = Object.keys(analytics.profiles).map((k) => k.replace(/-/g, " "));
  const data = Object.values(analytics.profiles).map((p) => p.health_score);
  charts.health = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Receipt health",
          data,
          backgroundColor: data.map((v) => RelOps.scoreColor(v, colors)),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: colors.text, callback: (v) => `${v}%` },
          grid: { color: colors.grid },
        },
        x: { ticks: { color: colors.text }, grid: { display: false } },
      },
    },
  });
}

function renderRobustnessChart(analytics, colors) {
  const ctx = document.getElementById("robustnessChart");
  const labels = analytics.robustness.labels;
  const palette = [colors.good, colors.warn, colors.bad, colors.cyan, colors.accent];
  const datasets = Object.entries(analytics.robustness)
    .filter(([k]) => k !== "labels")
    .map(([key, values], i) => ({
      label: key.replace(/-/g, " "),
      data: values,
      borderColor: palette[i % palette.length],
      backgroundColor: "transparent",
      tension: 0.35,
      pointRadius: 4,
    }));

  charts.robustness = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.text, boxWidth: 12 },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: colors.text, callback: (v) => `${v}%` },
          grid: { color: colors.grid },
        },
        x: { ticks: { color: colors.text }, grid: { color: colors.grid } },
      },
    },
  });
}

function renderHeatmap(analytics, colors) {
  const canvas = document.getElementById("heatmapChart");
  const ctx = canvas.getContext("2d");
  const rules = analytics.doctor_rules.slice(0, 8);
  const profiles = Object.keys(analytics.profiles);
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cellW = (w - 80) / profiles.length;
  const cellH = (h - 40) / rules.length;

  profiles.forEach((profile, x) => {
    const receiptKey = profile;
    rules.forEach((rule, y) => {
      const triggered =
        profile === "stennis-ship" &&
        ["PRINT_QUEUE_OVERRUN", "AS_BUILT_REVISION_DRIFT", "GATE_SIGNOFF_MISSING", "TEST_STAND_NOT_READY", "RELEASE_WAVE_BACKLOG"].includes(rule);
      const color = triggered ? colors.bad : colors.good;
      ctx.fillStyle = triggered ? "rgba(248,113,113,0.75)" : "rgba(52,211,153,0.55)";
      ctx.fillRect(70 + x * cellW, 16 + y * cellH, cellW - 6, cellH - 6);
      ctx.fillStyle = colors.text;
      ctx.font = "10px IBM Plex Mono";
      if (x === 0) {
        ctx.textAlign = "right";
        ctx.fillText(rule.slice(0, 18), 64, 24 + y * cellH + cellH / 2);
      }
    });
    ctx.textAlign = "center";
    ctx.fillStyle = colors.text;
    ctx.font = "11px Instrument Sans";
    ctx.fillText(profile.replace("stennis", "S2").replace("powder-to-pad-compiler", "compiler"), 70 + x * cellW + cellW / 2, h - 8);
  });
}

function renderTimelineChart(receipt, colors) {
  const ctx = document.getElementById("timelineChart");
  const cp = receipt.timeline_summary?.critical_path || [];
  const schedule = receipt.schedule || [];
  const byId = Object.fromEntries(schedule.map((s) => [s.node_id, s]));
  const labels = cp.map((id) => id.replace(/^(DR|PJ|NDT|FR|INT|CHK|TRN)-/, ""));
  const ends = cp.map((id) => byId[id]?.scheduled_end_h ?? 0);
  charts.timeline = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Critical path hours",
          data: ends,
          borderColor: colors.accent,
          backgroundColor: "rgba(249,115,22,0.15)",
          fill: true,
          tension: 0.25,
          pointBackgroundColor: colors.accent,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: colors.text, callback: (v) => `${v}h` },
          grid: { color: colors.grid },
        },
        x: { ticks: { color: colors.text, maxRotation: 45 }, grid: { display: false } },
      },
    },
  });
}

function renderDifficulty(analytics) {
  const el = document.getElementById("difficultyList");
  el.innerHTML = analytics.rule_difficulty
    .map(
      (item, i) => `
      <li>
        <span>${i + 1}</span>
        <div>
          <div>${item.rule.replace(/_/g, " ")}</div>
          <div class="difficulty-bar"><span style="width:${item.trigger_rate}%"></span></div>
        </div>
        <strong>${item.trigger_rate}%</strong>
      </li>`
    )
    .join("");
}

function renderScenarioCards(scenarios) {
  const grid = document.getElementById("scenarioGrid");
  grid.innerHTML = scenarios
    .map(
      (s) => `
      <a class="scenario-card" href="runner.html?profile=${s.id}">
        <div class="scenario-meta">${s.nodes} nodes · ${s.gates} gates · ${s.health_score}% health</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <span class="scenario-open">Open in Live Runner →</span>
      </a>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", initDashboard);
