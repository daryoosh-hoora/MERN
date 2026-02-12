import { EventBus } from '../../application/EventBus.js'
import { DomainEvent } from '../../domain/DomainEvent.js'
import { EventSerializer } from './EventSerializer.js'

type Handler = (payload: any) => Promise<void>

export class BrokerEventBus implements EventBus {

  private topics: Map<string, Handler[]> = new Map()

  subscribe(topic: string, handler: Handler) {
    const existing = this.topics.get(topic) || []
    this.topics.set(topic, [...existing, handler])
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {

      const serialized = EventSerializer.serialize(event)
      const handlers = this.topics.get(serialized.eventName) || []

      for (const handler of handlers) {
        setImmediate(() => {
          handler(serialized)
        })
      }
    }
  }

}
