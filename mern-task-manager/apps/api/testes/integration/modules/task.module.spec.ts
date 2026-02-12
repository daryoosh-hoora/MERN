import mongoose from 'mongoose'
import { createTaskModule } from '@/modules/task'

describe('Task Module Integration', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB!)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  it('should create task and emit event', async () => {

    const module = createTaskModule()

    const result = await module.commandBus.execute(
      new CreateTaskCommand('Integration test')
    )

    expect(result).toBeDefined()
  })

})
