import { DomainEvent } from '@/shared/domain/DomainEvent'

export class TaskCreatedEvent extends DomainEvent {

  readonly eventName = 'task.created'

  constructor(
    public readonly taskId: string
  ) {
    super()
  }

  toPrimitives() {
    return {
      taskId: this.taskId
    }
  }
}
