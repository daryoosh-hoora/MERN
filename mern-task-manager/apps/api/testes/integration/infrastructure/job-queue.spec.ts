it('should retry failed jobs', async () => {

  const queue = new MongoJobQueue()
  const worker = new JobWorker()

  let attempts = 0

  worker.register('fail-job', async () => {
    attempts++
    throw new Error('Fail')
  })

  await queue.dispatch('fail-job', {}, { maxAttempts: 2 })

  await worker.process()

  expect(attempts).toBe(1)
})
