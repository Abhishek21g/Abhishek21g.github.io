(function () {
  const data = window.BUNDLED;
  if (!data) return;

  const runSelect = document.getElementById("run-select");
  const runBtn = document.getElementById("run-btn");
  const statusEl = document.getElementById("demo-status");
  const chainGrid = document.getElementById("chain-grid");
  const heroDot = document.getElementById("hero-status-dot");
  const heroBadge = document.getElementById("hero-badge");
  const heroLabel = document.getElementById("hero-run-label");
  const heroCmd = document.getElementById("hero-command");
  const heroMetrics = document.getElementById("hero-metrics");
  const heroChain = document.getElementById("hero-chain");

  function render(runId) {
    const bundle = data[runId];
    if (!bundle) return;
    const { summary, chain } = bundle;
    const passed = summary.passed;
    statusEl.textContent = passed
      ? `TRAIN SAFE — ${summary.run_name}`
      : `UNSAFE — ${summary.unsafe_count} rollout(s) rejected`;
    statusEl.className = "demo-status " + (passed ? "good" : "bad");

    heroDot.className = "status-dot " + (passed ? "pass" : "fail");
    heroBadge.className = "badge " + (passed ? "pass" : "fail");
    heroBadge.textContent = passed ? "PASS" : "FAIL";
    heroLabel.textContent = summary.run_name;
    heroCmd.textContent = `rollout-chain verify examples/${runId.replace("demo-", "")}.yaml`;

    heroMetrics.innerHTML = [
      ["Policy v" + summary.trainer_policy_version, summary.trainer_policy_hash.slice(0, 22) + "…"],
      ["Rollouts", String(summary.links)],
      ["Unsafe", String(summary.unsafe_count)],
    ]
      .map(
        ([k, v]) =>
          `<article><span>${k}</span><strong>${v}</strong></article>`
      )
      .join("");

    heroChain.innerHTML = chain.links
      .map((link) => {
        const ok = link.train_safe;
        return `<div class="row${ok ? "" : " fail"}"><span>${link.rollout_id}</span><span>${ok ? "safe" : link.severity}</span><span>${(link.reasons[0] || "binding + numerics clean").slice(0, 60)}</span></div>`;
      })
      .join("");

    chainGrid.innerHTML = chain.links
      .map((link) => {
        const reasons = link.reasons.length
          ? `<ul>${link.reasons.map((r) => `<li>${r}</li>`).join("")}</ul>`
          : "<p style='color:var(--green);margin:0'>Train-safe — policy binding and numerics clean.</p>";
        return `<article class="chain-card${link.train_safe ? "" : " unsafe"}">
          <header>
            <strong>${link.rollout_id}</strong>
            <span class="badge ${link.train_safe ? "pass" : "fail"}">${link.train_safe ? "SAFE" : "REJECT"}</span>
          </header>
          <div style="color:var(--muted);font-size:0.9rem">
            worker <code>${link.worker_id}</code> · lag ${link.version_lag} · TOPLOC ${link.toploc_status}
          </div>
          ${reasons}
        </article>`;
      })
      .join("");
  }

  runBtn.addEventListener("click", () => render(runSelect.value));
  render("demo-fail");
})();
