/** Browser port of sia_eval_harness — same logic as the Python CLI. */
const RECEIPT_VERSION = "0.1";
const GOLD_LEAK_KEYS = new Set([
  "expected",
  "reference_answer",
  "answer_key",
  "gold",
  "correct_answer",
]);
const METRIC_KEYS = ["accuracy", "accuracy_percent", "score", "mse", "loss", "correct", "total"];
const ARTIFACTS = [
  "target_agent.py",
  "train.py",
  "results.json",
  "improvement.md",
  "transfer_evidence.json",
  "agent_execution.json",
];

async function sha256Text(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return (
    "sha256:" +
    [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}

function walkGoldKeys(obj, out) {
  if (obj && typeof obj === "object") {
    if (!Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj)) {
        if (GOLD_LEAK_KEYS.has(k.toLowerCase())) out.push(k);
        walkGoldKeys(v, out);
      }
    } else {
      obj.forEach((item) => walkGoldKeys(item, out));
    }
  }
}

function goldLeakCheck(results) {
  if (!results) {
    return { status: "missing", keys_found: [], detail: "no results.json" };
  }
  const keys = [];
  walkGoldKeys(results, keys);
  if (keys.length) {
    return {
      status: "fail",
      keys_found: [...new Set(keys)].sort(),
      detail: "held-out label keys present in results.json",
    };
  }
  return { status: "pass", keys_found: [], detail: "no gold-bearing keys detected" };
}

function detectFocus(genFiles) {
  if (genFiles["train.py"] || genFiles["train_stdout.log"]) return "weights";
  return "harness";
}

function extractPrimaryMetric(results) {
  if (!results) return [null, null];
  const scan = (block) => {
    for (const key of METRIC_KEYS) {
      if (key in block && typeof block[key] === "number") return [key, block[key]];
    }
    return [null, null];
  };
  if (results.summary && typeof results.summary === "object") {
    const found = scan(results.summary);
    if (found[0]) return found;
  }
  return scan(results);
}

function metricDelta(prev, curr) {
  const [prevKey, prevVal] = extractPrimaryMetric(prev);
  const [currKey, currVal] = extractPrimaryMetric(curr);
  if (currKey == null || currVal == null) {
    return { metric: null, previous: null, current: null, delta: null, direction: "unknown" };
  }
  let delta = null;
  if (prevVal != null && currKey === prevKey) delta = currVal - prevVal;
  let direction = "unknown";
  if (delta != null) {
    direction = currKey === "loss" || currKey === "mse" ? "lower_is_better" : "higher_is_better";
  }
  return {
    metric: currKey,
    previous: prevVal,
    current: currVal,
    delta,
    direction,
  };
}

function parseContextHeader(text) {
  const meta = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (m) meta[m[1].trim()] = m[2].trim();
  }
  return meta;
}

function codeDeltaLines(prevFiles, currFiles) {
  let agentName = "target_agent.py";
  if (!currFiles[agentName] && currFiles["train.py"]) agentName = "train.py";
  if (!currFiles[agentName]) {
    return { lines_added: null, lines_removed: null, agent_file: null };
  }
  const currLines = String(currFiles[agentName]).split("\n");
  if (!prevFiles) {
    return { lines_added: currLines.length, lines_removed: 0, agent_file: agentName };
  }
  let prevName = "target_agent.py";
  if (!prevFiles[prevName] && prevFiles["train.py"]) prevName = "train.py";
  if (!prevFiles[prevName]) {
    return { lines_added: currLines.length, lines_removed: 0, agent_file: agentName };
  }
  const prevLines = String(prevFiles[prevName]).split("\n");
  return {
    lines_added: Math.max(0, currLines.length - prevLines.length),
    lines_removed: Math.max(0, prevLines.length - currLines.length),
    agent_file: agentName,
  };
}

async function artifactHashes(genFiles) {
  const out = {};
  for (const name of ARTIFACTS) {
    if (!(name in genFiles)) continue;
    const raw =
      name.endsWith(".json") ? JSON.stringify(genFiles[name], null, 2) : String(genFiles[name]);
    out[name] = await sha256Text(raw);
  }
  return out;
}

