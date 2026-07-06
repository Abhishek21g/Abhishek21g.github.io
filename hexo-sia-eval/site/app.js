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

function logTerminal(line, cls = "") {
  const el = document.getElementById("terminal-log");
  if (!el) return;
  const row = document.createElement("div");
  row.className = `terminal-line ${cls}`;
  row.textContent = line;
  el.appendChild(row);
  el.scrollTop = el.scrollHeight;
}

function clearTerminal() {
  const el = document.getElementById("terminal-log");
  if (el) el.innerHTML = "";
}

function renderReceipt(receipt, markdown) {
  const best = receipt.summary.best_metric;
  document.getElementById("demo-meta").textContent =
    `${receipt.task} · ${receipt.summary.generation_count} gens · compiled ${new Date(receipt.compiled_at).toLocaleTimeString()}`;
  document.getElementById("summary-cards").innerHTML = `
    <div class="card"><div class="label">Best generation</div><div class="value">${best ? best.generation : "—"}</div></div>
    <div class="card"><div class="label">${best ? best.metric : "Metric"}</div><div class="value">${best ? best.value.toFixed(2) : "—"}</div></div>
    <div class="card"><div class="label">Leak failures</div><div class="value">${receipt.summary.leak_failures}</div></div>
    <div class="card"><div class="label">Receipt</div><div class="value">${receipt.receipt_version}</div></div>
  `;

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

  document.getElementById("json-view").textContent = JSON.stringify(receipt, null, 2);
  document.getElementById("markdown-view").textContent = markdown;
  window.__lastReceipt = receipt;
}

function showView(tabName) {
  const views = { json: "json-view", markdown: "markdown-view", detail: "detail-view" };
  Object.entries(views).forEach(([name, id]) => {
    document.getElementById(id).classList.toggle("hidden", name !== tabName);
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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runCompile(manifest, { simulateLeak = false, label = "demo/runs/run_1" } = {}) {
  const btn = document.getElementById("run-compile");
  const btnLeak = document.getElementById("run-leak-demo");
  if (btn) btn.disabled = true;
  if (btnLeak) btnLeak.disabled = true;

  clearTerminal();
  logTerminal("$ sia-eval compile " + label, "cmd");
  await sleep(350);
  logTerminal("Reading run artifacts…");
  await sleep(280);
  logTerminal(`  context.md`);
  logTerminal(`  gen_1/ … gen_${Object.keys(manifest.generations).length}/`);
  await sleep(320);
  logTerminal("Running leak check + gain attribution…");
  await sleep(400);

  const input = simulateLeak ? SiaEvalCompiler.manifestWithLeak(manifest) : manifest;
  const receipt = await SiaEvalCompiler.compileRunFromManifest(input);
  const markdown = SiaEvalCompiler.renderMarkdown(receipt);

  logTerminal(`Wrote receipts/run_${receipt.run_id}.json`, "ok");
  logTerminal(`Wrote receipts/run_${receipt.run_id}.md`, "ok");
  if (receipt.summary.leak_failures) {
    logTerminal(`⚠ leak check failed on ${receipt.summary.leak_failures} generation(s)`, "warn");
  } else {
    logTerminal("✓ all leak checks passed", "ok");
  }

  renderReceipt(receipt, markdown);
  document.getElementById("try-status").textContent = simulateLeak
    ? "Leak demo: injected gold key into gen 3 — same as a bad grader would produce."
    : "Compile finished. Output matches the Python CLI on the same demo run.";

  if (btn) btn.disabled = false;
  if (btnLeak) btnLeak.disabled = false;
  showView("json");
}

let demoManifest = null;

async function init() {
  const res = await fetch("./data/demo-run.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  demoManifest = await res.json();
  setupTabs();

  document.getElementById("run-compile").addEventListener("click", () =>
    runCompile(demoManifest, { simulateLeak: false })
  );
  document.getElementById("run-leak-demo").addEventListener("click", () =>
    runCompile(demoManifest, { simulateLeak: true, label: "demo/runs/run_1 (leak test)" })
  );

  await runCompile(demoManifest, { simulateLeak: false });
}

init().catch((err) => {
  document.getElementById("demo-meta").textContent = "Failed to load demo";
  document.getElementById("json-view").textContent = String(err);
  document.getElementById("try-status").textContent = String(err);
});
