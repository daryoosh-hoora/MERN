import { DomainEvent } from '@/shared/domain/IDomainEvent'

export class TaskCompletedEvent extends DomainEvent {

  readonly eventName = 'task.completed'

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
