import { createWriteStream } from 'fs'
import { resolve } from 'path'
import manifest from './shared'
import archiver from 'archiver'
import globby from 'globby'

// modified from https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files
const whitelist = [
  'package.json',
  'README*',
  'LICENSE*',
  'yarn.lock',
  'node_modules',
  '.yarnrc.yml',
]

const blacklist = [
  '.git',
  '.yarn',
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

  const files = await globby([
    ...whitelist,
    ...manifest.files,
  ], {
    ignore: blacklist,
    dot: true,
  })

  for (const file of files) {
    archive.file(file, { name: file })
  }
  await archive.finalize()
}

if (require.main === module) {
  bundle()
}
