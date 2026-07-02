import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const outputPath = resolve(process.argv[2] || 'public/spotify/now-playing.json')

const required = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`)
}

async function spotifyFetch(url, accessToken) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 204) return null
  if (!response.ok) {
    throw new Error(`Spotify request failed: ${response.status} ${await response.text()}`)
  }
  return response.json()
}

function trackPayload(item, overrides = {}) {
  if (!item) return null
  const image = item.album?.images?.[0]?.url || ''
  return {
    isPlaying: false,
    title: item.name || 'Spotify',
    artist: (item.artists || []).map((artist) => artist.name).join(', ') || 'Unknown artist',
    album: item.album?.name || '',
    image,
    url: item.external_urls?.spotify || 'https://open.spotify.com/',
    progressMs: 0,
    durationMs: item.duration_ms || 1,
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
  }),
})

if (!tokenResponse.ok) {
  throw new Error(`Spotify token refresh failed: ${tokenResponse.status} ${await tokenResponse.text()}`)
}

const token = await tokenResponse.json()
const accessToken = token.access_token

const current = await spotifyFetch('https://api.spotify.com/v1/me/player/currently-playing', accessToken)
let payload = current?.item
  ? trackPayload(current.item, {
      isPlaying: !!current.is_playing,
      progressMs: current.progress_ms || 0,
    })
  : null

if (!payload) {
  const recent = await spotifyFetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', accessToken)
  payload = trackPayload(recent?.items?.[0]?.track)
}

if (!payload) {
  payload = {
    isPlaying: false,
    title: 'Systems work queue',
    artist: 'Spotify connected, no recent track',
    album: 'Focus mode',
    image: '',
    url: 'https://open.spotify.com/',
    progressMs: 0,
    durationMs: 1,
    updatedAt: new Date().toISOString(),
  }
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Wrote Spotify now-playing data to ${outputPath}`)
