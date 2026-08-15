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

function isEntryType(value: unknown): value is EntryType {
  return value === 'travel' || value === 'note'
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
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

    // /api/admin/entries[?type=travel]
    // /api/admin/entries/:id
    const parts = url.pathname.replace('/api/admin/', '').split('/').filter(Boolean)

    if (parts[0] !== 'entries') {
      return json({ error: 'Not found' }, { status: 404 }, origin)
    }

    const entryId = parts[1]

    if (request.method === 'GET' && !entryId) {
      const typeParam = url.searchParams.get('type')
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
      const typeParam = url.searchParams.get('type')
      if (!isEntryType(typeParam)) return json({ error: 'type query param required (travel|note)' }, { status: 400 }, origin)
      const entries = await readEntries(env, typeParam)
      const next = entries.filter((entry) => entry.id !== entryId)
      await writeEntries(env, typeParam, next)
      return json({ ok: true }, {}, origin)
    }

    return json({ error: 'Not found' }, { status: 404 }, origin)
  },
}
