const SCENARIOS = {
  clean: {
    verdict: "GO",
    plain: "Everything checks out. Safe to start planning.",
    hint: "Checkpoint and config agree. Physics looks normal.",
    checks: [
      { status: "ok", label: "ok", title: "Image size matches", detail: "Config and checkpoint both use 224" },
      { status: "ok", label: "ok", title: "Model depth matches", detail: "Predictor blocks line up" },
      { status: "ok", label: "ok", title: "Embedding size matches", detail: "256-dim on both sides" },
      { status: "ok", label: "ok", title: "Plan length is valid", detail: "Horizon fits the episode" },
      { status: "ok", label: "ok", title: "Physics looks plausible", detail: "No weird jumps in latent space" },
    ],
  },
  hold: {
    verdict: "HOLD",
    plain: "Configs match, but something in the plan looks physically impossible. Pause before you burn GPU.",
    hint: "Config looks fine, but the model saw a physically weird jump — hold the plan.",
    checks: [
      { status: "ok", label: "ok", title: "Image size matches", detail: "Config and checkpoint both use 224" },
      { status: "ok", label: "ok", title: "Model depth matches", detail: "Predictor blocks line up" },
      { status: "ok", label: "ok", title: "Embedding size matches", detail: "256-dim on both sides" },
      { status: "ok", label: "ok", title: "Plan length is valid", detail: "Horizon fits the episode" },
      { status: "warn", label: "hold", title: "Physics looks weird", detail: "Surprise spike at step 29 — review before planning" },
    ],
  },
  fail: {
    verdict: "NO-GO",
    plain: "Config says one resolution. Checkpoint was trained at another. Don't start — you'll train at the wrong size.",
    hint: "Classic silent failure: 256 in the config, 384 in the checkpoint.",
    checks: [
      { status: "bad", label: "fail", title: "Image size mismatch", detail: "Config 256 · checkpoint 384" },
      { status: "ok", label: "ok", title: "Model depth matches", detail: "Predictor blocks line up" },
      { status: "ok", label: "ok", title: "Embedding size matches", detail: "1024-dim on both sides" },
      { status: "ok", label: "ok", title: "Plan length is valid", detail: "Horizon fits the episode" },
      { status: "ok", label: "ok", title: "Physics not checked", detail: "Skipped — fix the config first" },
    ],
  },
};

function render(mode) {
  const s = SCENARIOS[mode];
  if (!s) return;

  document.querySelectorAll(".mode-tab").forEach((btn) => {
    const on = btn.dataset.mode === mode;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });

  document.getElementById("modeHint").textContent = s.hint;

  const word = document.getElementById("verdictWord");
  word.textContent = s.verdict;
  word.className = `verdict-word ${s.verdict}`;
  document.getElementById("verdictPlain").textContent = s.plain;

  document.getElementById("checklist").innerHTML = s.checks
    .map(
      (c) => `
      <li>
        <span class="check-status ${c.status}">${c.label}</span>
        <span>
          <span class="check-label">${c.title}</span>
          <span class="check-detail">${c.detail}</span>
        </span>
      </li>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".mode-tab, .scenario").forEach((el) => {
    el.addEventListener("click", () => render(el.dataset.mode));
  });
  render("hold");
});
