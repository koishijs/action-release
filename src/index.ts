import bundle from './bundle'
import release from './release'

(async () => {
  await bundle()
  await release()
})()
