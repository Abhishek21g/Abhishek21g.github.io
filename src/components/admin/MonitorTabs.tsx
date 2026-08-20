'use client'

import { Fragment, FormEvent, useEffect, useMemo, useState } from 'react'
import {
  CloudflareEdgeSummary,
  TrackingSummary,
  createTrackedLink,
  deleteTrackedLink,
  getCloudflareEdgeSummary,
  getTrackingSummary,
} from '@/lib/adminApi'

type Tab = 'opens' | 'world' | 'links' | 'cloudflare'

const TABS: { id: Tab; label: string }[] = [
  { id: 'opens', label: 'Opens' },
  { id: 'world', label: 'World' },
  { id: 'links', label: 'Links' },
  { id: 'cloudflare', label: 'Cloudflare' },
]

function formatLocation(e: { city?: string; region?: string; regionCode?: string; country?: string }): string {
  const parts = [e.city, e.regionCode || e.region, e.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'unknown'
}

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

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-paper/60 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-mono text-lg text-ink">{value}</p>
    </div>
  )
}

function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-wash">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty && <p className="px-3 py-6 text-center font-mono text-xs uppercase tracking-[0.12em] text-muted">no data yet</p>}
    </div>
  )
}

function Td({ children, muted, mono }: { children: React.ReactNode; muted?: boolean; mono?: boolean }) {
  return (
    <td className={`px-3 py-2 align-top text-xs ${muted ? 'text-muted' : 'text-ink'} ${mono ? 'font-mono' : ''}`}>
      {children}
    </td>
  )
}

