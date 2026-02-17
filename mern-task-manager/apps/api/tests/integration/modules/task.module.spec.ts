import mongoose from 'mongoose'

import { MongoTaskRepository } from '@/infrastructure/repositories/MongoTaskRepository'
import { CreateTaskHandler } from '@/application/tasks/commands/CreateTaskHandler'
import { CreateTaskCommand } from '@/application/tasks/commands/CreateTaskCommand'
import { InMemoryEventBus } from '@/shared/infrastructure/event-bus/InMemoryEventBus'
import { env } from '@/config/env'

describe('Task Integration', () => {

  let repository: MongoTaskRepository
  let handler: CreateTaskHandler
  let eventBus: InMemoryEventBus

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'

    await mongoose.connect(env.testDB)

    repository = new MongoTaskRepository()
    eventBus = new InMemoryEventBus()
    handler = new CreateTaskHandler(repository, eventBus)
  })

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      // await mongoose.connection.dropDatabase()
      // await mongoose.disconnect()
    }
  })

  it('should create task in database', async () => {

    const command = new CreateTaskCommand('user-1', {
      title: 'Integration test',
      description: '...'
    })

    const result = await handler.execute(command)

    expect(result).toBeDefined()

    const saved = await repository.findById(result.id)
    expect(saved).not.toBeNull()
    expect(saved!.title).toBe('Integration test')

    const publishedEvents = eventBus.getPublishedEvents()
    expect(publishedEvents.length).toBe(1)
  })
})
