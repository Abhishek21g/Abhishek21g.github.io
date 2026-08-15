export interface Env {
  ADMIN_KV: KVNamespace
  ADMIN_PASSWORD: string
  CF_API_TOKEN?: string
  CF_ZONE_ID?: string
}

type EntryType = 'travel' | 'note'

interface Entry {
  id: string
  type: EntryType
  title: string
  body: string
  location?: string
  startDate?: string
  endDate?: string
  status?: 'idea' | 'planned' | 'booked' | 'done'
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface VisitEvent {
  ts: string
  path: string
  country: string
  referrer: string
}

interface ClickEvent {
  ts: string
  country: string
  referrer: string
}

interface TrackedLink {
  slug: string
  destination: string
  label: string
  createdAt: string
  clicks: ClickEvent[]
}

const MAX_VISITS = 1000
const MAX_CLICKS_PER_LINK = 200

const ALLOWED_ORIGINS = new Set([
  'https://enaguthi.com',
  'http://localhost:3001',
])

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://enaguthi.com'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data: unknown, init: ResponseInit = {}, origin: string | null = null): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
      ...init.headers,
    },
  })
}

function requireAdmin(request: Request, env: Env): boolean {
  const header = request.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  return Boolean(token) && token === env.ADMIN_PASSWORD
}

function isEntryType(value: unknown): value is EntryType {
  return value === 'travel' || value === 'note'
}

// ---- entries (travel / notes) ----

async function readEntries(env: Env, type: EntryType): Promise<Entry[]> {
  const raw = await env.ADMIN_KV.get(`entries:${type}`)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Entry[]
  } catch {
    return []
  }
}

async function writeEntries(env: Env, type: EntryType, entries: Entry[]): Promise<void> {
  await env.ADMIN_KV.put(`entries:${type}`, JSON.stringify(entries))
}

async function handleEntries(request: Request, env: Env, origin: string | null, parts: string[]): Promise<Response> {
  const entryId = parts[1]

  if (request.method === 'GET' && !entryId) {
    const typeParam = new URL(request.url).searchParams.get('type')
    if (!isEntryType(typeParam)) return json({ error: 'type query param required (travel|note)' }, { status: 400 }, origin)
    const entries = await readEntries(env, typeParam)
    return json({ entries }, {}, origin)
  }

  if (request.method === 'POST' && !entryId) {
    const body = await request.json<Partial<Entry>>().catch(() => null)
    if (!body || !isEntryType(body.type) || !body.title) {
      return json({ error: 'type and title are required' }, { status: 400 }, origin)
    }
    const now = new Date().toISOString()
    const entry: Entry = {
      id: crypto.randomUUID(),
      type: body.type,
      title: body.title,
      body: body.body ?? '',
      location: body.location,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
      tags: body.tags,
      createdAt: now,
      updatedAt: now,
    }
    const entries = await readEntries(env, entry.type)
    entries.unshift(entry)
    await writeEntries(env, entry.type, entries)
    return json({ entry }, { status: 201 }, origin)
  }

  if (request.method === 'PUT' && entryId) {
    const body = await request.json<Partial<Entry>>().catch(() => null)
    if (!body || !isEntryType(body.type)) {
      return json({ error: 'type is required' }, { status: 400 }, origin)
    }
    const entries = await readEntries(env, body.type)
    const index = entries.findIndex((entry) => entry.id === entryId)
    if (index === -1) return json({ error: 'Entry not found' }, { status: 404 }, origin)
    entries[index] = { ...entries[index], ...body, id: entryId, updatedAt: new Date().toISOString() }
    await writeEntries(env, body.type, entries)
    return json({ entry: entries[index] }, {}, origin)
  }

  if (request.method === 'DELETE' && entryId) {
    const typeParam = new URL(request.url).searchParams.get('type')
    if (!isEntryType(typeParam)) return json({ error: 'type query param required (travel|note)' }, { status: 400 }, origin)
    const entries = await readEntries(env, typeParam)
    const next = entries.filter((entry) => entry.id !== entryId)
    await writeEntries(env, typeParam, next)
    return json({ ok: true }, {}, origin)
  }

  return json({ error: 'Not found' }, { status: 404 }, origin)
}

// ---- tracking: visits + links ----

async function readVisits(env: Env): Promise<VisitEvent[]> {
  const raw = await env.ADMIN_KV.get('track:visits')
  if (!raw) return []
  try {
    return JSON.parse(raw) as VisitEvent[]
  } catch {
    return []
  }
}

async function readLinks(env: Env): Promise<TrackedLink[]> {
  const raw = await env.ADMIN_KV.get('track:links')
  if (!raw) return []
  try {
    return JSON.parse(raw) as TrackedLink[]
  } catch {
    return []
  }
}

async function writeLinks(env: Env, links: TrackedLink[]): Promise<void> {
  await env.ADMIN_KV.put('track:links', JSON.stringify(links))
}

