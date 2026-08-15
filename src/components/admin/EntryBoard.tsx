'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  Entry,
  EntryType,
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
} from '@/lib/adminApi'

const STATUS_OPTIONS: NonNullable<Entry['status']>[] = ['idea', 'planned', 'booked', 'done']

const STATUS_LABEL: Record<NonNullable<Entry['status']>, string> = {
  idea: 'Idea',
  planned: 'Planned',
  booked: 'Booked',
  done: 'Done',
}

const STATUS_DOT: Record<NonNullable<Entry['status']>, string> = {
  idea: 'bg-zinc-400',
  planned: 'bg-amber-400',
  booked: 'bg-sky-400',
  done: 'bg-emerald-400',
}

const emptyForm = {
  title: '',
  body: '',
  location: '',
  startDate: '',
  endDate: '',
  status: 'idea' as NonNullable<Entry['status']>,
}

export default function EntryBoard({ type }: { type: EntryType }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const data = await listEntries(type)
      setEntries(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function startEdit(entry: Entry) {
    setEditingId(entry.id)
    setForm({
      title: entry.title,
      body: entry.body,
      location: entry.location || '',
      startDate: entry.startDate || '',
      endDate: entry.endDate || '',
      status: entry.status || 'idea',
    })
    setShowForm(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const payload = {
        type,
        title: form.title.trim(),
        body: form.body.trim(),
        ...(type === 'travel'
          ? {
              location: form.location.trim() || undefined,
              startDate: form.startDate || undefined,
              endDate: form.endDate || undefined,
              status: form.status,
            }
          : {}),
      }
      if (editingId) {
        await updateEntry(editingId, payload)
      } else {
        await createEntry(payload)
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id, type)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>
      )}

      <div className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-normal">
              {type === 'travel' ? 'Trips' : 'Notes'}
            </h2>
          </div>
          {!showForm && (
            <button
              onClick={startCreate}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#E2621B] px-4 font-mono text-xs font-semibold text-[#14110D] transition hover:bg-[#E2621B]/85"
            >
              + add {type === 'travel' ? 'trip' : 'note'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
            <input
              autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={type === 'travel' ? 'Trip name (e.g. Tokyo, Nov 2026)' : 'Title'}
              className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
            />

            {type === 'travel' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Destination"
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
                />
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof f.status }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none focus:border-[#E2621B]/60"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#14110D]">
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none focus:border-[#E2621B]/60"
                />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none focus:border-[#E2621B]/60"
                />
              </div>
            )}

            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder={type === 'travel' ? 'Notes: flights, ideas, links…' : 'Write anything…'}
              rows={4}
              className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#E2621B] px-4 font-mono text-xs font-semibold text-[#14110D] transition hover:bg-[#E2621B]/85 disabled:opacity-40"
              >
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-4 font-mono text-xs text-white/72 transition hover:text-white"
              >
                cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {loading ? (
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">loading…</p>
      ) : entries.length === 0 ? (
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">nothing here yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-white/14 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-normal">{entry.title}</h3>
                  {type === 'travel' && (entry.location || entry.startDate) && (
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">
                      {entry.status && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${STATUS_DOT[entry.status]}`} />
                          {STATUS_LABEL[entry.status]}
                        </span>
                      )}
                      {entry.location && <span>{entry.location}</span>}
                      {entry.startDate && (
                        <span>
                          {entry.startDate}
                          {entry.endDate ? ` → ${entry.endDate}` : ''}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(entry)}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-white/60 hover:text-white"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-white/60 hover:border-red-400/60 hover:text-red-300"
                  >
                    delete
                  </button>
                </div>
              </div>
              {entry.body && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">{entry.body}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
