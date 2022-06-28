import { createWriteStream } from 'fs'
import { resolve } from 'path'
import archiver from 'archiver'
import globby from 'globby'

// modified from https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files
const whitelist = [
  'package.json',
  'README*',
  'LICENSE*',
  'yarn.lock',
  'node_modules',
]

const blacklist = [
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  '.wafpickle-N',
  '.*.swp',
  '.DS_Store',
  '._*',
  '*.log',
  'config.gypi',
  '*.orig',
]

export default async function bundle() {
  const stream = createWriteStream(resolve(process.env.RUNNER_TEMP, 'bundle.zip'))
  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(stream)
  const cwd = process.cwd()
  const white = await globby([...whitelist], { cwd, ignore: blacklist })
  for (const file of white) {
    archive.file(file, { name: file })
  }
  await archive.finalize()
}

if (require.main === module) {
  bundle()
}