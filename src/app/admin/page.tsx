'use client'

import Link from 'next/link'
import AdminAuthGate from '@/components/admin/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminShell
        eyebrow="AE Admin"
        title="Private space"
        description="Just for me — travel plans and anything else that doesn't belong on the public site."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/travel/"
            className="rounded-2xl border border-white/14 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl transition hover:border-[#E2621B]/60"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Travel</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">Trip planning</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">Destinations, dates, status, and the messy notes in between.</p>
          </Link>
          <Link
            href="/admin/notes/"
            className="rounded-2xl border border-white/14 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl transition hover:border-[#E2621B]/60"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Notes</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">Anything else</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">A catch-all space — ideas, lists, whatever doesn't fit elsewhere.</p>
          </Link>
          <Link
            href="/admin/tracking/"
            className="rounded-2xl border border-white/14 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl transition hover:border-[#E2621B]/60"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Tracking</p>
            <h2 className="mt-2 font-serif text-3xl font-normal">Visits &amp; links</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">Who's visiting, from where, and how your trackable links are doing.</p>
          </Link>
        </div>
      </AdminShell>
    </AdminAuthGate>
  )
}
