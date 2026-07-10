function statusClass(s) {
  if (s === "PASS") return "PASS";
  if (s === "FAIL") return "FAIL";
  if (s === "HOLD") return "WARN";
  return "SKIP";
}

function renderReceipt(r) {
  const overall = document.getElementById("overallBadge");
  overall.textContent = r.overall || "—";
  overall.className = `overall-badge ${r.overall || ""}`;

  document.getElementById("runId").textContent = r.run_id || "demo-run";

  const gates = document.getElementById("gateList");
  gates.innerHTML = (r.gates || [])
    .map(
      (g) => `
      <li>
        <span class="gate-status ${g.status}">${g.status}</span>
        <span><strong>${g.name}</strong><br/><span style="color:var(--muted)">${g.detail}</span></span>
      </li>`
    )
    .join("");

  const m = r.plan_metrics || {};
  document.getElementById("metricHorizon").textContent = m.planning_horizon ?? "—";
  document.getElementById("metricSteps").textContent = m.simulated_plan_steps ?? "—";
  document.getElementById("metricStack").textContent = m.stack ?? "—";
  document.getElementById("metricSuccess").textContent =
    m.success_rate_mock != null ? `${(m.success_rate_mock * 100).toFixed(0)}%` : "—";

  const s = r.surprise || {};
  document.getElementById("surpriseMax").textContent =
    s.max_surprise != null ? s.max_surprise.toFixed(2) : "—";
  document.getElementById("surpriseThreshold").textContent =
    s.threshold != null ? s.threshold.toFixed(2) : "—";

  if (window.surpriseChart) {
    window.surpriseChart.destroy();
    window.surpriseChart = null;
  }

  const canvas = document.getElementById("surpriseChart");
  if (canvas && s.spike_indices) {
    const labels = Array.from({ length: s.num_steps || 16 }, (_, i) => i + 1);
    const data = labels.map((i) => (s.spike_indices.includes(i) ? 1 : 0.15));
    window.surpriseChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "surprise spike",
            data,
            backgroundColor: labels.map((i) =>
              s.spike_indices.includes(i) ? "#f5b83d" : "#243044"
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { maxTicksLimit: 12, color: "#8b9bb5" }, grid: { display: false } },
          y: { display: false },
        },
      },
    });
  }
}

async function loadReceipt() {
  const params = new URLSearchParams(location.search);
  const receiptParam = params.get("receipt");
  let url = "./sample_receipt.json";
  if (receiptParam) {
    try {
      url = new URL(receiptParam).pathname.endsWith(".json")
        ? receiptParam
        : receiptParam.replace(/\/$/, "") + "/summary.json";
    } catch {
      url = receiptParam;
    }
  }
  const res = await fetch(url);
  const data = await res.json();
  renderReceipt(data);
}

document.addEventListener("DOMContentLoaded", loadReceipt);
