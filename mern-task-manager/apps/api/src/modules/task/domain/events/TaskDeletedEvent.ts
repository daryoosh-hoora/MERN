import { DomainEvent } from '@/shared/domain/DomainEvent'

export class TaskDeletedEvent extends DomainEvent {

  readonly eventName = 'task.deleted'

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
