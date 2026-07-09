const PROFILES = {
  broken: {
    name: "ministral3-h100-9p",
    gpu: "H100:1",
    enable_memory_snapshot: true,
    enable_gpu_snapshot: true,
    framework: "vllm",
    torch_compile: true,
    nccl_world_size: 1,
    image_pull_mib: 4200,
    cold_start_slo_sec: 50,
    vllm_sleep_mode: true,
    volume_commit_before_snapshot: false,
    volume_reload_on_wake: false,
    volumes: [{ backend: "9p" }, { backend: "9p" }],
  },
  fixed: {
    name: "ministral3-h100-9p-fixed",
    gpu: "H100:1",
    enable_memory_snapshot: true,
    enable_gpu_snapshot: true,
    framework: "vllm",
    torch_compile: true,
    nccl_world_size: 1,
    image_pull_mib: 4200,
    cold_start_slo_sec: 50,
    vllm_sleep_mode: true,
    volume_commit_before_snapshot: true,
    volume_reload_on_wake: true,
    volumes: [{ backend: "9p" }, { backend: "9p" }],
  },
  slo: {
    name: "vllm-gpu-snapshot-slo",
    gpu: "H100:1",
    enable_memory_snapshot: true,
    enable_gpu_snapshot: true,
    framework: "vllm",
    torch_compile: false,
    nccl_world_size: 1,
    image_pull_mib: 1800,
    cold_start_slo_sec: 50,
    vllm_sleep_mode: true,
    volume_commit_before_snapshot: true,
    volume_reload_on_wake: true,
    volumes: [{ backend: "9p" }],
  },
};

const FLAGS = {
  VOLUME_9P_STALE: "VOLUME_9P_STALE_AFTER_GPU_RESTORE",
  TORCH_COMPILE_ON_9P: "TORCH_COMPILE_ARTIFACT_ON_9P_VOLUME",
  NCCL_TCPSTORE_BROKEN: "NCCL_TCPSTORE_BROKEN_PIPE_AFTER_RESTORE",
  COLD_START_SLO_MISS: "COLD_START_SLO_MISS",
  NO_VOLUME_COMMIT: "MISSING_VOLUME_COMMIT_BEFORE_SNAPSHOT",
  NO_VOLUME_RELOAD: "MISSING_VOLUME_RELOAD_ON_WAKE",
};

function simulate(profile) {
  const phases = [];
  const buffer = profile.gpu.startsWith("H100") ? 0.5 : 8.0;
  phases.push({ name: "cloud_buffer", duration_sec: buffer });
  phases.push({ name: "imagefs_lazy_pull", duration_sec: 0.5 + profile.image_pull_mib / 800 });

  if (profile.enable_memory_snapshot) {
    phases.push({ name: "criu_cpu_restore", duration_sec: 3.0 });
  } else {
    phases.push({ name: "app_cpu_init", duration_sec: 25.0 });
  }

  if (profile.enable_gpu_snapshot) {
    phases.push({ name: "cuda_context_rehydrate", duration_sec: 4.0 });
  } else if (profile.framework === "vllm") {
    phases.push({ name: "vllm_model_load", duration_sec: 45.0 });
  }

  if (profile.torch_compile) {
    phases.push({ name: "torch_compile_warmup", duration_sec: 25.0 });
  }

  if (profile.nccl_world_size > 1) {
    phases.push({ name: "nccl_tcpstore_init", duration_sec: 2.0 });
  }

  const total = phases.reduce((sum, p) => sum + p.duration_sec, 0);
  return { phases, total_cold_start_sec: Math.round(total * 100) / 100 };
}

function doctor(profile, receipt) {
  const flags = [];
  const uses9p = profile.volumes.some((v) => v.backend === "9p");
  const mitigated = profile.volume_commit_before_snapshot && profile.volume_reload_on_wake;

  if (profile.enable_gpu_snapshot && uses9p && !mitigated) {
    flags.push(FLAGS.VOLUME_9P_STALE);
  }
  if (profile.enable_gpu_snapshot && uses9p && profile.torch_compile) {
    flags.push(FLAGS.TORCH_COMPILE_ON_9P);
  }
  if (profile.enable_gpu_snapshot && profile.nccl_world_size > 1) {
    flags.push(FLAGS.NCCL_TCPSTORE_BROKEN);
  }
  if (profile.enable_gpu_snapshot && uses9p && !profile.volume_commit_before_snapshot) {
    flags.push(FLAGS.NO_VOLUME_COMMIT);
  }
  if (profile.enable_gpu_snapshot && uses9p && !profile.volume_reload_on_wake) {
    flags.push(FLAGS.NO_VOLUME_RELOAD);
  }
  if (receipt.total_cold_start_sec > profile.cold_start_slo_sec) {
    flags.push(FLAGS.COLD_START_SLO_MISS);
  }

  const fail = new Set([FLAGS.VOLUME_9P_STALE, FLAGS.NCCL_TCPSTORE_BROKEN]);
  const fragile = new Set([
    FLAGS.TORCH_COMPILE_ON_9P,
    FLAGS.NO_VOLUME_COMMIT,
    FLAGS.NO_VOLUME_RELOAD,
    FLAGS.COLD_START_SLO_MISS,
  ]);

  let verdict = "RESTORE";
  if (flags.some((f) => fail.has(f))) verdict = "FAIL";
  else if (flags.some((f) => fragile.has(f))) verdict = "FRAGILE";

  return { flags: [...new Set(flags)].sort(), verdict };
}

function render(profileKey) {
  const profile = PROFILES[profileKey];
  const receipt = simulate(profile);
  const result = doctor(profile, receipt);
  const badge = document.getElementById("verdict-badge");
  const terminal = document.getElementById("terminal");
  const phases = document.getElementById("phase-list");
  const flags = document.getElementById("flag-list");
  const total = document.getElementById("total-seconds");

  badge.textContent = result.verdict;
  badge.className = `badge ${result.verdict.toLowerCase()}`;
  total.textContent = `${receipt.total_cold_start_sec}s`;

  terminal.textContent = `$ gpu-snapshot-continuum run --profile examples/${profile.name}.yaml --mock\nreceipt: out/receipts/demo-run\nverdict: ${result.verdict}`;

  phases.innerHTML = receipt.phases
    .map(
      (p) =>
        `<li><span>${p.name}</span><span>${p.duration_sec.toFixed(1)}s</span></li>`
    )
    .join("");

  flags.innerHTML = result.flags.length
    ? result.flags.map((f) => `<li>${f}</li>`).join("")
    : "<li style='color: var(--pass)'>no doctor flags</li>";
}

document.getElementById("profile-select").addEventListener("change", (e) => {
  render(e.target.value);
});

document.getElementById("run-demo").addEventListener("click", () => {
  const key = document.getElementById("profile-select").value;
  render(key);
});

render("broken");
