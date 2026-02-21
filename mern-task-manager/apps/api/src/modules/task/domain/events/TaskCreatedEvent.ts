import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { Task } from '../entities/Task'

export class TaskCreatedEvent implements IDomainEvent {
  // public dateTimeOccurred: Date

  constructor(public readonly taskId: UniqueEntityId) {
    // this.dateTimeOccurred = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.taskId
  }
}
