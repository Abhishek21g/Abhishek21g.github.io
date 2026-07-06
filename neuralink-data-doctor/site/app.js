function formatBytes(n) {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GiB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MiB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${n} B`;
}

function formatRows(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function renderReport(report) {
  const plan = report.plan;
  const status = plan.warnings.length ? "warn" : "ok";
  const statusLabel = plan.warnings.length ? "warn" : "ok";

  document.getElementById("scenario-label").textContent =
    `${plan.file_count} files · implant partition`;

  document.getElementById("status-pill").className = `status-pill ${statusLabel}`;
  document.getElementById("status-pill").textContent = status;

  document.getElementById("metric-files").textContent = plan.file_count;
  document.getElementById("metric-rows").textContent = formatRows(plan.estimated_rows);
  document.getElementById("metric-memory").textContent = formatBytes(plan.peak_memory_all_at_once_bytes);
  document.getElementById("metric-batching").textContent = plan.use_batching ? "yes" : "no";
  document.getElementById("metric-batch-size").textContent = plan.recommended_batch_size;

  const warningsEl = document.getElementById("warnings");
  warningsEl.innerHTML = "";
  if (plan.warnings.length === 0) {
    const li = document.createElement("li");
    li.style.color = "var(--ok)";
    li.textContent = "Partition fetch plan looks healthy.";
    warningsEl.appendChild(li);
  } else {
    plan.warnings.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w;
      warningsEl.appendChild(li);
    });
  }

  document.getElementById("receipt-json").textContent = JSON.stringify(report, null, 2);
}

async function loadScenario(name) {
  const res = await fetch(`data/${name}-report.json`);
  const report = await res.json();
  renderReport(report);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    loadScenario(tab.dataset.scenario);
  });
});

loadScenario("small");
