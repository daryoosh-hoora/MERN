import { JobQueue } from './JobQueue'
import { MongoJobModel } from './MongoJobModel'

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