export default function MonitorTabs() {
  const [tab, setTab] = useState<Tab>('opens')
  const [tracking, setTracking] = useState<TrackingSummary | null>(null)
  const [cloudflare, setCloudflare] = useState<CloudflareEdgeSummary | null>(null)
  const [cfError, setCfError] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      setTracking(await getTrackingSummary())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    }
    try {
      setCloudflare(await getCloudflareEdgeSummary())
      setCfError('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load'
      if (!message.includes('not configured')) setCfError(message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-1 shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <div className="admin-monitor rounded-xl bg-paper p-5 text-ink">
        <div className="flex flex-wrap items-center gap-1 border-b border-line pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition ${
                tab === t.id ? 'bg-ink text-paper' : 'text-muted hover:bg-wash hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={refresh} className="ml-auto rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted hover:text-ink">
            refresh
          </button>
        </div>

        {error && <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <div className="mt-4">
          {!tracking ? (
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">loading…</p>
          ) : tab === 'opens' ? (
            <OpensTab tracking={tracking} />
          ) : tab === 'world' ? (
            <WorldTab tracking={tracking} cloudflare={cloudflare} />
          ) : tab === 'links' ? (
            <LinksTab tracking={tracking} onChange={refresh} />
          ) : (
            <CloudflareTab cloudflare={cloudflare} error={cfError} />
          )}
        </div>
      </div>
    </div>
  )
}

function OpensTab({ tracking }: { tracking: TrackingSummary }) {
  return (
    <Table head={['Time', 'Path', 'Location', 'IP', 'Referrer']} empty={tracking.recentVisits.length === 0}>
      {tracking.recentVisits.map((v, i) => (
        <tr key={`${v.ts}-${i}`} className="hover:bg-wash">
          <Td mono muted>{new Date(v.ts).toLocaleString()}</Td>
          <Td mono>{v.path}</Td>
          <Td>{formatLocation(v)}</Td>
          <Td mono muted>{v.ip}</Td>
          <Td muted>{v.referrer || '—'}</Td>
        </tr>
      ))}
    </Table>
  )
}

function WorldTab({ tracking, cloudflare }: { tracking: TrackingSummary; cloudflare: CloudflareEdgeSummary | null }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">By region (your links + beacon)</p>
        <Table head={['Region', 'Visits']} empty={tracking.byRegion.length === 0}>
          {tracking.byRegion.map((r) => (
            <tr key={r.region} className="hover:bg-wash">
              <Td>{r.region}</Td>
              <Td mono>{r.count}</Td>
            </tr>
          ))}
        </Table>
      </div>
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">By country</p>
        <Table head={['Country', 'Visits']} empty={tracking.byCountry.length === 0}>
          {tracking.byCountry.map((c) => (
            <tr key={c.country} className="hover:bg-wash">
              <Td>{c.country}</Td>
              <Td mono>{c.count}</Td>
            </tr>
          ))}
        </Table>
      </div>
      {cloudflare && (
        <div className="lg:col-span-2">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Cloudflare edge — countries today</p>
          <Table head={['Country', 'Requests']} empty={cloudflare.today.byCountry.length === 0}>
            {cloudflare.today.byCountry.map((c) => (
              <tr key={c.country} className="hover:bg-wash">
                <Td>{c.country}</Td>
                <Td mono>{c.count}</Td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </div>
  )
}

function LinksTab({ tracking, onChange }: { tracking: TrackingSummary; onChange: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [slug, setSlug] = useState('')
  const [destination, setDestination] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [copiedSlug, setCopiedSlug] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!slug.trim() || !destination.trim()) return
    setSaving(true)
    setFormError('')
    try {
      await createTrackedLink({ slug: slug.trim(), destination: destination.trim(), label: label.trim() || undefined })
      setSlug('')
      setDestination('')
      setLabel('')
      setShowForm(false)
      onChange()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setSaving(false)
    }
  }

  function copy(s: string) {
    navigator.clipboard?.writeText(`https://enaguthi.com/l/${s}`).then(() => {
      setCopiedSlug(s)
      setTimeout(() => setCopiedSlug(''), 1500)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Create a tracking link for any page on the site
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs text-paper hover:bg-ink/85"
          >
            + new link
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border border-line bg-wash/60 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              autoFocus
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="slug (e.g. tyler-yc)"
              className="rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="any URL on enaguthi.com (or external)"
              className="rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink sm:col-span-2"
            />
          </div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="label (who this is for, optional)"
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          />
          {formError && <p className="mt-2 text-xs text-red-600">{formError}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={saving || !slug.trim() || !destination.trim()}
              className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs text-paper hover:bg-ink/85 disabled:opacity-40"
            >
              {saving ? 'creating…' : 'create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted">
              cancel
            </button>
          </div>
        </form>
      )}

      <Table head={['Label', 'Link', 'Destination', 'Clicks', 'Created', '']} empty={tracking.links.length === 0}>
        {tracking.links.map((link) => (
          <Fragment key={link.slug}>
            <tr className="cursor-pointer hover:bg-wash" onClick={() => setExpanded(expanded === link.slug ? null : link.slug)}>
              <Td>{link.label}</Td>
              <Td mono muted>/l/{link.slug}</Td>
              <Td muted>
                <span className="block max-w-[220px] truncate">{link.destination}</span>
              </Td>
              <Td mono>{link.clickCount}</Td>
              <Td mono muted>{new Date(link.createdAt).toLocaleDateString()}</Td>
              <Td>
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => copy(link.slug)} className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted hover:text-ink">
                    {copiedSlug === link.slug ? 'copied' : 'copy'}
                  </button>
                  <button
                    onClick={() => deleteTrackedLink(link.slug).then(onChange)}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted hover:border-red-400 hover:text-red-600"
                  >
                    delete
                  </button>
                </div>
              </Td>
            </tr>
            {expanded === link.slug && link.recentClicks.length > 0 && (
              <tr className="bg-wash/60">
                <td colSpan={6} className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    {link.recentClicks.map((c, i) => (
                      <div key={`${c.ts}-${i}`} className="flex flex-wrap gap-x-4 font-mono text-[11px] text-muted">
                        <span>{new Date(c.ts).toLocaleString()}</span>
                        <span>{formatLocation(c)}</span>
                        <span>{c.ip}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </Table>
    </div>
  )
}

function CloudflareTab({ cloudflare, error }: { cloudflare: CloudflareEdgeSummary | null; error: string }) {
  const totals = useMemo(() => {
    if (!cloudflare) return null
    const uniques = cloudflare.trend.reduce((s, t) => s + t.uniques, 0)
    const threats = cloudflare.trend.reduce((s, t) => s + t.threats, 0)
    return { uniques, threats }
  }, [cloudflare])

  if (error) return <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
  if (!cloudflare) return <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">not configured</p>

  const { today } = cloudflare

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <StatChip label="Requests today" value={today.requests.toLocaleString()} />
        <StatChip label="Bandwidth" value={formatBytes(today.bytes)} />
        <StatChip label="Error rate" value={`${((today.status4xxRatio + today.status5xxRatio) * 100).toFixed(1)}%`} />
        <StatChip label="Uniques (14d)" value={totals?.uniques.toLocaleString() ?? '—'} />
        <StatChip label="Threats (14d)" value={totals?.threats.toLocaleString() ?? '—'} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Paths today</p>
          <Table head={['Path', 'Requests']} empty={today.byPath.length === 0}>
            {today.byPath.slice(0, 10).map((p) => (
              <tr key={p.path} className="hover:bg-wash">
                <Td mono>{p.path}</Td>
                <Td mono>{p.count}</Td>
              </tr>
            ))}
          </Table>
        </div>
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Status codes today</p>
          <Table head={['Status', 'Count']} empty={today.byStatus.length === 0}>
            {today.byStatus.map((s) => (
              <tr key={s.status} className="hover:bg-wash">
                <Td mono>{s.status}</Td>
                <Td mono>{s.count}</Td>
              </tr>
            ))}
          </Table>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">14-day trend</p>
        <Table head={['Date', 'Requests', 'Page views', 'Uniques', 'Threats']}>
          {cloudflare.trend.map((t) => (
            <tr key={t.date} className="hover:bg-wash">
              <Td mono muted>{t.date}</Td>
              <Td mono>{t.requests}</Td>
              <Td mono>{t.pageViews}</Td>
              <Td mono>{t.uniques}</Td>
              <Td mono>{t.threats}</Td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
