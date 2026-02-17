import { createServer } from './http/index'
import { initInfrastructure } from './infrastructure/index'
import { env } from './config/env'

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
