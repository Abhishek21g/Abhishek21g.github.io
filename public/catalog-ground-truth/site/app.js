let report = null;
let activeTable = null;

async function init() {
  const res = await fetch("data/audit-report.json");
  report = await res.json();
  document.getElementById("thesis").textContent = report.thesis;
  renderSummary();
  renderNav();
  selectTable(report.tables.find((t) => t.status === "error") || report.tables[0]);
}

function renderSummary() {
  const el = document.getElementById("summary");
  const s = report.summary;
  el.innerHTML = `
    <div><strong>${s.ok}</strong><span>ok</span></div>
    <div><strong>${s.warn}</strong><span>warn</span></div>
    <div><strong>${s.error}</strong><span>error</span></div>
  `;
}

function renderNav() {
  const nav = document.getElementById("table-nav");
  nav.innerHTML = "";
  for (const table of report.tables) {
    const btn = document.createElement("button");
    btn.className = "table-btn";
    btn.dataset.name = table.name;
    btn.innerHTML = `<span>${table.name}</span><span class="badge ${table.status}">${table.status}</span>`;
    btn.addEventListener("click", () => selectTable(table));
    nav.appendChild(btn);
  }
}

function selectTable(table) {
  activeTable = table;
  document.querySelectorAll(".table-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.name === table.name);
  });

  document.getElementById("table-title").textContent = table.name;
  document.getElementById("table-uri").textContent = table.uri;
  const chip = document.getElementById("table-status");
  chip.textContent = table.status;
  chip.className = `status-chip badge ${table.status}`;

  renderSchemaDiff(table);
  renderFindings(table);
  renderPartitions(table);
}

function renderSchemaDiff(table) {
  const declared = table.declared_schema || {};
  const physical = table.physical_schema || {};
  const allCols = new Set([...Object.keys(declared), ...Object.keys(physical)]);

  const declaredEl = document.getElementById("declared-schema");
  const physicalEl = document.getElementById("physical-schema");
  declaredEl.innerHTML = "";
  physicalEl.innerHTML = "";

  for (const col of [...allCols].sort()) {
    const inD = col in declared;
    const inP = col in physical;
    let dClass = "match";
    let pClass = "match";
    if (inD && !inP) dClass = "missing";
    if (!inD && inP) pClass = "extra";
    if (inD && inP && declared[col] !== physical[col]) {
      dClass = pClass = "mismatch";
    }

    if (inD) {
      const li = document.createElement("li");
      li.className = dClass;
      li.textContent = `${col}: ${declared[col]}`;
      declaredEl.appendChild(li);
    }
    if (inP) {
      const li = document.createElement("li");
      li.className = pClass;
      li.textContent = `${col}: ${physical[col]}`;
      physicalEl.appendChild(li);
    }
  }
}

function renderFindings(table) {
  const list = document.getElementById("findings");
  list.innerHTML = "";
  for (const f of table.findings) {
    const li = document.createElement("li");
    li.className = f.severity;
    let extra = "";
    if (f.declared || f.physical) {
      extra = ` <code>declared=${f.declared ?? "—"} physical=${f.physical ?? "—"}</code>`;
    }
    li.innerHTML = `${f.message}${extra}`;
    list.appendChild(li);
  }
}

function renderPartitions(table) {
  const matrix = document.getElementById("partition-matrix");
  matrix.innerHTML = "";
  if (!table.partition_probes.length) {
    matrix.innerHTML = "<p style='color:var(--muted)'>No partition probes configured for this table.</p>";
    return;
  }
  for (const probe of table.partition_probes) {
    const cell = document.createElement("div");
    cell.className = `partition-cell ${probe.status}`;
    cell.innerHTML = `
      <strong>${probe.label}</strong>
      <span>${probe.file_count} parquet files</span>
    `;
    matrix.appendChild(cell);
  }
}

init();
