import { env } from './shared/infrastructure/config/env'
import { initInfrastructure } from './shared/infrastructure/index'
import { createServer } from './presentation/http/index'
import { createTaskModule } from './modules/task/index'
import { createUserModule } from './modules/user/index'
import { createAuthenticationModule } from './modules/auth/authentication/index'

async function bootstrap() {
  await initInfrastructure()
  
  const taskModule = await createTaskModule()
  const userModule = await createUserModule()
  const authModule = await createAuthenticationModule()

  const app = createServer(
    taskModule, 
    userModule,
    authModule
  )

  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`)
  })
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start API', err)
  process.exit(1)
})
