import { createServer } from './http/server.js'
import { initInfrastructure } from './infrastructure/index.js'
import { env } from './config/env.js'

async function bootstrap() {
  await initInfrastructure()

  const app = createServer()

  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start API', err)
  process.exit(1)
})
