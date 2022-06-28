interface Manifest {
  name: string
  version: string
  files: string[]
}

export default require('./package.json') as Manifest
