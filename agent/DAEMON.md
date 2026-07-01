# Rudhra Daemon

`rudhra-daemon` is the first living-agent runtime for this template.

It can:

- stay awake in the background while the host machine is awake
- monitor projects registered in `PROJECTS.md`
- remember session notes saved through `rudhra-remember` or the dashboard API
- schedule periodic learning reviews
- create approval-gated GitHub PRs with proposed learning reviews
- expose a local dashboard and JSON API

## Start It

```sh
rudhra-daemon
```

Dashboard:

```text
http://127.0.0.1:8765
```

Generate one review and exit:

```sh
rudhra-daemon --once
```

Open PRs automatically for new review drafts:

```sh
rudhra-daemon --create-pr
```

## Remember A Session

Pipe a note into the current project:

```sh
printf 'What happened in this session...' | rudhra-remember .
```

Or call the local API:

```sh
curl -X POST http://127.0.0.1:8765/api/remember \
  -H 'Content-Type: application/json' \
  -d '{"project":"/path/to/project","note":"Session summary here"}'
```

## Important Limitation

Rudhra cannot automatically read private Claude/Codex chat history unless that history is exported, logged, or sent to it. The reliable path is:

- use `rudhra learn` at session end
- save notes with `rudhra-remember`
- let `rudhra-daemon` scan and review them

## Background Hosting

Mac local background process:

```sh
nohup rudhra-daemon --create-pr > ~/.rudhra/daemon.log 2>&1 &
```

For real always-on behavior, run the same command on the spare laptop or a VPS.

## Install As Background Service

```sh
rudhra-install-service
```

On macOS this creates:

```text
~/Library/LaunchAgents/com.rudhra.daemon.plist
```

On Linux/WSL/VPS with systemd, this creates:

```text
~/.config/systemd/user/rudhra-daemon.service
```

The service starts `rudhra-daemon --create-pr`, which means new review drafts can become GitHub PRs. The PR is the human approval gate.
