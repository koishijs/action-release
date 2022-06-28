import { readFileSync } from 'fs'

interface Manifest {
  name: string
  version: string
  files: string[]
}

export default JSON.parse(readFileSync('package.json', 'utf-8')) as Manifest
