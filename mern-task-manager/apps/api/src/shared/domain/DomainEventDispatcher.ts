import { IDomainEvent } from './IDomainEvent'
import { IDomainEventHandler } from './IDomainEventHandler'

type EventClass = new (...args: any[]) => IDomainEvent

export class DomainEventDispatcher {

  private static handlersMap: Map<string, IDomainEventHandler<any>[]> = new Map()

  // Register handler for event
  public static register<T extends IDomainEvent>(
    eventClass: EventClass,
    handler: IDomainEventHandler<T>
  ): void {

    const eventName = eventClass.name

    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, [])
    }

    this.handlersMap.get(eventName)!.push(handler)
  }

  // Dispatch a single event
  public static async dispatch(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name

    const handlers = this.handlersMap.get(eventName)

    if (!handlers) return

    for (const handler of handlers) {
      await handler.handle(event)
    }
  }

  // Dispatch multiple events
  public static async dispatchAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event)
    }
  }

  // Clear all handlers (useful for testing)
  public static clearHandlers(): void {
    this.handlersMap.clear()
  }
}
