import { IEventBus } from '../../application/IEventBus'
import { DomainEvent } from '../../domain/DomainEvent'
import { EventSerializer } from './EventSerializer'

type Handler = (payload: any) => Promise<void>

export class BrokerEventBus implements IEventBus {

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
