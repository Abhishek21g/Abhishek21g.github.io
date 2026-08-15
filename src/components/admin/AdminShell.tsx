'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clearToken } from '@/lib/adminApi'

const NAV = [
  { href: '/admin/', label: 'Dashboard' },
  { href: '/admin/travel/', label: 'Travel' },
  { href: '/admin/notes/', label: 'Notes' },
  { href: '/admin/tracking/', label: 'Tracking' },
]

export default function AdminShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <main className="min-h-screen bg-[#14110D] px-5 py-6 text-[#F6F2EA] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#E2621B]">{eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-normal leading-none sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 items-center justify-center rounded-full border px-4 font-mono text-xs transition ${
                  pathname === item.href
                    ? 'border-[#E2621B]/60 bg-[#E2621B]/15 text-white'
                    : 'border-white/15 bg-white/8 text-white/72 hover:border-[#E2621B]/60 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                clearToken()
                window.location.href = '/admin/'
              }}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 font-mono text-xs text-white/72 transition hover:border-red-400/60 hover:text-white"
            >
              log out
            </button>
          </div>
        </header>

        {children}
      </div>
    </main>
  )
}
