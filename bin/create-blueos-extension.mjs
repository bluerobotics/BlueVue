#!/usr/bin/env node
import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const template = join(here, '..', 'templates', 'extension')

const raw = process.argv[2]
if (!raw || raw === '--help' || raw === '-h') {
  console.error('Usage: npx @bluerobotics/bluevue <name>')
  console.error('Creates a BlueOS extension in ./<name>, wired to this package.')
  process.exit(raw ? 0 : 1)
}

const slug = raw
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

if (!slug) {
  console.error('Give the extension a name made of letters, numbers or hyphens.')
  process.exit(1)
}

const title = slug
  .split('-')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

const dest = resolve(process.cwd(), slug)

try {
  mkdirSync(dest)
} catch (error) {
  if (/** @type {NodeJS.ErrnoException} */ (error).code === 'EEXIST') {
    console.error(`${dest} already exists.`)
    process.exit(1)
  }
  throw error
}

cpSync(template, dest, { recursive: true })

const replacements = {
  __SLUG__: slug,
  __TITLE__: title,
}

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      walk(path)
      continue
    }
    const before = readFileSync(path, 'utf8')
    const after = Object.entries(replacements).reduce(
      (text, [token, value]) => text.replaceAll(token, value),
      before
    )
    if (after !== before) writeFileSync(path, after)
  }
}

walk(dest)

console.log(`Created ${slug}/
  cd ${slug}/frontend && npm install && npm run dev
  The backend is PORT=8000 python backend/main.py, after pip install -r backend/requirements.txt.`)