function countBy<T>(items: T[], key: (item: T) => string): { key: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    const k = key(item)
    counts.set(k, (counts.get(k) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([k, count]) => ({ key: k, count }))
    .sort((a, b) => b.count - a.count)
}

// ---- cloudflare edge analytics (real traffic, via GraphQL Analytics API) ----

interface CfHttpGroupRow {
  count: number
  dimensions: {
    clientCountryName?: string
    clientRequestPath?: string
    edgeResponseStatus?: number
    cacheStatus?: string
  }
}

async function queryCloudflareGraphQL<T>(env: Env, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  const body = await response.json<{ data: T | null; errors?: { message: string }[] }>()
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join('; '))
  }
  return body.data as T
}

function sumByDimension(rows: CfHttpGroupRow[], key: keyof CfHttpGroupRow['dimensions']): { key: string; count: number }[] {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const value = row.dimensions[key]
    const k = value === undefined || value === null ? 'unknown' : String(value)
    totals.set(k, (totals.get(k) || 0) + row.count)
  }
  return Array.from(totals.entries())
    .map(([k, count]) => ({ key: k, count }))
    .sort((a, b) => b.count - a.count)
}

async function handleCloudflareEdgeSummary(env: Env, origin: string | null): Promise<Response> {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    return json({ error: 'Cloudflare analytics is not configured (missing CF_API_TOKEN / CF_ZONE_ID)' }, { status: 501 }, origin)
  }

  const now = new Date()
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const trendStart = new Date(todayStart.getTime() - 13 * 86400000)

  try {
    const [todayData, trendData] = await Promise.all([
      queryCloudflareGraphQL<{
        viewer: {
          zones: {
            breakdown: CfHttpGroupRow[]
            totals: { count: number; sum: { edgeResponseBytes: number }; ratio: { status4xx: number; status5xx: number } }[]
          }[]
        }
      }>(
        env,
        `query($zoneTag: String!, $start: Time!, $end: Time!) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              breakdown: httpRequestsAdaptiveGroups(
                limit: 100
                filter: { datetime_geq: $start, datetime_lt: $end }
                orderBy: [count_DESC]
              ) {
                count
                dimensions { clientCountryName clientRequestPath edgeResponseStatus cacheStatus }
              }
              totals: httpRequestsAdaptiveGroups(limit: 1, filter: { datetime_geq: $start, datetime_lt: $end }) {
                count
                sum { edgeResponseBytes }
                ratio { status4xx status5xx }
              }
            }
          }
        }`,
        { zoneTag: env.CF_ZONE_ID, start: todayStart.toISOString(), end: now.toISOString() },
      ),
      queryCloudflareGraphQL<{
        viewer: { zones: { daily: { count: number; uniq: { uniques: number }; dimensions: { date: string } }[] }[] }
      }>(
        env,
        `query($zoneTag: String!, $start: Date!, $end: Date!) {
          viewer {
            zones(filter: { zoneTag: $zoneTag }) {
              daily: httpRequests1dGroups(limit: 14, filter: { date_geq: $start, date_leq: $end }, orderBy: [date_ASC]) {
                count
                uniq { uniques }
                dimensions { date }
              }
            }
          }
        }`,
        { zoneTag: env.CF_ZONE_ID, start: trendStart.toISOString().slice(0, 10), end: todayStart.toISOString().slice(0, 10) },
      ),
    ])

    const zone = todayData.viewer.zones[0]
    const rows = zone?.breakdown ?? []
    const totals = zone?.totals?.[0] ?? { count: 0, sum: { edgeResponseBytes: 0 }, ratio: { status4xx: 0, status5xx: 0 } }
    const daily = trendData.viewer.zones[0]?.daily ?? []

    return json(
      {
        today: {
          requests: totals.count,
          bytes: totals.sum.edgeResponseBytes,
          status4xxRatio: totals.ratio.status4xx,
          status5xxRatio: totals.ratio.status5xx,
          byCountry: sumByDimension(rows, 'clientCountryName').map((r) => ({ country: r.key, count: r.count })),
          byPath: sumByDimension(rows, 'clientRequestPath').map((r) => ({ path: r.key, count: r.count })),
          byStatus: sumByDimension(rows, 'edgeResponseStatus').map((r) => ({ status: r.key, count: r.count })),
          byCache: sumByDimension(rows, 'cacheStatus').map((r) => ({ status: r.key, count: r.count })),
        },
        trend: daily.map((d) => ({ date: d.dimensions.date, requests: d.count, uniques: d.uniq.uniques })),
      },
      {},
      origin,
    )
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Cloudflare query failed' }, { status: 502 }, origin)
  }
}

