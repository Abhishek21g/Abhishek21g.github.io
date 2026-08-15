export type EntryType = 'travel' | 'note'

export interface Entry {
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

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_BASE || ''
const TOKEN_KEY = 'ae-admin-token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  window.sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  window.sessionStorage.removeItem(TOKEN_KEY)
}

class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE}/api/admin${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (response.status === 401) {
    clearToken()
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(body.error || `Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export async function verifyPassword(password: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/admin/verify`, {
    headers: { Authorization: `Bearer ${password}` },
  })
  return response.ok
}

export async function listEntries(type: EntryType): Promise<Entry[]> {
  const data = await request<{ entries: Entry[] }>(`/entries?type=${type}`)
  return data.entries
}

export async function createEntry(entry: Partial<Entry> & { type: EntryType; title: string }): Promise<Entry> {
  const data = await request<{ entry: Entry }>('/entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
  return data.entry
}

export async function updateEntry(id: string, entry: Partial<Entry> & { type: EntryType }): Promise<Entry> {
  const data = await request<{ entry: Entry }>(`/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  })
  return data.entry
}

export async function deleteEntry(id: string, type: EntryType): Promise<void> {
  await request(`/entries/${id}?type=${type}`, { method: 'DELETE' })
}

export interface ClickEvent {
  ts: string
  country: string
  referrer: string
}

export interface TrackedLink {
  slug: string
  destination: string
  label: string
  createdAt: string
  clickCount: number
  recentClicks: ClickEvent[]
}

export interface VisitEvent {
  ts: string
  path: string
  country: string
  referrer: string
}

export interface TrackingSummary {
  totalVisits: number
  totalClicks: number
  byPath: { path: string; count: number }[]
  byCountry: { country: string; count: number }[]
  recentVisits: VisitEvent[]
  links: TrackedLink[]
}

export async function getTrackingSummary(): Promise<TrackingSummary> {
  return request<TrackingSummary>('/tracking/summary')
}

export async function createTrackedLink(input: { slug: string; destination: string; label?: string }): Promise<TrackedLink> {
  const data = await request<{ link: TrackedLink }>('/tracking/links', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return data.link
}

export async function deleteTrackedLink(slug: string): Promise<void> {
  await request(`/tracking/links/${slug}`, { method: 'DELETE' })
}

export interface CloudflareEdgeSummary {
  today: {
    requests: number
    bytes: number
    status4xxRatio: number
    status5xxRatio: number
    byCountry: { country: string; count: number }[]
    byPath: { path: string; count: number }[]
    byStatus: { status: string; count: number }[]
    byCache: { status: string; count: number }[]
  }
  trend: { date: string; requests: number; uniques: number }[]
}

export async function getCloudflareEdgeSummary(): Promise<CloudflareEdgeSummary> {
  return request<CloudflareEdgeSummary>('/tracking/cloudflare')
}

export { UnauthorizedError }
