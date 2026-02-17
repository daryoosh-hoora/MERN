import mongoose from 'mongoose'
import { env } from '@/config/env'
import { MongoJobQueue } from '@/infrastructure/job-queue/MongoJobQueue'
import { JobWorker } from '@/infrastructure/job-queue/JobWorker'

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  await mongoose.connect(env.testDB)
})

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // await mongoose.connection.dropDatabase()
    // await mongoose.disconnect()
  }
})

it('should retry failed jobs', async () => {

  const queue = new MongoJobQueue()
  const worker = new JobWorker()

  let attempts = 0

  worker.register('fail-job', async () => {
    attempts++
    throw new Error('Fail')
  })

  await queue.dispatch('fail-job', {}, { maxAttempts: 2 })

  // await worker.start()
  await worker.runOnce()

  expect(attempts).toBe(1)
}, 30000)
