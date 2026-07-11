const BRANCH_HINTS = {
  "recency=hour": "Hour-recency news fork at step 3 — Bloomberg replaces Reuters and flips the competitive brief.",
  "model=anthropic/claude-sonnet-4-6": "Alternate provider branch at step 3 — adds analyst commentary without flipping the conclusion.",
  baseline: "No fork applied — baseline trace only. All gates pass; use as control group.",
};

const SCENARIOS = [
  {
    id: "competitive-brief-acme",
    name: "Competitive Brief — Acme Robotics",
    meta: "4 steps · 4 citations · 2 fork branches",
    desc: "Multi-step web_search trace for a funding + news competitive brief on a warehouse automation company.",
    defaultBranch: "recency=hour",
  },
];

const RECEIPTS = {
  "recency=hour": {
    schema_version: "1.0",
    run_id: "sample",
    trace_id: "competitive-brief-acme",
    overall: "fail",
    trust: false,
    fork_at: 3,
    branch_key: "recency=hour",
    gates: [
      { name: "fork_point_load", status: "pass", message: "Fork step 3 has 1 load-bearing citation(s)" },
      { name: "citation_divergence", status: "warn", message: "Citation divergence: +1 / -1 URLs" },
      { name: "conclusion_flip", status: "fail", message: "Final answers materially diverged" },
      { name: "recency_sensitivity", status: "pass", message: "Fork branch includes 4 citation(s) inside recency=hour" },
      { name: "multi_provider_branch", status: "skip", message: "No alternate model in fork profile" },
      { name: "cost_envelope", status: "pass", message: "Fork branch stays inside mock retry budget" },
    ],
    summary: { pass: 3, fail: 1, warn: 1, skip: 1 },
    fork_diff: {
      added: ["https://www.bloomberg.com/news/articles/2026-07-11/acme-robotics-fda-hold"],
      removed: ["https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/"],
      shared: [
        "https://www.acmerobotics.com/about",
        "https://www.crunchbase.com/organization/acme-robotics/company_financials",
        "https://techcrunch.com/2026/02/10/acme-robotics-series-b",
      ],
      rank_shift: true,
    },
    citations_graph: {
      nodes: [
        { side: "baseline", url: "https://www.acmerobotics.com/about" },
        { side: "baseline", url: "https://www.crunchbase.com/organization/acme-robotics/company_financials" },
        { side: "baseline", url: "https://techcrunch.com/2026/02/10/acme-robotics-series-b" },
        { side: "baseline", url: "https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/" },
        { side: "fork", url: "https://www.acmerobotics.com/about" },
        { side: "fork", url: "https://www.crunchbase.com/organization/acme-robotics/company_financials" },
        { side: "fork", url: "https://techcrunch.com/2026/02/10/acme-robotics-series-b" },
        { side: "fork", url: "https://www.bloomberg.com/news/articles/2026-07-11/acme-robotics-fda-hold" },
      ],
    },
    token_overlap: 0.25,
    baseline_excerpt: "Acme Robotics is a warehouse automation company that raised a $120M Series B in February 2026. The brief highlights steady enterprise traction through a March 2026 retailer pilot.",
    fork_excerpt: "Acme Robotics still raised $120M Series B, but a July 2026 regulatory review paused its flagship warehouse pilot. The forked brief now flags near-term deployment risk.",
  },
  "model=anthropic/claude-sonnet-4-6": {
    schema_version: "1.0",
    run_id: "model-branch",
    trace_id: "competitive-brief-acme",
    overall: "pass",
    trust: true,
    fork_at: 3,
    branch_key: "model=anthropic/claude-sonnet-4-6",
    gates: [
      { name: "fork_point_load", status: "pass", message: "Fork step 3 has 2 load-bearing citation(s)" },
      { name: "citation_divergence", status: "warn", message: "Citation divergence: +1 / -0 URLs" },
      { name: "conclusion_flip", status: "pass", message: "Final answers align (token overlap 0.82)" },
      { name: "recency_sensitivity", status: "skip", message: "No recency window in fork profile" },
      { name: "multi_provider_branch", status: "pass", message: "Alternate model anthropic/claude-sonnet-4-6 recorded" },
      { name: "cost_envelope", status: "pass", message: "Fork branch stays inside mock retry budget" },
    ],
    summary: { pass: 4, fail: 0, warn: 1, skip: 1 },
    fork_diff: {
      added: ["https://www.gartner.com/reviews/acme-robotics-warehouse-2026"],
      removed: [],
      shared: [
        "https://techcrunch.com/2026/02/10/acme-robotics-series-b",
        "https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/",
      ],
      rank_shift: false,
    },
    citations_graph: {
      nodes: [
        { side: "baseline", url: "https://techcrunch.com/2026/02/10/acme-robotics-series-b" },
        { side: "baseline", url: "https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/" },
        { side: "fork", url: "https://techcrunch.com/2026/02/10/acme-robotics-series-b" },
        { side: "fork", url: "https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/" },
        { side: "fork", url: "https://www.gartner.com/reviews/acme-robotics-warehouse-2026" },
      ],
    },
    token_overlap: 0.82,
    baseline_excerpt: "Acme Robotics is a warehouse automation company that raised a $120M Series B in February 2026.",
    fork_excerpt: "Acme Robotics raised $120M Series B and shows enterprise pilot traction, with analyst commentary noting execution risk during scale-up.",
  },
  baseline: {
    schema_version: "1.0",
    run_id: "baseline",
    trace_id: "competitive-brief-acme",
    overall: "pass",
    trust: true,
    fork_at: null,
    branch_key: "baseline",
    gates: [
      { name: "fork_point_load", status: "skip", message: "No fork applied" },
      { name: "citation_divergence", status: "skip", message: "No fork applied" },
      { name: "conclusion_flip", status: "skip", message: "No fork applied" },
      { name: "recency_sensitivity", status: "skip", message: "No fork applied" },
      { name: "multi_provider_branch", status: "skip", message: "No fork applied" },
      { name: "cost_envelope", status: "pass", message: "Baseline trace within budget" },
    ],
    summary: { pass: 1, fail: 0, warn: 0, skip: 5 },
    fork_diff: { added: [], removed: [], shared: [], rank_shift: false },
    citations_graph: {
      nodes: [
        { side: "baseline", url: "https://www.acmerobotics.com/about" },
        { side: "baseline", url: "https://techcrunch.com/2026/02/10/acme-robotics-series-b" },
        { side: "baseline", url: "https://www.reuters.com/technology/acme-warehouse-pilot-2026-03-01/" },
      ],
    },
    token_overlap: 1,
    baseline_excerpt: "Acme Robotics is a warehouse automation company that raised a $120M Series B in February 2026.",
    fork_excerpt: "—",
  },
};

