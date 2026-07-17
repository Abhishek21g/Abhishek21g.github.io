import { copyFileSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const outDir = resolve('out')
const osHtmlPath = resolve(outDir, 'claude-design/index.html')
const rootHtmlPath = resolve(outDir, 'index.html')

if (!existsSync(osHtmlPath)) {
  throw new Error(`Missing OS HTML at ${osHtmlPath}. Run next build first.`)
}

copyFileSync(osHtmlPath, rootHtmlPath)

const cfToken = process.env.CF_WEB_ANALYTICS_TOKEN?.trim()
const cfBeacon = cfToken
  ? `\n<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${cfToken}"}'></script>`
  : ''

const rootHtml = readFileSync(rootHtmlPath, 'utf8')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="canonical" href="https://enaguthi.com/">${cfBeacon}`
  )

writeFileSync(rootHtmlPath, rootHtml)

const legacyPaths = ['spotify']
for (const relativePath of legacyPaths) {
  const outputPath = resolve(outDir, relativePath)
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
}

const templateImageRequests = [
  '{{ photo.src }}',
  '{{ activeGalleryPhoto.src }}',
  '{{ activeBlogPost.hero }}',
  '{{ selectedPhoto }}',
]

for (const requestPath of templateImageRequests) {
  const badOutputPath = resolve(outDir, requestPath)
  if (existsSync(badOutputPath)) {
    rmSync(badOutputPath, { force: true })
  }
}

const removeFromOutput = [
  '.DS_Store',
  'claude-design',
  'Blog1/.DS_Store',
  'Blog1/IMG_7984.heic',
  'Blog1/Omniverse-Talk-AIWeek-2025 (1).pdf',
  'Blog1/Project X.mp4',
]

for (const relativePath of removeFromOutput) {
  const outputPath = resolve(outDir, relativePath)
  if (existsSync(outputPath)) {
    rmSync(outputPath, { recursive: true, force: true })
  }
}

const removeExtensions = new Set(['.heic'])

function scrubOutputDirectory(dir) {
  if (!existsSync(dir)) return

  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry)
    const entryStat = statSync(entryPath)

    if (entryStat.isDirectory()) {
      scrubOutputDirectory(entryPath)
      continue
    }

    if (entry === '.DS_Store' || removeExtensions.has(extname(entry).toLowerCase())) {
      rmSync(entryPath, { force: true })
    }
  }
}

scrubOutputDirectory(resolve(outDir, 'blog2'))
