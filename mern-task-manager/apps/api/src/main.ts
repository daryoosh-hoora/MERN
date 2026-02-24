import { env } from './infrastructure/config/env'
import { createServer } from './presentation/http/index'
import { initInfrastructure } from './infrastructure/index'
import { createTaskModule } from './modules/task/index'

async function bootstrap() {
  await initInfrastructure()
  
  const taskModule = await createTaskModule()
  
  const app = createServer(taskModule)

  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start API', err)
  process.exit(1)
})
