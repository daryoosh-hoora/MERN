import { IDomainEventHandler } from '@/shared/domain/IDomainEventHandler'
import { TaskCreatedEvent } from '../../domain/events/TaskCreatedEvent'

export class TaskCreatedHandler
  implements IDomainEventHandler<TaskCreatedEvent> {

  async handle(event: TaskCreatedEvent): Promise<void> {

    console.log('Task created: ', event.taskId)

    // later:
    // send email
    // publish integration event
    // update read model
  }
}
