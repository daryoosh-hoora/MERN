import { TaskCreatedEvent } from '../../../domain/task/events/TaskCreatedEvent.js'

export const logTaskCreatedHandler = async (
  event: TaskCreatedEvent
) => {
  console.log(
    `[TaskCreated] taskId=${event.taskId} ownerId=${event.ownerId}`
  )
}
