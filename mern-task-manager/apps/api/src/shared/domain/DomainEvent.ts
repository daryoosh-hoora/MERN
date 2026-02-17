import { randomUUID } from 'crypto'

export abstract class DomainEvent {

  public readonly eventId: string
  public readonly occurredOn: Date
  public readonly aggregateId: string
  public abstract readonly eventName: string

  constructor(aggregateId?: string) {
    this.eventId = randomUUID()
    this.occurredOn = new Date()
    this.aggregateId = aggregateId ?? ''
  }

  abstract toPrimitives(): any
}
