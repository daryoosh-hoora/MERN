import { DomainEventDispatcher } from '@/shared/domain/DomainEventDispatcher'
import { TaskCreatedEvent } from './domain/events/TaskCreatedEvent'
import { TaskCreatedHandler } from './application/handlers/TaskCreatedEventHandler'

export function registerTaskModuleEvents() {
  DomainEventDispatcher.register(
    TaskCreatedEvent,
    new TaskCreatedHandler()
  )
}

export { taskRouters } from './api/task.routes'
