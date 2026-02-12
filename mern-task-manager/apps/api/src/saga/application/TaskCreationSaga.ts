import { Saga } from '../domain/Saga.js'
import { DomainEvent } from '../../shared/domain/DomainEvent.js'
import { JobQueue } from '../../infrastructure/job-queue/JobQueue.js'

export class TaskCreationSaga extends Saga {
  constructor(private readonly jobQueue: JobQueue) { }
  
  subscribedTo(): string[] {
    return ['task.created']
  }

  async handle(event: DomainEvent): Promise<void> {

    const payload = event.toPrimitives()

    console.log('[Saga] Task created detected')

    // Step 2: Send notification
    console.log('[Saga] Sending notification')

    await this.jobQueue.dispatch(
      'send-notification',
      { taskId: payload.taskId }
    )

    // Step 1: Create audit log
    console.log('[Saga] Creating audit log')

    await this.jobQueue.dispatch(
      'create-audit-log',
      payload
    )

    // Step 3: Update statistics
    console.log('[Saga] Updating user stats')
  }
}