let activeBranch = "recency=hour";
let activeReceipt = RECEIPTS[activeBranch];

function trustScore(receipt) {
  const s = receipt.summary || {};
  const total = (s.pass || 0) + (s.fail || 0) + (s.warn || 0);
  if (!total) return receipt.trust ? 100 : 0;
  return Math.round(((s.pass || 0) / total) * 100);
}

function gateBarWidth(status) {
  if (status === "pass") return "100%";
  if (status === "warn") return "62%";
  if (status === "fail") return "28%";
  return "18%";
}

function renderTrust(receipt) {
  const score = trustScore(receipt);
  const pass = receipt.trust === true;
  document.getElementById("trustPanel").innerHTML = `
    <div class="trust-score-main">
      <div class="trust-score-val ${pass ? "pass" : "fail"}">${score}%</div>
      <span class="trust-verdict ${pass ? "pass" : "fail"}">${pass ? "TRUST" : "HOLD"}</span>
    </div>
    <p style="color:var(--muted);font-size:0.9rem;max-width:36rem">
      ${pass
        ? "Fork branch aligns with baseline grounding — safe to compare or promote."
        : "Conclusion or citation gates failed — inspect fork diff before production retry."}
    </p>
    <div class="gate-counts">
      <div class="gate-count"><div class="val">${receipt.summary?.pass || 0}</div><div class="lbl">Pass</div></div>
      <div class="gate-count"><div class="val">${receipt.summary?.fail || 0}</div><div class="lbl">Fail</div></div>
      <div class="gate-count"><div class="val">${receipt.summary?.warn || 0}</div><div class="lbl">Warn</div></div>
      <div class="gate-count"><div class="val">${receipt.summary?.skip || 0}</div><div class="lbl">Skip</div></div>
    </div>`;
  document.getElementById("trustFooter").textContent =
    receipt.fork_at != null
      ? `FORK AT STEP ${receipt.fork_at} · ${receipt.branch_key.toUpperCase()}`
      : "BASELINE · NO FORK";
}

function renderGates(receipt) {
  const gates = receipt.gates || [];
  document.getElementById("gateBars").innerHTML = gates
    .map(
      (g) => `<div class="gate-bar-row">
        <span class="gate-bar-name">${g.name}</span>
        <div class="gate-bar-track"><div class="gate-bar-fill ${g.status}" style="width:${gateBarWidth(g.status)}"></div></div>
        <span class="gate-bar-status ${g.status}">${g.status}</span>
      </div>`
    )
    .join("");
  document.getElementById("gateFooter").textContent = `${gates.length} GATES · ${receipt.overall.toUpperCase()}`;
}

