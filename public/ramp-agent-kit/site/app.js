(function () {
  const tourTabs = document.querySelectorAll(".tour-tab");
  const tourPanes = document.querySelectorAll(".tour-pane");
  const flowSteps = document.querySelectorAll(".flow-step");
  const heroTerminal = document.querySelector(".hero-panel .terminal code");
  const heroVerdict = document.querySelector(".hero-panel .verdict-banner");

  const tourData = {
    start: {
      cmd: "ramp-kit plan scenarios/cli-offline-contracts.yaml",
      verdict: "5 steps · no credentials required",
      flow: 0,
      visual: `# The problem
Agent called ramp transactions list --agent
→ empty data? timeout? wrong JSON?
→ was it OAuth, API, or your jq pipe?

# This kit gives you a receipt trail
runs/<id>/receipts/config-list.json
runs/<id>/report.html`,
    },
    plan: {
      cmd: "ramp-kit plan scenarios/cli-offline-contracts.yaml",
      verdict: "Preview: config-list, env, auth status…",
      flow: 0,
      visual: `$ ramp-kit plan scenarios/cli-offline-contracts.yaml

{
  "scenario": "cli-offline-contracts",
  "step_count": 5,
  "steps": [
    { "id": "config-list", "command": "ramp --agent config list" },
    { "id": "env-show", "command": "ramp --agent env" },
    ...
  ]
}`,
    },
    run: {
      cmd: "ramp-kit run … --ramp-cli-src ../upstream/ramp-cli",
      verdict: "Receipts: latency, exit code, redacted stdout",
      flow: 1,
      visual: `// receipts/config-list.json
{
  "step_id": "config-list",
  "latency_ms": 430,
  "exit_code": 0,
  "success": true,
  "schema_version": "1.0",
  "redacted_args_hash": "a3f8c2…"
}`,
    },
    doctor: {
      cmd: "ramp-kit doctor runs/<run_id>",
      verdict: "AUTH_BLOCKER vs AGENT_CODE_ISSUE vs LATENCY",
      flow: 2,
      visual: `{
  "verdict": "ALL_PASS",
  "passed": 5,
  "failed": 0,
  "by_error_class": { "ok": 5 }
}

# If auth failed → AUTH_BLOCKER
# If timeout   → LATENCY_BLOCKER
# If bad JSON  → AGENT_CODE_ISSUE`,
    },
    report: {
      cmd: "ramp-kit all … → report.html",
      verdict: "ALL_PASS — shareable HTML artifact",
      flow: 3,
      visual: `runs/d9762b027228/
├── manifest.json
├── receipts/
│   ├── config-list.json
│   └── auth-status-offline.json
├── report.json
└── report.html   ← you are here`,
    },
  };

  const tourVisual = document.getElementById("tour-code");

  function applyTour(key) {
    const data = tourData[key];
    if (!data) return;
    if (heroTerminal) heroTerminal.textContent = data.cmd;
    if (heroVerdict) heroVerdict.textContent = data.verdict;
    if (tourVisual && data.visual) tourVisual.textContent = data.visual;
    if (flowSteps.length) {
      flowSteps.forEach((s, i) =>
        s.classList.toggle("active", i === data.flow)
      );
    }
  }

  tourTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tour;
      tourTabs.forEach((t) => t.classList.toggle("active", t === tab));
      tourPanes.forEach((p) =>
        p.classList.toggle("active", p.dataset.tour === key)
      );
      applyTour(key);
    });
  });

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = btn.parentElement.querySelector("pre");
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(() => {
        const orig = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = orig;
        }, 2000);
      });
    });
  });

  // Auto-advance hero flow strip
  let flowIdx = 0;
  const flowKeys = ["plan", "run", "doctor", "report"];
  setInterval(() => {
    flowIdx = (flowIdx + 1) % flowKeys.length;
    applyTour(flowKeys[flowIdx]);
  }, 4000);
})();
