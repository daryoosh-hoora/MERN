import { ProcessedEventModel } from '../mongo/ProcessedEventModel.js'

export const idempotent =
  (handler: (payload: any) => Promise<void>) =>
  async (event: any) => {

    const exists = await ProcessedEventModel.findOne({
      eventId: event.eventId
    })

    if (exists) {
      return // already processed
    }

    await handler(event.payload)

    await ProcessedEventModel.create({
      eventId: event.eventId,
      eventName: event.eventName
    })
  }
