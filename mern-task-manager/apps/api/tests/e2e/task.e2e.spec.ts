import request from 'supertest'
import mongoose from 'mongoose'
import { createServer } from '@/http/index'
import { initInfrastructure, shutdownInfrastructure } from '@/infrastructure/index'

describe('Task E2E', () => {
  let app: any
  let redis: any

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'

    redis = (await initInfrastructure()).redis

    app = createServer()
  })

  afterAll(async () => {
    // await shutdownInfrastructure()

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase()
      await mongoose.disconnect()
    }
    
    if (redis.status === 'ready') {
      await redis.quit()
    }
  })


  it('should create task and trigger saga', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      })

    const token = loginRes.body.token

    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'E2E test' })

    expect(res.status).toBe(201)

    // optional: wait and check job completed
  })
})
