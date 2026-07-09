let severityChart = null;
let currentReceipt = null;

const SCENARIOS = {
  broken: {
    label: "FAIL",
    worthy: false,
    receiptUrl: "./sample_receipt.json",
    title: "Sol 1709: AI drove through sand ripple",
    desc: 'Waypoint <code>ripple_trap</code> sits inside forbidden <code>sand_ripple</code>. Segments are too long. Ghost Lane says <strong>do not</strong> send to twin.',
    stats: { waypoints: 3, distance: "54 m", segment: "26.9 m", findings: "3 critical" },
    waypoints: [
      { x: 20, y: 20, label: "start" },
      { x: 45, y: 30, label: "ripple_trap", bad: true, violation: true },
      { x: 70, y: 40, label: "exit" },
    ],
    patches: [{ x: 45, y: 30, r: 12, class: "sand_ripple" }],
    keepOut: [],
  },
  worthy: {
    label: "PASS",
    worthy: true,
    receiptUrl: "./sample-worthy.json",
    title: "Sol 1707: healthy Jezero breadcrumb trail",
    desc: "13 waypoints, 12 segments each under 10 m. Avoids keep-outs and ripple fields. Ghost Lane says <strong>worthy of twin</strong> preflight.",
    stats: { waypoints: 13, distance: "119 m", segment: "9.9 m", findings: "0" },
    waypoints: [
      { x: 100, y: 100, label: "start" },
      { x: 107, y: 107, label: "wp1" },
      { x: 114, y: 114, label: "wp2" },
      { x: 121, y: 121, label: "wp3" },
      { x: 128, y: 128, label: "wp4" },
      { x: 135, y: 135, label: "wp5" },
      { x: 142, y: 142, label: "wp6" },
      { x: 149, y: 149, label: "wp7" },
      { x: 156, y: 156, label: "wp8" },
      { x: 163, y: 163, label: "wp9" },
      { x: 170, y: 170, label: "wp10" },
      { x: 177, y: 177, label: "wp11" },
      { x: 184, y: 184, label: "wp12" },
    ],
    patches: [
      { x: 45, y: 30, r: 12, class: "sand_ripple" },
      { x: 120, y: 85, r: 15, class: "keep_out" },
    ],
    keepOut: [{ x: 120, y: 85, r: 15, label: "crater rim" }],
  },
};

