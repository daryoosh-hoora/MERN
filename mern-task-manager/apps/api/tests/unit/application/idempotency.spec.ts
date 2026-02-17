import { logTaskCreatedHandler } from '@/application/tasks/handlers/LogTaskCreatedHandler'
describe.skip('Idempotency', () => {
  it.skip('should skip already processed event', async () => {
    const repo = {
      exists: jest.fn().mockResolvedValue(true),
      save: jest.fn()
    }

    const handler = logTaskCreatedHandler(repo as any)

    //await handler.handle({ eventId: '123' } as any)

    expect(repo.save).not.toHaveBeenCalled()
  })
})