async function compileGeneration(genNum, genFiles, prevFiles) {
  const results = genFiles["results.json"] || null;
  const prevResults = prevFiles ? prevFiles["results.json"] || null : null;
  const transfer = genFiles["transfer_evidence.json"] || null;
  const focus = detectFocus(genFiles);
  const delta = metricDelta(prevResults, results);
  const leak = goldLeakCheck(results);

  const gain = {
    focus,
    metric_delta: delta,
    code_change: codeDeltaLines(prevFiles, genFiles),
    harness_delta: focus === "harness" ? delta.delta : null,
    weights_delta: focus === "weights" ? delta.delta : null,
  };

  let overfit = { status: "unknown", residue: [], unsupported_claims: [] };
  if (transfer) {
    overfit = {
      status: "present",
      accepted_for_reuse: transfer.accepted_for_reuse,
      residue: transfer.task_specific_residue || transfer.residue_bullets || [],
      unsupported_claims: transfer.unsupported_claims || [],
      claim_boundary: transfer.claim_boundary,
    };
  } else if (genFiles["improvement.md"]) {
    overfit.status = "improvement_md_only";
  }

  return {
    generation: genNum,
    focus,
    metrics: results?.summary || results || {},
    gain_attribution: gain,
    integrity: {
      private_leak_check: leak,
      transfer_evidence: overfit,
    },
    artifacts_hash: await artifactHashes(genFiles),
  };
}

function bestMetric(generations) {
  let best = null;
  for (const g of generations) {
    const d = g.gain_attribution.metric_delta;
    if (d.current == null) continue;
    if (!best || d.current > best.value) {
      best = { generation: g.generation, metric: d.metric, value: d.current };
    }
  }
  return best;
}

function renderMarkdown(receipt) {
  const lines = [
    `# SIA Run Receipt — run_${receipt.run_id}`,
    "",
    `**Compiled:** ${receipt.compiled_at}`,
    `**Task:** ${receipt.task}`,
    `**Generations:** ${receipt.summary.generation_count}`,
    "",
    "## Generation summary",
    "",
    "| Gen | Focus | Metric Δ | Leak check | Overfit signal |",
    "|-----|-------|----------|------------|----------------|",
  ];
  for (const g of receipt.generations) {
    const d = g.gain_attribution.metric_delta;
    let dStr = "—";
    if (d.delta != null) dStr = `${d.metric} ${d.delta >= 0 ? "+" : ""}${d.delta.toFixed(4)}`;
    lines.push(
      `| ${g.generation} | ${g.focus} | ${dStr} | ${g.integrity.private_leak_check.status} | ${g.integrity.transfer_evidence.status} |`
    );
  }
  if (receipt.summary.leak_failures) {
    lines.push("", "> **Warning:** gold-label keys detected in results.json.");
  }
  return lines.join("\n") + "\n";
}

/** Compile from bundled demo-run.json manifest (same inputs as CLI demo). */
async function compileRunFromManifest(manifest) {
  const contextMeta = parseContextHeader(manifest.context_md || "");
  const genKeys = Object.keys(manifest.generations).sort((a, b) => Number(a) - Number(b));
  const generations = [];
  let prev = null;
  for (const key of genKeys) {
    const genNum = Number(key);
    const files = manifest.generations[key];
    generations.push(await compileGeneration(genNum, files, prev));
    prev = files;
  }
  const leakFailures = generations.filter(
    (g) => g.integrity.private_leak_check.status === "fail"
  ).length;
  return {
    receipt_version: RECEIPT_VERSION,
    compiled_at: new Date().toISOString(),
    run_id: manifest.run_id || 1,
    run_dir: "demo/runs/run_1",
    task: contextMeta.Task || "longcot-chess",
    meta_model: contextMeta["Meta Model"] || null,
    task_model: contextMeta["Task Model"] || null,
    agent_impl: contextMeta["Agent impl"] || null,
    generations,
    summary: {
      generation_count: generations.length,
      leak_failures: leakFailures,
      best_metric: bestMetric(generations),
    },
  };
}

/** Inject a gold key into gen 3 to demo leak failure. */
function manifestWithLeak(manifest) {
  const copy = structuredClone(manifest);
  const g3 = copy.generations["3"];
  if (g3?.["results.json"]) {
    g3["results.json"].leak_demo = [{ expected: "SECRET_ANSWER", id: "q0" }];
  }
  return copy;
}

window.SiaEvalCompiler = {
  compileRunFromManifest,
  manifestWithLeak,
  renderMarkdown,
};