let activeScenario = "broken";

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.5 + 0.2,
      sp: Math.random() * 0.015 + 0.005,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.sp * (Math.random() > 0.5 ? 1 : -1);
      s.a = Math.max(0.15, Math.min(0.85, s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 200, ${s.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function drawDriveMap(scenarioKey) {
  const canvas = document.getElementById("driveMap");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const sc = SCENARIOS[scenarioKey];
  const w = canvas.width;
  const h = canvas.height;
  const pad = 48;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(w * 0.4, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, "#3d1a12");
  bg.addColorStop(0.5, "#1a0c08");
  bg.addColorStop(1, "#0a0604");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255, 179, 71, 0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }
  for (let j = 0; j < h; j += 30) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(w, j);
    ctx.stroke();
  }

  const allX = sc.waypoints.map((p) => p.x);
  const allY = sc.waypoints.map((p) => p.y);
  sc.patches.forEach((p) => {
    allX.push(p.x - p.r, p.x + p.r);
    allY.push(p.y - p.r, p.y + p.r);
  });
  (sc.keepOut || []).forEach((k) => {
    allX.push(k.x - k.r, k.x + k.r);
    allY.push(k.y - k.r, k.y + k.r);
  });

  const minX = Math.min(...allX) - 18;
  const maxX = Math.max(...allX) + 18;
  const minY = Math.min(...allY) - 18;
  const maxY = Math.max(...allY) + 18;

  const scale = Math.min((w - pad * 2) / (maxX - minX), (h - pad * 2) / (maxY - minY));
  const ox = pad + (w - pad * 2 - (maxX - minX) * scale) / 2;
  const oy = pad + (h - pad * 2 - (maxY - minY) * scale) / 2;
  const tx = (x) => ox + (x - minX) * scale;
  const ty = (y) => oy + (maxY - y) * scale;

  for (const p of sc.patches) {
    const px = tx(p.x);
    const py = ty(p.y);
    const pr = p.r * scale;
    if (p.class === "sand_ripple") {
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 165, 116, 0.28)";
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 165, 116, 0.65)";
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#d4a574";
      ctx.font = "bold 11px IBM Plex Mono, monospace";
      ctx.fillText("sand_ripple", px - pr * 0.5, py - pr - 6);
    }
  }

  for (const k of sc.keepOut || []) {
    const px = tx(k.x);
    const py = ty(k.y);
    const pr = k.r * scale;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 92, 92, 0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 92, 92, 0.55)";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    if (k.label) {
      ctx.fillStyle = "#ff8a8a";
      ctx.font = "10px IBM Plex Mono, monospace";
      ctx.fillText(k.label, px - pr * 0.4, py + 4);
    }
  }

  if (sc.waypoints.length > 1) {
    for (let i = 1; i < sc.waypoints.length; i++) {
      const prev = sc.waypoints[i - 1];
      const curr = sc.waypoints[i];
      const badSeg = prev.bad || curr.bad || scenarioKey === "broken";
      ctx.beginPath();
      ctx.moveTo(tx(prev.x), ty(prev.y));
      ctx.lineTo(tx(curr.x), ty(curr.y));
      ctx.strokeStyle = badSeg ? "#ff5c5c" : "#3dd68c";
      ctx.lineWidth = badSeg ? 3.5 : 2.5;
      ctx.setLineDash(badSeg ? [8, 5] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  sc.waypoints.forEach((wp, i) => {
    const px = tx(wp.x);
    const py = ty(wp.y);
    const r = wp.violation ? 9 : i === 0 || i === sc.waypoints.length - 1 ? 7 : 5;

    if (wp.violation) {
      ctx.beginPath();
      ctx.arc(px, py, r + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 92, 92, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#ff5c5c";
      ctx.font = "bold 10px IBM Plex Mono, monospace";
      ctx.fillText("VIOLATION HERE", px - 52, py - r - 14);
    }

    ctx.beginPath();
    ctx.arc(px, py, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = wp.bad ? "rgba(255, 92, 92, 0.3)" : "rgba(255, 179, 71, 0.2)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = wp.bad ? "#ff5c5c" : i === 0 ? "#3dd68c" : "#ffb347";
    ctx.fill();

    if (wp.violation) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 4, py - 4);
      ctx.lineTo(px + 4, py + 4);
      ctx.moveTo(px + 4, py - 4);
      ctx.lineTo(px - 4, py + 4);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(244, 236, 232, 0.9)";
    ctx.font = "10px IBM Plex Mono, monospace";
    ctx.fillText(wp.label, px + 12, py + 4);
  });

  ctx.fillStyle = "rgba(255, 179, 71, 0.75)";
  ctx.font = "10px IBM Plex Mono, monospace";
  ctx.fillText(sc.label === "FAIL" ? "Oracle rejects this plan" : "Oracle passes this plan", 12, h - 14);
}

function updateScenarioBanner(key) {
  const sc = SCENARIOS[key];
  const banner = document.getElementById("scenarioBanner");
  const pill = document.getElementById("scenarioPill");
  if (!banner || !pill) return;

  banner.className = "scenario-banner " + (sc.worthy ? "pass" : "fail");
  pill.textContent = sc.worthy ? "WORTHY OF TWIN" : "NOT WORTHY";
  pill.className = "scenario-pill " + (sc.worthy ? "pass" : "fail");
  document.getElementById("scenarioTitle").textContent = sc.title;
  document.getElementById("scenarioDesc").innerHTML = sc.desc;
  document.getElementById("statWaypoints").textContent = sc.stats.waypoints;
  document.getElementById("statDistance").textContent = sc.stats.distance;
  document.getElementById("statSegment").textContent = sc.stats.segment;
  document.getElementById("statFindings").textContent = sc.stats.findings;
}

function syncToolbar(key) {
  const brokenBtn = document.getElementById("loadBroken");
  const worthyBtn = document.getElementById("loadWorthy");
  if (!brokenBtn || !worthyBtn) return;
  brokenBtn.className = "btn " + (key === "broken" ? "btn-mars" : "btn-ghost");
  worthyBtn.className = "btn " + (key === "worthy" ? "btn-mars" : "btn-ghost");
}

function renderReceipt(r) {
  currentReceipt = r;
  const worthy = !!r.worthy;

  const worthyEl = document.getElementById("worthyBadge");
  worthyEl.textContent = worthy ? "WORTHY" : "NOT WORTHY";
  worthyEl.className = "worthy-badge " + (worthy ? "yes" : "no");

  document.getElementById("worthyLabel").textContent = worthy
    ? "Send to digital-twin preflight"
    : "Do not burn sim time on this plan";

  const summary = r.summary || {};
  const crit = summary.critical || 0;
  const warn = summary.warning || 0;
  const info = summary.info || 0;
  document.getElementById("critCount").textContent = crit;
  document.getElementById("warnCount").textContent = warn;
  document.getElementById("infoCount").textContent = info;

  document.getElementById("metaSol").textContent = r.sol != null ? String(r.sol) : "n/a";
  document.getElementById("planLabel").textContent = r.plan_name || "";
  document.getElementById("planPath").textContent = r.plan_path || "n/a";
  document.getElementById("generatedAt").textContent = r.generated_at
    ? new Date(r.generated_at).toLocaleString()
    : "n/a";

  const stats = r.stats || {};
  document.getElementById("dashWaypoints").textContent = stats.waypoints ?? "n/a";
  document.getElementById("dashDistance").textContent =
    stats.distance_m != null ? `${stats.distance_m} m` : "n/a";
  document.getElementById("dashEnergy").textContent =
    stats.energy_wh != null ? `${stats.energy_wh} Wh` : "n/a";
  document.getElementById("dashMaxSeg").textContent =
    stats.max_segment_m != null ? `${stats.max_segment_m} m` : "n/a";

  document.getElementById("notesList").innerHTML = (r.notes || [])
    .map((n) => `<li>${n}</li>`)
    .join("");

  const findings = r.findings || [];
  const list = document.getElementById("findingsList");
  if (!findings.length) {
    list.innerHTML = '<li style="color:var(--good)">All oracle constraints satisfied.</li>';
  } else {
    list.innerHTML = findings
      .map((f) => {
        const where = f.waypoint
          ? `<br/><span class="code-tag">${f.waypoint}</span>`
          : f.segment
            ? `<br/><span class="code-tag">${f.segment}</span>`
            : "";
        return `<li>
          <span class="sev sev-${f.severity}">${f.severity}</span>
          <strong>${f.code}</strong>: ${f.message}${where}
        </li>`;
      })
      .join("");
  }

  const critical = findings.find((f) => f.severity === "critical");
  const fixEl = document.getElementById("fixFirst");
  if (critical && !worthy) {
    fixEl.hidden = false;
    fixEl.innerHTML = `Fix first: <strong>${critical.code}</strong> at ${critical.waypoint || critical.segment || "plan"}`;
  } else {
    fixEl.hidden = true;
  }

  const heroVerdict = document.getElementById("heroVerdict");
  if (heroVerdict) {
    heroVerdict.className = "verdict-card " + (worthy ? "good" : "bad");
    heroVerdict.querySelector(".verdict-value").textContent = worthy ? "WORTHY" : "NOT WORTHY";
    heroVerdict.querySelector(".verdict-sub").textContent = worthy
      ? "Passes to digital-twin preflight"
      : critical
        ? `${critical.code} at ${critical.waypoint || "plan"}`
        : "Critical findings";
  }

  const chartEmpty = document.getElementById("chartEmpty");
  const total = crit + warn + info;
  const ctx = document.getElementById("severityChart");
  if (typeof Chart !== "undefined" && ctx) {
    if (severityChart) severityChart.destroy();
    if (total === 0) {
      severityChart = null;
      if (chartEmpty) chartEmpty.hidden = false;
    } else {
      if (chartEmpty) chartEmpty.hidden = true;
      severityChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Critical", "Warning", "Info"],
          datasets: [
            {
              data: [crit, warn, info],
              backgroundColor: ["#ff5c5c", "#f5b83d", "#ffb347"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: { legend: { labels: { color: "#9a8890", font: { size: 11 } } } },
          cutout: "68%",
        },
      });
    }
  }
}

async function loadReceipt(url) {
  const res = await fetch(url);
  renderReceipt(await res.json());
}

function setScenario(key) {
  activeScenario = key;
  document.querySelectorAll(".map-tab").forEach((btn) => {
    const on = btn.dataset.scenario === key;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  updateScenarioBanner(key);
  syncToolbar(key);
  drawDriveMap(key);
  loadReceipt(SCENARIOS[key].receiptUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  setScenario("broken");

  document.querySelectorAll(".map-tab").forEach((btn) => {
    btn.addEventListener("click", () => setScenario(btn.dataset.scenario));
  });

  document.getElementById("loadBroken")?.addEventListener("click", () => setScenario("broken"));
  document.getElementById("loadWorthy")?.addEventListener("click", () => setScenario("worthy"));

  document.getElementById("fileInput")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      renderReceipt(JSON.parse(reader.result));
      document.querySelectorAll(".map-tab").forEach((b) => b.classList.remove("active"));
    };
    reader.readAsText(file);
  });

  document.getElementById("copyReceipt")?.addEventListener("click", () => {
    if (!currentReceipt) return;
    navigator.clipboard.writeText(JSON.stringify(currentReceipt, null, 2));
  });
});
