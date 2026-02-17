export class TaskStatus {
  private constructor(public readonly value: string) { }

  static pending(): TaskStatus {
    return new TaskStatus('pending')
  }

  static started(): TaskStatus {
    return new TaskStatus('started')
  }

  static completed(): TaskStatus {
    return new TaskStatus('completed')
  }

  static from(value: string): TaskStatus {
    if (!['pending', 'started', 'completed'].includes(value)) {
      throw new Error('Invalid task status')
    }

    return new TaskStatus(value)
  }
}
