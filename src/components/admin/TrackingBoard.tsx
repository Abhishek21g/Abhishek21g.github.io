'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  TrackingSummary,
  createTrackedLink,
  deleteTrackedLink,
  getTrackingSummary,
} from '@/lib/adminApi'
import BarList from './BarList'

export default function TrackingBoard() {
  const [summary, setSummary] = useState<TrackingSummary | null>(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [slug, setSlug] = useState('')
  const [destination, setDestination] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState('')

  async function refresh() {
    try {
      const data = await getTrackingSummary()
      setSummary(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreateLink(event: FormEvent) {
    event.preventDefault()
    if (!slug.trim() || !destination.trim()) return
    setSaving(true)
    setError('')
    try {
      await createTrackedLink({ slug: slug.trim(), destination: destination.trim(), label: label.trim() || undefined })
      setSlug('')
      setDestination('')
      setLabel('')
      setShowForm(false)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteLink(linkSlug: string) {
    try {
      await deleteTrackedLink(linkSlug)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete link')
    }
  }

  function copyLink(linkSlug: string) {
    const url = `https://enaguthi.com/l/${linkSlug}`
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedSlug(linkSlug)
      setTimeout(() => setCopiedSlug(''), 1500)
    })
  }

  if (!summary) {
    return (
      <div className="flex flex-col gap-5">
        {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">loading…</p>
      </div>
    )
  }

  const countryRows = summary.byCountry.map((c) => ({ key: c.country, count: c.count }))
  const pathRows = summary.byPath.map((p) => ({ key: p.path, count: p.count }))

  return (
    <div className="flex flex-col gap-5">
      {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Visits</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{summary.totalVisits}</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Link clicks</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{summary.totalClicks}</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Countries</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{summary.byCountry.length}</strong>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Active links</p>
          <strong className="mt-3 block font-serif text-4xl font-normal">{summary.links.length}</strong>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">World</p>
          <h2 className="mt-1 font-serif text-2xl font-normal">Visits by country</h2>
          <div className="mt-5">
            <BarList rows={countryRows} labelWidth="w-14" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Pages</p>
          <h2 className="mt-1 font-serif text-2xl font-normal">Most visited</h2>
          <div className="mt-5">
            <BarList rows={pathRows} labelWidth="w-40" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Links</p>
            <h2 className="mt-1 font-serif text-2xl font-normal">Trackable short links</h2>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#E2621B] px-4 font-mono text-xs font-semibold text-[#14110D] transition hover:bg-[#E2621B]/85"
            >
              + create link
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreateLink} className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                autoFocus
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="slug (e.g. resume)"
                className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
              />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="destination URL"
                className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60 sm:col-span-2"
              />
            </div>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="label (optional)"
              className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !slug.trim() || !destination.trim()}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#E2621B] px-4 font-mono text-xs font-semibold text-[#14110D] transition hover:bg-[#E2621B]/85 disabled:opacity-40"
              >
                {saving ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-4 font-mono text-xs text-white/72 transition hover:text-white"
              >
                cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 divide-y divide-white/10">
          {summary.links.length === 0 && (
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">no links yet</p>
          )}
          {summary.links.map((link) => (
            <div key={link.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{link.label}</p>
                <p className="mt-1 font-mono text-[11px] text-white/45">
                  enaguthi.com/l/{link.slug} → {link.destination}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/55">
                  {link.clickCount} {link.clickCount === 1 ? 'click' : 'clicks'}
                </span>
                <button
                  onClick={() => copyLink(link.slug)}
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-white/60 hover:text-white"
                >
                  {copiedSlug === link.slug ? 'copied' : 'copy'}
                </button>
                <button
                  onClick={() => handleDeleteLink(link.slug)}
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-white/60 hover:border-red-400/60 hover:text-red-300"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Live feed</p>
        <h2 className="mt-1 font-serif text-2xl font-normal">Recent visits</h2>
        <div className="mt-4 divide-y divide-white/10">
          {summary.recentVisits.length === 0 && (
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">no visits yet</p>
          )}
          {summary.recentVisits.map((visit, i) => (
            <div key={`${visit.ts}-${i}`} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="min-w-0 truncate text-white/75">{visit.path}</span>
              <span className="shrink-0 font-mono text-[11px] text-white/45">{visit.country}</span>
              <span className="shrink-0 font-mono text-[11px] text-white/35">{new Date(visit.ts).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
