import { DomainEvent } from '@/shared/domain/IDomainEvent'

export class TaskStartedEvent extends DomainEvent {

  readonly eventName = 'task.started'

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
