import { JobQueue } from './JobQueue.js'
import { MongoJobModel } from './MongoJobModel.js'

export class MongoJobQueue implements JobQueue {

  async dispatch(
    name: string,
    payload: any,
    options?: { maxAttempts?: number }
  ): Promise<void> {

    await MongoJobModel.create({
      name,
      payload,
      maxAttempts: options?.maxAttempts ?? 3
    })
  }
}
