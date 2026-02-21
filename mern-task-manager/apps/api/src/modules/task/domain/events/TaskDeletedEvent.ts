import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'

export class TaskDeletedEvent implements IDomainEvent {
  constructor(public readonly taskId: UniqueEntityId) {
  }

  getAggregateId(): UniqueEntityId {
    return this.taskId
  }
}
