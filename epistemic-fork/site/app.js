function renderReceipt(receipt) {
  const trust = receipt.trust === true;
  const badge = document.getElementById("trustBadge");
  badge.textContent = trust ? "TRUST" : "HOLD";
  badge.className = "trust-badge " + (trust ? "yes" : "no");

  document.getElementById("trustLabel").textContent = trust
    ? "Fork branch aligns with baseline grounding"
    : "Conclusion or citation gates failed — inspect before production retry";

  const summary = receipt.summary || {};
  document.getElementById("passCount").textContent = summary.pass || 0;
  document.getElementById("failCount").textContent = summary.fail || 0;
  document.getElementById("warnCount").textContent = summary.warn || 0;
  document.getElementById("skipCount").textContent = summary.skip || 0;

  document.getElementById("traceLabel").textContent = receipt.trace_id || "";
  document.getElementById("forkAt").textContent = receipt.fork_at ?? "—";
  document.getElementById("branchKey").textContent = receipt.branch_key || "—";
  document.getElementById("overallLabel").textContent = "overall: " + receipt.overall;

  const diff = receipt.fork_diff || {};
  document.getElementById("diffAdded").innerHTML = (diff.added || [])
    .map((url) => '<li class="citation-item"><span class="status-pass">+</span> <span class="code-tag">' + url + "</span></li>")
    .join("") || '<li class="citation-item">none</li>';
  document.getElementById("diffRemoved").innerHTML = (diff.removed || [])
    .map((url) => '<li class="citation-item"><span class="status-fail">−</span> <span class="code-tag">' + url + "</span></li>")
    .join("") || '<li class="citation-item">none</li>';

  const gates = receipt.gates || [];
  document.getElementById("gateList").innerHTML = gates
    .map((gate) => '<li class="gate-item"><span class="status-' + gate.status + '">' + gate.status + "</span> <strong>" + gate.name + "</strong><br/>" + gate.message + "</li>")
    .join("");

  const graph = receipt.citations_graph || {};
  document.getElementById("citationGraph").innerHTML = (graph.nodes || [])
    .map((node) => '<li class="citation-item"><strong>' + node.side + "</strong> · <span class=\"code-tag\">" + node.url + "</span></li>")
    .join("");

  window.__lastReceipt = receipt;
}

async function loadSample() {
  const response = await fetch("./sample_receipt.json");
  renderReceipt(await response.json());
}

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      renderReceipt(JSON.parse(reader.result));
    } catch {
      alert("Invalid JSON receipt");
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadSample").addEventListener("click", loadSample);
  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) loadFile(file);
  });
  loadSample();
});
