import { DomainEvent } from '../domain/DomainEvent.js'

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>
}
