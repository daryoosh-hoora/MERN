import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { Task } from '../entities/Task'

export class TaskUpdatedEvent implements IDomainEvent {
  // public dateTimeOccurred: Date

  constructor(public readonly taskId: UniqueEntityId) {
    // this.dateTimeOccurred = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.taskId
  }
}
