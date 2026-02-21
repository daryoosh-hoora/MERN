import { UniqueEntityId } from './UniqueEntityId'

export abstract class DomainEvent {

  public readonly eventId: UniqueEntityId
  public readonly occurredOn: Date
  public readonly aggregateId: UniqueEntityId
  public abstract readonly eventName: string

  constructor(aggregateId?: UniqueEntityId) {
    this.eventId = new UniqueEntityId()
    this.occurredOn = new Date()
    this.aggregateId = aggregateId!
  }

  abstract toPrimitives(): any
}