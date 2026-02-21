import { IEventBus } from '../../application/IEventBus'
import { DomainEvent } from '../../domain/DomainEvent'

type EventHandler = (event: DomainEvent) => Promise<void>

export class InMemoryEventBus implements IEventBus {
  private publishedEvents: DomainEvent[] = []
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

      this.publishedEvents.push(event)
    }
  }



  // async publish(event: DomainEvent): Promise<void> {
  //   this.events.push(event)
  // }

  getPublishedEvents() {
    return this.publishedEvents
  }

  // getPublishedEvents(): DomainEvent[] {
  //   const allHandlers = Array.from(this.handlers.values()).flat()
  //   const publishedEvents: DomainEvent[] = []
  //   return publishedEvents
  // }
}
