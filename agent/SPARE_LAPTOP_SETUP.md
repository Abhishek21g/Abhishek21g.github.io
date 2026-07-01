# Spare Laptop Setup

Use the spare laptop as the Rudhra always-on machine.

## First Choice

If the laptop is Windows, use WSL Ubuntu. That gives Rudhra the same shell, Git, Python, and service model as a VPS.

## Setup

1. Install or confirm:
   - Git
   - GitHub CLI: `gh`
   - Python 3
   - Claude
   - Codex

2. Log into GitHub:

```sh
gh auth login
gh auth status
```

3. Run the Rudhra laptop setup:

```sh
gh repo clone Abhishek21g/agent-project-template ~/.agent-project-template
~/.agent-project-template/bin/rudhra-setup-laptop
```

4. Test commands:

```sh
rudhra-start .
rudhra-swarm .
rudhra-learn .
rudhra-daemon --once
```

5. Start the dashboard:

```sh
rudhra-daemon
```

Open:

```text
http://127.0.0.1:8765
```

6. Only after the dashboard works, install the background service:

```sh
rudhra-install-service
```

## Laptop Settings

For always-on behavior:

- keep it plugged in
- disable sleep
- keep Wi-Fi on during sleep if the OS supports it
- use disk encryption if storing tokens or keys
- keep GitHub CLI authenticated

## What This Laptop Does

```text
rudhra-daemon
-> monitors registered projects
-> remembers session notes
-> drafts learning reviews
-> can open approval-gated PRs
-> serves dashboard at http://127.0.0.1:8765
```

Later, expose the dashboard privately through:

```text
rudhra.enaguthi.com
```

using Cloudflare Tunnel + Cloudflare Access.
