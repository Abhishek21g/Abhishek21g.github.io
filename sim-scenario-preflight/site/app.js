const RECEIPTS = {
  good: "./sample_receipt.json",
  tl_desync: "./fail_receipt.json",
};

function renderReceipt(r) {
  const overall = document.getElementById("overall");
  overall.textContent = r.overall;
  overall.className = "overall " + (r.overall === "GO" ? "go" : "nogo");

  document.getElementById("scenarioId").textContent = r.scenario_id;
  document.getElementById("gateScore").textContent = `${r.passed_count}/${r.total_gates} gates`;
  document.getElementById("hashLine").textContent = `hash ${r.manifest_hash} · fp ${r.replay_fingerprint}`;

  const list = document.getElementById("gateList");
  list.innerHTML = (r.gates || [])
    .map(
      (g) => `<li>
        <span class="${g.passed ? "gate-pass" : "gate-fail"}">${g.passed ? "✓" : "✗"}</span>
        <span><strong>${g.name}</strong><br/><span style="color:var(--muted)">${g.detail}</span></span>
      </li>`
    )
    .join("");

  const fix = document.getElementById("fixFirst");
  const fail = (r.gates || []).find((g) => !g.passed);
  if (fail) {
    fix.hidden = false;
    fix.innerHTML = `Blocked by <strong>${fail.name}</strong> — ${fail.detail}`;
  } else {
    fix.hidden = true;
  }
}

async function loadVariant(key) {
  document.querySelectorAll(".variant-btns button").forEach((b) => {
    b.classList.toggle("active", b.dataset.variant === key);
  });
  const res = await fetch(RECEIPTS[key]);
  renderReceipt(await res.json());
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".variant-btns button").forEach((btn) => {
    btn.addEventListener("click", () => loadVariant(btn.dataset.variant));
  });
  loadVariant("good");
});
