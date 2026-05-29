import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'

export class UserRegisteredEvent implements IDomainEvent {
  readonly eventName = 'user.registered'
  readonly dateTimeOccurred = new Date()

  constructor(public readonly userId: UniqueEntityId) { }

  getAggregateId(): UniqueEntityId {
    return this.userId
  }
}