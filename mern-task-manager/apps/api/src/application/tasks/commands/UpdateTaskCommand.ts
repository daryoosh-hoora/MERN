import { TaskStatus } from '../../../domain/task/TaskStatus.js'

export class UpdateTaskCommand {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string,
    public readonly data: {
      title?: string
      description?: string
      status?: TaskStatus
    }
  ) {}
}
