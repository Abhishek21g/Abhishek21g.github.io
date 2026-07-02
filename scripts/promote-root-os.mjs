import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const outDir = resolve('out')
const osHtmlPath = resolve(outDir, 'claude-design/index.html')
const rootHtmlPath = resolve(outDir, 'index.html')

if (!existsSync(osHtmlPath)) {
  throw new Error(`Missing OS HTML at ${osHtmlPath}. Run next build first.`)
}

copyFileSync(osHtmlPath, rootHtmlPath)

const rootHtml = readFileSync(rootHtmlPath, 'utf8')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="canonical" href="https://enaguthi.com/">'
  )

writeFileSync(rootHtmlPath, rootHtml)

const placeholderSource = resolve(outDir, 'media/portrait.jpg')
const templateImageRequests = [
  '{{ photo.src }}',
  '{{ activeGalleryPhoto.src }}',
  '{{ activeBlogPost.hero }}',
  '{{ selectedPhoto }}',
]

if (existsSync(placeholderSource)) {
  for (const requestPath of templateImageRequests) {
    copyFileSync(placeholderSource, resolve(outDir, requestPath))
  }
}
