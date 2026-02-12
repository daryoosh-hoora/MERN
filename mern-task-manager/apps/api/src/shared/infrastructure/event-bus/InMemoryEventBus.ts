import { EventBus } from '../../application/EventBus.js'
import { DomainEvent } from '../../domain/DomainEvent.js'

type EventHandler = (event: DomainEvent) => Promise<void>

export class InMemoryEventBus implements EventBus {

  private handlers: Map<string, EventHandler[]> = new Map()

  register(eventName: string, handler: EventHandler) {
    const existing = this.handlers.get(eventName) || []
    this.handlers.set(eventName, [...existing, handler])
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventName = event.constructor.name
      const handlers = this.handlers.get(eventName) || []

      for (const handler of handlers) {
        await handler(event)
      }
    }
  }
}
