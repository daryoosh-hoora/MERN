import { randomUUID } from 'crypto'

export abstract class DomainEvent {

  public readonly eventId: string
  public readonly occurredOn: Date
  public abstract readonly eventName: string

  constructor(eventId?: string, occurredOn?: Date) {
    this.eventId = eventId ?? randomUUID()
    this.occurredOn = occurredOn ?? new Date()
  }

  abstract toPrimitives(): any
}
