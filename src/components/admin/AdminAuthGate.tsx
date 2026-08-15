'use client'

import { FormEvent, useEffect, useState } from 'react'
import { getToken, setToken, verifyPassword } from '@/lib/adminApi'

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'authed' | 'gate'>('checking')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const existing = getToken()
    if (!existing) {
      setStatus('gate')
      return
    }
    verifyPassword(existing).then((ok) => setStatus(ok ? 'authed' : 'gate'))
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const ok = await verifyPassword(password).catch(() => false)
    setSubmitting(false)
    if (!ok) {
      setError('Wrong password.')
      return
    }
    setToken(password)
    setStatus('authed')
  }

  if (status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14110D] text-[#F6F2EA]">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">checking session…</p>
      </main>
    )
  }

  if (status === 'gate') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14110D] px-5 text-[#F6F2EA]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-white/14 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#E2621B]">AE Admin</p>
          <h1 className="mt-2 font-serif text-3xl font-normal">Private area</h1>
          <p className="mt-2 text-sm leading-6 text-white/58">Enter the password to continue.</p>

          <input
            type="password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-5 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-[#F6F2EA] outline-none placeholder:text-white/35 focus:border-[#E2621B]/60"
          />

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !password}
            className="mt-5 w-full rounded-full bg-[#E2621B] px-4 py-2.5 text-sm font-semibold text-[#14110D] transition hover:bg-[#E2621B]/85 disabled:opacity-40"
          >
            {submitting ? 'Checking…' : 'Enter'}
          </button>

          <a
            href="/"
            className="mt-4 block text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 hover:text-white/70"
          >
            back to desktop
          </a>
        </form>
      </main>
    )
  }

  return <>{children}</>
}
