import { context, getOctokit } from '@actions/github'
import { getInput } from '@actions/core'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import manifest from './shared'

const token = getInput('token', { required: true })

const { repo } = context
const { rest } = getOctokit(token)

function getArch() {
  switch (process.arch) {
    case 'x32': return '386'
    case 'x64': return 'amd64'
    case 'arm64': return 'arm64'
    case 'arm': return 'armv7'
  }

  throw new Error(`Unsupported architecture: ${process.arch}`)
}

function getPlatform() {
  switch (process.platform) {
    case 'darwin': return 'darwin'
    case 'linux': return 'linux'
    case 'win32': return 'windows'
  }

  throw new Error(`Unsupported platform: ${process.platform}`)
}

function getNode() {
  return 'node' + process.version.split('.')[0].slice(1)
}

export default async function release() {
  const tag = `v${manifest.version}`
  const { data: release } = await rest.repos.getReleaseByTag({ ...repo, tag })

  const assetName = `${manifest.name}-${tag}-${getPlatform()}-${getArch()}-${getNode()}.zip`
  try {
    await rest.repos.uploadReleaseAsset({
      ...repo,
      release_id: release.id,
      name: assetName,
      data: await readFile(resolve(process.env.RUNNER_TEMP, 'bundle.zip')) as any,
    })
  } catch (error) {
    console.log(error)
  }
}

if (require.main === module) {
  release()
}
