function fmtDelta(delta) {
  if (delta == null || Number.isNaN(delta)) return "—";
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(4)}`;
}

function leakBadge(status) {
  const cls = status === "pass" ? "pass" : status === "fail" ? "fail" : "";
  const label = status === "pass" ? "pass" : status === "fail" ? "fail" : status;
  return `<span class="badge ${cls}">${label}</span>`;
}

function focusBadge(focus) {
  return `<span class="badge ${focus}">${focus}</span>`;
}

function renderSummary(receipt) {
  const best = receipt.summary.best_metric;
  document.getElementById("demo-meta").textContent = `${receipt.task} · ${receipt.summary.generation_count} generations`;
  document.getElementById("summary-cards").innerHTML = `
    <div class="card"><div class="label">Best generation</div><div class="value">${best ? best.generation : "—"}</div></div>
    <div class="card"><div class="label">${best ? best.metric : "Metric"}</div><div class="value">${best ? best.value.toFixed(2) : "—"}</div></div>
    <div class="card"><div class="label">Leak checks failed</div><div class="value">${receipt.summary.leak_failures}</div></div>
    <div class="card"><div class="label">Receipt version</div><div class="value">${receipt.receipt_version}</div></div>
  `;
}

function renderTable(receipt) {
  const tbody = document.getElementById("gen-rows");
  tbody.innerHTML = receipt.generations
    .map((g) => {
      const md = g.gain_attribution.metric_delta;
      const residue = g.integrity.transfer_evidence.residue || [];
      const residueText = residue.length ? residue[0] : "—";
      return `<tr data-gen="${g.generation}">
        <td>${g.generation}</td>
        <td>${focusBadge(g.focus)}</td>
        <td>${md.metric ? `${md.metric} ${fmtDelta(md.delta)}` : "—"}</td>
        <td>${fmtDelta(g.gain_attribution.harness_delta)}</td>
        <td>${leakBadge(g.integrity.private_leak_check.status)}</td>
        <td class="residue-cell" title="${residue.join(" · ")}">${residueText}</td>
      </tr>`;
    })
    .join("");

  tbody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      tbody.querySelectorAll("tr").forEach((r) => r.classList.remove("selected"));
      row.classList.add("selected");
      showGenDetail(receipt, Number(row.dataset.gen));
    });
  });

  const last = tbody.querySelector("tr:last-child");
  if (last) last.click();
}

function showGenDetail(receipt, genNum) {
  const gen = receipt.generations.find((g) => g.generation === genNum);
  document.getElementById("detail-view").textContent = JSON.stringify(gen, null, 2);
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === "detail"));
  document.getElementById("json-view").classList.add("hidden");
  document.getElementById("detail-view").classList.remove("hidden");
  document.getElementById("detail-view").setAttribute("aria-hidden", "false");
  document.getElementById("json-view").setAttribute("aria-hidden", "true");
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const showJson = tab.dataset.tab === "json";
      document.getElementById("json-view").classList.toggle("hidden", !showJson);
      document.getElementById("detail-view").classList.toggle("hidden", showJson);
      document.getElementById("json-view").setAttribute("aria-hidden", showJson ? "false" : "true");
      document.getElementById("detail-view").setAttribute("aria-hidden", showJson ? "true" : "false");
    });
  });
}

async function init() {
  const res = await fetch("./data/demo-receipt.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const receipt = await res.json();
  renderSummary(receipt);
  renderTable(receipt);
  document.getElementById("json-view").textContent = JSON.stringify(receipt, null, 2);
  setupTabs();
}

init().catch((err) => {
  document.getElementById("demo-meta").textContent = "Could not load demo data";
  document.getElementById("json-view").textContent = String(err);
});
