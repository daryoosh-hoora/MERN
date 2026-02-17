import { OutboxModel } from '../mongo/OutboxModel'
import { EventBus } from '../../application/EventBus'

export class OutboxProcessor {

  constructor(private readonly eventBus: EventBus) {}

  async process() {

    const events = await OutboxModel.find({
      processed: false
    }).limit(20)

    for (const record of events) {

      await this.eventBus.publish([record.payload])

      record.processed = true
      await record.save()
    }
  }
}
