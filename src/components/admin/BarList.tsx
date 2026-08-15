'use client'

export default function BarList({
  rows,
  labelWidth = 'w-40',
}: {
  rows: { key: string; count: number }[]
  labelWidth?: string
}) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  if (rows.length === 0) {
    return <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">no data yet</p>
  }
  return (
    <div className="flex flex-col gap-2">
      {rows.slice(0, 10).map((row) => (
        <div key={row.key} className="flex items-center gap-3">
          <span className={`shrink-0 truncate font-mono text-xs text-white/60 ${labelWidth}`}>{row.key}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#E2621B]"
              style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-mono text-xs text-white/50">{row.count}</span>
        </div>
      ))}
    </div>
  )
}
