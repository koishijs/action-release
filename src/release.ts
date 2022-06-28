import { context, getOctokit } from '@actions/github'
import { getInput } from '@actions/core'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import manifest from './shared'

const token = getInput('github_token', { required: true })

const { repo, sha } = context
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

export default async function release() {
  const tag = `v${manifest.version}`
  const res = await rest.git.createTag({
    ...repo,
    tag,
    message: `Release ${manifest.version}`,
    object: sha,
    type: 'commit',
  })
  console.log(res)
  try {
    const { data: release } = await rest.repos.createRelease({
      ...repo,
      tag_name: tag,
    })
    console.log(release)
    await rest.repos.uploadReleaseAsset({
      ...repo,
      release_id: release.id,
      name: `${manifest.name}_${getPlatform()}_${getArch()}.zip`,
      data: await readFile(resolve(process.env.RUNNER_TEMP, 'bundle.zip')) as any,
    })
  } catch (e) {
    console.log(e)
  }
}

if (require.main === module) {
  release()
}
