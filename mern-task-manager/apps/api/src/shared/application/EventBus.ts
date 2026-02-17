import { DomainEvent } from '../domain/DomainEvent'

export interface IEventBus {
  publish(events: DomainEvent[]): Promise<void>
}
