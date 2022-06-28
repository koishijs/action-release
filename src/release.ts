import { context, getOctokit } from '@actions/github'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import manifest from './shared'

const { repo, sha } = context
const octokit = getOctokit(process.env.GITHUB_TOKEN)

export default async function release() {
  const tag = `v${manifest.version}`
  await octokit.rest.git.createTag({
    ...repo,
    tag,
    message: `Release ${manifest.version}`,
    object: sha,
    type: 'commit',
  })
  const { data: release } = await octokit.rest.repos.createRelease({
    ...repo,
    tag_name: tag,
  })
  await octokit.rest.repos.uploadReleaseAsset({
    ...repo,
    release_id: release.id,
    name: tag,
    data: createReadStream(resolve(process.env.RUNNER_TEMP, 'bundle.zip')) as any,
  })
}

if (require.main === module) {
  release()
}
