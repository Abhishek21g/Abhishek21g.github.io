export interface Env {
  ADMIN_KV: KVNamespace
  ADMIN_PASSWORD: string
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

    return json({ error: 'Not found' }, { status: 404 }, origin)
  },
}