function renderHeatmap(receipt) {
  const diff = receipt.fork_diff || {};
  const shared = diff.shared || [];
  const added = diff.added || [];
  const removed = diff.removed || [];
  const total = shared.length + added.length + removed.length || 1;

  const rows = [
    { label: "shared", cells: shared, cls: "shared", pct: Math.round((shared.length / total) * 100) },
    { label: "added", cells: added, cls: "added", pct: Math.round((added.length / total) * 100) },
    { label: "removed", cells: removed, cls: "removed", pct: Math.round((removed.length / total) * 100) },
  ];

  document.getElementById("heatmap").innerHTML = rows
    .map((row) => {
      const cells =
        row.cells.length > 0
          ? row.cells.map(() => `<span class="heat-cell ${row.cls}"></span>`).join("")
          : `<span class="heat-cell empty"></span>`;
      return `<div class="heatmap-row">
        <span class="heatmap-label">${row.label}</span>
        <div class="heatmap-cells">${cells}</div>
        <span class="heatmap-pct">${row.pct}%</span>
      </div>`;
    })
    .join("");

  const diffItems = [
    ...added.map((u) => `<div class="diff-item"><span class="sign add">+</span><span class="url">${u}</span></div>`),
    ...removed.map((u) => `<div class="diff-item"><span class="sign rem">−</span><span class="url">${u}</span></div>`),
  ];
  document.getElementById("diffList").innerHTML =
    diffItems.join("") || `<div class="empty-state" style="min-height:4rem">No citation diff — baseline control.</div>`;

  document.getElementById("heatmapFooter").textContent =
    `${total} CITATIONS · ${diff.rank_shift ? "RANK SHIFT" : "STABLE RANK"}`;
}

function renderMeta(receipt) {
  document.getElementById("metaPanel").innerHTML = `
    <div style="display:grid;gap:0.85rem;font-size:0.88rem">
      <div><span style="color:var(--muted)">trace_id</span><br/><code style="font-family:var(--mono);font-size:0.78rem">${receipt.trace_id}</code></div>
      <div><span style="color:var(--muted)">fork_at</span><br/><strong>${receipt.fork_at ?? "—"}</strong></div>
      <div><span style="color:var(--muted)">branch</span><br/><code style="font-family:var(--mono);font-size:0.78rem">${receipt.branch_key}</code></div>
      <div><span style="color:var(--muted)">token overlap</span><br/><strong>${Math.round((receipt.token_overlap || 0) * 100)}%</strong></div>
      <div style="padding:0.75rem;border-radius:0.5rem;background:var(--surface);border:1px solid var(--border)">
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.35rem">baseline excerpt</div>
        <div style="font-size:0.8rem;line-height:1.5;color:var(--muted-strong)">${receipt.baseline_excerpt || "—"}</div>
      </div>
      <div style="padding:0.75rem;border-radius:0.5rem;background:var(--surface);border:1px solid var(--border)">
        <div style="font-size:0.72rem;color:var(--muted);margin-bottom:0.35rem">fork excerpt</div>
        <div style="font-size:0.8rem;line-height:1.5;color:var(--muted-strong)">${receipt.fork_excerpt || "—"}</div>
      </div>
    </div>`;
  document.getElementById("metaFooter").textContent = receipt.run_id.toUpperCase();
}

function renderScenarios() {
  document.getElementById("scenarioTable").innerHTML = SCENARIOS.map(
    (s) => `<div class="scenario-row active" data-scenario="${s.id}">
      <div>
        <div class="scenario-name">${s.name}</div>
        <div class="scenario-meta">${s.meta}</div>
      </div>
      <div class="scenario-desc">${s.desc}</div>
      <span class="scenario-open">Open ↗</span>
    </div>`
  ).join("");
}

function renderReceipt(receipt) {
  activeReceipt = receipt;
  renderTrust(receipt);
  renderGates(receipt);
  renderHeatmap(receipt);
  renderMeta(receipt);
  window.__lastReceipt = receipt;
}

function setBranch(branch) {
  activeBranch = branch;
  document.querySelectorAll("[data-branch]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.branch === branch);
    btn.setAttribute("aria-selected", btn.dataset.branch === branch ? "true" : "false");
  });
  document.getElementById("branchHint").textContent = BRANCH_HINTS[branch] || "";
  renderReceipt(RECEIPTS[branch] || RECEIPTS["recency=hour"]);
}

function initNav() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.dataset.nav;
      if (target === "cli") {
        e.preventDefault();
        document.getElementById("cli-panel").classList.remove("hidden");
        document.getElementById("cli-panel").scrollIntoView({ behavior: "smooth" });
      }
      document.querySelectorAll("[data-nav]").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function initTheme() {
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("epistemic-fork-theme");
  if (saved === "light") {
    document.documentElement.dataset.theme = "light";
    btn.textContent = "☾";
  }
  btn.addEventListener("click", () => {
    const light = document.documentElement.dataset.theme === "light";
    document.documentElement.dataset.theme = light ? "" : "light";
    btn.textContent = light ? "☀" : "☾";
    localStorage.setItem("epistemic-fork-theme", light ? "dark" : "light");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderScenarios();
  setBranch("recency=hour");
  initNav();
  initTheme();

  document.querySelectorAll("[data-branch]").forEach((btn) => {
    btn.addEventListener("click", () => setBranch(btn.dataset.branch));
  });

  document.getElementById("fileInput").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        renderReceipt(JSON.parse(reader.result));
      } catch {
        alert("Invalid JSON receipt");
      }
    };
    reader.readAsText(file);
  });
});
