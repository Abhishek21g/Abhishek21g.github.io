'use client'

import { useEffect, useMemo, useState } from 'react'

type FeedState = {
  status: 'checking' | 'online' | 'fallback' | 'offline'
  label: string
  detail: string
  href: string
}

type OpsStatus = {
  updatedAt: string
  release: string
  owner: string
  notes: string[]
  workflows: Array<{
    name: string
    cadence: string
    href: string
  }>
}

const initialFeeds: FeedState[] = [
  { status: 'checking', label: 'Spotify', detail: 'checking /spotify/now-playing.json', href: '/spotify/now-playing.json' },
  { status: 'checking', label: 'GitHub Pulse', detail: 'checking /live/github-activity.json', href: '/live/github-activity.json' },
  { status: 'checking', label: 'Today.txt', detail: 'checking /updates/today.json', href: '/updates/today.json' },
]

const workflowLinks = {
  deploy: 'https://github.com/Abhishek21g/my-personal-website/actions/workflows/deploy.yml',
  spotify: 'https://github.com/Abhishek21g/my-personal-website/actions/workflows/update-spotify.yml',
  github: 'https://github.com/Abhishek21g/my-personal-website/actions/workflows/update-github-activity.yml',
}

function statusClass(status: FeedState['status']) {
  if (status === 'online') return 'bg-emerald-400'
  if (status === 'fallback') return 'bg-amber-400'
  if (status === 'offline') return 'bg-red-400'
  return 'bg-zinc-400'
}

function statusCopy(status: FeedState['status']) {
  if (status === 'online') return 'online'
  if (status === 'fallback') return 'fallback'
  if (status === 'offline') return 'offline'
  return 'checking'
}

export default function OpsDashboard() {
  const [feeds, setFeeds] = useState(initialFeeds)
  const [ops, setOps] = useState<OpsStatus | null>(null)

  useEffect(() => {
    let cancelled = false

    async function readJson(path: string) {
      const response = await fetch(path, { cache: 'no-store' })
      if (!response.ok) throw new Error(String(response.status))
      return response.json()
    }

    async function refresh() {
      const nextFeeds = await Promise.all(initialFeeds.map(async (feed) => {
        try {
          const data = await readJson(feed.href)
          if (feed.label === 'Spotify') {
            return {
              ...feed,
              status: data?.title ? 'online' as const : 'fallback' as const,
              detail: data?.title ? `${data.title} - ${data.artist || 'Spotify'}` : 'fallback track is loaded',
            }
          }
          if (feed.label === 'GitHub Pulse') {
            return {
              ...feed,
              status: data?.status === 'live' ? 'online' as const : 'fallback' as const,
              detail: data?.totals?.contributions
                ? `${data.totals.contributions} public contributions in the current graph`
                : 'fallback graph is loaded',
            }
          }
          return {
            ...feed,
            status: data?.title ? 'online' as const : 'fallback' as const,
            detail: data?.title || 'daily update fallback is loaded',
          }
        } catch {
          return { ...feed, status: 'offline' as const, detail: 'feed did not respond' }
        }
      }))

      try {
        const status = await readJson('/ops/status.json')
        if (!cancelled) setOps(status)
      } catch {
        if (!cancelled) setOps(null)
      }

      if (!cancelled) setFeeds(nextFeeds)
    }

    refresh()
    const timer = window.setInterval(refresh, 60000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  const health = useMemo(() => {
    const online = feeds.filter((feed) => feed.status === 'online').length
    const degraded = feeds.filter((feed) => feed.status === 'fallback').length
    const offline = feeds.filter((feed) => feed.status === 'offline').length
    return { online, degraded, offline }
  }, [feeds])

  return (
    <main className="min-h-screen bg-[#14110D] px-5 py-6 text-[#F6F2EA] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#E2621B]">AE Ops</p>
            <h1 className="mt-2 font-serif text-4xl font-normal leading-none sm:text-5xl">Portfolio control room</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
              Public-safe monitoring for the OS desktop: live feeds, workflows, and agent handoff state.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 font-mono text-xs text-white/72 transition hover:border-[#E2621B]/60 hover:text-white"
          >
            back to desktop
          </a>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Feeds online</p>
            <strong className="mt-4 block font-serif text-5xl font-normal">{health.online}</strong>
          </div>
          <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Fallbacks</p>
            <strong className="mt-4 block font-serif text-5xl font-normal">{health.degraded}</strong>
          </div>
          <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Offline</p>
            <strong className="mt-4 block font-serif text-5xl font-normal">{health.offline}</strong>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Live feed checks</p>
                <h2 className="mt-2 font-serif text-3xl font-normal">What the desktop is reading</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/55">60s refresh</span>
            </div>
            <div className="mt-5 divide-y divide-white/10">
              {feeds.map((feed) => (
                <a key={feed.href} href={feed.href} className="flex items-center gap-4 py-4 text-left transition hover:bg-white/[0.03]">
                  <span className={`h-3 w-3 rounded-full ${statusClass(feed.status)}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{feed.label}</span>
                    <span className="mt-1 block truncate text-xs text-white/48">{feed.detail}</span>
                  </span>
                  <span className="font-mono text-[11px] uppercase text-white/45">{statusCopy(feed.status)}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Agent handoff</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">{ops?.release || 'portfolio-os'}</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">
              {ops?.updatedAt ? `Last status file update: ${ops.updatedAt}` : 'Status file fallback. The dashboard is still usable.'}
            </p>
            <div className="mt-5 space-y-3">
              {(ops?.notes || [
                'Public controls only. Private actions stay behind GitHub or Rudhra.',
                'Use workflows for deploy, Spotify, and GitHub activity updates.',
                'Use terminal commands on the desktop for visitor-facing agent behavior.',
              ]).map((note) => (
                <div key={note} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white/65">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Workflows</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(ops?.workflows || [
              { name: 'Deploy to GitHub Pages', cadence: 'on push to main', href: workflowLinks.deploy },
              { name: 'Update Spotify now playing', cadence: 'every 15 minutes', href: workflowLinks.spotify },
              { name: 'Update GitHub activity', cadence: 'every 6 hours', href: workflowLinks.github },
            ]).map((workflow) => (
              <a
                key={workflow.href}
                href={workflow.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-[#E2621B]/70 hover:bg-[#E2621B]/10"
              >
                <span className="block font-serif text-2xl font-normal">{workflow.name}</span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">{workflow.cadence}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
