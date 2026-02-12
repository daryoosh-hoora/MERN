import { DomainEvent } from '../../../shared/domain/DomainEvent.js'

export class TaskCreatedEvent extends DomainEvent {

  readonly eventName = 'task.created'

  constructor(
    public readonly taskId: string,
    public readonly ownerId: string
  ) {
    super()
  }

  toPrimitives() {
    return {
      taskId: this.taskId,
      ownerId: this.ownerId
    }
  }
}
