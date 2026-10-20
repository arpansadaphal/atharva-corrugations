/**
 * Fails if a banned string appears in source, content, metadata, public/
 * file names or package.json (Technical plan §13.4), unless the file and
 * term are allow-listed below with a reason.
 *
 * Scope: src/, public/, package.json. Planning documents, tests and these
 * scripts name the banned terms on purpose and are not scanned.
 *
 * Usage: npm run check:banned
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { findBanned, type BannedHit } from './lib/banned'

const ROOT = new URL('..', import.meta.url).pathname
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.md', '.svg', '.txt', '.xml', '.html'])

/** { file (repo-relative), term, reason } — every entry needs a reason. */
const ALLOW: { file: string; term: string; reason: string }[] = [
  {
    file: 'src/lib/email.ts',
    term: 'injection',
    reason: 'Security comment on header-injection protection (Technical §7.4); not business copy',
  },
]

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const files = [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'public')), join(ROOT, 'package.json')]

const hits: BannedHit[] = []
for (const path of files) {
  const file = relative(ROOT, path)
  // file names count too (public/ assets especially)
  hits.push(...findBanned(file, `${file} (file name)`))
  if (TEXT_EXTENSIONS.has(extname(path))) hits.push(...findBanned(readFileSync(path, 'utf8'), file))
}

const blocking = hits.filter((h) => !ALLOW.some((a) => h.file.startsWith(a.file) && a.term === h.term))

if (blocking.length > 0) {
  console.error('✗ Banned strings found:\n')
  for (const h of blocking) console.error(`  ${h.file}:${h.line}  "${h.term}" (${h.source})\n      ${h.text}`)
  process.exit(1)
}
console.log(`✓ No banned strings in ${files.length} files (${ALLOW.length} allow-list entries).`)
