let severityChart = null;
let currentReceipt = null;

const SCENARIOS = {
  broken: {
    waypoints: [
      { x: 20, y: 20, label: "start" },
      { x: 45, y: 30, label: "ripple_trap", bad: true },
      { x: 70, y: 40, label: "exit" },
    ],
    patches: [{ x: 45, y: 30, r: 12, class: "sand_ripple" }],
    keepOut: [],
    receiptUrl: "./sample_receipt.json",
  },
  worthy: {
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
    keepOut: [{ x: 120, y: 85, r: 15 }],
    receiptUrl: "./sample-worthy.json",
  },
};

let activeScenario = "broken";

/* ── Starfield ── */
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

/* ── Drive map ── */
function drawDriveMap(scenarioKey) {
  const canvas = document.getElementById("driveMap");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const sc = SCENARIOS[scenarioKey];
  const w = canvas.width;
  const h = canvas.height;
  const pad = 40;

  ctx.clearRect(0, 0, w, h);

  // Mars surface gradient
  const bg = ctx.createRadialGradient(w * 0.4, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, "#3d1a12");
  bg.addColorStop(0.5, "#1a0c08");
  bg.addColorStop(1, "#0a0604");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Grid
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
  const minX = Math.min(...allX) - 15;
  const maxX = Math.max(...allX) + 15;
  const minY = Math.min(...allY) - 15;
  const maxY = Math.max(...allY) + 15;

  const sx = (w - pad * 2) / (maxX - minX);
  const sy = (h - pad * 2) / (maxY - minY);
  const scale = Math.min(sx, sy);
  const ox = pad + (w - pad * 2 - (maxX - minX) * scale) / 2;
  const oy = pad + (h - pad * 2 - (maxY - minY) * scale) / 2;

  const tx = (x) => ox + (x - minX) * scale;
  const ty = (y) => oy + (maxY - y) * scale;

  // Patches
  for (const p of sc.patches) {
    const px = tx(p.x);
    const py = ty(p.y);
    const pr = p.r * scale;
    if (p.class === "sand_ripple") {
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 165, 116, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 165, 116, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(212, 165, 116, 0.8)";
      ctx.font = "10px IBM Plex Mono, monospace";
      ctx.fillText("sand_ripple", px - pr, py - pr - 4);
    }
  }

  for (const k of sc.keepOut || []) {
    const px = tx(k.x);
    const py = ty(k.y);
    const pr = k.r * scale;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 92, 92, 0.5)";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Trail
  if (sc.waypoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(tx(sc.waypoints[0].x), ty(sc.waypoints[0].y));
    for (let i = 1; i < sc.waypoints.length; i++) {
      const prev = sc.waypoints[i - 1];
      const curr = sc.waypoints[i];
      const badSeg = prev.bad || curr.bad;
      ctx.strokeStyle = badSeg ? "rgba(255, 92, 92, 0.7)" : "rgba(61, 214, 140, 0.6)";
      ctx.lineWidth = badSeg ? 3 : 2;
      ctx.setLineDash(badSeg ? [6, 4] : []);
      ctx.lineTo(tx(curr.x), ty(curr.y));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx(curr.x), ty(curr.y));
    }
    ctx.setLineDash([]);
  }

  // Waypoints
  sc.waypoints.forEach((wp, i) => {
    const px = tx(wp.x);
    const py = ty(wp.y);
    const r = i === 0 || i === sc.waypoints.length - 1 ? 7 : 5;
    ctx.beginPath();
    ctx.arc(px, py, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = wp.bad ? "rgba(255, 92, 92, 0.25)" : "rgba(255, 179, 71, 0.2)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = wp.bad ? "#ff5c5c" : i === 0 ? "#3dd68c" : "#ffb347";
    ctx.fill();
    ctx.fillStyle = "rgba(244, 236, 232, 0.85)";
    ctx.font = "9px IBM Plex Mono, monospace";
    ctx.fillText(wp.label, px + 10, py + 3);
  });
}

/* ── Receipt dashboard ── */
function renderReceipt(r) {
  currentReceipt = r;
  const worthyEl = document.getElementById("worthyBadge");
  worthyEl.textContent = r.worthy ? "WORTHY" : "NOT WORTHY";
  worthyEl.className = "worthy-badge " + (r.worthy ? "yes" : "no");

  document.getElementById("worthyLabel").textContent = r.worthy
    ? "Plan passes oracle — send to digital-twin preflight"
    : "Fix critical findings before burning sim time";

  const summary = r.summary || {};
  document.getElementById("critCount").textContent = summary.critical || 0;
  document.getElementById("warnCount").textContent = summary.warning || 0;
  document.getElementById("infoCount").textContent = summary.info || 0;

  const sol = r.sol != null ? String(r.sol) : "—";
  document.getElementById("metaSol").textContent = sol;
  document.getElementById("planLabel").textContent = r.plan_name || "";
  document.getElementById("planPath").textContent = r.plan_path || "—";
  document.getElementById("generatedAt").textContent = r.generated_at
    ? new Date(r.generated_at).toLocaleString()
    : "—";

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
  if (critical && !r.worthy) {
    fixEl.hidden = false;
    fixEl.innerHTML = `Fix first: <strong>${critical.code}</strong> — ${critical.message}`;
  } else {
    fixEl.hidden = true;
  }

  // Hero verdict sync
  const heroVerdict = document.getElementById("heroVerdict");
  if (heroVerdict) {
    heroVerdict.className = "verdict-card " + (r.worthy ? "good" : "bad");
    heroVerdict.querySelector(".verdict-value").textContent = r.worthy
      ? "WORTHY"
      : "NOT WORTHY";
    heroVerdict.querySelector(".verdict-sub").textContent = r.worthy
      ? "Passes to digital-twin preflight"
      : (critical ? `${critical.code} · ${critical.message.slice(0, 60)}…` : "Critical findings");
  }

  const ctx = document.getElementById("severityChart");
  if (typeof Chart !== "undefined" && ctx) {
    if (severityChart) severityChart.destroy();
    severityChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Critical", "Warning", "Info"],
        datasets: [
          {
            data: [summary.critical || 0, summary.warning || 0, summary.info || 0],
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

async function loadReceipt(url) {
  const res = await fetch(url);
  renderReceipt(await res.json());
}

function setScenario(key) {
  activeScenario = key;
  document.querySelectorAll(".map-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.scenario === key);
  });
  drawDriveMap(key);
  loadReceipt(SCENARIOS[key].receiptUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  drawDriveMap("broken");

  document.querySelectorAll(".map-tab").forEach((btn) => {
    btn.addEventListener("click", () => setScenario(btn.dataset.scenario));
  });

  document.getElementById("loadBroken")?.addEventListener("click", () => setScenario("broken"));
  document.getElementById("loadWorthy")?.addEventListener("click", () => setScenario("worthy"));

  document.getElementById("fileInput")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => renderReceipt(JSON.parse(reader.result));
    reader.readAsText(file);
  });

  document.getElementById("copyReceipt")?.addEventListener("click", () => {
    if (!currentReceipt) return;
    navigator.clipboard.writeText(JSON.stringify(currentReceipt, null, 2));
  });

  loadReceipt("./sample_receipt.json").catch(() => {});
});
