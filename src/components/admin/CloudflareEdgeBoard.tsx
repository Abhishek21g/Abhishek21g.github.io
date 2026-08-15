'use client'

import { useEffect, useState } from 'react'
import { CloudflareEdgeSummary, getCloudflareEdgeSummary } from '@/lib/adminApi'
import BarList from './BarList'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = -1
  do {
    value /= 1024
    unit++
  } while (value >= 1024 && unit < units.length - 1)
  return `${value.toFixed(1)} ${units[unit]}`
}

function statusColor(status: string): string {
  const n = Number(status)
  if (n >= 500) return 'bg-red-400'
  if (n >= 400) return 'bg-amber-400'
  if (n >= 300) return 'bg-sky-400'
  return 'bg-emerald-400'
}

function TrendChart({ trend }: { trend: CloudflareEdgeSummary['trend'] }) {
  const max = Math.max(1, ...trend.map((t) => t.requests))
  if (trend.length === 0) {
    return <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">no data yet</p>
  }
  return (
    <div className="flex h-32 items-end gap-1.5">
      {trend.map((t) => (
        <div key={t.date} className="group relative flex flex-1 flex-col items-center justify-end gap-1.5">
          <span className="pointer-events-none absolute -top-6 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition group-hover:opacity-100">
            {t.requests} reqs
          </span>
          <div
            className="w-full rounded-t bg-[#E2621B]/70 transition group-hover:bg-[#E2621B]"
            style={{ height: `${Math.max(3, (t.requests / max) * 100)}%` }}
          />
          <span className="font-mono text-[9px] text-white/35">{t.date.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CloudflareEdgeBoard() {
  const [summary, setSummary] = useState<CloudflareEdgeSummary | null>(null)
  const [error, setError] = useState('')
  const [notConfigured, setNotConfigured] = useState(false)

  useEffect(() => {
    getCloudflareEdgeSummary()
      .then(setSummary)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load'
        if (message.includes('not configured')) {
          setNotConfigured(true)
        } else {
          setError(message)
        }
      })
  }, [])

  if (notConfigured) return null

  if (error) {
    return <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
  }

  if (!summary) {
    return <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">loading cloudflare data…</p>
  }

  const { today, trend } = summary
  const errorRate = ((today.status4xxRatio + today.status5xxRatio) * 100).toFixed(1)
  const totalUniques = trend.reduce((sum, t) => sum + t.uniques, 0)
  const totalThreats = trend.reduce((sum, t) => sum + t.threats, 0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Real edge traffic</p>
        <h2 className="mt-1 font-serif text-2xl font-normal">Cloudflare</h2>
        <p className="mt-1 text-sm text-white/50">Every request that actually hit enaguthi.com — not just what a JS beacon caught.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Requests today</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{today.requests.toLocaleString()}</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Bandwidth today</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{formatBytes(today.bytes)}</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Error rate</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{errorRate}%</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Unique visitors (14d)</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{totalUniques.toLocaleString()}</strong>
        </div>
      </section>

      {totalThreats > 0 && (
        <p className="font-mono text-xs text-white/45">
          {totalThreats.toLocaleString()} threats blocked at the edge in the last 14 days (bots, known-bad IPs, attack patterns).
        </p>
      )}

      <section className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Trend</p>
        <h3 className="mt-1 font-serif text-2xl font-normal">Requests, last 14 days</h3>
        <div className="mt-6">
          <TrendChart trend={trend} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Today</p>
          <h3 className="mt-1 font-serif text-2xl font-normal">Countries</h3>
          <div className="mt-5">
            <BarList rows={today.byCountry.map((c) => ({ key: c.country, count: c.count }))} labelWidth="w-14" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Today</p>
          <h3 className="mt-1 font-serif text-2xl font-normal">Paths</h3>
          <div className="mt-5">
            <BarList rows={today.byPath.map((p) => ({ key: p.path, count: p.count }))} labelWidth="w-40" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Today</p>
          <h3 className="mt-1 font-serif text-2xl font-normal">Status codes</h3>
          <div className="mt-4 flex flex-col gap-2">
            {today.byStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-3 text-sm">
                <span className={`h-2 w-2 rounded-full ${statusColor(s.status)}`} />
                <span className="font-mono text-white/70">{s.status}</span>
                <span className="ml-auto font-mono text-xs text-white/45">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Today</p>
          <h3 className="mt-1 font-serif text-2xl font-normal">Cache</h3>
          <div className="mt-4 flex flex-col gap-2">
            {today.byCache.map((c) => (
              <div key={c.status} className="flex items-center gap-3 text-sm">
                <span className="font-mono capitalize text-white/70">{c.status}</span>
                <span className="ml-auto font-mono text-xs text-white/45">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
