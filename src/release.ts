import { context, getOctokit } from '@actions/github'
import { getInput } from '@actions/core'
import { resolve } from 'path'
import manifest from './shared'
import { readFile } from 'fs/promises'

const token = getInput('github_token', { required: true })

const { repo, sha } = context
const octokit = getOctokit(token)

export default async function release() {
  const tag = `v${manifest.version}`
  const { data } = await octokit.rest.git.createTag({
    ...repo,
    tag,
    message: `Release ${manifest.version}`,
    object: sha,
    type: 'commit',
  })
  console.log(data)
  const { data: release } = await octokit.rest.repos.createRelease({
    ...repo,
    tag_name: tag,
  })
  console.log(release)
  await octokit.rest.repos.uploadReleaseAsset({
    ...repo,
    release_id: release.id,
    name: tag,
    data: await readFile(resolve(process.env.RUNNER_TEMP, 'bundle.zip')) as any,
  })
}

if (require.main === module) {
  release()
}
