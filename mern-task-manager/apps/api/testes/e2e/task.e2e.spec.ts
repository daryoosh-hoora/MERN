import request from 'supertest'
import { app } from '@/apps'

describe('Task E2E', () => {

  it('should create task and trigger saga', async () => {

    const res = await request(app)
      .post('/tasks')
      .send({ title: 'E2E test' })

    expect(res.status).toBe(201)

    // optional: wait and check job completed
  })

})
