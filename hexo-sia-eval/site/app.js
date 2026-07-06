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
  document.getElementById("demo-meta").textContent = `${receipt.task} · ${receipt.summary.generation_count} gens · real compiler output`;
  document.getElementById("summary-cards").innerHTML = `
    <div class="card"><div class="label">Best generation</div><div class="value">${best ? best.generation : "—"}</div></div>
    <div class="card"><div class="label">${best ? best.metric : "Metric"}</div><div class="value">${best ? best.value.toFixed(2) : "—"}</div></div>
    <div class="card"><div class="label">Leak failures</div><div class="value">${receipt.summary.leak_failures}</div></div>
    <div class="card"><div class="label">Receipt</div><div class="value">${receipt.receipt_version}</div></div>
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

function showView(tabName) {
  const views = { json: "json-view", markdown: "markdown-view", detail: "detail-view" };
  Object.entries(views).forEach(([name, id]) => {
    const el = document.getElementById(id);
    el.classList.toggle("hidden", name !== tabName);
  });
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tabName);
  });
}

function showGenDetail(receipt, genNum) {
  const gen = receipt.generations.find((g) => g.generation === genNum);
  document.getElementById("detail-view").textContent = JSON.stringify(gen, null, 2);
  showView("detail");
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.tab));
  });
}

async function init() {
  const [jsonRes, mdRes] = await Promise.all([
    fetch("./data/demo-receipt.json"),
    fetch("./data/demo-receipt.md"),
  ]);
  if (!jsonRes.ok) throw new Error(`JSON HTTP ${jsonRes.status}`);
  const receipt = await jsonRes.json();
  const markdown = mdRes.ok ? await mdRes.text() : "(demo-receipt.md not found)";

  renderSummary(receipt);
  renderTable(receipt);
  document.getElementById("json-view").textContent = JSON.stringify(receipt, null, 2);
  document.getElementById("markdown-view").textContent = markdown;
  setupTabs();
}

init().catch((err) => {
  document.getElementById("demo-meta").textContent = "Could not load demo output";
  document.getElementById("json-view").textContent = String(err);
});
