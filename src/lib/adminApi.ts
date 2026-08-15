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

export { UnauthorizedError }