// public: record a page visit (called by the tracking beacon on every page)
async function handleTrackVisit(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await request.json<{ path?: string; referrer?: string }>().catch(() => null)
  if (!body || typeof body.path !== 'string') {
    return json({ error: 'path is required' }, { status: 400 }, origin)
  }
  const country = (request.cf?.country as string | undefined) || 'unknown'
  const event: VisitEvent = {
    ts: new Date().toISOString(),
    path: body.path.slice(0, 200),
    country,
    referrer: (body.referrer || '').slice(0, 300),
  }
  const visits = await readVisits(env)
  visits.push(event)
  while (visits.length > MAX_VISITS) visits.shift()
  await env.ADMIN_KV.put('track:visits', JSON.stringify(visits))
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

// public: redirect a trackable short link and record the click
async function handleLinkRedirect(request: Request, env: Env, slug: string): Promise<Response> {
  const links = await readLinks(env)
  const link = links.find((l) => l.slug === slug)
  if (!link) return new Response('Not found', { status: 404 })

  const country = (request.cf?.country as string | undefined) || 'unknown'
  link.clicks.push({
    ts: new Date().toISOString(),
    country,
    referrer: request.headers.get('Referer') || '',
  })
  while (link.clicks.length > MAX_CLICKS_PER_LINK) link.clicks.shift()
  await writeLinks(env, links)

  return Response.redirect(link.destination, 302)
}

// admin: aggregated tracking summary
async function handleTrackingSummary(env: Env, origin: string | null): Promise<Response> {
  const [visits, links] = await Promise.all([readVisits(env), readLinks(env)])
  const totalClicks = links.reduce((sum, l) => sum + l.clicks.length, 0)

  const byPath = countBy(visits, (v) => v.path).map((r) => ({ path: r.key, count: r.count }))
  const byCountry = countBy(visits, (v) => v.country).map((r) => ({ country: r.key, count: r.count }))

  const recentVisits = visits.slice(-20).reverse()
  const linkSummaries = links
    .map((l) => ({
      slug: l.slug,
      destination: l.destination,
      label: l.label,
      createdAt: l.createdAt,
      clickCount: l.clicks.length,
      recentClicks: l.clicks.slice(-5).reverse(),
    }))
    .sort((a, b) => b.clickCount - a.clickCount)

  return json(
    {
      totalVisits: visits.length,
      totalClicks,
      byPath,
      byCountry,
      recentVisits,
      links: linkSummaries,
    },
    {},
    origin,
  )
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,40}$/.test(slug)
}

async function handleTrackingLinks(request: Request, env: Env, origin: string | null, linkSlug?: string): Promise<Response> {
  if (request.method === 'POST' && !linkSlug) {
    const body = await request.json<Partial<TrackedLink>>().catch(() => null)
    if (!body || !body.slug || !body.destination || !isValidSlug(body.slug)) {
      return json({ error: 'slug (lowercase, alphanumeric/hyphen) and destination are required' }, { status: 400 }, origin)
    }
    const links = await readLinks(env)
    if (links.some((l) => l.slug === body.slug)) {
      return json({ error: 'That slug is already taken' }, { status: 409 }, origin)
    }
    const link: TrackedLink = {
      slug: body.slug,
      destination: body.destination,
      label: body.label || body.slug,
      createdAt: new Date().toISOString(),
      clicks: [],
    }
    links.unshift(link)
    await writeLinks(env, links)
    return json({ link }, { status: 201 }, origin)
  }

  if (request.method === 'DELETE' && linkSlug) {
    const links = await readLinks(env)
    const next = links.filter((l) => l.slug !== linkSlug)
    await writeLinks(env, next)
    return json({ ok: true }, {}, origin)
  }

  return json({ error: 'Not found' }, { status: 404 }, origin)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    // public: tracking beacon
    if (url.pathname === '/api/track/visit' && request.method === 'POST') {
      return handleTrackVisit(request, env, origin)
    }

    // public: short-link redirect, e.g. /l/resume
    if (url.pathname.startsWith('/l/')) {
      const slug = url.pathname.replace('/l/', '').split('/').filter(Boolean)[0]
      if (!slug) return new Response('Not found', { status: 404 })
      return handleLinkRedirect(request, env, slug)
    }

    if (!url.pathname.startsWith('/api/admin')) {
      return json({ error: 'Not found' }, { status: 404 }, origin)
    }

    if (url.pathname === '/api/admin/verify') {
      if (!requireAdmin(request, env)) return json({ error: 'Unauthorized' }, { status: 401 }, origin)
      return json({ ok: true }, {}, origin)
    }

    if (!requireAdmin(request, env)) {
      return json({ error: 'Unauthorized' }, { status: 401 }, origin)
    }

    const parts = url.pathname.replace('/api/admin/', '').split('/').filter(Boolean)

    if (parts[0] === 'entries') {
      return handleEntries(request, env, origin, parts)
    }

    if (parts[0] === 'tracking' && parts[1] === 'summary' && request.method === 'GET') {
      return handleTrackingSummary(env, origin)
    }

    if (parts[0] === 'tracking' && parts[1] === 'links') {
      return handleTrackingLinks(request, env, origin, parts[2])
    }

    if (parts[0] === 'tracking' && parts[1] === 'cloudflare' && request.method === 'GET') {
      return handleCloudflareEdgeSummary(env, origin)
    }

    return json({ error: 'Not found' }, { status: 404 }, origin)
  },
}
