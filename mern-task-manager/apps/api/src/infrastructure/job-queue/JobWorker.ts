import { MongoJobModel } from './MongoJobModel'

type JobHandler = (payload: any) => Promise<void>

export class JobWorker {

  private handlers: Map<string, JobHandler> = new Map()

  register(jobName: string, handler: JobHandler) {
    this.handlers.set(jobName, handler)
  }

  async start(intervalMs = 5000) {
    setInterval(() => this.process(), intervalMs)
  }

  async runOnce() {
    await this.process()
  }

  private async process() {

    const jobs = await MongoJobModel.find({
      status: 'pending'
    }).limit(10)

    for (const job of jobs) {

      const handler = this.handlers.get(job.name)
      if (!handler) continue

      // job.status = 'processing'
      // await job.save()
      await MongoJobModel.updateOne(
        { _id: job._id },
        { $set: { status: 'processing' } }
      )

      try {
        await handler(job.payload)

        // job.status = 'completed'
        // await job.save()
        await MongoJobModel.updateOne(
          { _id: job._id },
          { $set: { status: 'completed' } }
        )
      } catch (err) {

        job.attempts += 1

        // if (job.attempts >= job.maxAttempts) {
        //   job.status = 'failed'
        // } else {
        //   job.status = 'pending'
        // }

        // await job.save()
        await MongoJobModel.updateOne(
          { _id: job._id },
          {
            $set: {
              status: job.attempts >= job.maxAttempts ? 'failed' : 'pending',
              // attempts
            }
          }
        )
      }
    }
  }
}
